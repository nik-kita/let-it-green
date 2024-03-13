import { is_plain_obj } from "@project/shared/utils.ts";
import { assertEquals, assertNotEquals } from "deno/assert";
import { testClient } from "hono/helper/testing/index.ts";
import { Hono, MiddlewareHandler } from "hono/mod.ts";

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
              const merged_args = args.map((a, i) => {
                const _a = _args[i];
                // may be little better solution for "this" safety
                if (is_plain_obj(_a) && is_plain_obj(a)) {
                  for (const k in _a) {
                    a[k] = _a[k];
                  }
                  return a;
                } else {
                  return _a;
                }
              });
              return cb(...merged_args);
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

  await t.step("test with Hono middleware", async (tt) => {
    await tt.step("should do nothing", async () => {
      const stuff = SlottableStuff.init();
      const app = new Hono().get(
        "/test",
        stuff.enroll((c) => {
          return c.json({
            hello: "world",
            q: c.req.query(),
          });
        }, "t"),
      );
      const res = await testClient(app)["test"].$get();
      const jRes = await res.json();
      assertEquals(jRes, { hello: "world", q: {} });
    });
    await tt.step("should replace handler", async () => {
      const stuff = SlottableStuff.init();
      stuff.replace<MiddlewareHandler>("t", {
        fn: async (c) => {
          return c.json({
            world: "hello",
            q: c.req.query(),
          });
        },
      });
      const app = new Hono().get(
        "/test",
        stuff.enroll((c) => {
          return c.json({
            hello: "world",
            q: c.req.query(),
          });
        }, "t"),
      );
      const res = await testClient(app)["test"].$get();
      const jRes = await res.json();
      assertNotEquals(jRes, { hello: "world", q: {} });
      assertEquals(jRes, { world: "hello", q: {} });
    });
    await tt.step("strange test... but should work", async () => {
      const stuff = SlottableStuff.init();
      stuff.replace<MiddlewareHandler>("t", {
        args: [
          {
            json() {
              return Promise.resolve(
                new Response(JSON.stringify({ boom: "!" })),
              );
            },
          } as any,
        ] as any,
        type: "merge-otherwise-replace",
      });
      const app = new Hono().get(
        "/test",
        stuff.enroll((c) => {
          return c.json({
            hello: "world",
          });
        }, "t"),
      );
      const res = await testClient(app)["test"].$get();
      const jRes = await res.json();
      assertNotEquals(jRes, { hello: "world" });
      assertEquals(jRes, { boom: "!" });
    });
    await tt.step(
      "previous strange test with better usage... also should work",
      async () => {
        const stuff = SlottableStuff.init();
        stuff.replace<MiddlewareHandler>("t", {
          fn: async (c) => {
            return c.json({
              boom: "!",
            });
          },
        });
        const app = new Hono().get(
          "/test",
          stuff.enroll((c) => {
            return c.json({
              hello: "world",
              q: c.req.query(),
            });
          }, "t"),
        );
        const res = await testClient(app)["test"].$get();
        const jRes = await res.json();
        assertNotEquals(jRes, { hello: "world", q: {} });
        assertEquals(jRes, { boom: "!" });
      },
    );
  });
});
