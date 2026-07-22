<template>
  <div class="p-4 lg:p-8 max-w-3xl mx-auto">
    <!-- Back button -->
    <NuxtLink to="/produk" class="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 mb-6 transition-colors">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Kembali ke Daftar Reksa Dana
    </NuxtLink>

    <!-- Loading -->
    <div v-if="loading" class="space-y-5">
      <div class="rounded-card bg-white shadow-card border border-slate-100 p-6 animate-pulse">
        <div class="flex gap-4 mb-5">
          <div class="w-16 h-16 bg-slate-200 rounded-2xl"></div>
          <div class="flex-1">
            <div class="h-5 bg-slate-200 rounded w-2/3 mb-2"></div>
            <div class="h-3 bg-slate-200 rounded w-1/2"></div>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-3 mb-4">
          <div class="h-16 bg-slate-200 rounded-xl"></div>
          <div class="h-16 bg-slate-200 rounded-xl"></div>
          <div class="h-16 bg-slate-200 rounded-xl"></div>
        </div>
        <div class="h-40 bg-slate-200 rounded-xl"></div>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-center py-16">
      <div class="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <p class="text-slate-700 font-semibold">Gagal memuat produk</p>
      <p class="text-slate-400 text-sm mt-1">{{ error }}</p>
      <button @click="loadFund" class="mt-4 inline-flex px-5 py-2.5 rounded-xl text-sm font-semibold bg-primary-600 text-white hover:bg-primary-700 transition-all shadow-card">
        Coba Lagi
      </button>
    </div>

    <!-- Content -->
    <div v-else-if="fund" class="space-y-5">
      <!-- Fund hero card (indigo gradient) -->
      <div class="relative overflow-hidden rounded-card bg-brand-gradient shadow-card p-6 text-white">
        <div class="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
        <div class="absolute -bottom-16 -left-8 w-44 h-44 rounded-full bg-accent-400/30 blur-3xl pointer-events-none"></div>

        <div class="relative flex items-start gap-4">
          <div class="w-16 h-16 rounded-2xl flex items-center justify-center text-primary-700 bg-white font-display font-extrabold text-2xl flex-shrink-0 shadow-lg">
            {{ fund.name?.charAt(0) }}
          </div>
          <div class="flex-1 min-w-0">
            <h1 class="font-display font-extrabold tracking-tight text-2xl leading-tight">{{ fund.name }}</h1>
            <p class="text-sm text-white/70 mt-0.5">{{ fund.fund_code }} • {{ fund.investment_manager }}</p>
            <div class="flex flex-wrap items-center gap-2 mt-3">
              <span v-if="fund.fund_type_label" class="px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-white backdrop-blur">
                {{ fund.fund_type_label }}
              </span>
              <span class="px-3 py-1 rounded-full text-xs font-semibold backdrop-blur bg-white/15 text-white">
                {{ fund.risk_label }}
              </span>
              <span v-if="fund.is_syariah" class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                Syariah
              </span>
            </div>
          </div>
        </div>

        <!-- NAV pill stats -->
        <div class="relative mt-6 grid grid-cols-3 gap-3">
          <div class="rounded-2xl bg-white/10 backdrop-blur p-4">
            <p class="text-xs text-white/60 mb-1">NAV/unit</p>
            <p class="text-lg font-bold">{{ formatIDR(fund.nav_per_unit) }}</p>
            <p v-if="fund.nav_date" class="text-[10px] text-white/50 mt-0.5">{{ formatDate(fund.nav_date) }}</p>
          </div>
          <div class="rounded-2xl bg-white/10 backdrop-blur p-4">
            <p class="text-xs text-white/60 mb-1">Performa 1 Thn</p>
            <p class="text-lg font-bold" :class="(fund.performance_1yr ?? 0) >= 0 ? 'text-green-300' : 'text-red-300'">
              {{ formatPercent(fund.performance_1yr ?? 0) }}
            </p>
          </div>
          <div class="rounded-2xl bg-white/10 backdrop-blur p-4">
            <p class="text-xs text-white/60 mb-1">Dana Kelolaan</p>
            <p class="text-lg font-bold">{{ formatAUM(fund.total_aum) }}</p>
          </div>
        </div>
      </div>

      <!-- Risk profile callout -->
      <div class="bg-white rounded-card border border-slate-100 shadow-card p-6">
        <div class="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">Profil Risiko</p>
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold" :class="riskBadgeClass">
              {{ fund.risk_label }}
            </span>
          </div>
          <!-- Risk level dots -->
          <div class="flex items-center gap-1.5">
            <span
              v-for="lvl in 5"
              :key="lvl"
              class="w-2.5 h-2.5 rounded-full transition-colors"
              :class="lvl <= (fund.risk_level || 0) ? riskDotClass : 'bg-slate-200'"
            ></span>
          </div>
        </div>
      </div>

      <!-- NAV Chart -->
      <div class="bg-white rounded-card border border-slate-100 shadow-card p-6">
        <div class="flex items-center justify-between mb-5">
          <div>
            <h2 class="font-display font-extrabold tracking-tight text-lg text-slate-800">Grafik NAV</h2>
            <p v-if="navTrendPct !== null" class="text-xs mt-0.5 font-semibold" :class="navTrendPct >= 0 ? 'text-green-600' : 'text-red-500'">
              {{ formatPercent(navTrendPct) }} ({{ activePeriodLabel }})
            </p>
          </div>
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="p in chartPeriods"
              :key="p.value"
              @click="selectPeriod(p.value)"
              class="px-3 py-1 text-xs font-semibold rounded-xl transition-all"
              :class="selectedPeriod === p.value ? 'bg-primary-600 text-white shadow-card' : 'text-slate-500 hover:bg-primary-50'"
            >
              {{ p.label }}
            </button>
          </div>
        </div>

        <!-- SVG line chart -->
        <div v-if="navLoading" class="h-48 rounded-xl bg-slate-100 animate-pulse"></div>
        <template v-else-if="chartPoints.length > 1">
          <div class="relative h-48">
            <svg class="w-full h-full" viewBox="0 0 400 120" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#C67177" stop-opacity="0.18" />
                  <stop offset="100%" stop-color="#C67177" stop-opacity="0" />
                </linearGradient>
                <linearGradient id="chartLine" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stop-color="#A40001" />
                  <stop offset="100%" stop-color="#D59997" />
                </linearGradient>
              </defs>
              <path :d="chartAreaPath" fill="url(#chartGrad)" />
              <path :d="chartLinePath" fill="none" stroke="url(#chartLine)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke" />
            </svg>
            <!-- Y-axis labels -->
            <div class="absolute left-0 top-0 h-full flex flex-col justify-between pointer-events-none">
              <span class="text-[11px] text-slate-400 bg-white/70 px-1 rounded">{{ formatNumber(maxChartVal) }}</span>
              <span class="text-[11px] text-slate-400 bg-white/70 px-1 rounded">{{ formatNumber(minChartVal) }}</span>
            </div>
          </div>
          <!-- X-axis range -->
          <div class="flex justify-between mt-2 text-[11px] text-slate-400">
            <span>{{ chartStartDate }}</span>
            <span>{{ chartEndDate }}</span>
          </div>
        </template>
        <!-- Fallback: trend list when not enough points -->
        <div v-else-if="recentNavList.length" class="space-y-1">
          <div v-for="(n, i) in recentNavList" :key="i" class="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
            <span class="text-sm text-slate-500">{{ formatDate(n.nav_date) }}</span>
            <div class="flex items-center gap-3">
              <span class="text-sm font-semibold text-slate-800">{{ formatIDR(n.nav_per_unit) }}</span>
              <span v-if="n.nav_change_pct != null" class="text-xs font-semibold w-16 text-right" :class="n.nav_change_pct >= 0 ? 'text-green-600' : 'text-red-500'">
                {{ formatPercent(n.nav_change_pct) }}
              </span>
            </div>
          </div>
        </div>
        <div v-else class="h-32 flex items-center justify-center text-sm text-slate-400">
          Data NAV belum tersedia
        </div>
      </div>

      <!-- Performance -->
      <div class="bg-white rounded-card border border-slate-100 shadow-card p-6">
        <h2 class="font-display font-extrabold tracking-tight text-lg text-slate-800 mb-5">Kinerja</h2>
        <div class="grid grid-cols-3 gap-3">
          <div v-for="perf in performanceData" :key="perf.label" class="rounded-2xl bg-brand-soft ring-1 ring-primary-50 p-4 text-center">
            <p class="text-xs text-slate-500 mb-1">{{ perf.label }}</p>
            <p class="text-base font-bold" :class="(perf.value ?? 0) >= 0 ? 'text-green-600' : 'text-red-500'">
              {{ perf.value == null ? '-' : formatPercent(perf.value) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Fund info -->
      <div class="bg-white rounded-card border border-slate-100 shadow-card p-6">
        <h2 class="font-display font-extrabold tracking-tight text-lg text-slate-800 mb-5">Informasi Produk</h2>
        <div class="space-y-1">
          <div v-for="info in fundInfo" :key="info.label" class="flex justify-between gap-4 py-2.5 border-b border-slate-100 last:border-0">
            <span class="text-sm text-slate-500 flex-shrink-0">{{ info.label }}</span>
            <span class="text-sm font-semibold text-slate-800 text-right">{{ info.value }}</span>
          </div>
        </div>
      </div>

      <!-- Description -->
      <div v-if="fund.description" class="bg-white rounded-card border border-slate-100 shadow-card p-6">
        <h2 class="font-display font-extrabold tracking-tight text-lg text-slate-800 mb-3">Deskripsi</h2>
        <p class="text-sm text-slate-600 leading-relaxed">{{ fund.description }}</p>
      </div>

      <!-- Action: Buy (public-aware) -->
      <div class="sticky bottom-4 bg-white/90 backdrop-blur rounded-card p-3 border border-slate-100 shadow-card-hover">
        <button
          @click="handleBuy"
          class="w-full py-3.5 rounded-xl font-bold text-sm bg-primary-600 text-white hover:bg-primary-700 hover:-translate-y-0.5 transition-all shadow-card"
        >
          Beli Reksa Dana
        </button>
        <p v-if="!authStore.token" class="text-center text-xs text-slate-400 mt-2">
          Masuk untuk membeli
        </p>
      </div>
    </div>

    <!-- Not found / empty -->
    <div v-else class="text-center py-16">
      <div class="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p class="text-slate-600 font-medium">Produk tidak ditemukan</p>
      <NuxtLink to="/produk" class="text-primary-600 text-sm font-medium hover:underline mt-2 block">
        Kembali ke daftar reksa dana
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatIDR, formatNumber, formatPercent } from '~/composables/useApi'

definePageMeta({ layout: 'public' })

const { get } = useApi()
const route = useRoute()
const authStore = useAuthStore()

const productId = computed(() => route.params.id as string)

const loading = ref(true)
const error = ref<string | null>(null)
const fund = ref<any>(null)

// ---- Formatting helpers ----
const formatDate = (d?: string) => {
  if (!d) return '-'
  const date = new Date(d)
  if (isNaN(date.getTime())) return d
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

const formatAUM = (aum?: number) => {
  if (!aum) return '-'
  if (aum >= 1e12) return `Rp ${(aum / 1e12).toLocaleString('id-ID', { maximumFractionDigits: 1 })} T`
  if (aum >= 1e9) return `Rp ${(aum / 1e9).toLocaleString('id-ID', { maximumFractionDigits: 1 })} M`
  if (aum >= 1e6) return `Rp ${(aum / 1e6).toLocaleString('id-ID', { maximumFractionDigits: 1 })} Jt`
  return formatIDR(aum)
}

// ---- Risk styling by risk_level ----
const riskBadgeClass = computed(() => {
  const r = fund.value?.risk_level || 0
  if (r <= 2) return 'bg-green-50 text-green-700'
  if (r === 3) return 'bg-amber-50 text-amber-700'
  return 'bg-red-50 text-red-700'
})
const riskDotClass = computed(() => {
  const r = fund.value?.risk_level || 0
  if (r <= 2) return 'bg-green-500'
  if (r === 3) return 'bg-amber-500'
  return 'bg-red-500'
})

// ---- Performance ----
const performanceData = computed(() => [
  { label: 'YTD', value: fund.value?.performance_ytd ?? null },
  { label: '1 Tahun', value: fund.value?.performance_1yr ?? null },
  { label: '3 Tahun', value: fund.value?.performance_3yr ?? null },
])

// ---- Fund info table ----
const fundInfo = computed(() => {
  const f = fund.value || {}
  return [
    { label: 'Kode', value: f.fund_code || '-' },
    { label: 'Jenis', value: f.fund_type_label || '-' },
    { label: 'Profil Risiko', value: f.risk_label || '-' },
    { label: 'Manajer Investasi', value: f.investment_manager || '-' },
    { label: 'Bank Kustodian', value: f.custodian_bank || '-' },
    { label: 'NAV/unit', value: `${formatIDR(f.nav_per_unit || 0)} (${formatDate(f.nav_date)})` },
    { label: 'Dana Kelolaan (AUM)', value: formatAUM(f.total_aum) },
    { label: 'Minimum Pembelian', value: formatIDR(f.min_subscription || 0) },
    { label: 'Biaya Pengelolaan', value: `${f.management_fee ?? 0}%` },
    { label: 'Biaya Pembelian', value: `${f.subscription_fee ?? 0}%` },
    { label: 'Biaya Penjualan', value: `${f.redemption_fee ?? 0}%` },
  ]
})

// ============================================================
// NAV chart
// ============================================================
const chartPeriods = [
  { value: '1m', label: '1B' },
  { value: '3m', label: '3B' },
  { value: '6m', label: '6B' },
  { value: '1y', label: '1T' },
  { value: '3y', label: '3T' },
]
const selectedPeriod = ref('3m')
const navLoading = ref(false)
const navHistory = ref<any[]>([])
const navTrendPct = ref<number | null>(null)

const activePeriodLabel = computed(() => chartPeriods.find(p => p.value === selectedPeriod.value)?.label || '')

// recent_nav comes ordered newest-first from API; normalize oldest->newest for the chart
const recentNavList = computed<any[]>(() => fund.value?.recent_nav ?? [])

// series of {date, value} oldest -> newest
const navSeries = computed(() => {
  const source = navHistory.value.length ? navHistory.value : recentNavList.value
  const mapped = source.map((n: any) => ({
    date: n.nav_date,
    value: Number(n.nav_per_unit),
  })).filter((n: any) => !isNaN(n.value))
  // detect order; ensure ascending by date
  if (mapped.length > 1) {
    const first = new Date(mapped[0].date).getTime()
    const last = new Date(mapped[mapped.length - 1].date).getTime()
    if (first > last) mapped.reverse()
  }
  return mapped
})

const chartPoints = computed(() => navSeries.value)
const chartVals = computed(() => chartPoints.value.map(p => p.value))
const minChartVal = computed(() => (chartVals.value.length ? Math.min(...chartVals.value) : 0))
const maxChartVal = computed(() => (chartVals.value.length ? Math.max(...chartVals.value) : 0))
const chartStartDate = computed(() => (chartPoints.value.length ? formatDate(chartPoints.value[0].date) : ''))
const chartEndDate = computed(() => (chartPoints.value.length ? formatDate(chartPoints.value[chartPoints.value.length - 1].date) : ''))

const svgPoints = computed(() => {
  const data = chartVals.value
  const w = 400
  const h = 120
  if (data.length < 2) return []
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  return data.map((v, i) => ({
    x: (i / (data.length - 1)) * w,
    y: h - ((v - min) / range) * h * 0.9 - h * 0.05,
  }))
})

const chartLinePath = computed(() =>
  svgPoints.value.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ')
)
const chartAreaPath = computed(() => {
  if (!svgPoints.value.length) return ''
  const line = chartLinePath.value
  return `${line} L400,120 L0,120 Z`
})

const selectPeriod = async (period: string) => {
  selectedPeriod.value = period
  await loadNavHistory()
}

const loadNavHistory = async () => {
  navLoading.value = true
  try {
    const res = await get<{ data: { histories: any[]; performance_pct: number } }>(
      `/products/${productId.value}/nav-history`,
      { period: selectedPeriod.value }
    )
    navHistory.value = res.data?.histories ?? []
    navTrendPct.value = res.data?.performance_pct ?? null
  } catch {
    // Fallback to recent_nav already embedded; compute trend from it
    navHistory.value = []
    const list = navSeries.value
    if (list.length > 1) {
      const start = list[0].value
      const end = list[list.length - 1].value
      navTrendPct.value = start ? ((end - start) / start) * 100 : null
    } else {
      navTrendPct.value = null
    }
  } finally {
    navLoading.value = false
  }
}

// ============================================================
// Buy action — public-aware
// ============================================================
const handleBuy = () => {
  if (!authStore.token) {
    navigateTo('/login')
    return
  }
  navigateTo(`/transaksi/subscribe?fund_id=${fund.value.id}&fund_code=${fund.value.fund_code}`)
}

// ============================================================
// Load
// ============================================================
const loadFund = async () => {
  loading.value = true
  error.value = null
  fund.value = null
  try {
    const res = await get<{ data: any }>(`/products/${productId.value}`)
    fund.value = res.data
    // initialise NAV chart from history endpoint (falls back to recent_nav)
    await loadNavHistory()
  } catch (e: any) {
    error.value = e?.data?.message || e?.message || 'Terjadi kesalahan saat memuat data.'
  } finally {
    loading.value = false
  }
}

onMounted(loadFund)
</script>
