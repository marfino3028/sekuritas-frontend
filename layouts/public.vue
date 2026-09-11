<template>
  <div class="min-h-screen bg-surface-page flex flex-col font-sans text-ink">
    <!-- Header putih sticky (gaya Danapathi) -->
    <header class="sticky top-0 z-40 bg-white border-b border-slate-100/80">
      <div class="max-w-container mx-auto px-4 sm:px-6 lg:px-8 h-[76px] lg:h-[88px] flex items-center justify-between gap-6">
        <NuxtLink to="/" class="flex items-center shrink-0">
          <img src="/logo.png" alt="Danapathi Asset Management" class="h-11 lg:h-14 w-auto object-contain" />
        </NuxtLink>

        <nav class="hidden lg:flex items-center gap-1">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="px-3.5 py-2 text-[15px] font-display font-semibold transition-colors"
            :class="isActive(item.to) ? 'text-accent-500' : 'text-primary-900 hover:text-accent-500'"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <div class="flex items-center gap-2 sm:gap-3">
          <template v-if="authStore.token">
            <NuxtLink to="/dashboard" class="btn-cta">Portal Investor</NuxtLink>
          </template>
          <template v-else>
            <NuxtLink to="/login" class="hidden sm:inline-flex px-3 py-2 text-[15px] font-display font-semibold text-primary-900 hover:text-accent-500 transition-colors">
              Masuk
            </NuxtLink>
            <NuxtLink to="/register" class="btn-cta">Buka Rekening</NuxtLink>
          </template>
        </div>
      </div>

      <!-- Menu mobile -->
      <nav class="lg:hidden flex items-center gap-1.5 px-4 pb-3 overflow-x-auto">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors"
          :class="isActive(item.to) ? 'text-white bg-primary-600' : 'text-primary-900 bg-surface-soft border border-slate-200/70'"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>
    </header>

    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer 2 lapis: bar legal putih + bar biru copyright -->
    <footer class="mt-16">
      <div class="bg-white border-t border-slate-200/80">
        <div class="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-12 grid gap-10 md:grid-cols-12">
          <div class="md:col-span-5">
            <img src="/logo.png" alt="Danapathi Asset Management" class="h-12 w-auto mb-5" />
            <p class="text-sm leading-relaxed text-ink max-w-md">
              PT Danapathi Asset Management berizin dan diawasi oleh Otoritas Jasa Keuangan (OJK) sebagai Manajer Investasi.
            </p>
          </div>
          <div class="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
            <div>
              <h4 class="font-display font-bold text-primary-900 mb-3">Produk</h4>
              <ul class="space-y-2.5">
                <li><NuxtLink to="/produk" class="hover:text-accent-500 transition-colors">Reksa Dana</NuxtLink></li>
                <li><NuxtLink to="/bandingkan" class="hover:text-accent-500 transition-colors">Bandingkan Produk</NuxtLink></li>
                <li><NuxtLink to="/promo" class="hover:text-accent-500 transition-colors">Promo &amp; Event</NuxtLink></li>
              </ul>
            </div>
            <div>
              <h4 class="font-display font-bold text-primary-900 mb-3">Informasi</h4>
              <ul class="space-y-2.5">
                <li><NuxtLink to="/artikel" class="hover:text-accent-500 transition-colors">Publikasi &amp; Artikel</NuxtLink></li>
                <li><NuxtLink to="/manajer-investasi" class="hover:text-accent-500 transition-colors">Manajer Investasi</NuxtLink></li>
                <li><a href="#" class="hover:text-accent-500 transition-colors">Pengaduan Investor</a></li>
              </ul>
            </div>
            <div>
              <h4 class="font-display font-bold text-primary-900 mb-3">Akun</h4>
              <ul class="space-y-2.5">
                <li><NuxtLink to="/register" class="hover:text-accent-500 transition-colors">Buka Rekening</NuxtLink></li>
                <li><NuxtLink to="/login" class="hover:text-accent-500 transition-colors">Portal Investor</NuxtLink></li>
              </ul>
            </div>
          </div>
        </div>
        <div class="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-5 border-t border-slate-200/80 text-xs text-slate-500 leading-relaxed">
          Investasi melalui reksa dana mengandung risiko. Calon investor wajib membaca dan memahami prospektus sebelum
          memutuskan untuk berinvestasi. Kinerja masa lalu tidak mencerminkan kinerja di masa mendatang.
        </div>
      </div>
      <div class="bg-footer text-slate-200">
        <div class="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <p>&copy; {{ new Date().getFullYear() }} PT Danapathi Asset Management. Hak cipta dilindungi.</p>
          <div class="flex items-center gap-4">
            <a href="#" class="hover:text-white">Kebijakan Privasi</a>
            <a href="#" class="hover:text-white">Syarat &amp; Ketentuan</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const route = useRoute()

const navItems = [
  { to: '/produk', label: 'Produk Reksa Dana' },
  { to: '/bandingkan', label: 'Bandingkan' },
  { to: '/manajer-investasi', label: 'Manajer Investasi' },
  { to: '/promo', label: 'Promo' },
  { to: '/artikel', label: 'Publikasi' },
]

const isActive = (path: string) => route.path.startsWith(path)
</script>
