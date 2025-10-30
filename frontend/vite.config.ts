// /frontend/vite.config.ts
import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import tailwindcss from "@tailwindcss/vite" // <-- 1. Import the new plugin

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <-- 2. Add the plugin here
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
