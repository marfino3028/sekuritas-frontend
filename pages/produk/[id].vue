<template>
  <div class="p-4 lg:p-6 max-w-3xl mx-auto">
    <!-- Back button -->
    <NuxtLink to="/produk" class="flex items-center gap-1 text-sm text-gray-500 hover:text-teal-600 mb-4 transition-colors">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Kembali ke Daftar Reksa Dana
    </NuxtLink>

    <!-- Loading -->
    <div v-if="loading" class="space-y-4">
      <div class="bg-white rounded-2xl p-6 animate-pulse">
        <div class="flex gap-4 mb-4">
          <div class="w-14 h-14 bg-gray-200 rounded-2xl"></div>
          <div class="flex-1">
            <div class="h-5 bg-gray-200 rounded w-2/3 mb-2"></div>
            <div class="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        <div class="h-32 bg-gray-200 rounded-xl"></div>
      </div>
    </div>

    <div v-else-if="fund">
      <!-- Fund header card -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-card p-5 mb-4">
        <div class="flex items-start gap-4">
          <div
            class="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
            :style="{ backgroundColor: fundColor }"
          >
            {{ fund.name?.charAt(0) }}
          </div>
          <div class="flex-1 min-w-0">
            <h1 class="text-lg font-bold text-gray-800 leading-tight">{{ fund.name }}</h1>
            <p class="text-sm text-gray-500">{{ fund.manager }}</p>
            <div class="flex items-center gap-2 mt-2">
              <span class="px-2 py-0.5 rounded-full text-xs font-medium"
                :class="{
                  'bg-blue-100 text-blue-700': fund.type?.includes('Pasar Uang'),
                  'bg-teal-100 text-teal-700': fund.type?.includes('Pendapatan Tetap'),
                  'bg-orange-100 text-orange-700': fund.type?.includes('Campuran'),
                  'bg-green-100 text-green-700': fund.type?.includes('Saham'),
                  'bg-purple-100 text-purple-700': fund.is_syariah,
                }">
                {{ fund.type }}
              </span>
              <span v-if="fund.is_syariah" class="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                Syariah
              </span>
              <span v-if="fund.is_index" class="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                Indeks
              </span>
            </div>
          </div>
        </div>

        <!-- NAV -->
        <div class="mt-4 p-4 bg-gray-50 rounded-xl">
          <div class="grid grid-cols-3 gap-3">
            <div>
              <p class="text-xs text-gray-500 mb-0.5">NAV/unit</p>
              <p class="text-lg font-bold text-gray-800">{{ formatIDR(fund.nav) }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 mb-0.5">Return 1 Tahun</p>
              <p class="text-lg font-bold" :class="fund.return_1y >= 0 ? 'text-green-600' : 'text-red-500'">
                {{ fund.return_1y >= 0 ? '+' : '' }}{{ fund.return_1y?.toFixed(2) }}%
              </p>
            </div>
            <div>
              <p class="text-xs text-gray-500 mb-0.5">Dana Kelolaan</p>
              <p class="text-lg font-bold text-gray-800">{{ formatAUM(fund.aum) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- NAV Chart (simple SVG line chart) -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-card p-5 mb-4">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-semibold text-gray-800">Grafik NAV</h2>
          <div class="flex gap-1">
            <button
              v-for="period in chartPeriods"
              :key="period"
              @click="selectedPeriod = period"
              class="px-3 py-1 text-xs font-medium rounded-lg transition-colors"
              :class="selectedPeriod === period ? 'bg-teal-600 text-white' : 'text-gray-500 hover:bg-gray-100'"
            >
              {{ period }}
            </button>
          </div>
        </div>

        <!-- Simple SVG Line Chart -->
        <div class="relative h-48">
          <svg class="w-full h-full" viewBox="0 0 400 120" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#009688" stop-opacity="0.15" />
                <stop offset="100%" stop-color="#009688" stop-opacity="0" />
              </linearGradient>
            </defs>
            <path :d="chartAreaPath" fill="url(#chartGrad)" />
            <path :d="chartLinePath" fill="none" stroke="#009688" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <!-- Y-axis labels -->
          <div class="absolute left-0 top-0 h-full flex flex-col justify-between pointer-events-none">
            <span class="text-xs text-gray-400">{{ maxChartVal }}</span>
            <span class="text-xs text-gray-400">{{ minChartVal }}</span>
          </div>
        </div>
      </div>

      <!-- Performance table -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-card p-5 mb-4">
        <h2 class="font-semibold text-gray-800 mb-4">Kinerja</h2>
        <div class="space-y-3">
          <div v-for="perf in performanceData" :key="perf.label" class="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
            <span class="text-sm text-gray-600">{{ perf.label }}</span>
            <span class="text-sm font-semibold" :class="perf.value >= 0 ? 'text-green-600' : 'text-red-500'">
              {{ perf.value >= 0 ? '+' : '' }}{{ perf.value?.toFixed(2) }}%
            </span>
          </div>
        </div>
      </div>

      <!-- Fund info -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-card p-5 mb-4">
        <h2 class="font-semibold text-gray-800 mb-4">Informasi Produk</h2>
        <div class="space-y-3">
          <div v-for="info in fundInfo" :key="info.label" class="flex justify-between py-1.5 border-b border-gray-100 last:border-0">
            <span class="text-sm text-gray-500">{{ info.label }}</span>
            <span class="text-sm font-medium text-gray-800 text-right">{{ info.value }}</span>
          </div>
        </div>
      </div>

      <!-- KYC warning -->
      <div
        v-if="!authStore.isKycApproved"
        class="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4"
      >
        <div class="flex items-start gap-3">
          <svg class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <p class="text-sm font-semibold text-yellow-800">Verifikasi KYC diperlukan</p>
            <p class="text-xs text-yellow-700 mt-0.5">Lengkapi verifikasi KYC terlebih dahulu untuk melakukan transaksi.</p>
          </div>
        </div>
      </div>

      <!-- Action buttons -->
      <div class="flex gap-3 sticky bottom-20 lg:bottom-4 bg-white/90 backdrop-blur rounded-2xl p-3 border border-gray-100 shadow-lg">
        <button
          @click="handleSell"
          class="flex-1 py-3 rounded-xl font-semibold text-sm border-2 border-teal-600 text-teal-600 hover:bg-teal-50 transition-colors"
        >
          Jual
        </button>
        <button
          @click="handleBuy"
          class="flex-1 py-3 rounded-xl font-semibold text-sm bg-teal-600 text-white hover:bg-teal-700 transition-colors"
        >
          Beli
        </button>
      </div>
    </div>

    <!-- Not found -->
    <div v-else class="text-center py-16">
      <p class="text-gray-500">Produk tidak ditemukan</p>
      <NuxtLink to="/produk" class="text-teal-600 text-sm font-medium hover:underline mt-2 block">
        Kembali ke daftar reksa dana
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { get } = useApi()
const router = useRouter()
const authStore = useAuthStore()
const route = useRoute()

const loading = ref(false)
const fund = ref<any>(null)
const selectedPeriod = ref('1T')
const chartPeriods = ['1B', '3B', '6B', 'YTD', '1T', '3T']

const fundColor = '#009688'

const formatIDR = (v: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v)

const formatAUM = (aum: number) => {
  if (!aum) return '-'
  if (aum >= 1e12) return `Rp${(aum / 1e12).toFixed(1)} T`
  if (aum >= 1e9) return `Rp${(aum / 1e9).toFixed(1)} M`
  return formatIDR(aum)
}

// Mock chart data
const chartData = computed(() => {
  const base = fund.value?.nav || 1000
  return Array.from({ length: 12 }, (_, i) => base * (0.85 + Math.random() * 0.3 + i * 0.01))
})

const minChartVal = computed(() => Math.min(...chartData.value).toFixed(0))
const maxChartVal = computed(() => Math.max(...chartData.value).toFixed(0))

const chartLinePath = computed(() => {
  const data = chartData.value
  const w = 400
  const h = 120
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const points = data.map((v, i) => ({
    x: (i / (data.length - 1)) * w,
    y: h - ((v - min) / range) * h * 0.9 - h * 0.05,
  }))
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
})

const chartAreaPath = computed(() => {
  const data = chartData.value
  const w = 400
  const h = 120
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const points = data.map((v, i) => ({
    x: (i / (data.length - 1)) * w,
    y: h - ((v - min) / range) * h * 0.9 - h * 0.05,
  }))
  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
  return `${line} L${w},${h} L0,${h} Z`
})

const performanceData = computed(() => {
  const r = fund.value?.return_1y || 0
  return [
    { label: 'Return YTD', value: fund.value?.return_ytd || r * 0.4 },
    { label: 'Return 1 Bulan', value: r * 0.08 },
    { label: 'Return 3 Bulan', value: r * 0.25 },
    { label: 'Return 6 Bulan', value: r * 0.5 },
    { label: 'Return 1 Tahun', value: r },
    { label: 'Return 3 Tahun', value: r * 2.8 },
  ]
})

const fundInfo = computed(() => [
  { label: 'Manajer Investasi', value: fund.value?.manager || '-' },
  { label: 'Jenis Reksa Dana', value: fund.value?.type || '-' },
  { label: 'Bank Kustodian', value: 'BNI' },
  { label: 'Minimum Pembelian', value: formatIDR(fund.value?.min_subscription || 10000) },
  { label: 'Minimum Penjualan', value: `${fund.value?.min_redemption_units || 1} unit` },
  { label: 'Tanggal NAV', value: new Date().toLocaleDateString('id-ID') },
  { label: 'Biaya Pembelian', value: `${fund.value?.buy_fee || 0}%` },
  { label: 'Biaya Penjualan', value: `${fund.value?.sell_fee || 0}%` },
])

const handleBuy = () => {
  if (!authStore.isKycApproved) {
    router.push('/kyc')
    return
  }
  router.push(`/transaksi/subscribe?fund_id=${fund.value?.id}&fund_code=${fund.value?.code}`)
}

const handleSell = () => {
  if (!authStore.isKycApproved) {
    router.push('/kyc')
    return
  }
  // Navigate to redeem page
  router.push(`/transaksi/subscribe?type=redeem&fund_id=${fund.value?.id}`)
}

onMounted(async () => {
  loading.value = true
  try {
    const data = await get<{ data: any }>(`/products/${route.params.id}`)
    fund.value = data.data
  } catch {
    // Demo data fallback
    fund.value = {
      id: route.params.id,
      code: 'RDPU001',
      name: 'Sequis Dana Kas Prima',
      manager: 'Sequis Asset Management',
      type: 'Pasar Uang',
      nav: 1250.45,
      return_1y: 6.8,
      return_ytd: 3.2,
      aum: 2500000000000,
      min_subscription: 10000,
      min_redemption_units: 1,
      buy_fee: 0,
      sell_fee: 0,
      is_syariah: false,
      is_index: false,
    }
  } finally {
    loading.value = false
  }
})
</script>
