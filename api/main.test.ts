import { assertEquals } from "https://deno.land/std@0.219.0/assert/mod.ts";

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
