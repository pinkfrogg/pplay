import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const stylesheet = readFileSync(new URL("../index.css", import.meta.url), "utf8");

describe("movie sleeve record motion", () => {
  it("keeps a record partially tucked behind its DVD case at rest", () => {
    expect(stylesheet).toContain("right: 10px; top: 18px; width: 100px");
    expect(stylesheet).toContain("transform: translateX(-76px) rotate(-4deg)");
  });

  it("reveals a record on hover and keyboard focus", () => {
    expect(stylesheet).toContain(".album-card:hover .album-disc, .album-card:focus-visible .album-disc, .album-card:focus-within .album-disc");
    expect(stylesheet).toContain("transform: translateX(10px) rotate(2deg)");
    expect(stylesheet).toContain("transition: transform 300ms cubic-bezier(.23,1,.32,1)");
    expect(stylesheet).toContain("transition-duration: 420ms, 420ms");
  });

  it("returns the record behind the DVD case immediately while deepening the extended sleeve shadow", () => {
    expect(stylesheet).toContain(".album-disc { position: absolute; z-index: 1");
    expect(stylesheet).not.toContain("z-index 0ms linear 420ms");
    expect(stylesheet).toContain(".album-card:hover .dvd-case, .album-card:focus-visible .dvd-case, .album-card:focus-within .dvd-case");
  });

  it("adds interaction glow without replacing the existing sleeve lift or disc-roll motion", () => {
    expect(stylesheet).toContain(".album-card:hover, .album-card:focus-visible, .album-card:focus-within");
    expect(stylesheet).toContain("0 0 19px rgba(207,75,110,.42)");
    expect(stylesheet).toContain("transform: translateY(-3px)");
    expect(stylesheet).toContain(".album-card:hover .album-disc, .album-card:focus-visible .album-disc, .album-card:focus-within .album-disc");
  });
});
