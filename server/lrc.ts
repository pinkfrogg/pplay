import { isSafePublicUrl } from "./mp3Metadata";

export type LrcCue = { start: number; end: number; text: string };
const MAX_LRC_BYTES = 1_000_000;
const LRC_TIMEOUT_MS = 8_000;

export function parseLrc(text: string): LrcCue[] {
  const entries: Array<{ start: number; text: string }> = [];
  for (const line of text.split(/\r?\n/)) {
    const lyric = line.replace(/^(?:\[\d{1,2}:\d{2}(?:\.\d{1,3})?\])+/, "").trim();
    for (const stamp of Array.from(line.matchAll(/\[(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?\]/g))) {
      const start = Number(stamp[1]) * 60 + Number(stamp[2]) + Number(`0.${stamp[3] ?? "0"}`);
      if (lyric && Number.isFinite(start)) entries.push({ start, text: lyric });
    }
  }
  return entries.sort((a, b) => a.start - b.start).map((cue, index, cues) => ({ ...cue, end: cues[index + 1]?.start ?? cue.start + 6 }));
}

export async function readLrc(url: string): Promise<LrcCue[]> {
  if (!isSafePublicUrl(url)) throw new Error("Use a public HTTP(S) LRC link.");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), LRC_TIMEOUT_MS);
  try {
    const response = await fetch(url, { signal: controller.signal, redirect: "error", headers: { Accept: "text/plain,text/*;q=0.9,*/*;q=0.1" } });
    if (!response.ok) throw new Error(`LRC host returned ${response.status}`);
    const declaredLength = Number(response.headers.get("content-length") ?? 0);
    if (declaredLength > MAX_LRC_BYTES) throw new Error("LRC files must be 1 MB or smaller.");
    if (!response.body) throw new Error("The LRC host returned an empty response.");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let received = 0;
    let text = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      received += value.byteLength;
      if (received > MAX_LRC_BYTES) {
        await reader.cancel();
        throw new Error("LRC files must be 1 MB or smaller.");
      }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
    return parseLrc(text);
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") return [];
    throw error;
  } finally { clearTimeout(timer); }
}
