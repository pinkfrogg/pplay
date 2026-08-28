import { describe, expect, it } from "vitest";
import { marqueeScrollDistance } from "./titleMarquee";
import { readFileSync } from "node:fs";

const marqueeComponent = readFileSync(new URL("../components/MarqueeTitle.tsx", import.meta.url), "utf8");
const css = readFileSync(new URL("../index.css", import.meta.url), "utf8");

describe("selected-song title marquee", () => {
  it("does not animate titles that fit their viewport", () => {
    expect(marqueeScrollDistance(240, 240)).toBe(0);
    expect(marqueeScrollDistance(180, 240)).toBe(0);
  });

  it("returns the overflow distance for exceptionally long titles", () => {
    expect(marqueeScrollDistance(481.2, 320)).toBe(162);
  });

  it("uses a duplicated text track for a seamless, active-only continuous loop", () => {
    expect(marqueeComponent).toContain("active?: boolean");
    expect(marqueeComponent).toContain("const shouldLoop = active && hasOverflow;");
    expect(marqueeComponent).toContain('className="track-title-marquee-track"');
    expect(marqueeComponent).toContain('aria-hidden="true"');
    expect(css).toContain("animation: selected-title-marquee 10s linear infinite;");
    expect(css).toContain("gap: 54px;");
  });
});
