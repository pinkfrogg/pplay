import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const stylesheet = readFileSync(new URL("../index.css", import.meta.url), "utf8");

describe("album-page vinyl presentation", () => {
  it("keeps the original unframed vinyl-and-sleeve presentation", () => {
    expect(stylesheet).toContain(".record-presentation { position: relative; width: min(100%, 510px)");
    expect(stylesheet).not.toContain(".record-presentation::before");
    expect(stylesheet).toContain(".sleeve-backdrop { position: absolute; z-index: 1");
  });
});
