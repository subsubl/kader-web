export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  ssr: true,
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/supabase',
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
  supabase: { redirect: false },
  css: ['~/assets/styles/main.css'],
  runtimeConfig: {
    pretixWebhookSecret: process.env.NUXT_PRETIX_WEBHOOK_SECRET || '',
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL || '',
      supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || ''
    }
  }
})
