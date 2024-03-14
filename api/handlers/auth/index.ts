import { Hono } from "hono/mod.ts";
import { sign_in } from "./sign-in.ts";

export const auth = new Hono()
  .post("/sign-in", ...sign_in);
