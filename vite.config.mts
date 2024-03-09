import { defineConfig } from "npm:vite@latest";
import vue from "npm:@vitejs/plugin-vue@latest";

import "npm:vue@latest";
import "npm:vue-router@latest";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
});
