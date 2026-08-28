import { describe, expect, it } from "vitest";
import { nextExpandedAlbumId } from "./albumDisclosure";

describe("nextExpandedAlbumId", () => {
  it("opens the sleeve selected by a listener", () => {
    expect(nextExpandedAlbumId(null, 24)).toBe(24);
  });

  it("collapses the currently open sleeve when it is selected again", () => {
    expect(nextExpandedAlbumId(24, 24)).toBeNull();
  });

  it("replaces the visible track list when a different sleeve is selected", () => {
    expect(nextExpandedAlbumId(24, 71)).toBe(71);
  });
});
