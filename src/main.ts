import { createApp } from "vue";
import App from "./App.vue";
import router from "./pages/router.ts";
import "./style.css";
import GButton from "vue3-google-login";

if (import.meta.env.PROD) {}
else {
  router.addRoute({
    path: "/lab",
    name: "Lab",
    component: () => import("./pages/LabPage.vue"),
  });
}

createApp(App).use(router).use(GButton, {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
}).mount("#app");
