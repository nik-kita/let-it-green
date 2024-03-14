import { BrickOuter } from "../shared/brick-outer.ts";
import { cors } from "hono/middleware/cors/index.ts";

const _bricks = BrickOuter.init();

// TODO this should be exactly in some special own place and be synced with the 'bricks'
_bricks.intercept("cors()", {
  fn: cors(),
});

export const bricks = _bricks;
