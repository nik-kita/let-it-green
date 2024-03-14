import { z } from "zod";
import { AUTH_PROVIDERS, FULL_NAME_REGEX } from "../shared/const.ts";

export const IsUser = z.object({
  id: z
    .string()
    .ulid()
    .describe("primary"),
  sub: z
    .string()
    .describe("unique"),
  createdAt: z
    .number()
    .int(),
  email: z
    .string()
    .email(),
  name: z
    .string()
    .regex(FULL_NAME_REGEX),
  auth_provider: z
    .enum(AUTH_PROVIDERS),
  picture: z.string()
    .url()
    .optional(),
});

export type User = z.input<typeof IsUser>;
