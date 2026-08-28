import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const home = readFileSync(new URL("../pages/Home.tsx", import.meta.url), "utf8");

describe("collection album card metadata", () => {
  it("retains track count and shows the release year in the requested secondary-card format", () => {
    expect(home).toContain('{item.releaseYear ?? "—"} • {item.tracks.length}');
    expect(home).toContain('item.tracks.length === 1 ? "Track" : "Tracks"');
    expect(home).not.toContain("Open album");
  });
});
