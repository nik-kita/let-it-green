import { api } from "./api.ts";
import { showRoutes } from "hono/helper/dev/index.ts";
import { cors } from "hono/middleware/cors/index.ts";
import { logger } from "hono/middleware/logger/index.ts";
import { Hono } from "hono/mod.ts";
import { bricks } from "./bricks.ts";

const app = new Hono()
  .use(bricks.enroll(
    cors({
      origin: "https://let-it-green.deno.dev",
    }),
    "cors()",
  ))
  .use(logger())
  .route("/api", api)
  .all("/", (c) => {
    return c.text("Hello, world!");
  });

showRoutes(app, { verbose: true });

Deno.serve({
  port: 3000,
}, app.fetch);
