import { describe, expect, it } from "vitest";
import { isCollectionRoute } from "./brandNavigation";

describe("brand navigation", () => {
  it("keeps the collection-page wordmark inert", () => {
    expect(isCollectionRoute("/")).toBe(true);
  });

  it("makes the wordmark a collection return on album routes", () => {
    expect(isCollectionRoute("/albums/60001")).toBe(false);
  });
});
