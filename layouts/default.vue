<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar (desktop) -->
    <aside
      class="hidden lg:flex flex-col w-64 fixed h-full z-30"
      style="background: linear-gradient(180deg, #0f172a 0%, #1a2744 100%)"
    >
      <!-- Logo -->
      <div class="flex items-center px-5 py-5 border-b" style="border-color: rgba(255,255,255,0.08)">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg"
               style="background: linear-gradient(135deg, #14b8a6, #0ea5e9)">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <div>
            <p class="text-white font-bold text-[16px] tracking-tight leading-none">Sekuritas</p>
            <p class="text-[11px] font-medium leading-none mt-0.5" style="color: #5eead4">Reksa Dana</p>
          </div>
        </div>
      </div>

      <!-- Nav links -->
      <nav class="flex-1 px-3 py-5 space-y-0.5">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
          :class="isActive(item.to)
            ? 'text-teal-300'
            : 'text-slate-400 hover:text-white hover:bg-white/5'"
          :style="isActive(item.to)
            ? 'background: rgba(20,184,166,0.12); border-left: 2px solid #14b8a6;'
            : 'border-left: 2px solid transparent;'"
        >
          <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
          {{ item.label }}
        </NuxtLink>
      </nav>

      <!-- User info at bottom -->
      <div class="px-4 py-4" style="border-top: 1px solid rgba(255,255,255,0.08)">
        <div class="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
          <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
               style="background: linear-gradient(135deg, #14b8a6, #0ea5e9)">
            {{ userInitial }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-white truncate">{{ authStore.user?.name || 'Pengguna' }}</p>
            <p class="text-xs truncate" style="color: #64748b">{{ authStore.user?.phone }}</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main content area -->
    <div class="flex-1 lg:ml-64 flex flex-col min-h-screen">
      <!-- Top bar -->
      <header class="bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm">
        <div class="flex items-center justify-between px-4 lg:px-6 h-16">
          <!-- Mobile hamburger -->
          <button
            @click="mobileMenuOpen = true"
            class="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <!-- Page title -->
          <div class="lg:block">
            <h1 class="text-base font-semibold text-gray-800">{{ pageTitle }}</h1>
          </div>

          <!-- Right side actions -->
          <div class="flex items-center gap-2">
            <button class="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div class="hidden lg:flex items-center gap-2 pl-2 border-l border-gray-100">
              <div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                   style="background: linear-gradient(135deg, #14b8a6, #0ea5e9)">
                {{ userInitial }}
              </div>
              <span class="text-sm font-medium text-gray-700">{{ authStore.user?.name || 'Pengguna' }}</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 pb-20 lg:pb-6">
        <slot />
      </main>
    </div>

    <!-- Mobile nav drawer overlay -->
    <div
      v-if="mobileMenuOpen"
      class="fixed inset-0 z-40 lg:hidden"
      @click="mobileMenuOpen = false"
    >
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      <aside class="absolute left-0 top-0 h-full w-72 flex flex-col"
             style="background: linear-gradient(180deg, #0f172a 0%, #1a2744 100%)">
        <div class="flex items-center justify-between px-5 py-5" style="border-bottom: 1px solid rgba(255,255,255,0.08)">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl flex items-center justify-center"
                 style="background: linear-gradient(135deg, #14b8a6, #0ea5e9)">
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <div>
              <p class="text-white font-bold text-base leading-none">Sekuritas</p>
              <p class="text-xs font-medium leading-none mt-0.5" style="color: #5eead4">Reksa Dana</p>
            </div>
          </div>
          <button @click.stop="mobileMenuOpen = false"
                  class="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav class="flex-1 px-3 py-5 space-y-0.5">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            @click="mobileMenuOpen = false"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
            :class="isActive(item.to) ? 'text-teal-300' : 'text-slate-400 hover:text-white hover:bg-white/5'"
            :style="isActive(item.to) ? 'background: rgba(20,184,166,0.12); border-left: 2px solid #14b8a6;' : 'border-left: 2px solid transparent;'"
          >
            <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
            {{ item.label }}
          </NuxtLink>
        </nav>
        <div class="px-4 py-4" style="border-top: 1px solid rgba(255,255,255,0.08)">
          <button
            @click="handleLogout"
            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Keluar
          </button>
        </div>
      </aside>
    </div>

    <!-- Bottom navigation (mobile) -->
    <nav class="fixed bottom-0 left-0 right-0 z-20 lg:hidden bg-white border-t border-gray-100 shadow-lg">
      <div class="flex">
        <NuxtLink
          v-for="item in bottomNavItems"
          :key="item.to"
          :to="item.to"
          class="flex-1 flex flex-col items-center pt-2.5 pb-3 px-1 text-xs transition-all"
          :class="isActive(item.to) ? 'text-teal-600' : 'text-gray-400'"
        >
          <div class="relative">
            <component :is="item.icon" class="w-6 h-6" />
            <span
              v-if="isActive(item.to)"
              class="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-teal-500"
            ></span>
          </div>
          <span class="truncate mt-1.5">{{ item.label }}</span>
        </NuxtLink>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, h } from 'vue'

const authStore = useAuthStore()
const route = useRoute()
const mobileMenuOpen = ref(false)

const userInitial = computed(() => {
  const name = authStore.user?.name || 'U'
  return name.charAt(0).toUpperCase()
})

const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    '/dashboard': 'Beranda',
    '/portofolio': 'Portofolio',
    '/produk': 'Reksa Dana',
    '/transaksi': 'Transaksi',
    '/profil': 'Profil',
    '/kyc': 'Verifikasi KYC',
  }
  return titles[route.path] || 'Sekuritas'
})

const isActive = (path: string) => {
  if (path === '/dashboard') return route.path === '/dashboard'
  return route.path.startsWith(path)
}

const IconHome = defineComponent({
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' })
  ])
})
const IconChart = defineComponent({
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' })
  ])
})
const IconSearch = defineComponent({
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' })
  ])
})
const IconList = defineComponent({
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' })
  ])
})
const IconUser = defineComponent({
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' })
  ])
})

const navItems = [
  { to: '/dashboard', label: 'Beranda', icon: IconHome },
  { to: '/portofolio', label: 'Portofolio', icon: IconChart },
  { to: '/produk', label: 'Reksa Dana', icon: IconSearch },
  { to: '/transaksi', label: 'Transaksi', icon: IconList },
  { to: '/profil', label: 'Profil', icon: IconUser },
]

const bottomNavItems = [
  { to: '/dashboard', label: 'Beranda', icon: IconHome },
  { to: '/portofolio', label: 'Portofolio', icon: IconChart },
  { to: '/produk', label: 'Explore', icon: IconSearch },
  { to: '/transaksi', label: 'Transaksi', icon: IconList },
  { to: '/profil', label: 'Profil', icon: IconUser },
]

const handleLogout = () => {
  authStore.logout()
  mobileMenuOpen.value = false
}
</script>
