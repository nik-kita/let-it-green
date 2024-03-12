import { showRoutes } from "hono/helper/dev/index.ts";
import { cors } from "hono/middleware/cors/index.ts";
import { logger } from "hono/middleware/logger/index.ts";
import { Hono } from "hono/mod.ts";
import { gen_api } from "~/api/api.ts";
import { gen_pentagon } from "~/api/pentagon/index.ts";
import { sign_in } from "~/api/handlers/sing-in.ts";
import { zValidator } from "~/api/helpers/zod-validaotr.ts";
import { IsSignInReq } from "~/models/req-res/sign-in.ts";

const api = await gen_api({
  pentagon: await gen_pentagon(await Deno.openKv("./lab.db")),
}, {});

const app = new Hono()
  .use("/*", cors())
  .use(logger())
  // .route("/api", api)
  .route(
    "/api",
    new Hono().post("/sign-in", zValidator("json", IsSignInReq)),
  );

showRoutes(app, { colorize: true, verbose: true });

Deno.serve({
  port: 3000,
}, app.fetch);
