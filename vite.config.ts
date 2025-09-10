import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    // This is set in the deploy.yml workflow. Otherwise, no subpath.
    base: env.VITE_GITHUB_REPO_NAME ? `/${env.VITE_GITHUB_REPO_NAME}/` : '',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
