import { describe, expect, it } from "vitest";
import { lyricGenerationAccess } from "./lyricsAccess";

describe("lyric generation access", () => {
  it("requires authentication before a stored track can request lyric generation", () => {
    expect(lyricGenerationAccess(false, { storageId: 1, kind: "upload" })).toBe("login");
  });

  it("allows only signed-in users with a stored MP3 to generate lyrics", () => {
    expect(lyricGenerationAccess(true, { storageId: 1, kind: "upload" })).toBe("ready");
    expect(lyricGenerationAccess(true, { storageId: 1, kind: "link" })).toBe("unavailable");
  });
});
