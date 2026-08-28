import { describe, expect, it, vi } from "vitest";
import { id3v1MetadataFromBuffer, inferMp3MetadataFromUrl, isSafePublicMp3Url, metadataUnavailableMessage, readMp3Metadata, resolveMp3MetadataTags } from "./mp3Metadata";

describe("MP3 metadata link safety", () => {
  it("allows public HTTP(S) audio links and blocks local network destinations", () => {
    expect(isSafePublicMp3Url("https://archive.example.org/audio/song.mp3")).toBe(true);
    expect(isSafePublicMp3Url("http://127.0.0.1/private.mp3")).toBe(false);
    expect(isSafePublicMp3Url("http://192.168.1.10/audio.mp3")).toBe(false);
    expect(isSafePublicMp3Url("file:///private/song.mp3")).toBe(false);
  });

  it("turns an upstream timeout into manual-entry guidance", () => {
    expect(metadataUnavailableMessage(Object.assign(new Error("slow host"), { name: "TimeoutError" }))).toContain("still save the link");
  });

  it("derives a curator-reviewable title, track number, and sleeve hint from a blocked direct-link path", () => {
    expect(inferMp3MetadataFromUrl("https://file.garden/archive/1.%20Nutcracker/04.%20Dance%20of%20the%20Sugar%20Plum%20Fairy.mp3")).toMatchObject({
      title: "Dance of the Sugar Plum Fairy",
      trackNumber: 4,
      albumName: "Nutcracker",
    });
  });

  it("explains when an MP3 host rejects the server metadata request", () => {
    expect(metadataUnavailableMessage(new Error("The MP3 link returned HTTP 403."))).toContain("blocked direct tag reading");
  });

  it("returns filename-derived metadata instead of failing when an MP3 host blocks the server request", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("forbidden", { status: 403 })));
    try {
      await expect(readMp3Metadata("https://file.garden/archive/1.%20Nutcracker/Overture%20to%20The%20Nutcracker.mp3")).resolves.toMatchObject({
        status: "fallback",
        title: "Overture to The Nutcracker",
        albumName: "Nutcracker",
      });
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it("reads legacy ID3v1.1 artist and track fields from an MP3 tail tag", () => {
    const tag = Buffer.alloc(128);
    tag.write("TAG", 0, "latin1");
    tag.write("Dreamhouse Theme", 3, "latin1");
    tag.write("Barbie Ensemble", 33, "latin1");
    tag.write("Dreamhouse", 63, "latin1");
    tag.write("2004", 93, "latin1");
    tag[125] = 0;
    tag[126] = 7;
    expect(id3v1MetadataFromBuffer(tag)).toMatchObject({ title: "Dreamhouse Theme", albumArtists: "Barbie Ensemble", albumName: "Dreamhouse", year: 2004, trackNumber: 7 });
  });

  it("uses native album-artist and track frames when common tags are incomplete", () => {
    expect(resolveMp3MetadataTags({ title: "A Song", track: {} }, { ID3v2: [{ id: "TPE2", value: "Album Cast" }, { id: "TRCK", value: "05/12" }, { id: "TALB", value: "The Movie" }] })).toMatchObject({ title: "A Song", albumArtists: "Album Cast", trackNumber: 5, albumName: "The Movie" });
  });
});
