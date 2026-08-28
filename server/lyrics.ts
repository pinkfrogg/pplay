import type { WhisperSegment } from "./_core/voiceTranscription";

export type LyricCue = { start: number; end: number; text: string };

export function storedLyricsOrNull<T>(lyrics: T | undefined) {
  return lyrics ?? null;
}

export function asLyricCues(segments: WhisperSegment[]): LyricCue[] {
  return segments
    .map((segment) => ({ start: Math.max(0, segment.start), end: Math.max(segment.start, segment.end), text: segment.text.trim() }))
    .filter((segment) => segment.text.length > 0);
}

export function findActiveCueIndex(cues: LyricCue[], time: number) {
  const index = cues.findIndex((cue) => time >= cue.start && time < cue.end);
  if (index >= 0) return index;
  return cues.reduce((latest, cue, cueIndex) => (cue.start <= time ? cueIndex : latest), -1);
}
