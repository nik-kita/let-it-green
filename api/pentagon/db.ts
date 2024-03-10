import { createPentagon } from "https://deno.land/x/pentagon@v0.1.5/mod.ts";
import { IsUser } from "~/models/user.ts";

export const kv = await Deno.openKv();
export const db = createPentagon(kv, {
  users: {
    schema: IsUser,
  },
});
