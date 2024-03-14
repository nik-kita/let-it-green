import {
  createRemoteJWKSet,
  jwtVerify,
} from "https://deno.land/x/jose@v4.13.1/index.ts";
import { bricks } from "../bricks.ts";

export const verify_google_credential = bricks
  .enroll(
    async (options: {
      credential: string;
      google_client_id: string;
      remote_google_jwk_set_url?: string;
      create_jwk_set_fn?: typeof createRemoteJWKSet;
      jwt_verify_fn?: typeof jwtVerify;
      issuer?: string;
    }) => {
      const {
        credential,
        google_client_id,
        create_jwk_set_fn = createRemoteJWKSet,
        remote_google_jwk_set_url =
          "https://www.googleapis.com/oauth2/v3/certs",
        issuer = "https://accounts.google.com",
        jwt_verify_fn = jwtVerify,
      } = options;

      const JWKS = await create_jwk_set_fn(
        new URL(remote_google_jwk_set_url),
      );

      return jwt_verify_fn(credential, JWKS, {
        issuer,
        audience: google_client_id,
      });
    },
    "verify_google_credential",
  );
