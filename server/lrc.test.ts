import { afterEach, describe, expect, it, vi } from "vitest";
import { parseLrc, readLrc } from "./lrc";

afterEach(() => vi.unstubAllGlobals());

describe("LRC retrieval", () => {
  it("parses timestamped lines into ordered playback cues", () => {
    expect(parseLrc("[00:03.50] Second\n[00:01.00] First")).toEqual([
      { start: 1, end: 3.5, text: "First" },
      { start: 3.5, end: 9.5, text: "Second" },
    ]);
  });

  it("reads a small public LRC file", async () => {
    const body = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new TextEncoder().encode("[00:01.20] A sparkling line"));
        controller.close();
      },
    });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, status: 200, headers: new Headers({ "content-length": "29" }), body }));

    await expect(readLrc("https://lyrics.example.com/song.lrc")).resolves.toEqual([
      { start: 1.2, end: 7.2, text: "A sparkling line" },
    ]);
  });

  it("blocks private URLs before requesting an LRC file", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(readLrc("http://127.0.0.1/lyrics.lrc")).rejects.toThrow("public HTTP(S) LRC link");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns no lyric cues when a bounded remote LRC request is aborted", async () => {
    const aborted = Object.assign(new Error("This operation was aborted"), { name: "AbortError" });
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(aborted));

    await expect(readLrc("https://lyrics.example.com/slow-song.lrc")).resolves.toEqual([]);
  });
});
