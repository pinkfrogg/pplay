import { describe, expect, it } from "vitest";
import { albumReleaseYearFromInput } from "./catalogReleaseYear";

describe("album-level release year", () => {
  it("keeps a valid sleeve release year for album create and update payloads", () => {
    expect(albumReleaseYearFromInput("2001")).toBe(2001);
    expect(albumReleaseYearFromInput(2004)).toBe(2004);
  });

  it("does not forward blank or invalid values as a track-level-style year", () => {
    expect(albumReleaseYearFromInput("")).toBeUndefined();
    expect(albumReleaseYearFromInput("999")).toBeUndefined();
    expect(albumReleaseYearFromInput("2001.5")).toBeUndefined();
  });
});
