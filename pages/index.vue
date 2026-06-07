<template>
  <div class="min-h-screen bg-white">
    <!-- Navigation -->
    <nav class="fixed top-0 w-full bg-white/80 backdrop-blur-xl border-b border-slate-100 z-50">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 bg-brand-gradient rounded-xl flex items-center justify-center shadow-soft">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <span class="text-xl font-display font-extrabold tracking-tight text-slate-900">Sekuritas</span>
        </div>
        <div class="flex items-center gap-3">
          <NuxtLink to="/login" class="text-sm font-semibold text-primary-700 hover:text-primary-800 transition-colors">
            Masuk
          </NuxtLink>
          <NuxtLink
            to="/register"
            class="bg-primary-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-primary-700 shadow-soft transition-all"
          >
            Daftar Gratis
          </NuxtLink>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="relative overflow-hidden pt-32 pb-24 bg-brand-gradient text-white">
      <!-- soft gradient orbs -->
      <div class="pointer-events-none absolute -top-24 -right-20 w-96 h-96 rounded-full bg-accent-400/30 blur-3xl"></div>
      <div class="pointer-events-none absolute -bottom-32 -left-24 w-96 h-96 rounded-full bg-primary-300/20 blur-3xl"></div>

      <div class="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div class="grid lg:grid-cols-12 gap-12 items-center">
          <!-- Left: asymmetric, wider, left-aligned heading -->
          <div class="lg:col-span-7">
            <div class="inline-flex items-center gap-2 bg-white/10 ring-1 ring-white/20 rounded-full px-4 py-1.5 text-sm mb-7">
              <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Berizin dan Diawasi OJK
            </div>
            <h1 class="font-display font-extrabold tracking-tight text-5xl lg:text-6xl leading-[1.05] mb-6">
              Mulai Investasi
              <span class="block text-accent-200">Reksa Dana</span>
              Sekarang
            </h1>
            <p class="text-primary-100 text-lg mb-9 leading-relaxed max-w-xl">
              Investasi mudah, aman, dan terjangkau. Mulai dari Rp10.000 saja.
              Kelola portofolio reksa dana Anda kapan saja dan di mana saja.
            </p>
            <div class="flex flex-col sm:flex-row gap-3 mb-10">
              <NuxtLink
                to="/register"
                class="bg-white text-primary-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-primary-50 shadow-soft transition-all text-center"
              >
                Mulai Investasi
              </NuxtLink>
              <NuxtLink
                to="/produk"
                class="bg-white/10 ring-1 ring-white/40 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/20 transition-all text-center"
              >
                Lihat Produk
              </NuxtLink>
            </div>

            <!-- stat pills -->
            <div class="flex flex-wrap gap-3">
              <div class="inline-flex items-baseline gap-2 bg-white/10 ring-1 ring-white/15 rounded-full px-4 py-2">
                <span class="text-lg font-bold">50.000+</span>
                <span class="text-primary-200 text-xs">Total Pengguna</span>
              </div>
              <div class="inline-flex items-baseline gap-2 bg-white/10 ring-1 ring-white/15 rounded-full px-4 py-2">
                <span class="text-lg font-bold">200+</span>
                <span class="text-primary-200 text-xs">Produk Reksa Dana</span>
              </div>
              <div class="inline-flex items-baseline gap-2 bg-white/10 ring-1 ring-white/15 rounded-full px-4 py-2">
                <span class="text-lg font-bold">Rp2 T+</span>
                <span class="text-primary-200 text-xs">Dana Kelolaan</span>
              </div>
            </div>
          </div>

          <!-- Right: floating performance card -->
          <div class="hidden lg:block lg:col-span-5">
            <div class="bg-white/10 backdrop-blur-xl rounded-card p-6 ring-1 ring-white/20 shadow-soft">
              <div class="flex items-center justify-between mb-5">
                <div>
                  <p class="text-primary-200 text-xs mb-1">Return Terbaik</p>
                  <p class="text-3xl font-display font-extrabold text-green-300">+32%</p>
                </div>
                <div class="text-right">
                  <p class="text-primary-200 text-xs mb-1">Dana Kelolaan</p>
                  <p class="text-xl font-bold">Rp2 T+</p>
                </div>
              </div>
              <!-- Mini chart placeholder -->
              <div class="h-28 flex items-end gap-1.5">
                <div v-for="(h, i) in chartBars" :key="i"
                  class="flex-1 bg-gradient-to-t from-white/20 to-white/60 rounded-t-md transition-all"
                  :style="{ height: h + '%' }"
                ></div>
              </div>
              <p class="text-primary-200 text-xs mt-3 text-center">Pertumbuhan NAV 12 Bulan Terakhir</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-24 bg-white">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="max-w-2xl mb-14">
          <span class="text-accent-600 font-semibold text-sm uppercase tracking-wider">Keunggulan</span>
          <h2 class="font-display font-extrabold tracking-tight text-4xl text-slate-900 mt-2 mb-4">Kenapa Memilih Sekuritas?</h2>
          <p class="text-slate-500 text-lg">Platform investasi reksa dana modern yang aman, transparan, dan mudah digunakan.</p>
        </div>

        <div class="grid md:grid-cols-3 gap-6">
          <div v-for="feature in features" :key="feature.title"
            class="rounded-card bg-white border border-slate-100 shadow-card p-6 hover:shadow-card-hover hover:-translate-y-0.5 transition-all"
          >
            <div class="w-14 h-14 bg-brand-soft ring-1 ring-primary-50 rounded-2xl flex items-center justify-center mb-5">
              <span class="text-2xl">{{ feature.icon }}</span>
            </div>
            <h3 class="text-lg font-bold text-slate-900 mb-2">{{ feature.title }}</h3>
            <p class="text-slate-500 text-sm leading-relaxed">{{ feature.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Fund types section -->
    <section class="py-24 bg-brand-soft">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="max-w-2xl mb-12">
          <span class="text-accent-600 font-semibold text-sm uppercase tracking-wider">Produk</span>
          <h2 class="font-display font-extrabold tracking-tight text-4xl text-slate-900 mt-2 mb-3">Pilihan Reksa Dana</h2>
          <p class="text-slate-500 text-lg">Berbagai pilihan produk untuk semua profil risiko</p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="type in fundTypes" :key="type.name"
            class="group flex flex-col rounded-card bg-white p-6 border border-slate-100 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            <div class="w-12 h-12 bg-brand-soft ring-1 ring-primary-50 rounded-2xl flex items-center justify-center text-2xl mb-5">{{ type.icon }}</div>
            <h3 class="font-bold text-slate-900 text-base mb-1.5">{{ type.name }}</h3>
            <p class="text-sm text-slate-500 leading-relaxed">{{ type.desc }}</p>
            <div class="mt-5 pt-4 border-t border-slate-100">
              <span class="text-sm font-bold" :class="type.returnColor">{{ type.return }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Steps section -->
    <section class="py-24 bg-white">
      <div class="max-w-5xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-14">
          <span class="text-accent-600 font-semibold text-sm uppercase tracking-wider">Langkah Mudah</span>
          <h2 class="font-display font-extrabold tracking-tight text-4xl text-slate-900 mt-2 mb-3">Cara Mulai Investasi</h2>
          <p class="text-slate-500 text-lg">Hanya 3 langkah mudah untuk mulai berinvestasi</p>
        </div>

        <div class="grid md:grid-cols-3 gap-6">
          <div v-for="(step, i) in steps" :key="i"
            class="rounded-card bg-white border border-slate-100 shadow-card p-6 hover:shadow-card-hover hover:-translate-y-0.5 transition-all"
          >
            <div class="w-12 h-12 bg-brand-gradient text-white rounded-2xl flex items-center justify-center text-xl font-display font-extrabold mb-5 shadow-soft">
              {{ i + 1 }}
            </div>
            <h3 class="font-bold text-slate-900 text-lg mb-2">{{ step.title }}</h3>
            <p class="text-slate-500 text-sm leading-relaxed">{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-24 bg-brand-soft">
      <div class="max-w-5xl mx-auto px-4 sm:px-6">
        <div class="relative overflow-hidden rounded-card bg-brand-gradient px-8 py-14 sm:px-14 text-center shadow-soft">
          <div class="pointer-events-none absolute -top-16 -right-10 w-72 h-72 rounded-full bg-accent-400/30 blur-3xl"></div>
          <div class="relative">
            <h2 class="font-display font-extrabold tracking-tight text-4xl text-white mb-4">
              Siap Mulai Investasi?
            </h2>
            <p class="text-primary-100 mb-9 text-lg max-w-2xl mx-auto">
              Bergabung bersama lebih dari 50.000 investor yang sudah mempercayakan investasinya kepada kami.
            </p>
            <NuxtLink
              to="/register"
              class="inline-block bg-white text-primary-700 font-bold px-10 py-4 rounded-xl hover:bg-primary-50 shadow-soft transition-all text-lg"
            >
              Daftar Sekarang — Gratis
            </NuxtLink>
            <p class="text-primary-200 text-sm mt-4">Tidak ada biaya pendaftaran. Mulai dari Rp10.000.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-primary-900 text-primary-200/80 py-14">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="grid md:grid-cols-4 gap-8 mb-10">
          <div>
            <div class="flex items-center gap-2.5 mb-3">
              <div class="w-8 h-8 bg-brand-gradient rounded-xl flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <span class="text-white font-display font-extrabold tracking-tight">Sekuritas</span>
            </div>
            <p class="text-sm text-primary-300/70">Platform investasi reksa dana terpercaya, berizin dan diawasi OJK.</p>
          </div>
          <div>
            <h4 class="text-white font-semibold text-sm mb-3">Produk</h4>
            <ul class="space-y-2 text-sm">
              <li><NuxtLink to="/produk" class="hover:text-accent-300 transition-colors">Reksa Dana Pasar Uang</NuxtLink></li>
              <li><NuxtLink to="/produk" class="hover:text-accent-300 transition-colors">Reksa Dana Pendapatan Tetap</NuxtLink></li>
              <li><NuxtLink to="/produk" class="hover:text-accent-300 transition-colors">Reksa Dana Campuran</NuxtLink></li>
              <li><NuxtLink to="/produk" class="hover:text-accent-300 transition-colors">Reksa Dana Saham</NuxtLink></li>
            </ul>
          </div>
          <div>
            <h4 class="text-white font-semibold text-sm mb-3">Perusahaan</h4>
            <ul class="space-y-2 text-sm">
              <li><a href="#" class="hover:text-accent-300 transition-colors">Tentang Kami</a></li>
              <li><a href="#" class="hover:text-accent-300 transition-colors">Karir</a></li>
              <li><a href="#" class="hover:text-accent-300 transition-colors">Blog</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-white font-semibold text-sm mb-3">Legal</h4>
            <ul class="space-y-2 text-sm">
              <li><a href="#" class="hover:text-accent-300 transition-colors">Syarat & Ketentuan</a></li>
              <li><a href="#" class="hover:text-accent-300 transition-colors">Kebijakan Privasi</a></li>
            </ul>
          </div>
        </div>
        <div class="border-t border-white/10 pt-6 text-center text-xs text-primary-300/60">
          &copy; {{ new Date().getFullYear() }} PT Sekuritas Indonesia. Berizin dan Diawasi OJK.
          Investasi mengandung risiko. Kinerja masa lalu tidak menjamin kinerja masa depan.
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const chartBars = [40, 55, 45, 60, 52, 68, 72, 65, 78, 82, 75, 90]

const features = [
  {
    icon: '🔒',
    title: 'Aman & Terpercaya',
    desc: 'Dana Anda disimpan pada bank kustodian teregulasi. Berizin dan diawasi langsung oleh OJK.',
  },
  {
    icon: '💰',
    title: 'Modal Terjangkau',
    desc: 'Mulai investasi hanya dengan Rp10.000. Tidak perlu modal besar untuk mulai berinvestasi.',
  },
  {
    icon: '📱',
    title: 'Mudah & Praktis',
    desc: 'Beli, jual, dan pantau portofolio Anda kapan saja dan di mana saja melalui aplikasi.',
  },
  {
    icon: '📊',
    title: 'Produk Terlengkap',
    desc: 'Pilihan ratusan reksa dana dari manajer investasi terkemuka di Indonesia.',
  },
  {
    icon: '⚡',
    title: 'Proses Cepat',
    desc: 'Pendaftaran dan verifikasi KYC yang mudah, transaksi dapat diproses pada hari bursa.',
  },
  {
    icon: '🎯',
    title: 'Sesuai Profil Risiko',
    desc: 'Rekomendasi produk yang disesuaikan dengan tujuan keuangan dan toleransi risiko Anda.',
  },
]

const fundTypes = [
  { icon: '💵', name: 'Pasar Uang', desc: 'Risiko rendah, likuiditas tinggi', return: 'Return ~5-7% p.a', returnColor: 'text-primary-600' },
  { icon: '📈', name: 'Pendapatan Tetap', desc: 'Risiko rendah-menengah', return: 'Return ~7-10% p.a', returnColor: 'text-primary-700' },
  { icon: '⚖️', name: 'Campuran', desc: 'Risiko menengah', return: 'Return ~10-15% p.a', returnColor: 'text-accent-600' },
  { icon: '🚀', name: 'Saham', desc: 'Potensi return tinggi', return: 'Return ~15-25% p.a', returnColor: 'text-green-600' },
]

const steps = [
  { title: 'Daftar Akun', desc: 'Masukkan nomor HP dan buat PIN keamanan Anda dalam hitungan menit.' },
  { title: 'Verifikasi KYC', desc: 'Lengkapi data diri dan unggah KTP. Proses verifikasi 1-2 hari kerja.' },
  { title: 'Mulai Investasi', desc: 'Pilih reksa dana yang sesuai dan mulai berinvestasi dari Rp10.000.' },
]
</script>
