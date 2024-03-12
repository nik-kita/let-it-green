import { createPentagon } from "https://deno.land/x/pentagon@v0.1.5/mod.ts";
import { IsUser } from "~/models/user.ts";

export const gen_pentagon = async (kv: Deno.Kv) => {
  return createPentagon(kv, {
    users: {
      schema: IsUser,
    },
  });
};
