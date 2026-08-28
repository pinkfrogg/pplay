import { describe, expect, it } from "vitest";
import { asLyricCues, findActiveCueIndex, storedLyricsOrNull } from "./lyrics";

describe("timed lyric helpers", () => {
  const segments = [
    { id: 0, seek: 0, start: 0.2, end: 1.4, text: " First line ", tokens: [], temperature: 0, avg_logprob: 0, compression_ratio: 0, no_speech_prob: 0 },
    { id: 1, seek: 1, start: 1.4, end: 3.1, text: "Second line", tokens: [], temperature: 0, avg_logprob: 0, compression_ratio: 0, no_speech_prob: 0 },
  ];

  it("normalizes timestamped transcription phrases into display cues", () => {
    expect(asLyricCues(segments)).toEqual([
      { start: 0.2, end: 1.4, text: "First line" },
      { start: 1.4, end: 3.1, text: "Second line" },
    ]);
  });

  it("selects the currently active lyric cue from playback time", () => {
    const cues = asLyricCues(segments);
    expect(findActiveCueIndex(cues, 1.5)).toBe(1);
    expect(findActiveCueIndex(cues, 3.5)).toBe(1);
  });

  it("returns a stable null value when no stored transcript exists", () => {
    expect(storedLyricsOrNull(undefined)).toBeNull();
    expect(storedLyricsOrNull({ lyricsText: "Ready" })).toEqual({ lyricsText: "Ready" });
  });
});
