<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 py-6 lg:py-10">
    <!-- Hero -->
    <div class="relative overflow-hidden bg-brand-gradient rounded-card shadow-card p-6 lg:p-10 mb-8">
      <div class="absolute -top-16 -right-10 w-56 h-56 rounded-full bg-accent-400/30 blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-20 -left-12 w-64 h-64 rounded-full bg-primary-400/30 blur-3xl pointer-events-none"></div>

      <div class="relative max-w-2xl">
        <h1 class="font-display font-extrabold tracking-tight text-3xl lg:text-4xl text-white">Reksa Dana</h1>
        <p class="text-primary-100 text-sm lg:text-base mt-2">Temukan produk investasi yang tepat untuk Anda</p>

        <div class="flex flex-wrap gap-2 mt-5">
          <span class="inline-flex items-center px-4 py-1.5 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur">Mulai dari Rp10.000</span>
          <span class="inline-flex items-center px-4 py-1.5 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur">Terdaftar &amp; Diawasi OJK</span>
        </div>
      </div>
    </div>

    <!-- Search -->
    <div class="relative mb-5 max-w-xl">
      <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Cari nama reksa dana..."
        class="w-full pl-11 pr-4 py-3 border border-slate-100 ring-1 ring-primary-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white shadow-card"
      />
    </div>

    <!-- Fund type tabs (jenis -> type) -->
    <div class="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
      <button
        v-for="tab in fundTabs"
        :key="tab.key"
        @click="activeType = tab.key"
        class="flex-shrink-0 px-5 py-2 text-sm font-semibold rounded-xl transition-all"
        :class="activeType === tab.key
          ? 'bg-accent-100 text-accent-700'
          : 'text-slate-500 hover:text-primary-700 hover:bg-primary-50'"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Risk chips + sort -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
      <!-- Risk profile chips (Rendah..Tinggi -> risk) -->
      <div class="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <button
          v-for="chip in riskChips"
          :key="chip.key"
          @click="activeRisk = activeRisk === chip.key ? null : chip.key"
          class="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border transition-all"
          :class="activeRisk === chip.key
            ? 'bg-primary-600 border-primary-600 text-white shadow-card'
            : 'bg-white border-slate-100 text-primary-700 hover:border-accent-400 hover:text-accent-600'"
        >
          {{ chip.label }}
        </button>
      </div>

      <!-- Sort -->
      <div class="relative flex-shrink-0">
        <select
          v-model="sort"
          class="appearance-none pl-4 pr-9 py-2 text-sm font-semibold text-primary-700 bg-white border border-slate-100 ring-1 ring-primary-50 rounded-xl shadow-card focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
        >
          <option v-for="opt in sortOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
        </select>
        <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="i in 6" :key="i" class="bg-white rounded-card border border-slate-100 shadow-card p-6 animate-pulse">
        <div class="flex gap-3 mb-4">
          <div class="w-11 h-11 bg-primary-100 rounded-2xl"></div>
          <div class="flex-1">
            <div class="h-4 bg-slate-100 rounded w-3/4 mb-2"></div>
            <div class="h-3 bg-slate-100 rounded w-1/2"></div>
          </div>
        </div>
        <div class="flex gap-1.5 mb-4">
          <div class="h-6 bg-slate-100 rounded-full w-20"></div>
          <div class="h-6 bg-slate-100 rounded-full w-16"></div>
        </div>
        <div class="grid grid-cols-2 gap-2.5">
          <div class="h-14 bg-slate-100 rounded-2xl"></div>
          <div class="h-14 bg-slate-100 rounded-2xl"></div>
        </div>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center py-16">
      <div class="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <p class="text-slate-700 font-semibold">Gagal memuat produk</p>
      <p class="text-slate-400 text-sm mt-1">Terjadi kesalahan saat mengambil data.</p>
      <button
        @click="fetchFunds"
        class="mt-4 inline-flex items-center px-5 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold shadow-soft hover:bg-primary-700 transition-all"
      >
        Coba Lagi
      </button>
    </div>

    <!-- Fund cards -->
    <div v-else-if="funds.length" class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <button
        v-for="fund in funds"
        :key="fund.id"
        type="button"
        @click="navigateTo(`/produk/${fund.id}`)"
        class="group relative text-left bg-white rounded-card border border-slate-100 ring-1 ring-primary-50 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <div class="pointer-events-none absolute -top-10 -right-10 w-28 h-28 rounded-full bg-brand-soft opacity-70 blur-2xl"></div>

        <div class="relative p-5">
          <!-- Header -->
          <div class="flex items-start gap-3 mb-4">
            <div
              class="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-extrabold text-base flex-shrink-0 shadow-soft"
              :style="{ backgroundColor: avatarColor(fund.id) }"
            >
              {{ fund.name?.charAt(0) }}
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-display text-[15px] font-extrabold tracking-tight text-slate-900 leading-tight group-hover:text-primary-700 transition-colors line-clamp-2">
                {{ fund.name }}
              </h3>
              <p class="text-xs text-slate-500 mt-1 truncate">{{ fund.investment_manager }}</p>
            </div>
          </div>

          <!-- Badges: jenis (fund_type_label) + profil risiko (risk_label) -->
          <div class="flex flex-wrap gap-1.5 mb-4">
            <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-accent-50 text-accent-700">
              {{ fund.fund_type_label }}
            </span>
            <span class="px-2.5 py-1 rounded-full text-xs font-semibold" :class="riskBadgeClass(fund.risk_level)">
              {{ fund.risk_label }}
            </span>
            <span v-if="fund.is_syariah" class="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700">
              Syariah
            </span>
          </div>

          <!-- Stats: performa 1 tahun + AUM -->
          <div class="grid grid-cols-2 gap-2.5 mb-4">
            <div class="bg-primary-50/60 rounded-2xl p-3">
              <p class="text-[11px] font-medium text-slate-500 mb-1">Performa 1 Tahun</p>
              <p class="text-base font-extrabold tracking-tight" :class="(fund.performance_1yr ?? 0) >= 0 ? 'text-green-600' : 'text-red-500'">
                {{ formatPercent(fund.performance_1yr ?? 0) }}
              </p>
            </div>
            <div class="bg-accent-50/60 rounded-2xl p-3">
              <p class="text-[11px] font-medium text-slate-500 mb-1">Dana Kelolaan</p>
              <p class="text-base font-extrabold tracking-tight text-slate-800">{{ formatAUM(fund.total_aum) }}</p>
            </div>
          </div>

          <!-- NAV per unit -->
          <div class="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>NAV/unit: <strong class="text-slate-800 font-semibold">{{ formatIDR(fund.nav_per_unit) }}</strong></span>
            <span class="inline-flex items-center gap-1 text-primary-600 font-semibold group-hover:gap-1.5 transition-all">
              Detail
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </button>
    </div>

    <!-- Empty state -->
    <div v-else class="text-center py-16">
      <div class="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p class="text-gray-600 font-medium">Tidak ada produk ditemukan</p>
      <p class="text-gray-400 text-sm mt-1">Coba ubah filter pencarian Anda</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'public' })

interface Fund {
  id: number
  fund_code: string
  name: string
  investment_manager: string
  fund_type: string
  fund_type_label: string
  risk_level: number
  risk_label: string
  nav_per_unit: number
  total_aum: number
  performance_1yr: number
  is_syariah: boolean
}

const { get } = useApi()

const searchQuery = ref('')
const activeType = ref<string | null>(null)
const activeRisk = ref<number | null>(null)
const sort = ref('aum_desc')

const loading = ref(true)
const error = ref(false)
const funds = ref<Fund[]>([])

const fundTabs = [
  { key: null, label: 'Semua' },
  { key: 'money_market', label: 'Pasar Uang' },
  { key: 'fixed_income', label: 'Pendapatan Tetap' },
  { key: 'balanced', label: 'Campuran' },
  { key: 'equity', label: 'Saham' },
  { key: 'sharia', label: 'Syariah' },
]

const riskChips = [
  { key: 1, label: 'Rendah' },
  { key: 2, label: 'Konservatif' },
  { key: 3, label: 'Moderat' },
  { key: 4, label: 'Agresif' },
  { key: 5, label: 'Tinggi' },
]

const sortOptions = [
  { value: 'aum_desc', label: 'AUM Terbesar' },
  { value: 'performance_desc', label: 'Performa Tertinggi' },
  { value: 'performance_asc', label: 'Performa Terendah' },
  { value: 'nav_desc', label: 'NAV Tertinggi' },
  { value: 'nav_asc', label: 'NAV Terendah' },
  { value: 'name_asc', label: 'Nama (A-Z)' },
]

// --- helpers ---
const avatarColors = ['#4F46E5', '#6366F1', '#4338CA', '#7C3AED', '#8B5CF6', '#5B21B6']
const avatarColor = (id: number) => avatarColors[id % avatarColors.length]

const formatAUM = (aum: number) => {
  if (!aum) return '-'
  if (aum >= 1e12) return `Rp ${(aum / 1e12).toFixed(1).replace('.', ',')} T`
  if (aum >= 1e9) return `Rp ${(aum / 1e9).toFixed(1).replace('.', ',')} M`
  if (aum >= 1e6) return `Rp ${(aum / 1e6).toFixed(0)} Jt`
  return formatIDR(aum)
}

// Badge profil risiko by risk_level
const riskBadgeClass = (level: number) => {
  if (level <= 2) return 'bg-green-50 text-green-700'
  if (level === 3) return 'bg-amber-50 text-amber-700'
  return 'bg-red-50 text-red-700'
}

// --- server-side fetch ---
const fetchFunds = async () => {
  loading.value = true
  error.value = false
  try {
    const params: Record<string, any> = {
      sort: sort.value,
      per_page: 60,
    }
    if (activeType.value) params.type = activeType.value
    if (activeRisk.value) params.risk = activeRisk.value
    if (searchQuery.value.trim()) params.search = searchQuery.value.trim()

    const res = await get<{ success: boolean; data: Fund[] }>('/products', params)
    funds.value = res.data ?? []
  } catch {
    error.value = true
    funds.value = []
  } finally {
    loading.value = false
  }
}

// Debounced search
let searchTimer: ReturnType<typeof setTimeout> | null = null
watch(searchQuery, () => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(fetchFunds, 350)
})

// Instant refetch on filter/sort change
watch([activeType, activeRisk, sort], fetchFunds)

onMounted(fetchFunds)
</script>
