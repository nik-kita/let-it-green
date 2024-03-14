import { createPentagon } from "pentagon";
import { IsUser } from "../models/user.ts";
import { bricks } from "./bricks.ts";

const kv = await bricks.enroll(Deno.openKv, "Deno.openKv()")();

export const pentagon = bricks.enroll(
  createPentagon,
  "createPentagon",
)(kv, {
  users: {
    schema: IsUser,
  },
});
