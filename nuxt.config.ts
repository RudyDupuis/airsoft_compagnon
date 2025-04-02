export default defineNuxtConfig({
  compatibilityDate: '2025-04-02',
  devtools: { enabled: true },
  components: [{ path: '~/components', pathPrefix: false }],
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/i18n'],
  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    configPath: 'tailwind.config.js'
  },
  i18n: {
    strategy: 'prefix_except_default',
    bundle: {
      optimizeTranslationDirective: false
    },
    locales: ['fr', 'en'],
    defaultLocale: 'en',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root'
    }
  }
})
