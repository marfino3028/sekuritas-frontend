<template>
  <div class="min-h-screen bg-brand-soft flex flex-col">
    <!-- Top navbar (publik — tanpa login) -->
    <header class="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2.5">
          <img src="/logo.png" alt="Victoria Sekuritas" class="w-9 h-9 object-contain" />
          <span class="text-xl font-display font-extrabold tracking-tight text-slate-900">Victoria Sekuritas</span>
        </NuxtLink>

        <!-- Center nav -->
        <nav class="hidden md:flex items-center gap-1">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
            :class="isActive(item.to)
              ? 'text-primary-700 bg-primary-50'
              : 'text-slate-600 hover:text-primary-700 hover:bg-primary-50/60'"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <!-- Right: auth actions -->
        <div class="flex items-center gap-2">
          <template v-if="authStore.token">
            <NuxtLink
              to="/dashboard"
              class="bg-primary-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-primary-700 shadow-soft transition-all"
            >
              Dashboard
            </NuxtLink>
          </template>
          <template v-else>
            <NuxtLink to="/login" class="hidden sm:inline-flex text-sm font-semibold text-primary-700 hover:text-primary-800 px-4 py-2.5 transition-colors">
              Masuk
            </NuxtLink>
            <NuxtLink
              to="/register"
              class="bg-primary-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-primary-700 shadow-soft transition-all"
            >
              Daftar
            </NuxtLink>
          </template>
        </div>
      </div>

      <!-- Mobile nav row -->
      <nav class="md:hidden flex items-center gap-1 px-4 pb-2 overflow-x-auto">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors"
          :class="isActive(item.to)
            ? 'text-white bg-primary-600'
            : 'text-slate-600 bg-white border border-slate-100'"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>
    </header>

    <!-- Page content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="border-t border-slate-100 bg-white/60 mt-12">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p class="text-xs text-slate-500">© {{ new Date().getFullYear() }} Victoria Sekuritas. Terdaftar &amp; Diawasi OJK.</p>
        <div class="flex items-center gap-4 text-xs text-slate-500">
          <NuxtLink to="/produk" class="hover:text-primary-700">Reksa Dana</NuxtLink>
          <NuxtLink to="/manajer-investasi" class="hover:text-primary-700">Manajer Investasi</NuxtLink>
          <NuxtLink to="/promo" class="hover:text-primary-700">Promo</NuxtLink>
          <NuxtLink to="/login" class="hover:text-primary-700">Masuk</NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const route = useRoute()

const navItems = [
  { to: '/produk', label: 'Reksa Dana' },
  { to: '/manajer-investasi', label: 'Manajer Investasi' },
  { to: '/bandingkan', label: 'Bandingkan' },
  { to: '/promo', label: 'Promo' },
  { to: '/artikel', label: 'Artikel' },
]

const isActive = (path: string) => route.path.startsWith(path)
</script>
