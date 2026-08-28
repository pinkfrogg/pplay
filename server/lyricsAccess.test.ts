import { describe, expect, it } from "vitest";
import { lyricGenerationAccess } from "../client/src/lib/lyricsAccess";

describe("anonymous lyric generation guard", () => {
  it("requires a sign-in state before a stored MP3 can generate lyrics", () => {
    expect(lyricGenerationAccess(false, { storageId: 1, kind: "upload" })).toBe("login");
  });

  it("allows generation only for an authenticated stored MP3", () => {
    expect(lyricGenerationAccess(true, { storageId: 1, kind: "upload" })).toBe("ready");
    expect(lyricGenerationAccess(true, { storageId: 1, kind: "link" })).toBe("unavailable");
  });
});
