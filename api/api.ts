import { zValidator } from "@hono/zod-validator";
import { verify_google_credential } from "@project/api/helpers/verify-google-credential.ts";
import { IsSignInReq } from "@project/models/req-res/sign-in.ts";
import { Hono } from "hono/mod.ts";
import { bricks } from "@project/api/bricks.ts";

export const api = new Hono()
  .post(...[
    "/sign-in",

    zValidator("json", IsSignInReq),

    bricks.enroll(
      async (c) => {
        console.log("inside sign-in");
        const auth_payload = c.req.valid("json");
        const res = await verify_google_credential({
          credential: auth_payload.credential,
          google_client_id: auth_payload.client_id,
        });

        console.log(res);

        return c.json(res);
      },
      "asdf",
    ),
  ]);
