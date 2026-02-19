// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  runtimeConfig: {
    // Private keys, only available on server
    secretKey: process.env.API_SECRET_KEY || '',
    secretHeader: process.env.API_SECRET_HEADER_LABEL || '',
    public: { // Public keys, available on client and server
      apiBaseUrl: process.env.API_BASE_URL || '',
    }
  },
  app: {
    head: {
      title: 'Cabmatics', 
    }
  }
})
