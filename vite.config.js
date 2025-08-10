import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    laravel({
      input: ["resources/css/app.css", "resources/js/app.jsx"],
      refresh: true,
    }),
    react(),
  ],
  resolve: {
    alias: {
      "@": "/resources/js",
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react") && !id.includes("lucide-react")) {
              return "react-vendors";
            }

            if (id.includes("lucide-react")) {
              return "lucide";
            }

            return "vendor";
          }
        },
      },
    },
  },
  // server: {
  //   host: "0.0.0.0",
  //   port: 5173,
  //   hmr: {
  //     host: "192.168.18.13",
  //     // host: "192.168.18.75",
  //     port: 5173,
  //   },
  //   watch: {
  //     usePolling: true,
  //   },
  // },
});
