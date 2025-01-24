import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react"; // new

export default defineConfig({
  plugins: react(), // new
  test: {
    environment: "jsdom",
  },
});