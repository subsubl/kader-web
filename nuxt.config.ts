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
      title: 'Kader - Pizza bistro in plesni bar na gradu Kodeljevo',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Doživite pristen okus italijanske pice v Gradu Kodeljevo! Sveže sestavine, ročno raztegnjeno testo in popolno pečena pica. Obiščite nas ali naročite za s seboj!' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Montserrat:wght@300;400;600;700;900&display=swap' }
      ],
      htmlAttrs: { lang: 'sl', class: 'dark' }
    }
  },
  css: ['~/assets/styles/main.css'],
  runtimeConfig: {
    pretixWebhookSecret: process.env.NUXT_PRETIX_WEBHOOK_SECRET || '',
    supabaseServiceKey: process.env.NUXT_SUPABASE_SERVICE_KEY || '',
    microgrammApiUrl: process.env.NUXT_MICROGRAMM_API_URL || 'https://api.microgramm.si/v1/orders',
    microgrammApiKey: process.env.NUXT_MICROGRAMM_API_KEY || '',
    microgrammPosId: process.env.NUXT_MICROGRAMM_POS_ID || 'BAR-KODELJEVO-1',
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL || '',
      supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || '',
      pretixUrl: process.env.NUXT_PUBLIC_PRETIX_URL || 'https://pretix.eu'
    }
  }
})
