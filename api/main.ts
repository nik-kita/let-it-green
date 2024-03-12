import { showRoutes } from "hono/helper/dev/index.ts";
import { cors } from "hono/middleware/cors/index.ts";
import { logger } from "hono/middleware/logger/index.ts";
import { Hono } from "hono/mod.ts";
import { zValidator } from "@project/api/helpers/zod-validaotr.ts";
import { IsSignInReq } from "@project/models/req-res/sign-in.ts";

const app = new Hono()
  .use(logger());

showRoutes(app, { verbose: true });

Deno.serve({
  port: 3000,
}, app.fetch);
