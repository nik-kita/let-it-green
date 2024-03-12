import { zValidator } from "@hono/zod-validator";
import {
  Env,
  Handler,
  Hono,
  HTTPException,
  MiddlewareHandler,
  Schema,
} from "hono/mod.ts";
import { BlankSchema } from "https://deno.land/x/hono@v4.0.10/types.ts";
import { monotonicUlid } from "ulid";
import { IsSignInReq } from "~/models/req-res/sign-in.ts";
import { IsUser, User } from "~/models/user.ts";
import { gen_verify_google_credential } from "../helpers/verify-google-credential.ts";
import { gen_pentagon } from "../pentagon/index.ts";

const validator = zValidator(
  "json",
  IsSignInReq,
);

export const sign_in = <
  E extends Env = Env,
  S extends Schema = BlankSchema,
  BasePath extends string = "/",
>(
  h: Hono<E, S, BasePath>,
  pentagon: Awaited<ReturnType<typeof gen_pentagon>>,
  _options: {
    path?: string;
    validator?: MiddlewareHandler;
    handler?: {
      full_replace: Handler;
      verify_google_credential?: never;
    } | {
      full_replace?: never;
      verify_google_credential?: ReturnType<
        typeof gen_verify_google_credential
      >;
    };
  } = {},
) => {
  const verify_google_credential = _options.handler?.verify_google_credential ??
    gen_verify_google_credential();
  return h.post(
    (_options.path as "/sign-in") ?? "/sign-in",
    (_options.validator as typeof validator) ?? validator,
    (_options.handler?.full_replace as never) ?? (async (c) => {
      const body = c.req.valid("json");
      console.log(body);
      try {
        const g_res = await verify_google_credential({
          credential: body.credential,
          google_client_id: body.client_id,
        });
        console.log(g_res.payload);
        const user: User = IsUser.parse(
          {
            id: monotonicUlid(),
            email: g_res.payload.email as string,
            createdAt: Date.now(),
            name: `${g_res.payload.firstName} ${g_res.payload.lastName}`,
            sub: g_res.payload.sub as string,
            auth_provider: "google",
            picture: g_res.payload.picture as string,
          } satisfies User,
        );
      } catch (e) {
        console.warn(e);
        throw new HTTPException(401, { message: "Unauthorized", res: e });
      }
    }),
  );
};
