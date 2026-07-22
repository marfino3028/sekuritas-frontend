import type { Config } from 'tailwindcss'

// ============================================================
// Design System — "Victoria Merah" (warna brand asli Victoria Sekuritas)
// Brand mark = ornamen MERAH #A40001, wordmark hitam, di atas netral hangat.
// Palet dari logo: #a40001 #f0f3ec #c67177 #d59997 #fffdfc #e2dad3 #d2d7d3
// Token `primary`(merah) & `accent`(rose) + alias `teal`->merah agar kelas lama ikut.
// ============================================================

const red = {
  50: '#FBEAEA',
  100: '#F6D0D1',
  200: '#EBA6A8',
  300: '#DE7F81',
  400: '#C85155',
  500: '#A40001', // brand
  600: '#8F0001',
  700: '#7D0001',
  800: '#630001',
  900: '#4A0000',
}

// Aksen rose (turunan lembut dari merah — memakai #d59997 & #c67177 dari logo)
const rose = {
  50: '#FBF1F1',
  100: '#F5DEDF',
  200: '#EAC1C3',
  300: '#D59997', // dari logo
  400: '#C67177', // dari logo
  500: '#B85A61',
  600: '#A0474E',
  700: '#83383E',
  800: '#6B2E33',
  900: '#59272B',
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
        primary: red,
        accent: rose,
        teal: red, // alias pengaman: kelas teal-* lama -> merah
        // Netral hangat brand
        cream: '#F0F3EC',
        paper: '#FFFDFC',
        sand: '#E2DAD3',
        mist: '#D2D7D3',
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
        // soft, layered, merah-tinted
        card: '0 1px 2px rgba(164,0,1,0.04), 0 12px 32px -12px rgba(164,0,1,0.18)',
        'card-hover': '0 2px 4px rgba(164,0,1,0.06), 0 20px 40px -16px rgba(164,0,1,0.26)',
        soft: '0 8px 24px -10px rgba(125,0,1,0.16)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #7D0001 0%, #A40001 45%, #C67177 100%)',
        'brand-soft': 'linear-gradient(135deg, #FBEAEA 0%, #F0F3EC 100%)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} satisfies Config
