export const is_plain_obj = (something: unknown) => {
  return typeof something === "object" &&
    !Array.isArray(something) &&
    something !== null;
};
