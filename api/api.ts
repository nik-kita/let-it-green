import { cors } from "https://deno.land/x/hono@v4.0.10/middleware/cors/index.ts";
import {
  Hono,
  MiddlewareHandler,
} from "https://deno.land/x/hono@v4.0.10/mod.ts";
import { gen_pentagon } from "~/api/pentagon/index.ts";
import { sign_in } from "./handlers/sing-in.ts";

export async function gen_api(_gloabls: {
  pentagon?: Awaited<ReturnType<typeof gen_pentagon>>;
} = {}, _options: {
  middlewares?: {
    _cors?: MiddlewareHandler;
  };
  handlers?: {
    _post_sign_in?: typeof sign_in;
  };
} = {}) {
  const {
    pentagon = await gen_pentagon(await Deno.openKv()),
  } = _gloabls;
  const {
    middlewares = {},
    handlers = {},
  } = _options;
  const app = new Hono();
  const {
    _cors = cors(),
  } = middlewares;
  app.use(_cors);
  const {
    _post_sign_in = sign_in,
  } = handlers;

  return _post_sign_in(app, pentagon);
}
