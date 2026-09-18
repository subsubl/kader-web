export default defineNuxtConfig({
  compatibilityDate: '2026-09-17',
  srcDir: 'src',
  ssr: true,
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss', '@vueuse/nuxt'],
  dir: { public: 'public' },
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
    head: {
      title: 'Kader — Pizza bistro in plesni bar',
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
      htmlAttrs: { lang: 'sl', class: 'dark' },
      link: [{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Montserrat:wght@300;400;600;700;900&display=swap' }]
    }
  },
  css: ['~/assets/styles/main.css'],
  nitro: { preset: 'static', prerender: { crawlLinks: true, routes: ['/'], failOnError: true } },
  runtimeConfig: { public: { pretixUrl: 'https://pretix.eu' } }
})

