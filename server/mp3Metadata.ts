import { parseBuffer } from "music-metadata";

const MAX_METADATA_BYTES = 18 * 1024 * 1024;
const METADATA_TIMEOUT_MS = 6_000;
const METADATA_RANGE_BYTES = 2 * 1024 * 1024;

type NativeTag = { id?: string; value?: unknown };
type Id3v1Metadata = { title?: string; albumName?: string; albumArtists?: string; year?: number; trackNumber?: number };

function cleanTagText(value: unknown): string {
  if (Array.isArray(value)) return value.map(cleanTagText).filter(Boolean).join(", ");
  if (typeof value === "string") return value.replace(/\0/g, "").trim();
  if (typeof value === "number") return String(value);
  return "";
}

function trackNumberFromValue(value: unknown) {
  if (Array.isArray(value)) return trackNumberFromValue(value[0]);
  if (typeof value === "object" && value && "no" in value) return trackNumberFromValue((value as { no?: unknown }).no);
  const match = cleanTagText(value).match(/\d{1,3}/);
  return match ? Number(match[0]) : 0;
}

function nativeTagText(native: Record<string, NativeTag[]>, ids: string[]) {
  const wanted = ids.map((id) => id.toUpperCase());
  for (const tag of Object.values(native).flat()) {
    const id = tag.id?.toUpperCase() ?? "";
    if (wanted.includes(id) || wanted.some((candidate) => id.endsWith(candidate))) {
      const text = cleanTagText(tag.value);
      if (text) return text;
    }
  }
  return "";
}

function nativeTrackNumber(native: Record<string, NativeTag[]>) {
  for (const tag of Object.values(native).flat()) {
    const id = tag.id?.toUpperCase() ?? "";
    if (id === "TRCK" || id === "TRACKNUMBER" || id.endsWith(":TRACKNUMBER") || id === "TRKN") {
      const trackNumber = trackNumberFromValue(tag.value);
      if (trackNumber) return trackNumber;
    }
  }
  return 0;
}

function id3v1Field(buffer: Buffer, start: number, length: number) {
  return buffer.subarray(start, start + length).toString("latin1").replace(/\0/g, "").trim();
}

/** Parses tail-resident ID3v1 / ID3v1.1 tags when a host does not expose the ID3v2 header. */
export function id3v1MetadataFromBuffer(buffer: Buffer): Id3v1Metadata {
  const tag = buffer.length >= 128 ? buffer.subarray(-128) : Buffer.alloc(0);
  if (tag.subarray(0, 3).toString("latin1") !== "TAG") return {};
  const year = Number(id3v1Field(tag, 93, 4));
  return {
    title: id3v1Field(tag, 3, 30),
    albumArtists: id3v1Field(tag, 33, 30),
    albumName: id3v1Field(tag, 63, 30),
    year: Number.isInteger(year) && year >= 1000 && year <= 9999 ? year : undefined,
    trackNumber: tag[125] === 0 && tag[126] > 0 ? tag[126] : undefined,
  };
}

/** Resolves common, native, and legacy tag variants into curator-facing catalog fields. */
export function resolveMp3MetadataTags(common: { title?: string | null; year?: number | null; track?: { no?: number | null }; album?: string | null; albumartist?: string | null; artists?: string[] | null; artist?: string | null }, native: Record<string, NativeTag[]> = {}, legacy: Id3v1Metadata = {}) {
  const nativeAlbumArtist = nativeTagText(native, ["TPE2", "ALBUMARTIST", "AART"]);
  const nativeAlbum = nativeTagText(native, ["TALB", "ALBUM"]);
  const nativeTitle = nativeTagText(native, ["TIT2", "TITLE"]);
  const nativeYear = Number(nativeTagText(native, ["TDRC", "TYER", "DATE", "YEAR"]).match(/\d{4}/)?.[0]);
  return {
    title: cleanTagText(common.title) || nativeTitle || legacy.title || "",
    year: common.year || (Number.isInteger(nativeYear) && nativeYear >= 1000 && nativeYear <= 9999 ? nativeYear : 0) || legacy.year || 0,
    trackNumber: common.track?.no || nativeTrackNumber(native) || legacy.trackNumber || 0,
    albumName: cleanTagText(common.album) || nativeAlbum || legacy.albumName || "",
    albumArtists: cleanTagText(common.albumartist) || nativeAlbumArtist || cleanTagText(common.artists) || cleanTagText(common.artist) || legacy.albumArtists || "",
  };
}

async function readId3v1Metadata(audioUrl: URL) {
  try {
    const response = await fetch(audioUrl, { redirect: "follow", headers: { Range: "bytes=-128" }, signal: AbortSignal.timeout(METADATA_TIMEOUT_MS) });
    if (!response.ok || response.status !== 206) return {};
    const tail = Buffer.from(await response.arrayBuffer());
    return tail.byteLength <= 1024 ? id3v1MetadataFromBuffer(tail) : {};
  } catch {
    return {};
  }
}

function isUnsafeHost(hostname: string) {
  const host = hostname.toLowerCase();
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local")) return true;
  if (host === "0.0.0.0" || host === "::1" || host.startsWith("127.")) return true;
  if (host.startsWith("10.") || host.startsWith("192.168.") || host.startsWith("169.254.")) return true;
  return /^172\.(1[6-9]|2\d|3[0-1])\./.test(host);
}

export function isSafePublicUrl(publicUrl: string) {
  try {
    const url = new URL(publicUrl);
    return /^https?:$/.test(url.protocol) && !isUnsafeHost(url.hostname);
  } catch {
    return false;
  }
}

export function isSafePublicMp3Url(audioUrl: string) {
  return isSafePublicUrl(audioUrl);
}

export function metadataUnavailableMessage(error: unknown) {
  const name = error instanceof Error ? error.name : "";
  if (name === "TimeoutError" || name === "AbortError") {
    return "This MP3 host did not respond quickly enough. You can still save the link and complete the metadata manually.";
  }
  const message = error instanceof Error ? error.message : "";
  if (/HTTP 40[13]/.test(message)) {
    return "This MP3 host blocked direct tag reading from the server.";
  }
  return "Metadata could not be read directly from this link.";
}

function decodePathSegment(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function cleanFileLabel(value: string) {
  return value.replace(/[_+]+/g, " ").replace(/^\s*\d+\s*[._-]\s*/, "").replace(/\s+/g, " ").trim();
}

/**
 * Provides useful catalog fields when a direct host refuses the server-side range request.
 * This never claims to have read embedded tags: it derives values only from the public URL.
 */
export function inferMp3MetadataFromUrl(audioUrl: string) {
  const url = new URL(audioUrl);
  const segments = url.pathname.split("/").filter(Boolean).map(decodePathSegment);
  const fileStem = (segments.at(-1) ?? "").replace(/\.[a-z0-9]{2,5}$/i, "");
  const trackMatch = fileStem.match(/^\s*(\d{1,3})\s*[._-]\s*(.+)$/);
  const trackNumber = trackMatch ? Number(trackMatch[1]) : 0;

  return {
    title: cleanFileLabel(trackMatch?.[2] ?? fileStem),
    durationSeconds: 0,
    year: 0,
    trackNumber,
    albumName: cleanFileLabel(segments.at(-2) ?? ""),
    albumArtists: "",
  };
}

export async function readMp3Metadata(audioUrl: string) {
  if (!isSafePublicMp3Url(audioUrl)) {
    throw new Error("Use a public HTTP(S) direct MP3 link.");
  }
  try {
    const url = new URL(audioUrl);
    const response = await fetch(url, { redirect: "follow", headers: { Range: `bytes=0-${METADATA_RANGE_BYTES - 1}` }, signal: AbortSignal.timeout(METADATA_TIMEOUT_MS) });
    if (!response.ok) throw new Error(`The MP3 link returned HTTP ${response.status}.`);
    const length = Number(response.headers.get("content-length") ?? 0);
    if (length && length > MAX_METADATA_BYTES && response.status !== 206) throw new Error("Metadata lookup supports MP3 files up to 18 MB.");
    const audio = Buffer.from(await response.arrayBuffer());
    if (!audio.byteLength || audio.byteLength > MAX_METADATA_BYTES) throw new Error("Metadata lookup supports MP3 files up to 18 MB.");
    const metadata = await parseBuffer(audio, { mimeType: response.headers.get("content-type") ?? "audio/mpeg" }, { duration: false, skipCovers: true });
    let tags = resolveMp3MetadataTags(metadata.common, metadata.native as Record<string, NativeTag[]>);
    if (!tags.trackNumber || !tags.albumArtists || !tags.albumName || !tags.title || !tags.year) {
      tags = resolveMp3MetadataTags(metadata.common, metadata.native as Record<string, NativeTag[]>, await readId3v1Metadata(url));
    }
    return {
      status: "ready" as const,
      title: tags.title,
      durationSeconds: Math.round(metadata.format.duration || 0),
      year: tags.year,
      trackNumber: tags.trackNumber,
      albumName: tags.albumName,
      albumArtists: tags.albumArtists,
    };
  } catch (error) {
    const fallback = inferMp3MetadataFromUrl(audioUrl);
    if (fallback.title || fallback.albumName) {
      return {
        status: "fallback" as const,
        ...fallback,
        message: `${metadataUnavailableMessage(error)} The title and sleeve hint were filled from the public file path; review them before saving.`,
      };
    }
    return { status: "unavailable" as const, title: "", durationSeconds: 0, year: 0, trackNumber: 0, albumName: "", albumArtists: "", message: `${metadataUnavailableMessage(error)} You can still save the link and complete the metadata manually.` };
  }
}
