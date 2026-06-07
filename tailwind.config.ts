import type { Config } from 'tailwindcss'

// ============================================================
// Design System — "Indigo Premium"
// Brand: indigo (primary) + violet (accent). Sengaja dijauhkan
// dari teal/navy/gold. Token `teal` di-alias ke indigo sebagai
// jaring pengaman agar kelas `teal-*` lama otomatis jadi indigo.
// ============================================================

const indigo = {
  50: '#EEF2FF',
  100: '#E0E7FF',
  200: '#C7D2FE',
  300: '#A5B4FC',
  400: '#818CF8',
  500: '#6366F1',
  600: '#4F46E5',
  700: '#4338CA',
  800: '#3730A3',
  900: '#312E81',
}

const violet = {
  50: '#F5F3FF',
  100: '#EDE9FE',
  200: '#DDD6FE',
  300: '#C4B5FD',
  400: '#A78BFA',
  500: '#8B5CF6',
  600: '#7C3AED',
  700: '#6D28D9',
  800: '#5B21B6',
  900: '#4C1D95',
}

export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
  ],
  theme: {
    extend: {
      colors: {
        primary: indigo,
        accent: violet,
        // alias pengaman: kelas teal-* lama -> indigo
        teal: indigo,
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        card: '20px',
        '2xl': '18px',
        '3xl': '24px',
      },
      boxShadow: {
        // soft, layered, indigo-tinted — bukan shadow abu-abu datar
        card: '0 1px 2px rgba(79,70,229,0.04), 0 12px 32px -12px rgba(79,70,229,0.20)',
        'card-hover': '0 2px 4px rgba(79,70,229,0.06), 0 20px 40px -16px rgba(79,70,229,0.28)',
        soft: '0 8px 24px -10px rgba(49,46,129,0.16)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #4F46E5 0%, #6366F1 45%, #8B5CF6 100%)',
        'brand-soft': 'linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 100%)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} satisfies Config
