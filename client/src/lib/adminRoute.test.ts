import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const app = readFileSync(new URL("../App.tsx", import.meta.url), "utf8");
const home = readFileSync(new URL("../pages/Home.tsx", import.meta.url), "utf8");
const rail = readFileSync(new URL("../components/ListeningRail.tsx", import.meta.url), "utf8");
const adminPage = readFileSync(new URL("../pages/AdminPage.tsx", import.meta.url), "utf8");

describe("private curator route", () => {
  it("registers a dedicated admin route with its own owner-login interface", () => {
    expect(app).toContain('<Route path={"/admin"} component={AdminPage} />');
    expect(adminPage).toContain("trpc.admin.login.useMutation()");
    expect(adminPage).toContain("trpc.admin.status.useQuery");
    expect(adminPage).toContain("CuratorCatalogDesk");
  });

  it("removes curator controls and access prompts from guest-facing routes", () => {
    expect(home).not.toContain("CuratorCatalogDesk");
    expect(home).not.toContain("Open catalog desk");
    expect(rail).not.toContain("Curator access");
  });
});
