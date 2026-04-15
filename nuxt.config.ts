// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: ['@pinia/nuxt'],

  // Static generation for GitHub Pages
  ssr: true,
  nitro: {
    preset: 'github_pages',
    prerender: {
      routes: [
        '/api/archetypes',
        '/api/advantages',
        '/api/disadvantages',
        '/api/secrets',
        '/api/disciplines'
      ]
    }
  },
  app: {
    baseURL: '/KULT-Builder/'
  },

  vite: {
    plugins: [
      import('@tailwindcss/vite').then((m) => m.default())
    ]
  }
})
