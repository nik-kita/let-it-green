import { load } from "https://deno.land/std@0.219.0/dotenv/mod.ts";
import { cors } from "https://deno.land/x/hono@v4.0.10/middleware/cors/index.ts";
/* @deno-types="npm:hono" */
import { Hono } from "https://deno.land/x/hono@v4.0.10/mod.ts";
import {
  createRemoteJWKSet,
  jwtVerify,
} from "https://deno.land/x/jose@v4.13.1/index.ts";

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
    const JWKS = await createRemoteJWKSet(
      new URL("https://www.googleapis.com/oauth2/v3/certs"),
    );
    const jwt = body.credential;
    const { payload, protectedHeader } = await jwtVerify(jwt, JWKS, {
      issuer: "https://accounts.google.com",
      audience: google_client_id,
    });
    console.log(protectedHeader);
    console.log(payload);
    return c.json(payload);
  });

Deno.serve(
  { port: 3000 },
  new Hono().route("/api", api).fetch,
);
