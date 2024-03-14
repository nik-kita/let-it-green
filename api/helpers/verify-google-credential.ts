import {
  createRemoteJWKSet,
  jwtVerify,
} from "https://deno.land/x/jose@v4.13.1/index.ts";
import { SuccessGoogleVerifyRes } from "../../models/hardcoded-types/success-google-verify-res.ts";
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
      const gCredentialId = Deno.env.get("VITE_GOOGLE_CLIENT_ID");

      if (gCredentialId !== google_client_id) {
        throw new Error("Unknown google client id.");
      }

      const JWKS = await create_jwk_set_fn(
        new URL(remote_google_jwk_set_url),
      );

      const { payload } = await jwt_verify_fn(credential, JWKS, {
        issuer,
        audience: google_client_id,
      });

      return payload as Partial<SuccessGoogleVerifyRes["payload"]>;
    },
    "verify_google_credential",
  );
