import {
  createRemoteJWKSet,
  jwtVerify,
} from "https://deno.land/x/jose@v4.13.1/index.ts";

export async function verify_google_credential(credential: string, options: {
  google_client_id: string;
  issuer?: string;
  remote_google_jwk_set_url?: string;
}) {
  const {
    google_client_id,
    issuer,
    remote_google_jwk_set_url,
  } = {
    remote_google_jwk_set_url: "https://www.googleapis.com/oauth2/v3/certs",
    issuer: "https://accounts.google.com",
    ...options,
  };

  try {
    const JWKS = await createRemoteJWKSet(new URL(remote_google_jwk_set_url));
    const { payload, protectedHeader } = await jwtVerify(credential, JWKS, {
      issuer,
      audience: google_client_id,
    });

    return {
      ok: true,
      payload,
      protectedHeader,
    } as const;
  } catch (err) {
    return {
      ok: false,
      err,
    } as const;
  }
}
