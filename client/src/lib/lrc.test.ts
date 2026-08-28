import { describe, expect, it } from "vitest";
import { parseLrc } from "./lrc";

describe("parseLrc", () => {
  it("creates sorted playback cues from standard timed LRC lines", () => {
    expect(parseLrc("[00:02.50]First line\n[00:08]Second line")).toEqual([
      { start: 2.5, end: 8, text: "First line" },
      { start: 8, end: 14, text: "Second line" },
    ]);
  });
});
