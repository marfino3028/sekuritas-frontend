<template>
  <div class="p-4 lg:p-6">
    <div class="max-w-3xl mx-auto">
      <h1 class="text-2xl font-bold text-gray-800 mb-4">Portofolio</h1>

      <!-- Summary cards -->
      <div class="grid grid-cols-3 gap-3 mb-6">
        <div class="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-4 text-white col-span-3">
          <p class="text-teal-200 text-xs mb-1">Total Nilai Investasi</p>
          <p class="text-3xl font-bold">{{ formatIDR(summary.totalValue) }}</p>
          <div class="flex items-center gap-4 mt-2">
            <div>
              <p class="text-teal-300 text-xs">Modal</p>
              <p class="text-white font-semibold text-sm">{{ formatIDR(summary.totalInvested) }}</p>
            </div>
            <div>
              <p class="text-teal-300 text-xs">Imbal Hasil</p>
              <p class="font-semibold text-sm" :class="summary.returnAmount >= 0 ? 'text-green-300' : 'text-red-300'">
                {{ summary.returnAmount >= 0 ? '+' : '' }}{{ formatIDR(summary.returnAmount) }}
                <span class="text-xs">({{ summary.returnPercent >= 0 ? '+' : '' }}{{ summary.returnPercent.toFixed(2) }}%)</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex border-b border-gray-200 mb-4">
        <button
          v-for="tab in tabs"
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

      <!-- Portofolio Tab -->
      <div v-if="activeTab === 'portfolio'">
        <div v-if="loading" class="space-y-3">
          <div v-for="i in 3" :key="i" class="bg-white rounded-xl p-4 border border-gray-100 animate-pulse">
            <div class="flex gap-3">
              <div class="w-10 h-10 bg-gray-200 rounded-xl"></div>
              <div class="flex-1">
                <div class="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div class="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="holdings.length" class="space-y-3">
          <div
            v-for="h in holdings"
            :key="h.fund_code"
            class="bg-white rounded-xl border border-gray-100 shadow-card overflow-hidden"
          >
            <div class="p-4">
              <div class="flex items-start gap-3">
                <div
                  class="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  :style="{ backgroundColor: '#009688' }"
                >
                  {{ h.fund_name?.charAt(0) }}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-gray-800 truncate">{{ h.fund_name }}</p>
                  <p class="text-xs text-gray-500">{{ h.fund_type }} • {{ h.units?.toFixed(4) }} unit</p>
                </div>
                <div class="text-right flex-shrink-0">
                  <p class="text-sm font-bold text-gray-800">{{ formatIDR(h.current_value) }}</p>
                  <p class="text-xs font-medium" :class="h.return_percent >= 0 ? 'text-green-600' : 'text-red-500'">
                    {{ h.return_percent >= 0 ? '+' : '' }}{{ h.return_percent?.toFixed(2) }}%
                  </p>
                </div>
              </div>

              <div class="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-gray-100 text-center">
                <div>
                  <p class="text-xs text-gray-400">Modal</p>
                  <p class="text-xs font-semibold text-gray-700">{{ formatIDR(h.invested) }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-400">Imbal Hasil</p>
                  <p class="text-xs font-semibold" :class="h.return_amount >= 0 ? 'text-green-600' : 'text-red-500'">
                    {{ h.return_amount >= 0 ? '+' : '' }}{{ formatIDR(h.return_amount) }}
                  </p>
                </div>
                <div>
                  <p class="text-xs text-gray-400">NAV/unit</p>
                  <p class="text-xs font-semibold text-gray-700">{{ formatIDR(h.nav) }}</p>
                </div>
              </div>
            </div>

            <!-- Action buttons -->
            <div class="flex border-t border-gray-100">
              <NuxtLink
                :to="`/produk/${h.fund_id}`"
                class="flex-1 py-2.5 text-xs font-semibold text-center text-gray-500 hover:bg-gray-50 transition-colors"
              >
                Detail
              </NuxtLink>
              <div class="w-px bg-gray-100"></div>
              <NuxtLink
                :to="`/transaksi/subscribe?fund_id=${h.fund_id}&fund_code=${h.fund_code}&type=redeem`"
                class="flex-1 py-2.5 text-xs font-semibold text-center text-red-500 hover:bg-red-50 transition-colors"
              >
                Jual
              </NuxtLink>
              <div class="w-px bg-gray-100"></div>
              <NuxtLink
                :to="`/transaksi/subscribe?fund_id=${h.fund_id}&fund_code=${h.fund_code}`"
                class="flex-1 py-2.5 text-xs font-semibold text-center text-teal-600 hover:bg-teal-50 transition-colors"
              >
                Beli Lagi
              </NuxtLink>
            </div>
          </div>

          <!-- Info note -->
          <div class="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-start gap-2">
            <svg class="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-xs text-blue-700">
              Transaksi dalam proses dapat dilihat di halaman
              <NuxtLink to="/transaksi" class="font-semibold underline">Transaksi</NuxtLink>
            </p>
          </div>
        </div>

        <div v-else class="text-center py-16">
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p class="text-gray-600 font-medium">Portofolio kosong</p>
          <p class="text-gray-400 text-sm mt-1">Mulai investasi untuk mengisi portofolio Anda</p>
          <NuxtLink to="/produk" class="mt-4 inline-block bg-teal-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-teal-700 transition-colors text-sm">
            Mulai Investasi
          </NuxtLink>
        </div>
      </div>

      <!-- Komposisi Tab -->
      <div v-else-if="activeTab === 'composition'" class="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
        <h3 class="font-semibold text-gray-800 mb-4">Komposisi Portofolio</h3>
        <div v-if="holdings.length">
          <!-- Pie chart placeholder -->
          <div class="flex items-center justify-center mb-6">
            <div class="relative w-40 h-40">
              <svg viewBox="0 0 40 40" class="w-full h-full transform -rotate-90">
                <circle cx="20" cy="20" r="15.9155" fill="none" stroke="#e5e7eb" stroke-width="5" />
                <circle
                  v-for="(segment, i) in pieSegments"
                  :key="i"
                  cx="20" cy="20" r="15.9155"
                  fill="none"
                  :stroke="segment.color"
                  stroke-width="5"
                  :stroke-dasharray="`${segment.dash} 100`"
                  :stroke-dashoffset="-segment.offset"
                />
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="text-center">
                  <p class="text-xs text-gray-500">Total</p>
                  <p class="text-sm font-bold text-gray-800">{{ formatIDR(summary.totalValue) }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="space-y-3">
            <div v-for="(h, i) in holdings" :key="h.fund_code" class="flex items-center gap-3">
              <div class="w-3 h-3 rounded-full flex-shrink-0" :style="{ backgroundColor: pieColors[i % pieColors.length] }"></div>
              <div class="flex-1 min-w-0">
                <p class="text-sm text-gray-800 truncate">{{ h.fund_name }}</p>
                <div class="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                  <div
                    class="h-full rounded-full transition-all"
                    :style="{ width: composition(h) + '%', backgroundColor: pieColors[i % pieColors.length] }"
                  ></div>
                </div>
              </div>
              <span class="text-sm font-semibold text-gray-700 flex-shrink-0">{{ composition(h).toFixed(1) }}%</span>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8 text-gray-400 text-sm">Tidak ada data komposisi</div>
      </div>

      <!-- Kinerja Tab -->
      <div v-else-if="activeTab === 'performance'" class="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
        <h3 class="font-semibold text-gray-800 mb-4">Kinerja Portofolio</h3>
        <div class="space-y-4">
          <div v-for="period in performancePeriods" :key="period.label" class="flex items-center gap-3">
            <span class="text-sm text-gray-500 w-24">{{ period.label }}</span>
            <div class="flex-1 flex items-center gap-2">
              <div class="flex-1 bg-gray-100 rounded-full h-2">
                <div
                  class="h-full rounded-full transition-all"
                  :class="period.value >= 0 ? 'bg-teal-500' : 'bg-red-500'"
                  :style="{ width: Math.abs(period.value) + '%' }"
                ></div>
              </div>
              <span class="text-sm font-semibold w-16 text-right" :class="period.value >= 0 ? 'text-teal-600' : 'text-red-500'">
                {{ period.value >= 0 ? '+' : '' }}{{ period.value.toFixed(2) }}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatIDR } from '~/composables/useApi'

definePageMeta({ middleware: 'auth' })

const { get } = useApi()

const activeTab = ref('portfolio')
const loading = ref(false)
const holdings = ref<any[]>([])

const tabs = [
  { key: 'portfolio', label: 'Portofolio' },
  { key: 'composition', label: 'Komposisi' },
  { key: 'performance', label: 'Kinerja' },
]

const summary = computed(() => {
  const totalValue = holdings.value.reduce((s, h) => s + h.current_value, 0)
  const totalInvested = holdings.value.reduce((s, h) => s + h.invested, 0)
  const returnAmount = totalValue - totalInvested
  const returnPercent = totalInvested > 0 ? (returnAmount / totalInvested) * 100 : 0
  return { totalValue, totalInvested, returnAmount, returnPercent }
})

const pieColors = ['#009688', '#00897b', '#26a69a', '#4db6ac', '#80cbc4', '#0288d1']

const composition = (h: any) => {
  if (!summary.value.totalValue) return 0
  return (h.current_value / summary.value.totalValue) * 100
}

const pieSegments = computed(() => {
  let offset = 0
  return holdings.value.map((h, i) => {
    const pct = composition(h) * 100 / 100
    const seg = { dash: pct, offset, color: pieColors[i % pieColors.length] }
    offset += pct
    return seg
  })
})

const performancePeriods = computed(() => {
  const base = summary.value.returnPercent
  return [
    { label: '1 Bulan', value: base * 0.08 },
    { label: '3 Bulan', value: base * 0.25 },
    { label: '6 Bulan', value: base * 0.5 },
    { label: 'YTD', value: base * 0.4 },
    { label: '1 Tahun', value: base },
  ]
})

onMounted(async () => {
  loading.value = true
  try {
    const data = await get<{ data: any[] }>('/portfolio')
    holdings.value = data.data
  } catch {
    // Demo data
    holdings.value = [
      {
        fund_id: 1,
        fund_code: 'RDPU001',
        fund_name: 'Sequis Dana Kas Prima',
        fund_type: 'Pasar Uang',
        units: 399.84,
        nav: 1250.45,
        current_value: 499980,
        invested: 480000,
        return_amount: 19980,
        return_percent: 4.16,
      },
      {
        fund_id: 2,
        fund_code: 'RDPT002',
        fund_name: 'Manulife Obligasi Unggulan',
        fund_type: 'Pendapatan Tetap',
        units: 289.85,
        nav: 3450.20,
        current_value: 999975,
        invested: 950000,
        return_amount: 49975,
        return_percent: 5.26,
      },
    ]
  } finally {
    loading.value = false
  }
})
</script>
