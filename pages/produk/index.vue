<template>
  <div class="p-4 lg:p-6">
    <!-- Header -->
    <div class="mb-4">
      <h1 class="text-2xl font-bold text-gray-800">Reksa Dana</h1>
      <p class="text-gray-500 text-sm mt-0.5">Temukan produk investasi yang tepat untuk Anda</p>
    </div>

    <!-- Search -->
    <div class="relative mb-4">
      <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Cari nama reksa dana..."
        class="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
      />
    </div>

    <!-- Filter chips -->
    <div class="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
      <button
        v-for="filter in filters"
        :key="filter.key"
        @click="toggleFilter(filter.key)"
        class="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors"
        :class="activeFilters.includes(filter.key)
          ? 'bg-teal-600 border-teal-600 text-white'
          : 'bg-white border-gray-200 text-gray-600 hover:border-teal-400'"
      >
        {{ filter.label }}
      </button>
    </div>

    <!-- Fund type tabs -->
    <div class="flex border-b border-gray-200 mb-4">
      <button
        v-for="tab in fundTabs"
        :key="tab.key"
        @click="activeTab = tab.key"
        class="px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px"
        :class="activeTab === tab.key
          ? 'border-teal-600 text-teal-700'
          : 'border-transparent text-gray-500 hover:text-gray-700'"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="i in 6" :key="i" class="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse">
        <div class="flex gap-3 mb-4">
          <div class="w-10 h-10 bg-gray-200 rounded-xl"></div>
          <div class="flex-1">
            <div class="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
            <div class="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        <div class="h-3 bg-gray-200 rounded w-full mb-2"></div>
        <div class="h-8 bg-gray-200 rounded"></div>
      </div>
    </div>

    <!-- Fund cards -->
    <div v-else-if="filteredFunds.length" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <FundCard
        v-for="fund in filteredFunds"
        :key="fund.id"
        :fund="fund"
        @buy="handleBuy"
      />
    </div>

    <!-- Empty state -->
    <div v-else class="text-center py-16">
      <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
