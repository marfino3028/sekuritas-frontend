<template>
  <div class="p-4 lg:p-8">
    <!-- Hero -->
    <div class="relative overflow-hidden bg-brand-gradient rounded-card shadow-card p-6 lg:p-10 mb-8">
      <!-- soft gradient orbs -->
      <div class="absolute -top-16 -right-10 w-56 h-56 rounded-full bg-accent-400/30 blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-20 -left-12 w-64 h-64 rounded-full bg-primary-400/30 blur-3xl pointer-events-none"></div>

      <div class="relative max-w-2xl">
        <h1 class="font-display font-extrabold tracking-tight text-3xl lg:text-4xl text-white">Reksa Dana</h1>
        <p class="text-primary-100 text-sm lg:text-base mt-2">Temukan produk investasi yang tepat untuk Anda</p>

        <!-- stat pills -->
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

    <!-- Filter chips -->
    <div class="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide">
      <button
        v-for="filter in filters"
        :key="filter.key"
        @click="toggleFilter(filter.key)"
        class="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border transition-all"
        :class="activeFilters.includes(filter.key)
          ? 'bg-primary-600 border-primary-600 text-white shadow-card'
          : 'bg-white border-slate-100 text-primary-700 hover:border-accent-400 hover:text-accent-600'"
      >
        {{ filter.label }}
      </button>
    </div>

    <!-- Fund type tabs -->
    <div class="flex gap-2 mb-6">
      <button
        v-for="tab in fundTabs"
        :key="tab.key"
        @click="activeTab = tab.key"
        class="px-5 py-2 text-sm font-semibold rounded-xl transition-all"
        :class="activeTab === tab.key
          ? 'bg-accent-100 text-accent-700'
          : 'text-gray-500 hover:text-primary-700 hover:bg-primary-50'"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="i in 6" :key="i" class="bg-white rounded-card border border-slate-100 shadow-card p-6 animate-pulse">
        <div class="flex gap-3 mb-4">
          <div class="w-10 h-10 bg-primary-100 rounded-xl"></div>
          <div class="flex-1">
            <div class="h-4 bg-slate-100 rounded w-3/4 mb-1"></div>
            <div class="h-3 bg-slate-100 rounded w-1/2"></div>
          </div>
        </div>
        <div class="h-3 bg-slate-100 rounded w-full mb-2"></div>
        <div class="h-8 bg-slate-100 rounded"></div>
      </div>
    </div>

    <!-- Fund cards -->
    <div v-else-if="filteredFunds.length" class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <FundCard
        v-for="fund in filteredFunds"
        :key="fund.id"
        :fund="fund"
        @buy="handleBuy"
      />
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
import FundCard from '~/components/ui/FundCard.vue'

definePageMeta({ middleware: 'auth' })

const { get } = useApi()
const router = useRouter()
const authStore = useAuthStore()

const searchQuery = ref('')
const activeTab = ref('reksa_dana')
const activeFilters = ref<string[]>([])
const loading = ref(false)
const funds = ref<any[]>([])

const fundTabs = [
  { key: 'reksa_dana', label: 'Reksa Dana' },
  { key: 'saham', label: 'Saham' },
]

const filters = [
  { key: 'min_10k', label: 'Mulai dari 10k' },
  { key: 'dividend', label: 'Dengan Dividen' },
  { key: 'syariah', label: 'Syariah' },
  { key: 'index', label: 'Indeks' },
  { key: 'low_risk', label: 'Risiko Rendah' },
]

const toggleFilter = (key: string) => {
  const idx = activeFilters.value.indexOf(key)
  if (idx > -1) activeFilters.value.splice(idx, 1)
  else activeFilters.value.push(key)
}

const filteredFunds = computed(() => {
  let result = funds.value

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(f =>
      f.name?.toLowerCase().includes(q) ||
      f.manager?.toLowerCase().includes(q)
    )
  }

  if (activeFilters.value.includes('syariah')) {
    result = result.filter(f => f.is_syariah)
  }
  if (activeFilters.value.includes('index')) {
    result = result.filter(f => f.is_index)
  }
  if (activeFilters.value.includes('dividend')) {
    result = result.filter(f => f.has_dividend)
  }
  if (activeFilters.value.includes('min_10k')) {
    result = result.filter(f => f.min_subscription <= 10000)
  }

  return result
})

const handleBuy = (fund: any) => {
  if (!authStore.isKycApproved) {
    router.push('/kyc')
    return
  }
  router.push(`/transaksi/subscribe?fund_id=${fund.id}&fund_code=${fund.code}`)
}

// Load funds on mount
onMounted(async () => {
  loading.value = true
  try {
    const data = await get<{ data: any[] }>('/products')
    funds.value = data.data
  } catch {
    // Use demo data if API not available
    funds.value = demoFunds
  } finally {
    loading.value = false
  }
})

// Demo data
const demoFunds = [
  {
    id: 1,
    code: 'RDPU001',
    name: 'Sequis Dana Kas Prima',
    manager: 'Sequis Asset Management',
    type: 'Pasar Uang',
    nav: 1250.45,
    return_1y: 6.8,
    return_ytd: 3.2,
    aum: 2500000000000,
    min_subscription: 10000,
    is_syariah: false,
    is_index: false,
    has_dividend: false,
    risk_level: 1,
  },
  {
    id: 2,
    code: 'RDPT002',
    name: 'Manulife Obligasi Unggulan',
    manager: 'Manulife Asset Management',
    type: 'Pendapatan Tetap',
    nav: 3450.20,
    return_1y: 9.5,
    return_ytd: 4.1,
    aum: 1800000000000,
    min_subscription: 10000,
    is_syariah: false,
    is_index: false,
    has_dividend: true,
    risk_level: 2,
  },
  {
    id: 3,
    code: 'RDSC003',
    name: 'BNI-AM Dana Saham',
    manager: 'BNI Asset Management',
    type: 'Saham',
    nav: 5120.80,
    return_1y: 18.3,
    return_ytd: 7.5,
    aum: 980000000000,
    min_subscription: 10000,
    is_syariah: false,
    is_index: false,
    has_dividend: false,
    risk_level: 4,
  },
  {
    id: 4,
    code: 'RDSY004',
    name: 'Mandiri Pasar Uang Syariah',
    manager: 'Mandiri Investasi',
    type: 'Pasar Uang Syariah',
    nav: 1180.00,
    return_1y: 5.9,
    return_ytd: 2.8,
    aum: 750000000000,
    min_subscription: 10000,
    is_syariah: true,
    is_index: false,
    has_dividend: false,
    risk_level: 1,
  },
  {
    id: 5,
    code: 'RDIN005',
    name: 'Reksa Dana Indeks IDX30',
    manager: 'Principal Asset Management',
    type: 'Saham',
    nav: 4280.60,
    return_1y: 15.7,
    return_ytd: 6.2,
    aum: 450000000000,
    min_subscription: 10000,
    is_syariah: false,
    is_index: true,
    has_dividend: false,
    risk_level: 4,
  },
  {
    id: 6,
    code: 'RDCP006',
    name: 'Schroder Dana Campuran',
    manager: 'Schroder Investment Management',
    type: 'Campuran',
    nav: 2890.15,
    return_1y: 12.4,
    return_ytd: 5.8,
    aum: 1200000000000,
    min_subscription: 10000,
    is_syariah: false,
    is_index: false,
    has_dividend: true,
    risk_level: 3,
  },
]
</script>
