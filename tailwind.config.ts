import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  darkMode: 'class',
  content: ['./src/**/*.{vue,js,ts,jsx,tsx,md}', './app.vue'],
  theme: {
    extend: {
      colors: {
        // Kader brand (from kader.si CSS)
        kader: {
          red: '#ed2224',
          black: '#101010',
          cream: '#f0efe0',
          gray: '#d2d3d4'
        },
        masanielli: {
          gold: '#cdb083',
          goldDark: '#a8895b',
          goldLight: '#e4cfab',
          darkBg: '#0f0a0d'
        },
        brand: { red: '#E63946', dark: '#0D0F12', card: '#161920', accent: '#FF4D4D' }
      },
      fontFamily: {
        // Inter is self-hosted from kader.si's own font files (see main.css)
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        serif: ['Inter', 'system-ui', 'sans-serif'],
        montserrat: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  }
}