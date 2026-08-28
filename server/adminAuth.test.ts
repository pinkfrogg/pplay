import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { OWNER_ADMIN_COOKIE } from "./adminAuth";
import type { TrpcContext } from "./_core/context";

function createContext(cookie = "") {
  const cookies: { name: string; value: string; options: Record<string, unknown> }[] = [];
  const context: TrpcContext = {
    req: { protocol: "https", headers: cookie ? { cookie } : {} } as TrpcContext["req"],
    res: {
      cookie: (name: string, value: string, options: Record<string, unknown>) => cookies.push({ name, value, options }),
      clearCookie: () => undefined,
    } as TrpcContext["res"],
  };
  return { context, cookies };
}

describe("dedicated owner admin session", () => {
  it("validates the configured admin credentials through the login endpoint and signs an owner cookie", async () => {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    if (!email || !password) throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be configured.");
    const login = createContext();
    await expect(appRouter.createCaller(login.context).admin.login({ email, password })).resolves.toEqual({ authenticated: true });
    const session = login.cookies.find((cookie) => cookie.name === OWNER_ADMIN_COOKIE);
    expect(session?.value).toBeTruthy();
    expect(session?.options).toMatchObject({ httpOnly: true, sameSite: "lax", secure: true });
    const status = createContext(`${OWNER_ADMIN_COOKIE}=${encodeURIComponent(session?.value ?? "")}`);
    await expect(appRouter.createCaller(status.context).admin.status()).resolves.toEqual({ authenticated: true });
  });

  it("rejects credentials that do not match the configured owner login", async () => {
    const login = createContext();
    await expect(appRouter.createCaller(login.context).admin.login({ email: "not-the-owner@example.com", password: "not-the-password" })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("keeps catalog editing behind the owner session even though album browsing is public", async () => {
    const visitor = createContext();
    await expect(appRouter.createCaller(visitor.context).catalog.fetchMp3Metadata({ audioUrl: "https://example.com/song.mp3" })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
});
