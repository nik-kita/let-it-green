import {
  createRemoteJWKSet,
  jwtVerify,
} from "https://deno.land/x/jose@v4.13.1/index.ts";

export const gen_verify_google_credential = (
  _options: {
    issuer?: string;
    remote_google_jwk_set_url?: string;
    create_jwk_set_fn?: typeof createRemoteJWKSet;
    jwt_verify_fn?: typeof jwtVerify;
  } = {},
) => {
  const {
    issuer = "https://accounts.google.com",
    remote_google_jwk_set_url = "https://www.googleapis.com/oauth2/v3/certs",
    create_jwk_set_fn = createRemoteJWKSet,
    jwt_verify_fn = jwtVerify,
  } = _options;

  return async (options: {
    credential: string;
    google_client_id: string;
  }) => {
    const {
      credential,
      google_client_id,
    } = options;
    const JWKS = await create_jwk_set_fn(
      new URL(remote_google_jwk_set_url),
    );
    return jwt_verify_fn(
      credential,
      JWKS,
      {
        issuer,
        audience: google_client_id,
      },
    );
  };
};
