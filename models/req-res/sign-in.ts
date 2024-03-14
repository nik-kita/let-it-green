import { z } from "zod";
import { type User } from "../user.ts";
import { AUTH_PROVIDERS } from "../../shared/const.ts";

export const IsGoogleSignInReq = z.object({
  credential: z.string(),
  client_id: z.string(),
  auth_provider: z.literal("google" satisfies typeof AUTH_PROVIDERS[number]),
});
export const IsSignInReq = z.union([
  IsGoogleSignInReq,
  z.never(), // TODO replace with some new auth provider
]);
export type SignInReq = z.input<typeof IsSignInReq>;
export type TokenPair = {
  access_token: string;
  refresh_token: string;
};
export type SignInRes = User & TokenPair;
