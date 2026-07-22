<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 py-6 lg:py-10">
    <!-- Hero -->
    <div class="relative overflow-hidden bg-brand-gradient rounded-card shadow-card p-6 lg:p-10 mb-8">
      <div class="absolute -top-16 -right-10 w-56 h-56 rounded-full bg-accent-400/30 blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-20 -left-12 w-64 h-64 rounded-full bg-primary-400/30 blur-3xl pointer-events-none"></div>

      <div class="relative max-w-2xl">
        <span class="inline-flex items-center px-3 py-1 rounded-full bg-white/15 text-white text-[11px] font-bold tracking-wide uppercase backdrop-blur mb-4">
          Peringkat AUM
        </span>
        <h1 class="font-display font-extrabold tracking-tight text-3xl lg:text-4xl text-white">Manajer Investasi</h1>
        <p class="text-primary-100 text-sm lg:text-base mt-2">
          Daftar manajer investasi terkemuka, diurutkan berdasarkan total dana kelolaan (AUM).
        </p>

        <!-- Aggregate stat pills -->
        <div v-if="!loading && managers.length" class="flex flex-wrap gap-2 mt-5">
          <span class="inline-flex items-center px-4 py-1.5 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur">
            {{ managers.length }} Manajer Investasi
          </span>
          <span class="inline-flex items-center px-4 py-1.5 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur">
            Total AUM {{ formatAUMShort(totalAum) }}
          </span>
          <span class="inline-flex items-center px-4 py-1.5 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur">
            {{ totalFunds }} Produk
          </span>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="i in 6" :key="i" class="bg-white rounded-card border border-slate-100 shadow-card p-6 animate-pulse">
        <div class="flex gap-3 mb-4">
          <div class="w-11 h-11 bg-primary-100 rounded-2xl"></div>
          <div class="flex-1">
            <div class="h-4 bg-slate-100 rounded w-3/4 mb-2"></div>
            <div class="h-3 bg-slate-100 rounded w-1/3"></div>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2.5 mb-4">
          <div class="h-14 bg-slate-100 rounded-2xl"></div>
          <div class="h-14 bg-slate-100 rounded-2xl"></div>
        </div>
        <div class="h-8 bg-slate-100 rounded-xl"></div>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center py-16">
      <div class="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p class="text-slate-700 font-semibold">Gagal memuat data manajer investasi</p>
      <p class="text-slate-400 text-sm mt-1">Periksa koneksi Anda lalu coba lagi.</p>
      <button
        @click="loadManagers"
        class="mt-5 inline-flex items-center px-5 py-2.5 bg-primary-600 text-white font-bold text-sm rounded-xl shadow-soft hover:bg-primary-700 transition-all"
      >
        Coba Lagi
      </button>
    </div>

    <!-- Empty state -->
    <div v-else-if="!managers.length" class="text-center py-16">
      <div class="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 10-4-4 4 4 0 004 4z" />
        </svg>
      </div>
      <p class="text-slate-600 font-medium">Belum ada manajer investasi</p>
      <p class="text-slate-400 text-sm mt-1">Data akan tampil setelah produk tersedia.</p>
    </div>

    <!-- Manager cards -->
    <div v-else class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <button
        v-for="(mi, idx) in managers"
        :key="mi.investment_manager"
        @click="goToCatalog(mi.investment_manager)"
        class="group relative text-left bg-white rounded-card border border-slate-100 ring-1 ring-primary-50 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <!-- soft orb -->
        <div class="pointer-events-none absolute -top-10 -right-10 w-28 h-28 rounded-full bg-brand-soft opacity-70 blur-2xl"></div>

        <!-- Rank badge -->
        <div class="absolute top-4 right-4 z-10">
          <span
            class="inline-flex items-center justify-center min-w-[2rem] h-7 px-2 rounded-full text-xs font-extrabold shadow-soft"
            :class="rankBadgeClass(idx)"
          >
            #{{ idx + 1 }}
          </span>
        </div>

        <div class="relative p-5">
          <!-- Header -->
          <div class="flex items-start gap-3 mb-4 pr-10">
            <div
              class="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-extrabold text-base flex-shrink-0 shadow-soft"
              :style="{ backgroundColor: avatarColor(idx) }"
            >
              {{ initials(mi.investment_manager) }}
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-display text-[15px] font-extrabold tracking-tight text-slate-900 leading-tight group-hover:text-primary-700 transition-colors line-clamp-2">
                {{ mi.investment_manager }}
              </h3>
              <p class="text-xs text-slate-500 mt-1">{{ mi.fund_count }} produk reksa dana</p>
            </div>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-2 gap-2.5 mb-4">
            <div class="bg-primary-50/60 rounded-2xl p-3">
              <p class="text-[11px] font-medium text-slate-500 mb-1">Total Dana Kelolaan</p>
              <p class="text-base font-extrabold tracking-tight text-slate-800">{{ formatAUMShort(mi.total_aum) }}</p>
            </div>
            <div class="bg-accent-50/60 rounded-2xl p-3">
              <p class="text-[11px] font-medium text-slate-500 mb-1">Rata-rata 1 Tahun</p>
              <p
                class="text-base font-extrabold tracking-tight"
                :class="Number(mi.avg_performance_1yr) >= 0 ? 'text-green-600' : 'text-red-500'"
              >
                {{ formatPercent(Number(mi.avg_performance_1yr) || 0) }}
              </p>
            </div>
          </div>

          <!-- Risk profile range -->
          <div class="flex items-center justify-between pt-1">
            <span class="text-xs text-slate-400">Profil Risiko</span>
            <span
              class="px-2.5 py-1 rounded-full text-xs font-semibold"
              :class="riskBadgeClass(mi.max_risk_level)"
            >
              {{ riskRangeLabel(mi.min_risk_level, mi.max_risk_level) }}
            </span>
          </div>
        </div>

        <!-- Footer CTA -->
        <div class="relative px-5 pb-5">
          <div class="w-full py-3 bg-primary-50 group-hover:bg-primary-600 text-primary-700 group-hover:text-white font-bold text-sm rounded-xl text-center transition-all flex items-center justify-center gap-1.5">
            Lihat Produk
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'public' })

interface ManagerSummary {
  investment_manager: string
  fund_count: number
  total_aum: number
  avg_performance_1yr: number
  min_risk_level: number
  max_risk_level: number
}

const { get } = useApi()

const loading = ref(true)
const error = ref(false)
const managers = ref<ManagerSummary[]>([])

const totalAum = computed(() => managers.value.reduce((sum, m) => sum + (Number(m.total_aum) || 0), 0))
const totalFunds = computed(() => managers.value.reduce((sum, m) => sum + (Number(m.fund_count) || 0), 0))

// --- Helpers ---
const formatAUMShort = (aum: number): string => {
  const v = Number(aum) || 0
  if (v >= 1e12) return `Rp ${(v / 1e12).toFixed(1).replace('.', ',')} T`
  if (v >= 1e9) return `Rp ${(v / 1e9).toFixed(1).replace('.', ',')} M`
  if (v >= 1e6) return `Rp ${(v / 1e6).toFixed(0)} Jt`
  return formatIDR(v)
}

const initials = (name: string): string => {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase()
}

const avatarColors = ['#A40001', '#C67177', '#7D0001', '#A0474E', '#D59997', '#7D0001']
const avatarColor = (idx: number) => avatarColors[idx % avatarColors.length]

const rankBadgeClass = (idx: number): string => {
  if (idx === 0) return 'bg-amber-100 text-amber-700'
  if (idx === 1) return 'bg-slate-200 text-slate-700'
  if (idx === 2) return 'bg-orange-100 text-orange-700'
  return 'bg-primary-50 text-primary-700'
}

const riskLabels = ['', 'Sangat Rendah', 'Rendah', 'Sedang', 'Tinggi', 'Sangat Tinggi']

const riskRangeLabel = (min: number, max: number): string => {
  const lo = Number(min) || 1
  const hi = Number(max) || lo
  if (lo === hi) return riskLabels[lo] || `Level ${lo}`
  return `${riskLabels[lo] || lo} – ${riskLabels[hi] || hi}`
}

const riskBadgeClass = (maxRisk: number): string => {
  const r = Number(maxRisk) || 1
  if (r <= 2) return 'bg-green-50 text-green-700'
  if (r === 3) return 'bg-amber-50 text-amber-700'
  return 'bg-red-50 text-red-700'
}

const goToCatalog = (name: string) => {
  navigateTo('/produk?manager=' + encodeURIComponent(name))
}

// --- Data ---
const loadManagers = async () => {
  loading.value = true
  error.value = false
  try {
    const res = await get<{ success: boolean; data: ManagerSummary[] }>('/products/managers')
    managers.value = res.data || []
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(loadManagers)
</script>
