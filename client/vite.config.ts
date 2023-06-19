/// <reference types="vitest" />
/// <reference types="vite/client" />

import react from "@vitejs/plugin-react";
import path from "path";
import {defineConfig} from "vite";
import {checker} from "vite-plugin-checker";
import svgrPlugin from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  envPrefix: "REACT_APP_",
  build: {
    outDir: "build",
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    deps: {
      moduleDirectories: ["node_modules"],
    },

    //
  },
  plugins: [
    tsconfigPaths(),
    react(),
    svgrPlugin({
      svgrOptions: {
        icon: true,
        // ...svgr options (https://react-svgr.com/docs/options/)
      },
    }),
    checker({
      typescript: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
      },
      "/socket.io": {
        target: "http://localhost:3001",
        ws: true,
      },
      "/images": "http://localhost:3001",
    },
  },
});
