function fontawesomeIcons() {
  return {
    brands: ['facebook', 'instagram'],
    solid: [
      'spinner',
      'person-rifle',
      'toilet',
      'car',
      'store',
      'circle-xmark',
      'gamepad',
      'person',
      'people-group',
      'coins',
      'calendar-days',
      'calendar',
      'map-location-dot'
    ]
  }
}

export default defineNuxtConfig({
  compatibilityDate: '2025-04-02',
  serverHandlers: [{ route: '/api/**', handler: './server/index' }],
  components: [{ path: '~/components', pathPrefix: false }],
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/i18n', '@vesp/nuxt-fontawesome', 'nuxt-auth-utils'],
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
  },
  fontawesome: {
    icons: fontawesomeIcons()
  },
  nitro: {
    esbuild: {
      options: {
        keepNames: true,
        tsconfigRaw: {
          compilerOptions: {
            experimentalDecorators: true
          }
        }
      }
    }
  }
})
