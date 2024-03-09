import { createApp } from "vue";
import App from "./App.vue";
import router from "./pages/router.ts";
import "./style.css";

if (import.meta.env.PROD) {}
else {
  router.addRoute({
    path: "/lab",
    name: "Lab",
    component: () => import("./pages/LabPage.vue"),
  });
}

createApp(App).use(router).mount("#app");
