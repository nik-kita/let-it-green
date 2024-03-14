import { createFactory } from "hono/helper.ts";
import { monotonicUlid } from "ulid";
import { IsSignInReq, SignInRes } from "../../../models/req-res/sign-in.ts";
import { User } from "../../../models/user.ts";
import { signJwt } from "../../helpers/jwt.ts";
import { verify_google_credential } from "../../helpers/verify-google-credential.ts";
import { zValidator } from "../../helpers/zvalidator.middleware.ts";
import { users } from "../../services/users.ts";

const factory = createFactory();
const validation = factory
  .createMiddleware(zValidator("json", IsSignInReq));

export const sign_in = factory
  .createHandlers(
    validation,
    async (c) => {
      const auth_payload = c.req.valid("json");
      const res = await verify_google_credential({
        credential: auth_payload.credential,
        google_client_id: auth_payload.client_id,
      });

      if (!res.name || !res.sub || !res.email) {
        throw new Error("Unexpected: 'name | email | sub' is not present");
      }

      const user = await users.get_by_sub(res.sub) || await users.insert(
        {
          createdAt: Date.now(),
          id: monotonicUlid(),
          name: res.name,
          sub: res.sub,
          auth_provider: "google",
          email: res.email,
          picture: res.picture,
        } satisfies User,
      );

      if (!user) {
        throw new Error("Unexpected: user is not present/created");
      }

      const issuer = c.req.url;
      const user_id = user.id;
      const [{ token: access_token }, { token: refresh_token }] = await Promise
        .all([
          signJwt({
            expiresIn: new Date(Date.now() + 1000 * 60 * 1),
            privateKeyPem: "ACCESS_TOKEN_PRIVATE_KEY",
            user_id,
            issuer,
          }),
          signJwt({
            expiresIn: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
            issuer,
            user_id,
            privateKeyPem: "REFRESH_TOKEN_PRIVATE_KEY",
          }),
        ]);

      return c.json(
        { ...user, access_token, refresh_token } satisfies SignInRes,
      );
    },
  );
