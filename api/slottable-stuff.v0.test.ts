import { assertEquals } from "deno/assert";

class SlottableStuff<T extends [string, any][], U extends [string, any][] = T> {
  private constructor() {}
  public static init<
    T extends [string, any][] = [],
    U extends [string, any][] = T,
  >() {
    return new SlottableStuff<T, U>();
  }
  private STUFF = {} as Record<T[number][0], T[number][1]>;
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
        "get"
      >);
  }
  add<S extends T[number][0], V extends any>(str: S, value: V) {
    return this as unknown as (Exclude<T[number], 1> extends
      Exclude<[...U, [S, V]][number], 1> ? SlottableStuff<T, [...U, [S, V]]>
      : Omit<SlottableStuff<T, [...U, [S, V]]>, "get">);
  }
  get(name: U[number][0]) {
    return this.STUFF[name];
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
