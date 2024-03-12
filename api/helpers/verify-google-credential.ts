import {
  createRemoteJWKSet,
  jwtVerify,
} from "https://deno.land/x/jose@v4.13.1/index.ts";

export const gen_verify_google_credential = async ({
  credential,
  google_client_id,
}: {
  credential: string;
  google_client_id: string;
}) => {
  const create_jwk_set_fn = createRemoteJWKSet;
  const remote_google_jwk_set_url =
    "https://www.googleapis.com/oauth2/v3/certs";
  const issuer = "https://accounts.google.com";
  const jwt_verify_fn = jwtVerify;

  const JWKS = await create_jwk_set_fn(
    new URL(remote_google_jwk_set_url),
  );
  return jwt_verify_fn(credential, JWKS, {
    issuer,
    audience: google_client_id,
  });
};
