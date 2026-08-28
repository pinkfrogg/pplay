import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("../components/CuratorCatalogDesk.tsx", import.meta.url), "utf8");

describe("curator release-year entry", () => {
  it("keeps a raw typed year while restricting it to four numeric characters", () => {
    expect(source).toContain('const [albumReleaseYear, setAlbumReleaseYear] = useState("")');
    expect(source).toContain('inputMode="numeric"');
    expect(source).toContain('event.target.value.replace(/\\D/g, "").slice(0, 4)');
  });

  it("normalizes the typed year only when a sleeve is saved", () => {
    expect(source).toContain("releaseYear: albumReleaseYearFromInput(albumReleaseYear)");
  });
});
