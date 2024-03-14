import { defineConfig } from "npm:vite@latest";
import vue from "npm:@vitejs/plugin-vue@latest";

import "npm:vue@latest";
import "npm:vue-router@latest";
import "npm:zod@latest";
import "npm:vue3-google-login@latest";
import "npm:pinia@latest";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
});
