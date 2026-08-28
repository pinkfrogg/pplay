import { describe, expect, it } from "vitest";
import { isSupportedMp3, makeAudioStorageName, MAX_AUDIO_UPLOAD_BYTES } from "./music";

describe("music upload helpers", () => {
  it("only accepts supported MP3 file signatures", () => {
    expect(isSupportedMp3("soundtrack.mp3", "audio/mpeg")).toBe(true);
    expect(isSupportedMp3("soundtrack.wav", "audio/wav")).toBe(false);
  });

  it("converts a filename into a storage-safe MP3 name", () => {
    expect(makeAudioStorageName("My Song (Final Mix).mp3")).toBe("My-Song-Final-Mix.mp3");
    expect(makeAudioStorageName("..///.mp3")).toBe("track.mp3");
  });

  it("defines a bounded audio upload size", () => {
    expect(MAX_AUDIO_UPLOAD_BYTES).toBe(18 * 1024 * 1024);
  });
});
