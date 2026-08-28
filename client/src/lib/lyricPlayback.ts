import type { LrcCue } from "./lrc";

export function selectedTrackLyricCues({
  trackId,
  lrcUrl,
  lrcCues,
  curatedCues,
}: {
  trackId: number | null;
  lrcUrl?: string | null;
  lrcCues: LrcCue[];
  curatedCues: LrcCue[];
}) {
  if (trackId === null) return [];
  return lrcUrl ? lrcCues : curatedCues;
}

export function activeLyricCueIndex(cues: LrcCue[], elapsed: number) {
  return cues.findIndex(cue => elapsed >= cue.start && elapsed < cue.end);
}

export type LyricStagePosition = "past" | "current" | "next" | "queued";

export function lyricStageCues(cues: LrcCue[], activeIndex: number) {
  if (activeIndex < 0) return [];
  return cues.flatMap((cue, index) => {
    const distance = index - activeIndex;
    const position: LyricStagePosition | null = distance === -1 ? "past" : distance === 0 ? "current" : distance === 1 ? "next" : distance === 2 ? "queued" : null;
    return position ? [{ cue, index, position }] : [];
  });
}
