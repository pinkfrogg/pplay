import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const albumPage = readFileSync(new URL("../pages/AlbumPage.tsx", import.meta.url), "utf8");
const stylesheet = readFileSync(new URL("../index.css", import.meta.url), "utf8");

describe("album track playing highlight", () => {
  it("applies the playing state only to the selected track that is actively playing", () => {
    expect(albumPage).toContain("const isPlayingTrack = isSelectedTrack && playing");
    expect(albumPage).toContain("album-page-track-button--playing");
    expect(albumPage).toContain('aria-current={isPlayingTrack ? "true" : undefined}');
    expect(albumPage).not.toContain("now-playing-badge");
  });

  it("uses the dusty-pink palette for a translucent playing-row highlight and title", () => {
    expect(stylesheet).toContain(".album-page-track-button--playing { background: rgba(180,93,112,.14)");
    expect(stylesheet).toContain(".album-page-track-button--playing .album-page-track-title strong { color: var(--rosewood-blush)");
    expect(stylesheet).not.toContain(".now-playing-badge");
  });
});
