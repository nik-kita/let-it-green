import { load } from "deno/std/dotenv/mod.ts";
import { showRoutes } from "hono/helper/dev/index.ts";
import { cors } from "hono/middleware/cors/index.ts";
import { logger } from "hono/middleware/logger/index.ts";
import { Hono } from "hono/mod.ts";
import { bricks } from "./bricks.ts";
import { auth } from "./handlers/auth/index.ts";

await load({ export: true });

const app = new Hono()
  .use(bricks.enroll(
    cors({
      origin: "https://let-it-green.deno.dev",
    }),
    "cors()",
  ))
  .use(logger())
  .basePath("/api")
  .route("/auth", auth);

showRoutes(app, { verbose: true });

Deno.serve({
  port: 3000,
}, app.fetch);
