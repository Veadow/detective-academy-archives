import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests', workers: 1, reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:5173', headless: true,
    ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}),
  },
  webServer: {
    command: 'node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5173 --strictPort',
    url: 'http://127.0.0.1:5173', reuseExistingServer: false,
  },
});
