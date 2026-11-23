import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    "globalThis.__MOVE_RELEASE__":
      JSON.stringify(process.env.VITE_SENTRY_RELEASE || process.env.COMMIT_REF || "development"),
  },
  server: {
    proxy: {
      "/.netlify/functions": {
        target: "http://localhost:8888",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/\.netlify\/functions/, ""),
      },
    },
  },
});
