import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono/mod.ts";
import { monotonicUlid } from "ulid";
import { IsSignInReq } from "../models/req-res/sign-in.ts";
import { User } from "../models/user.ts";
import { bricks } from "./bricks.ts";
import { verify_google_credential } from "./helpers/verify-google-credential.ts";
import { users } from "./services/users.ts";

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

        if (!res.name || !res.sub || !res.email) {
          throw new Error("Unexpected: 'name | email | sub' is not present");
        }

        const prev = await users.get_by_sub(res.sub);

        if (prev) {
          return c.json(prev);
        }

        const user: User = {
          createdAt: Date.now(),
          id: monotonicUlid(),
          name: res.name,
          sub: res.sub,
          auth_provider: "google",
          email: res.email,
          picture: res.picture,
        };

        const db_res = await users.insert(user);

        return c.json(db_res);
      },
      "/sign-in",
    ),
  ]);
