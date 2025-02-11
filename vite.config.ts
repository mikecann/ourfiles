import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
//import basicSsl from "@vitejs/plugin-basic-ssl";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    //basicSsl()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    allowedHosts: true, // This is important for serving it on my own network and I cant get the env var to work: https://github.com/vitejs/vite/pull/19325/files
    //https: {},
  },
});
