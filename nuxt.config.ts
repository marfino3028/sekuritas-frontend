export default defineNuxtConfig({
  compatibilityDate: '2026-06-07',

  // SPA mode: gunakan routeRules, bukan ssr: false (fix Nuxt 3.21+ bug)
  routeRules: {
    '/**': { ssr: false },
  },

  app: {
    head: {
      title: 'Victoria Sekuritas - Investasi Reksa Dana',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Platform investasi reksa dana terpercaya, berizin dan diawasi OJK' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap' },
      ],
    },
  },

  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss', '@vueuse/nuxt'],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000/api',
    },
  },

  pinia: {
    autoImports: ['defineStore', 'storeToRefs'],
  },
})