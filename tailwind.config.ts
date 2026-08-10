import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  darkMode: 'class',
  content: ['./src/**/*.{vue,js,ts,jsx,tsx,md}', './app.vue'],
  theme: {
    extend: {
      colors: {
        brand: { red: '#E63946', dark: '#0D0F12', card: '#161920', accent: '#FF4D4D' }
      },
      fontFamily: { sans: ['Inter', 'sans-serif'] }
    }
  }
}
