import { cors } from "hono/middleware/cors/index.ts";
import { BrickOuter } from "../shared/brick-outer.ts";

const _bricks = BrickOuter.init();

// TODO this should be exactly in some special own place and be synced with the 'bricks'
_bricks
  .intercept("cors()", {
    fn: cors(),
  })
  .intercept("Deno.openKv()", {
    args: ["lab.db"],
    args_strategy: "replace",
  });

export const bricks = _bricks;
