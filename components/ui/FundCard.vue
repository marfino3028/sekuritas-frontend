<template>
  <div class="bg-white rounded-2xl border border-gray-100 shadow-card hover:border-teal-200 hover:shadow-md transition-all overflow-hidden">
    <div class="p-4">
      <!-- Fund header -->
      <div class="flex items-start gap-3 mb-3">
        <div
          class="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
          :style="{ backgroundColor: avatarColor }"
        >
          {{ fund.name?.charAt(0) }}
        </div>
        <div class="flex-1 min-w-0">
          <NuxtLink :to="`/produk/${fund.id}`" class="block">
            <h3 class="text-sm font-semibold text-gray-800 leading-tight hover:text-teal-700 transition-colors line-clamp-2">
              {{ fund.name }}
            </h3>
          </NuxtLink>
          <p class="text-xs text-gray-500 mt-0.5 truncate">{{ fund.manager }}</p>
        </div>
      </div>

      <!-- Type badge + tags -->
      <div class="flex flex-wrap gap-1.5 mb-3">
        <span
          class="px-2 py-0.5 rounded-full text-xs font-medium"
          :class="typeColorClass"
        >
          {{ fund.type }}
        </span>
        <span v-if="fund.is_syariah" class="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
          Syariah
        </span>
        <span v-if="fund.is_index" class="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
          Indeks
        </span>
        <span v-if="fund.has_dividend" class="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
          Dividen
        </span>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 gap-2 mb-4">
        <div class="bg-gray-50 rounded-lg p-2.5">
          <p class="text-xs text-gray-400 mb-0.5">Return 1 Tahun</p>
          <p class="text-sm font-bold" :class="fund.return_1y >= 0 ? 'text-green-600' : 'text-red-500'">
            {{ fund.return_1y >= 0 ? '+' : '' }}{{ fund.return_1y?.toFixed(2) }}%
          </p>
        </div>
        <div class="bg-gray-50 rounded-lg p-2.5">
          <p class="text-xs text-gray-400 mb-0.5">Dana Kelolaan</p>
          <p class="text-sm font-bold text-gray-700">{{ formatAUM(fund.aum) }}</p>
        </div>
      </div>

      <!-- NAV and min -->
      <div class="flex items-center justify-between text-xs text-gray-500 mb-3">
        <span>NAV: <strong class="text-gray-700">{{ formatIDR(fund.nav) }}</strong></span>
        <span>Min: <strong class="text-gray-700">{{ formatIDR(fund.min_subscription) }}</strong></span>
      </div>

      <!-- Risk indicator -->
      <div class="flex items-center gap-1 mb-3">
        <span class="text-xs text-gray-400">Risiko:</span>
        <div class="flex gap-0.5">
          <div
            v-for="i in 5"
            :key="i"
            class="w-4 h-1.5 rounded-full"
            :class="i <= (fund.risk_level || 1) ? riskColor : 'bg-gray-200'"
          ></div>
        </div>
        <span class="text-xs font-medium" :class="riskTextColor">{{ riskLabel }}</span>
      </div>
    </div>

    <!-- Buy button -->
    <div class="px-4 pb-4">
      <button
        @click="$emit('buy', fund)"
        class="w-full py-2.5 bg-teal-600 text-white font-semibold text-sm rounded-xl hover:bg-teal-700 active:bg-teal-800 transition-colors"
      >
        Beli Sekarang
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatIDR } from '~/composables/useApi'

interface Fund {
  id: number
  code: string
  name: string
  manager: string
  type: string
  nav: number
  return_1y: number
  return_ytd?: number
  aum: number
  min_subscription: number
  is_syariah: boolean
  is_index: boolean
  has_dividend: boolean
  risk_level?: number
}

const props = defineProps<{ fund: Fund }>()
defineEmits<{ buy: [fund: Fund] }>()

const avatarColors = ['#009688', '#00897b', '#00796b', '#0288d1', '#7b1fa2', '#c62828']
const avatarColor = computed(() => avatarColors[props.fund.id % avatarColors.length])

const formatAUM = (aum: number) => {
  if (!aum) return '-'
  if (aum >= 1e12) return `${(aum / 1e12).toFixed(1)}T`
  if (aum >= 1e9) return `${(aum / 1e9).toFixed(1)}M`
  if (aum >= 1e6) return `${(aum / 1e6).toFixed(0)}Jt`
  return formatIDR(aum)
}

const typeColorClass = computed(() => {
  const t = props.fund.type || ''
  if (t.includes('Pasar Uang')) return 'bg-blue-100 text-blue-700'
  if (t.includes('Pendapatan Tetap')) return 'bg-teal-100 text-teal-700'
  if (t.includes('Campuran')) return 'bg-orange-100 text-orange-700'
  if (t.includes('Saham')) return 'bg-green-100 text-green-700'
  return 'bg-gray-100 text-gray-700'
})

const riskLevel = computed(() => props.fund.risk_level || 1)
const riskColor = computed(() => {
  if (riskLevel.value <= 1) return 'bg-blue-400'
  if (riskLevel.value <= 2) return 'bg-teal-400'
  if (riskLevel.value <= 3) return 'bg-yellow-400'
  if (riskLevel.value <= 4) return 'bg-orange-400'
  return 'bg-red-500'
})

const riskTextColor = computed(() => {
  if (riskLevel.value <= 1) return 'text-blue-600'
  if (riskLevel.value <= 2) return 'text-teal-600'
  if (riskLevel.value <= 3) return 'text-yellow-600'
  if (riskLevel.value <= 4) return 'text-orange-600'
  return 'text-red-600'
})

const riskLabel = computed(() => {
  const labels = ['', 'Sangat Rendah', 'Rendah', 'Sedang', 'Tinggi', 'Sangat Tinggi']
  return labels[riskLevel.value] || ''
})
</script>
