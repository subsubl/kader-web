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
        { name: 'description', content: 'Doživite pristen okus neapeljske pice in klubske kulture v Gradu Kodeljevo! Sveže sestavine, ročno raztegnjeno testo, vrhunski zvok in nepogrešljiv ambient.' },
        { name: 'theme-color', content: '#000000' },
        { property: 'og:site_name', content: 'Kader Grad Kodeljevo' },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'sl_SI' },
        { property: 'og:image', content: 'https://www.kader.si/logo-banner.png' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: 'https://www.kader.si/logo-banner.png' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Montserrat:wght@300;400;600;700;900&display=swap' },
        { rel: 'alternate', hreflang: 'sl', href: 'https://www.kader.si/' },
        { rel: 'alternate', hreflang: 'en', href: 'https://www.kader.si/' },
        { rel: 'alternate', hreflang: 'de', href: 'https://www.kader.si/' },
        { rel: 'alternate', hreflang: 'fr', href: 'https://www.kader.si/' },
        { rel: 'alternate', hreflang: 'it', href: 'https://www.kader.si/' },
        { rel: 'alternate', hreflang: 'sr', href: 'https://www.kader.si/' },
        { rel: 'alternate', hreflang: 'nl', href: 'https://www.kader.si/' },
        { rel: 'alternate', hreflang: 'pl', href: 'https://www.kader.si/' },
        { rel: 'alternate', hreflang: 'cs', href: 'https://www.kader.si/' },
        { rel: 'alternate', hreflang: 'es', href: 'https://www.kader.si/' },
        { rel: 'alternate', hreflang: 'x-default', href: 'https://www.kader.si/' }
      ],
      htmlAttrs: { lang: 'sl', class: 'dark' }
    }
  },
  routeRules: {
    '/events': { redirect: { to: '/club', statusCode: 301 } }
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
