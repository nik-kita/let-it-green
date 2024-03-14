import { createPinia } from "pinia";
import { createApp } from "vue";
import GButton from "vue3-google-login";
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

createApp(App)
  .use(createPinia())
  .use(router)
  .use(GButton, {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  })
  .mount("#app");
