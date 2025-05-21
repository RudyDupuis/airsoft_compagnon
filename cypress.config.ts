import { defineConfig } from 'cypress'

export default defineConfig({
  fixturesFolder: false,
  e2e: {
    baseUrl: 'http://localhost:3000'
  },
  env: {
    CRON_API_KEY: process.env.CRON_API_KEY
  }
})
