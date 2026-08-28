import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { TrpcContext } from "./context";
import { hasOwnerSession } from "../adminAuth";

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

export const adminProcedure = t.procedure.use(({ ctx, next }) => {
  if (!hasOwnerSession(ctx.req)) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Owner admin access is required." });
  }
  return next();
});
