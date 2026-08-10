export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  ssr: true,
  srcDir: 'src',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    'nuxt-icon'
  ],
  app: {
    head: {
      title: 'Kader Grad Kodeljevo - Neapolitan Pizza & Underground Club Ljubljana',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Hybrid daytime pizzeria and nighttime underground club in the historic Grad Kodeljevo castle, Ljubljana.' }
      ],
      htmlAttrs: { lang: 'sl', class: 'dark' }
    }
  },
  css: ['~/assets/styles/main.css'],
  runtimeConfig: {
    pretixWebhookSecret: process.env.NUXT_PRETIX_WEBHOOK_SECRET || '',
    supabaseServiceKey: process.env.NUXT_SUPABASE_SERVICE_KEY || '',
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL || '',
      supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || ''
    }
  }
})
