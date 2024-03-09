export const ENDPOINTS = [
  "/",
  "/about",
  "/login",
  "/logout",
] as const;
export const PRIVATE_ENDPOINTS = [
  "/",
  "/logout",
] as const satisfies Endpoint[];
export const COMMON_ENDOINTS: Exclude<
  Endpoint,
  typeof PUBLIC_ENDPOINTS[number] | typeof PRIVATE_ENDPOINTS[number]
>[] = ["/about"];
export const PUBLIC_ENDPOINTS = [
  "/login",
] as const satisfies (Exclude<Endpoint, typeof PRIVATE_ENDPOINTS[number]>)[];
export const ENDPOINT_NAME = {
  "/": "Home",
  "/about": "About",
  "/login": "Login",
  "/logout": "Logout",
} as const satisfies Record<Endpoint, string>;
export type Endpoint = typeof ENDPOINTS[number];
