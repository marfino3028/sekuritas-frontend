<template>
  <div class="min-h-screen bg-white">
    <!-- Navigation -->
    <nav class="fixed top-0 w-full bg-white/95 backdrop-blur border-b border-gray-100 z-50">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <span class="text-xl font-bold text-gray-800">Sekuritas</span>
        </div>
        <div class="flex items-center gap-3">
          <NuxtLink to="/login" class="text-sm font-medium text-gray-600 hover:text-teal-600 transition-colors">
            Masuk
          </NuxtLink>
          <NuxtLink
            to="/register"
            class="bg-teal-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
          >
            Daftar Gratis
          </NuxtLink>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="pt-24 pb-16 bg-gradient-to-br from-teal-700 via-teal-600 to-teal-500 text-white">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div class="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm mb-6">
              <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Berizin dan Diawasi OJK
            </div>
            <h1 class="text-4xl lg:text-5xl font-bold leading-tight mb-4">
              Mulai Investasi<br />
              <span class="text-teal-200">Reksa Dana</span><br />
              Sekarang
            </h1>
            <p class="text-teal-100 text-lg mb-8 leading-relaxed">
              Investasi mudah, aman, dan terjangkau. Mulai dari Rp10.000 saja.
              Kelola portofolio reksa dana Anda kapan saja dan di mana saja.
            </p>
            <div class="flex flex-col sm:flex-row gap-3">
              <NuxtLink
                to="/register"
                class="bg-white text-teal-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-teal-50 transition-colors text-center"
              >
                Mulai Investasi
              </NuxtLink>
              <NuxtLink
                to="/produk"
                class="border border-white/50 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-colors text-center"
              >
                Lihat Produk
              </NuxtLink>
            </div>
          </div>

          <!-- Stats card -->
          <div class="hidden lg:block">
            <div class="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
              <div class="grid grid-cols-2 gap-4 mb-6">
                <div class="bg-white/10 rounded-xl p-4">
                  <p class="text-teal-200 text-xs mb-1">Total Pengguna</p>
                  <p class="text-2xl font-bold">50.000+</p>
                </div>
                <div class="bg-white/10 rounded-xl p-4">
                  <p class="text-teal-200 text-xs mb-1">Produk Reksa Dana</p>
                  <p class="text-2xl font-bold">200+</p>
                </div>
                <div class="bg-white/10 rounded-xl p-4">
                  <p class="text-teal-200 text-xs mb-1">Dana Kelolaan</p>
                  <p class="text-2xl font-bold">Rp2 T+</p>
                </div>
                <div class="bg-white/10 rounded-xl p-4">
                  <p class="text-teal-200 text-xs mb-1">Return Terbaik</p>
                  <p class="text-2xl font-bold text-green-300">+32%</p>
                </div>
              </div>
              <!-- Mini chart placeholder -->
              <div class="h-24 flex items-end gap-1">
                <div v-for="(h, i) in chartBars" :key="i"
                  class="flex-1 bg-white/30 rounded-t transition-all"
                  :style="{ height: h + '%' }"
                ></div>
              </div>
              <p class="text-teal-200 text-xs mt-2 text-center">Pertumbuhan NAV 12 Bulan Terakhir</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 bg-white">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-800 mb-3">Kenapa Memilih Sekuritas?</h2>
          <p class="text-gray-500 max-w-xl mx-auto">Platform investasi reksa dana modern yang aman, transparan, dan mudah digunakan.</p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div v-for="feature in features" :key="feature.title" class="text-center p-6">
            <div class="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl">{{ feature.icon }}</span>
            </div>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ feature.title }}</h3>
            <p class="text-gray-500 text-sm leading-relaxed">{{ feature.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Fund types section -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-10">
          <h2 class="text-3xl font-bold text-gray-800 mb-3">Pilihan Reksa Dana</h2>
          <p class="text-gray-500">Berbagai pilihan produk untuk semua profil risiko</p>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="type in fundTypes" :key="type.name"
            class="bg-white rounded-2xl p-5 border border-gray-100 hover:border-teal-200 hover:shadow-md transition-all cursor-pointer"
          >
            <div class="text-2xl mb-3">{{ type.icon }}</div>
            <h3 class="font-semibold text-gray-800 text-sm mb-1">{{ type.name }}</h3>
            <p class="text-xs text-gray-500">{{ type.desc }}</p>
            <div class="mt-3">
              <span class="text-xs font-semibold" :class="type.returnColor">{{ type.return }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Steps section -->
    <section class="py-16 bg-white">
      <div class="max-w-4xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-800 mb-3">Cara Mulai Investasi</h2>
          <p class="text-gray-500">Hanya 3 langkah mudah untuk mulai berinvestasi</p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div v-for="(step, i) in steps" :key="i" class="text-center">
            <div class="w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
              {{ i + 1 }}
            </div>
            <h3 class="font-semibold text-gray-800 mb-2">{{ step.title }}</h3>
            <p class="text-gray-500 text-sm">{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 bg-teal-600">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h2 class="text-3xl font-bold text-white mb-4">
          Siap Mulai Investasi?
        </h2>
        <p class="text-teal-100 mb-8 text-lg">
          Bergabung bersama lebih dari 50.000 investor yang sudah mempercayakan investasinya kepada kami.
        </p>
        <NuxtLink
          to="/register"
          class="inline-block bg-white text-teal-700 font-bold px-10 py-4 rounded-xl hover:bg-teal-50 transition-colors text-lg"
        >
          Daftar Sekarang — Gratis
        </NuxtLink>
        <p class="text-teal-200 text-sm mt-4">Tidak ada biaya pendaftaran. Mulai dari Rp10.000.</p>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-gray-400 py-12">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div class="flex items-center gap-2 mb-3">
              <div class="w-7 h-7 bg-teal-500 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <span class="text-white font-bold">Sekuritas</span>
            </div>
            <p class="text-sm text-gray-500">Platform investasi reksa dana terpercaya, berizin dan diawasi OJK.</p>
          </div>
          <div>
            <h4 class="text-white font-semibold text-sm mb-3">Produk</h4>
            <ul class="space-y-2 text-sm">
              <li><NuxtLink to="/produk" class="hover:text-teal-400 transition-colors">Reksa Dana Pasar Uang</NuxtLink></li>
              <li><NuxtLink to="/produk" class="hover:text-teal-400 transition-colors">Reksa Dana Pendapatan Tetap</NuxtLink></li>
              <li><NuxtLink to="/produk" class="hover:text-teal-400 transition-colors">Reksa Dana Campuran</NuxtLink></li>
              <li><NuxtLink to="/produk" class="hover:text-teal-400 transition-colors">Reksa Dana Saham</NuxtLink></li>
            </ul>
          </div>
          <div>
            <h4 class="text-white font-semibold text-sm mb-3">Perusahaan</h4>
            <ul class="space-y-2 text-sm">
              <li><a href="#" class="hover:text-teal-400 transition-colors">Tentang Kami</a></li>
              <li><a href="#" class="hover:text-teal-400 transition-colors">Karir</a></li>
              <li><a href="#" class="hover:text-teal-400 transition-colors">Blog</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-white font-semibold text-sm mb-3">Legal</h4>
            <ul class="space-y-2 text-sm">
              <li><a href="#" class="hover:text-teal-400 transition-colors">Syarat & Ketentuan</a></li>
              <li><a href="#" class="hover:text-teal-400 transition-colors">Kebijakan Privasi</a></li>
            </ul>
          </div>
        </div>
        <div class="border-t border-gray-800 pt-6 text-center text-xs text-gray-600">
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
  { icon: '💵', name: 'Pasar Uang', desc: 'Risiko rendah, likuiditas tinggi', return: 'Return ~5-7% p.a', returnColor: 'text-blue-600' },
  { icon: '📈', name: 'Pendapatan Tetap', desc: 'Risiko rendah-menengah', return: 'Return ~7-10% p.a', returnColor: 'text-teal-600' },
  { icon: '⚖️', name: 'Campuran', desc: 'Risiko menengah', return: 'Return ~10-15% p.a', returnColor: 'text-orange-500' },
  { icon: '🚀', name: 'Saham', desc: 'Potensi return tinggi', return: 'Return ~15-25% p.a', returnColor: 'text-green-600' },
]

const steps = [
  { title: 'Daftar Akun', desc: 'Masukkan nomor HP dan buat PIN keamanan Anda dalam hitungan menit.' },
  { title: 'Verifikasi KYC', desc: 'Lengkapi data diri dan unggah KTP. Proses verifikasi 1-2 hari kerja.' },
  { title: 'Mulai Investasi', desc: 'Pilih reksa dana yang sesuai dan mulai berinvestasi dari Rp10.000.' },
]
</script>
