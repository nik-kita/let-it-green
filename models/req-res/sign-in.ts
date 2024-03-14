import { z } from "zod";
import { User } from "@project/models/user.ts";
import { AUTH_PROVIDERS } from "@project/shared/const.ts";

export const IsGoogleSignInReq = z.object({
  credential: z.string().min(20).max(100),
  client_id: z.string().min(20).max(100),
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
