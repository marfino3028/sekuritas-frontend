import type { Config } from 'tailwindcss'

// ============================================================
// Design System — Danapathi Asset Management
// Sumber: CSS asli danapathi.co.id (lihat sekuritas-infra/DESIGN_DANAPATHI.md).
// Navy = semua teks/judul/tombol utama, hijau = aksen kecil (CTA, angka naik).
// Nama token `primary`(navy) & `accent`(hijau) dipertahankan agar kelas lama ikut.
// ============================================================

const navy = {
  50: '#EEF3F9',
  100: '#D9E3EF',
  200: '#B3C6DD',
  300: '#8AA5C6',
  400: '#4F6F97',
  500: '#234A74', // link
  600: '#14365F', // tombol utama / judul section
  700: '#0F2F5F', // tab aktif, angka NAB
  800: '#082C53', // judul hero
  900: '#00214A', // heading & logo
}

const green = {
  50: '#E9F5EF',
  100: '#CDEBDC',
  200: '#9FD6BB',
  300: '#6CBF96',
  400: '#3AA672',
  500: '#198754', // aksen utama
  600: '#157347', // hover
  700: '#146B40',
  800: '#0F5533',
  900: '#0B4027',
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
        primary: navy,
        accent: green,
        teal: navy, // alias pengaman kelas teal-* lama
        ink: { DEFAULT: '#617286', desc: '#5F7084', muted: '#64748B' },
        surface: { page: '#F9FAFB', soft: '#F8FAFC', hero: '#F5F7FB' },
        footer: '#1A4978',
        up: '#1F8A5B',
        down: '#D84B4B',
        warn: '#EBBA45',
        // Netral lama (dipakai beberapa halaman) → netral dingin Danapathi
        cream: '#F8FAFC',
        paper: '#FFFFFF',
        sand: '#E5E7EB',
        mist: '#E2E8F0',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      letterSpacing: {
        heading: '-0.04em',
        eyebrow: '0.14em',
      },
      maxWidth: {
        container: '1360px',
      },
      borderRadius: {
        btnsm: '12px',
        btn: '18px',
        input: '16px',
        card: '22px',
        strip: '28px',
        panel: '30px',
        box: '34px',
        '2xl': '18px',
        '3xl': '24px',
      },
      boxShadow: {
        // sangat tipis, di-tint navy (gaya Danapathi)
        card: '0 2px 10px rgba(16,47,85,0.04)',
        'card-hover': '0 14px 34px rgba(16,47,85,0.08)',
        soft: '0 4px 18px rgba(15,53,103,0.06)',
        strip: '0 12px 40px rgba(15,23,42,0.08)',
        cta: '0 8px 18px rgba(25,135,84,0.25)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(160deg, #14365F 0%, #0F2F55 100%)',
        'brand-soft': 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
        trust: 'linear-gradient(135deg, #0F3D75 0%, #1F4F87 100%)',
        'hero-fade': 'linear-gradient(90deg, rgba(248,249,251,.97) 0%, rgba(248,249,251,.9) 35%, rgba(248,249,251,.62) 55%, rgba(248,249,251,.2) 75%, rgba(248,249,251,0) 100%)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} satisfies Config
