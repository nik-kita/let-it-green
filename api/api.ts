import { zValidator } from "@hono/zod-validator";
import { verify_google_credential } from "./helpers/verify-google-credential.ts";
import { IsSignInReq } from "../models/req-res/sign-in.ts";
import { Hono } from "hono/mod.ts";
import { bricks } from "./bricks.ts";

export const api = new Hono()
  .post(...[
    "/sign-in",

    zValidator("json", IsSignInReq),

    bricks.enroll(
      async (c) => {
        const auth_payload = c.req.valid("json");
        const res = await verify_google_credential({
          credential: auth_payload.credential,
          google_client_id: auth_payload.client_id,
        });

        return c.json(res);
      },
      "asdf",
    ),
  ]);
