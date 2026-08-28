import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const routers = readFileSync(new URL("../../../server/routers.ts", import.meta.url), "utf8");
const context = readFileSync(new URL("../../../server/_core/context.ts", import.meta.url), "utf8");
const adminAuth = readFileSync(new URL("../../../server/adminAuth.ts", import.meta.url), "utf8");
const env = readFileSync(new URL("../../../server/_core/env.ts", import.meta.url), "utf8");

describe("public access and auth cleanup", () => {
  it("keeps catalog and LRC reads public while removing the legacy user routers", () => {
    expect(routers).toContain("list: publicProcedure");
    expect(routers).toContain("fetchLrc: publicProcedure");
    expect(routers).not.toContain("auth: router");
    expect(routers).not.toContain("music: router");
    expect(context).not.toContain("authenticateRequest");
  });

  it("uses only admin email and password for the owner session", () => {
    expect(adminAuth).toContain("process.env.ADMIN_EMAIL");
    expect(adminAuth).toContain("process.env.ADMIN_PASSWORD");
    expect(adminAuth).not.toContain("ADMIN_SESSION_SECRET");
    expect(env).not.toContain("JWT_SECRET");
    expect(env).not.toContain("OAUTH_SERVER_URL");
    expect(env).not.toContain("VITE_APP_ID");
  });
});
