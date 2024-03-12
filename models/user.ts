import { z } from "https://deno.land/x/zod@v3.21.4/mod.ts";
import { AUTH_PROVIDERS, FULL_NAME_REGEX } from "~/shared/const.ts";

export const IsUser = z.object({
  id: z
    .string()
    .uuid()
    .describe("primary"),
  sub: z
    .string()
    .min(20)
    .max(100)
    .describe("Unique identifier for auth provider"),
  createdAt: z
    .number()
    .int(),
  email: z
    .string()
    .email()
    .optional(),
  name: z
    .string()
    .regex(FULL_NAME_REGEX),
  auth_provider: z
    .enum(AUTH_PROVIDERS)
    .optional(),
  picture: z.string()
    .url()
    .optional(),
});

export type User = z.input<typeof IsUser>;
