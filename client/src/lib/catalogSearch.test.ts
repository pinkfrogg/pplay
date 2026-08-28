import { describe, expect, it } from "vitest";
import { catalogSearchPath, catalogSearchSuggestions, findCatalogSearchResult, selectedTrackIdFromSearch } from "./catalogSearch";
import type { CatalogAlbum } from "./catalogRoutes";

const catalog: CatalogAlbum[] = [
  { id: 1, title: "Barbie in the Nutcracker", coverImage: "cover.jpg", releaseYear: 2001, tracks: [{ id: 11, albumId: 1, title: "Overture to The Nutcracker", artist: "Arnie Roth", albumArtists: "Arnie Roth", audioUrl: "https://example.com/overture.mp3", lyrics: [] }] },
  { id: 2, title: "Barbie of Swan Lake", coverImage: "cover.jpg", releaseYear: 2003, tracks: [{ id: 21, albumId: 2, title: "Swan Theme", artist: "Orchestra", albumArtists: "London Symphony", audioUrl: "https://example.com/swan.mp3", lyrics: [] }] },
];

describe("collection search routing", () => {
  it("routes movie-title and album-artist matches to their album page", () => {
    expect(findCatalogSearchResult(catalog, "Swan Lake")).toEqual({ albumId: 2 });
    expect(findCatalogSearchResult(catalog, "London Symphony")).toEqual({ albumId: 2 });
  });

  it("routes a matching song to its album and marks it for autoplay", () => {
    const result = findCatalogSearchResult(catalog, "Overture");
    expect(result).toEqual({ albumId: 1, trackId: 11 });
    expect(catalogSearchPath(result!)).toBe("/albums/1?track=11&autoplay=1");
    expect(selectedTrackIdFromSearch("?track=11&autoplay=1")).toBe(11);
  });

  it("ignores empty, unknown, and non-autoplay track search parameters", () => {
    expect(findCatalogSearchResult(catalog, "")).toBeNull();
    expect(findCatalogSearchResult(catalog, "unlisted score")).toBeNull();
    expect(selectedTrackIdFromSearch("?track=11")).toBeNull();
  });

  it("offers grouped album choices when an artist is credited across multiple releases", () => {
    const suggestions = catalogSearchSuggestions(catalog, "Arnie Roth");
    expect(suggestions).toEqual([{ kind: "artist", albumId: 1, title: "Arnie Roth", detail: "Barbie in the Nutcracker" }]);
  });

  it("offers song choices that preserve their direct autoplay destination", () => {
    const suggestion = catalogSearchSuggestions(catalog, "Swan Theme")[0];
    expect(suggestion).toMatchObject({ kind: "song", albumId: 2, trackId: 21 });
    expect(catalogSearchPath(suggestion)).toBe("/albums/2?track=21&autoplay=1");
  });
});
