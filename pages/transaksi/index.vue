<template>
  <div class="p-4 lg:p-8">
    <div class="max-w-3xl mx-auto">
      <!-- Hero header: asimetris, rata-kiri, dengan orb gradient lembut -->
      <div class="relative overflow-hidden bg-brand-gradient rounded-card shadow-card p-6 lg:p-8 mb-6">
        <div class="absolute -top-10 -right-8 w-44 h-44 rounded-full bg-accent-400/30 blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-12 left-1/3 w-40 h-40 rounded-full bg-primary-300/20 blur-3xl pointer-events-none"></div>
        <div class="relative">
          <p class="text-xs font-medium uppercase tracking-widest text-white/70 mb-2">Aktivitas</p>
          <h1 class="text-3xl lg:text-4xl font-display font-extrabold tracking-tight text-white">Transaksi</h1>
        </div>
      </div>

      <!-- Tab: Order / Riwayat -->
      <div class="flex gap-2 mb-5">
        <button
          v-for="tab in mainTabs"
          :key="tab.key"
          @click="activeMainTab = tab.key"
          class="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
          :class="activeMainTab === tab.key
            ? 'bg-primary-600 text-white shadow-card'
            : 'bg-white text-gray-500 ring-1 ring-slate-100 hover:text-primary-700'"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Filter: Reksa Dana / Saham -->
      <div class="flex gap-2 mb-6">
        <button
          v-for="f in typeFilters"
          :key="f.key"
          @click="activeTypeFilter = f.key"
          class="px-4 py-1.5 rounded-full text-xs font-medium border transition-colors"
          :class="activeTypeFilter === f.key
            ? 'bg-accent-500 border-accent-500 text-white'
            : 'bg-white border-slate-100 text-gray-600 hover:border-accent-300 hover:text-accent-600'"
        >
          {{ f.label }}
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="space-y-4">
        <div v-for="i in 4" :key="i" class="bg-white rounded-card p-5 border border-slate-100 shadow-card animate-pulse">
          <div class="flex gap-3">
            <div class="w-11 h-11 bg-slate-200 rounded-xl"></div>
            <div class="flex-1">
              <div class="h-4 bg-slate-200 rounded w-2/3 mb-2"></div>
              <div class="h-3 bg-slate-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Transaction list -->
      <div v-else-if="filteredTransactions.length" class="space-y-4">
        <div
          v-for="trx in filteredTransactions"
          :key="trx.id"
          class="bg-white rounded-card border border-slate-100 shadow-card p-5 cursor-pointer hover:shadow-card-hover hover:-translate-y-0.5 transition-all"
          @click="selectedTrx = trx"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
              :class="{
                'bg-primary-100 text-primary-700': trx.type === 'subscription',
                'bg-red-100 text-red-600': trx.type === 'redemption',
                'bg-accent-100 text-accent-600': trx.type === 'switching',
              }"
            >
              {{ trx.type === 'subscription' ? '↓' : trx.type === 'redemption' ? '↑' : '⇄' }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <p class="text-sm font-semibold text-gray-800">{{ trx.fund_name }}</p>
                <span class="text-xs px-2 py-0.5 rounded-full font-medium"
                  :class="{
                    'bg-primary-100 text-primary-700': trx.type === 'subscription',
                    'bg-red-100 text-red-700': trx.type === 'redemption',
                    'bg-accent-100 text-accent-600': trx.type === 'switching',
                  }">
                  {{ typeLabel(trx.type) }}
                </span>
              </div>
              <p class="text-xs text-gray-500 mt-0.5">{{ trx.date }} • Order #{{ trx.order_code }}</p>
            </div>
            <div class="text-right flex-shrink-0">
              <p class="text-sm font-bold text-gray-800">{{ formatIDR(trx.amount) }}</p>
              <StatusBadge :status="trx.status" size="xs" />
            </div>
          </div>

          <!-- Progress for pending orders -->
          <div v-if="activeMainTab === 'orders' && trx.status !== 'completed'" class="mt-4 pt-4 border-t border-slate-100">
            <div class="flex items-center gap-2">
              <div class="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  class="h-full bg-brand-gradient rounded-full transition-all"
                  :style="{ width: orderProgress(trx.status) + '%' }"
                ></div>
              </div>
              <span class="text-xs text-gray-500 flex-shrink-0">{{ statusLabel(trx.status) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="bg-white rounded-card border border-slate-100 shadow-card text-center py-16 px-6">
        <div class="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p class="text-gray-600 font-medium">Belum ada transaksi</p>
        <p class="text-gray-400 text-sm mt-1">
          {{ activeMainTab === 'orders' ? 'Tidak ada pesanan dalam proses' : 'Riwayat transaksi kosong' }}
        </p>
        <NuxtLink to="/produk" class="mt-4 inline-flex items-center px-5 py-2 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors">
          Mulai Investasi
        </NuxtLink>
      </div>
    </div>

    <!-- Detail modal -->
    <div v-if="selectedTrx" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" @click.self="selectedTrx = null">
      <div class="absolute inset-0 bg-black/50" @click="selectedTrx = null"></div>
      <div class="relative bg-white rounded-card shadow-card-hover ring-1 ring-primary-50 w-full max-w-md p-6 z-10">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-display font-extrabold tracking-tight text-gray-800">Detail Transaksi</h3>
          <button @click="selectedTrx = null" class="p-1 rounded-lg hover:bg-primary-50">
            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="space-y-3">
          <div class="flex justify-between"><span class="text-sm text-gray-500">Reksa Dana</span><span class="text-sm font-medium text-gray-800 text-right">{{ selectedTrx.fund_name }}</span></div>
          <div class="flex justify-between"><span class="text-sm text-gray-500">Jenis</span><span class="text-sm font-medium text-gray-800">{{ typeLabel(selectedTrx.type) }}</span></div>
          <div class="flex justify-between"><span class="text-sm text-gray-500">Nominal</span><span class="text-sm font-bold text-gray-800">{{ formatIDR(selectedTrx.amount) }}</span></div>
          <div class="flex justify-between"><span class="text-sm text-gray-500">Unit</span><span class="text-sm font-medium text-gray-800">{{ selectedTrx.units?.toFixed(4) || '-' }} unit</span></div>
          <div class="flex justify-between"><span class="text-sm text-gray-500">Tanggal</span><span class="text-sm font-medium text-gray-800">{{ selectedTrx.date }}</span></div>
          <div class="flex justify-between"><span class="text-sm text-gray-500">Nomor Order</span><span class="text-sm font-medium text-gray-800">{{ selectedTrx.order_code }}</span></div>
          <div class="flex justify-between items-center"><span class="text-sm text-gray-500">Status</span><StatusBadge :status="selectedTrx.status" /></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import StatusBadge from '~/components/ui/StatusBadge.vue'
import { formatIDR } from '~/composables/useApi'

definePageMeta({ middleware: 'auth' })

const { get } = useApi()

const activeMainTab = ref('orders')
const activeTypeFilter = ref('all')
const loading = ref(false)
const transactions = ref<any[]>([])
const selectedTrx = ref<any>(null)

const mainTabs = [
  { key: 'orders', label: 'Pesanan' },
  { key: 'history', label: 'Riwayat' },
]

const typeFilters = [
  { key: 'all', label: 'Semua' },
  { key: 'reksa_dana', label: 'Reksa Dana' },
  { key: 'saham', label: 'Saham' },
]

const TYPE_LABELS: Record<string, string> = {
  subscription: 'Pembelian',
  redemption: 'Penjualan',
  switching: 'Pengalihan',
}
const typeLabel = (type: string) => TYPE_LABELS[type] || type

const STATUS_LABELS: Record<string, string> = {
  waiting_payment: 'Menunggu Pembayaran',
  waiting_confirm: 'Menunggu Konfirmasi',
  approve: 'Disetujui',
  completed: 'Selesai',
  rejected: 'Ditolak',
}
const statusLabel = (status: string) => STATUS_LABELS[status] || status

const ORDER_PROGRESS: Record<string, number> = {
  waiting_payment: 25,
  waiting_confirm: 50,
  approve: 75,
  completed: 100,
}
const orderProgress = (status: string) => ORDER_PROGRESS[status] || 0

const filteredTransactions = computed(() => {
  let result = transactions.value
  if (activeMainTab.value === 'orders') {
    result = result.filter(t => !['completed', 'rejected'].includes(t.status))
  } else {
    result = result.filter(t => ['completed', 'rejected'].includes(t.status))
  }
  return result
})

onMounted(async () => {
  loading.value = true
  try {
    const data = await get<{ data: any[] }>('/transactions')
    transactions.value = data.data
  } catch {
    // Demo data
    transactions.value = [
      {
        id: 1,
        fund_name: 'Sequis Dana Kas Prima',
        type: 'subscription',
        amount: 500000,
        units: 399.84,
        date: '5 Jun 2026',
        order_code: 'TRX202606050001',
        status: 'waiting_payment',
      },
      {
        id: 2,
        fund_name: 'Manulife Obligasi Unggulan',
        type: 'subscription',
        amount: 1000000,
        units: 289.85,
        date: '3 Jun 2026',
        order_code: 'TRX202606030001',
        status: 'waiting_confirm',
      },
      {
        id: 3,
        fund_name: 'BNI-AM Dana Saham',
        type: 'redemption',
        amount: 750000,
        units: 146.5,
        date: '1 Jun 2026',
        order_code: 'TRX202606010001',
        status: 'completed',
      },
    ]
  } finally {
    loading.value = false
  }
})
</script>
