import { assertEquals } from "https://deno.land/std@0.219.0/assert/mod.ts";

class SlottableStuff<T extends [string, any][], U extends [string, any][] = T> {
  private constructor() {}
  public static init<
    T extends [string, any][] = [],
    U extends [string, any][] = T,
  >() {
    return new SlottableStuff<T, U>();
  }
  add_new<S extends string, V extends any>(
    str: S extends T[number][0] ? never : S,
    value: V,
  ) {
    return this as unknown as (Exclude<[...T, [S, V]][number], 1> extends
      Exclude<[...U, [S, V]][number], 1> ? SlottableStuff<
        [...T, [S, V]],
        [...U, [S, V]]
      >
      : Omit<
        SlottableStuff<
          [...T, [S, V]],
          [...U, [S, V]]
        >,
        "do"
      >);
  }
  add<S extends T[number][0], V extends any>(str: S, value: V) {
    return this as unknown as (Exclude<T[number], 1> extends
      Exclude<[...U, [S, V]][number], 1> ? SlottableStuff<T, [...U, [S, V]]>
      : Omit<SlottableStuff<T, [...U, [S, V]]>, "do">);
  }
  do() {
  }
}

Deno.test("SlottableStuff", () => {
  const stuff = SlottableStuff.init().add_new("a", 1).add_new(
    "b",
    2,
  ).add(
    "b",
    3,
  ).add("a", 4).add_new("c", 6);
});

function make_slottable<
  Origin extends (...arg: any[]) => any,
>(
  origin: Origin,
  ...default_options: Parameters<Origin>
) {
  return (
    ...runtime_options: Parameters<Origin>[1] extends void ? (
        | []
        | [Partial<Parameters<Origin>[0]>]
      )
      : Parameters<Origin>[2] extends void ? (
          | []
          | [Partial<Parameters<Origin>[0]>]
          | [{}, Partial<Parameters<Origin>[1]>]
          | [Partial<Parameters<Origin>[0]>, Partial<Parameters<Origin>[1]>]
        )
      : (
        | []
        | [Partial<Parameters<Origin>[0]>]
        | [{}, Partial<Parameters<Origin>[1]>]
        | [Partial<Parameters<Origin>[0]>, Partial<Parameters<Origin>[1]>]
        | [{}, Partial<Parameters<Origin>[1]>, Partial<Parameters<Origin>[2]>]
        | [
          Partial<Parameters<Origin>[0]>,
          Partial<Parameters<Origin>[1]>,
          Partial<Parameters<Origin>[2]>,
        ]
      )
  ) => {
    return origin(
      ...default_options.map((default_option, i): ReturnType<Origin> => {
        const result = {
          ...default_option,
          ...runtime_options[i],
        };
        console.log(result);

        return result as ReturnType<Origin>;
      }),
    );
  };
}

Deno.test("make_slottable", async (t) => {
  await t.step("with some parametres", () => {
    const origin = (
      { a }: { a: number },
      { b, c }: { b: string; c: string },
    ) => {
      return new Array(a).fill(`${b} ${c}`.replaceAll(/\s/g, " "));
    };
    const target = make_slottable(origin, { a: 3 }, { b: "hello", c: "world" });
    const expected = origin({ a: 3 }, { b: "hello", c: "world" });
    const actual = target();
    assertEquals(actual, expected);
  });
});
