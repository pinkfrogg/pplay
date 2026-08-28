import { describe, expect, it } from "vitest";
import { activeLyricCueIndex, lyricStageCues, selectedTrackLyricCues } from "./lyricPlayback";

const lrcCues = [{ start: 1, end: 4, text: "Synced line" }];
const curatedCues = [{ start: 1, end: 4, text: "Curated fallback" }];

describe("selected-track lyric playback", () => {
  it("keeps the Lyrics panel empty until a listener selects a track", () => {
    expect(selectedTrackLyricCues({ trackId: null, lrcUrl: "https://lyrics.example.com/song.lrc", lrcCues, curatedCues })).toEqual([]);
  });

  it("uses fetched LRC cues for the selected track and preserves manual cues only when no LRC is configured", () => {
    expect(selectedTrackLyricCues({ trackId: 7, lrcUrl: "https://lyrics.example.com/song.lrc", lrcCues, curatedCues })).toEqual(lrcCues);
    expect(selectedTrackLyricCues({ trackId: 7, lrcUrl: null, lrcCues, curatedCues })).toEqual(curatedCues);
  });

  it("maps an unchanged elapsed time to the same active line while playback is paused", () => {
    expect(activeLyricCueIndex(lrcCues, 2)).toBe(0);
    expect(activeLyricCueIndex(lrcCues, 2)).toBe(0);
  });

  it("keeps only the previous, current, and next queued cues in the floating story stage", () => {
    const cues = [
      { start: 0, end: 2, text: "One" },
      { start: 2, end: 4, text: "Two" },
      { start: 4, end: 6, text: "Three" },
      { start: 6, end: 8, text: "Four" },
      { start: 8, end: 10, text: "Five" },
    ];

    expect(lyricStageCues(cues, 2)).toEqual([
      { cue: cues[1], index: 1, position: "past" },
      { cue: cues[2], index: 2, position: "current" },
      { cue: cues[3], index: 3, position: "next" },
      { cue: cues[4], index: 4, position: "queued" },
    ]);
  });

});
