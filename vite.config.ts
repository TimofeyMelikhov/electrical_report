import { defineConfig, type ConfigEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
// https://vite.dev/config/
export default ({ command }: ConfigEnv) => {
  const isDev = command === "serve";
  return defineConfig({
    base: isDev ? "/_wt/electricalReport" : "/electrical_report/dist/",
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    plugins: [react()],
  });
};
