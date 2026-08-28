import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const app = readFileSync(new URL("../App.tsx", import.meta.url), "utf8");
const loader = readFileSync(new URL("../components/OpeningLoader.tsx", import.meta.url), "utf8");
const css = readFileSync(new URL("../index.css", import.meta.url), "utf8");

describe("opening loader", () => {
  it("mounts a single loading overlay from the shared app shell", () => {
    expect(app).toContain("<OpeningLoader />");
    expect(loader).toContain("PrincessCrown");
    expect(loader).toContain("loader-note");
    expect(loader).toContain("loader-spark");
  });

  it("uses the dusk palette and continuously contracts a fuller circulating note field into crown coordinates", () => {
    expect(css).toContain(".opening-loader { position: fixed");
    expect(css).toContain("#171214");
    expect(css).toContain("@keyframes loader-note-orbit-contract");
    expect(css).toContain("@keyframes loader-crown-form");
    expect(css).toContain("--orbit-radius");
    expect(css).toContain("--orbit-radius-mid");
    expect(css).toContain("--orbit-radius-near");
    expect(css).toContain("--crown-x");
    expect(loader).toContain("loader-note--eight");
    expect(loader).toContain("loader-spark--eight");
    expect(loader).toContain("OPENING_GATHER_DURATION_MS = 2300");
    expect(css).toContain("0%, 86% { opacity: 0");
    expect(css).toContain("92% { opacity: .82; transform: translate(var(--crown-x)");
    expect(css).toContain("transition: opacity 560ms");
  });

  it("shortens the experience and removes nonessential motion for reduced-motion visitors", () => {
    expect(loader).toContain("prefers-reduced-motion: reduce");
    expect(css).toContain(".opening-loader-crown { opacity: 1; transform: scale(1); }");
  });

  it("automatically schedules piano from the note orbit through crown completion without exposing a preview menu", () => {
    expect(app).not.toContain("IntroPreviewPage");
    expect(app).toContain('<Route path={"/intro-preview"}><Redirect to="/" replace /></Route>');
    expect(loader).toContain("if (!reducedMotion) scheduleOpeningPiano()");
    expect(loader).toContain("OPENING_PIANO_START_AT_MS = 60");
    expect(loader).toContain("OPENING_CROWN_COMPLETE_AT_MS = 2230");
    expect(loader).toContain("context.currentTime + startDelayMs / 1000");
    expect(loader).toContain("window.AudioContext");
  });
});
