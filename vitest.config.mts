import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL(".", import.meta.url)) },
  },
  test: {
    include: [
      "tests/unit/**/*.test.{ts,mjs}",
      "tests/integration/**/*.test.{tsx,mjs}",
    ],
    coverage: {
      provider: "v8",
      include: ["lib/**/*.ts"],
      reporter: ["text", "lcov", "html"],
      thresholds: { statements: 80 },
    },
  },
});
