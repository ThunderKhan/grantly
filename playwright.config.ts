import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  workers: 2,
  retries: 0,
  reporter: "list",
  use: {
    baseURL: process.env.BASE_URL || "http://127.0.0.1:4173",
    launchOptions: {
      ...(process.env.CHROMIUM_PATH
        ? { executablePath: process.env.CHROMIUM_PATH }
        : {}),
      args: ["--no-sandbox"],
    },
    trace: "retain-on-failure",
  },
  webServer: process.env.CI
    ? {
        command: "npm run dev -- --port 4173",
        url: "http://127.0.0.1:4173",
        reuseExistingServer: false,
      }
    : undefined,
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
});
