// @deno-types="npm:hono"
import { Hono } from "https://deno.land/x/hono@v4.0.10/mod.ts";
import { cors } from "https://deno.land/x/hono@v4.0.10/middleware/cors/index.ts";

const api = new Hono();

api
  .use(cors())
  .post("/lab", (c) => {
    return c.json({ message: "Hello, World!" });
  });

Deno.serve(
  { port: 3000 },
  new Hono().route("/api", api).fetch,
);
