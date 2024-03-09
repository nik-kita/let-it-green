import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import type { OmitReplace } from "../utils/types";
import LoginPage from "./LoginPage.vue";
import { type ENDPOINT_NAME } from "./const";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
  },
] satisfies MyRouterRecordRow[];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

type MyRouterRecordRow = OmitReplace<RouteRecordRaw, {
  path: keyof typeof ENDPOINT_NAME;
  name: typeof ENDPOINT_NAME[keyof typeof ENDPOINT_NAME];
}>;
