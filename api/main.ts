import { load } from "https://deno.land/std@0.219.0/dotenv/mod.ts";
import { HTTPException } from "https://deno.land/x/hono@v4.0.10/http-exception.ts";
import { cors } from "https://deno.land/x/hono@v4.0.10/middleware/cors/index.ts";
/* @deno-types="npm:hono" */
import { Hono } from "https://deno.land/x/hono@v4.0.10/mod.ts";
import { verify_google_credential } from "./helpers/verify-google-credential.ts";

const env = await load();
const google_client_id = env["VITE_GOOGLE_CLIENT_ID"];
const api = new Hono();

api
  .use(cors())
  .post("/lab", (c) => {
    return c.json({ message: "Hello, World!" });
  })
  .post("/login", async (c) => {
    const body = await c.req.json();
    const result = await verify_google_credential(body.credential, {
      google_client_id,
    });

    if (result.ok) {
      return c.json(result);
    }

    throw new HTTPException(401, {
      res: new Response("Unauthorized", {
        status: 401,
        statusText: result.err,
      }),
    });
  });

Deno.serve(
  { port: 3000 },
  new Hono().route("/api", api).fetch,
);
