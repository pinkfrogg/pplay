export type LrcCue = { start: number; end: number; text: string };

export function parseLrc(text: string): LrcCue[] {
  const entries: Array<{ start: number; text: string }> = [];
  for (const line of text.split(/\r?\n/)) {
    const lyric = line.replace(/^(?:\[\d{1,2}:\d{2}(?:\.\d{1,3})?\])+/, "").trim();
    const timestamps = Array.from(line.matchAll(/\[(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?\]/g));
    for (const timestamp of Array.from(timestamps)) {
      const minutes = Number(timestamp[1]);
      const seconds = Number(timestamp[2]);
      const fraction = Number(`0.${timestamp[3] ?? "0"}`);
      if (lyric && Number.isFinite(minutes) && Number.isFinite(seconds)) entries.push({ start: minutes * 60 + seconds + fraction, text: lyric });
    }
  }
  return entries.sort((a, b) => a.start - b.start).map((entry, index, sorted) => ({ start: entry.start, end: sorted[index + 1]?.start ?? entry.start + 6, text: entry.text }));
}
