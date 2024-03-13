import { is_plain_obj } from "@project/shared/utils.ts";
import { assertEquals, assertNotEquals } from "deno/assert";

Deno.test("tiny logic implementation", async (t) => {
  class SlottableStuff {
    #stuff = new Map<string, any>();
    private constructor() {}
    public static init() {
      return new SlottableStuff();
    }
    replace<T extends (...args: any[]) => any = (...args: any[]) => any>(
      id: string,
      payload: {
        fn: T;
        args: Parameters<T>;
        type: "simply-replace" | "merge-otherwise-replace";
      } | {
        fn: T;
      } | {
        args: Parameters<T>;
        type: "simply-replace" | "merge-otherwise-replace";
      },
    ) {
      if (this.#stuff.has(id)) {
        console.warn(`Replacement for ${id} already exists!!!`);
      }

      this.#stuff.set(id, payload);
    }
    enroll<T extends (...args: any[]) => any>(cb: T, id: string): T {
      const replacement = this.#stuff.get(id);
      // replacement was provided
      if (replacement) {
        const _args = replacement.args;
        // replacement is a function
        if (replacement.fn) {
          // arguments also were provided
          if (_args) {
            // partially update arguments (from runtime has less priority)
            if (replacement.type === "merge-otherwise-replace") {
              return ((...args: any[]) => {
                return replacement.fn(...args.map((a, i) => {
                  const _a = _args[i];
                  // merge objects
                  if (is_plain_obj(_a)) {
                    return {
                      ...(is_plain_obj(a) && a),
                      ..._a,
                    };
                  } else {
                    // replace argument otherwise
                    return _a;
                  }
                }));
              }) as T;
            } else if (replacement.type === "simply-replace") {
              // simple replace arguments (ignore from runtime)
              return ((...args: any[]) => replacement.fn(..._args)) as T;
            }
            console.warn("Unknown replacement type for arguments:");
            console.warn(replacement.type);
            console.warn("...so [simply-replace] was used automatically");
            // implicitly replace arguments (ignore from runtime)
            return ((...args: any[]) => replacement.fn(..._args)) as T;
          }
          // no arguments were provided - so just return the function
          return replacement.fn as T;
        }
        // args were provided but not function
        if (_args) {
          if (replacement.type === "merge-otherwise-replace") {
            return ((...args: any[]) => {
              return cb(args.map((a, i) => {
                const _a = _args[i];
                if (is_plain_obj(_a)) {
                  return {
                    ...(is_plain_obj(a) && a),
                    ..._a,
                  };
                } else {
                  return _a;
                }
              }));
            }) as T;
          } else if (replacement.type === "simply-replace") {
            return ((...args: any[]) => cb(..._args)) as T;
          }
          console.warn("Unknown replacement type for arguments:");
          console.warn(replacement.type);
          console.warn("...so [simply-replace] was used automatically");

          // implicitly replace arguments
          return ((...args: any[]) => cb(..._args)) as T;
        }
      }
      // no replacement was provided - so just return the original
      return cb as T;
    }
  }

  await t.step("should do nothing without replacement", () => {
    const stuff = SlottableStuff.init();
    const app = (a: number, b: number) => a + b;
    const enrolled_app_but_ignored = stuff.enroll(app, "app");
    const original_args = [1, 2] as const;
    assertEquals(
      app(...original_args),
      enrolled_app_but_ignored(...original_args),
    );
  });

  await t.step("should replace runtime args", () => {
    const stuff = SlottableStuff.init();
    const app = (a: number, b: number) => a + b;
    stuff.replace("app", {
      args: [3, 4],
      type: "simply-replace",
    });
    const enrolled_app = stuff.enroll(app, "app");
    const original_args = [1, 2] as const;
    assertNotEquals(app(...original_args), enrolled_app(...original_args));
    assertEquals(app(...original_args), 3);
    assertEquals(enrolled_app(...original_args), 7);
  });
});
