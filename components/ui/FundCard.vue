<template>
  <div class="relative bg-white rounded-card border border-slate-100 ring-1 ring-primary-50 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all overflow-hidden">
    <!-- soft indigo orb accent -->
    <div class="pointer-events-none absolute -top-10 -right-10 w-28 h-28 rounded-full bg-brand-soft opacity-70 blur-2xl"></div>

    <div class="relative p-5">
      <!-- Fund header -->
      <div class="flex items-start gap-3 mb-4">
        <div
          class="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-extrabold text-base flex-shrink-0 shadow-soft"
          :style="{ backgroundColor: avatarColor }"
        >
          {{ fund.name?.charAt(0) }}
        </div>
        <div class="flex-1 min-w-0">
          <NuxtLink :to="`/produk/${fund.id}`" class="block">
            <h3 class="font-display text-[15px] font-extrabold tracking-tight text-slate-900 leading-tight hover:text-primary-700 transition-colors line-clamp-2">
              {{ fund.name }}
            </h3>
          </NuxtLink>
          <p class="text-xs text-slate-500 mt-1 truncate">{{ fund.manager }}</p>
        </div>
      </div>

      <!-- Type badge + tags -->
      <div class="flex flex-wrap gap-1.5 mb-4">
        <span
          class="px-2.5 py-1 rounded-full text-xs font-semibold"
          :class="typeColorClass"
        >
          {{ fund.type }}
        </span>
        <span v-if="fund.is_syariah" class="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
          Syariah
        </span>
        <span v-if="fund.is_index" class="px-2.5 py-1 rounded-full text-xs font-semibold bg-accent-100 text-accent-700">
          Indeks
        </span>
        <span v-if="fund.has_dividend" class="px-2.5 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-700">
          Dividen
        </span>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 gap-2.5 mb-4">
        <div class="bg-primary-50/60 rounded-2xl p-3">
          <p class="text-[11px] font-medium text-slate-500 mb-1">Return 1 Tahun</p>
          <p class="text-base font-extrabold tracking-tight" :class="fund.return_1y >= 0 ? 'text-green-600' : 'text-red-500'">
            {{ fund.return_1y >= 0 ? '+' : '' }}{{ fund.return_1y?.toFixed(2) }}%
          </p>
        </div>
        <div class="bg-accent-50/60 rounded-2xl p-3">
          <p class="text-[11px] font-medium text-slate-500 mb-1">Dana Kelolaan</p>
          <p class="text-base font-extrabold tracking-tight text-slate-800">{{ formatAUM(fund.aum) }}</p>
        </div>
      </div>

      <!-- NAV and min -->
      <div class="flex items-center justify-between text-xs text-slate-500 mb-4 pt-1">
        <span>NAV: <strong class="text-slate-800 font-semibold">{{ formatIDR(fund.nav) }}</strong></span>
        <span>Min: <strong class="text-slate-800 font-semibold">{{ formatIDR(fund.min_subscription) }}</strong></span>
      </div>

      <!-- Risk indicator -->
      <div class="flex items-center gap-2 mb-1">
        <span class="text-xs text-slate-400">Risiko:</span>
        <div class="flex gap-0.5">
          <div
            v-for="i in 5"
            :key="i"
            class="w-4 h-1.5 rounded-full"
            :class="i <= (fund.risk_level || 1) ? riskColor : 'bg-slate-200'"
          ></div>
        </div>
        <span class="text-xs font-semibold" :class="riskTextColor">{{ riskLabel }}</span>
      </div>
    </div>

    <!-- Buy button -->
    <div class="relative px-5 pb-5">
      <button
        @click="$emit('buy', fund)"
        class="w-full py-3 bg-primary-600 text-white font-bold text-sm rounded-xl shadow-soft hover:bg-primary-700 active:bg-primary-800 transition-all hover:-translate-y-0.5"
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

const avatarColors = ['#4F46E5', '#6366F1', '#4338CA', '#7C3AED', '#8B5CF6', '#5B21B6']
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
  if (t.includes('Pasar Uang')) return 'bg-primary-100 text-primary-700'
  if (t.includes('Pendapatan Tetap')) return 'bg-accent-100 text-accent-700'
  if (t.includes('Campuran')) return 'bg-primary-50 text-primary-600'
  if (t.includes('Saham')) return 'bg-accent-50 text-accent-600'
  return 'bg-slate-100 text-slate-700'
})

const riskLevel = computed(() => props.fund.risk_level || 1)
const riskColor = computed(() => {
  if (riskLevel.value <= 1) return 'bg-primary-400'
  if (riskLevel.value <= 2) return 'bg-accent-400'
  if (riskLevel.value <= 3) return 'bg-amber-400'
  if (riskLevel.value <= 4) return 'bg-orange-400'
  return 'bg-red-500'
})

const riskTextColor = computed(() => {
  if (riskLevel.value <= 1) return 'text-primary-600'
  if (riskLevel.value <= 2) return 'text-accent-600'
  if (riskLevel.value <= 3) return 'text-amber-600'
  if (riskLevel.value <= 4) return 'text-orange-600'
  return 'text-red-600'
})

const riskLabel = computed(() => {
  const labels = ['', 'Sangat Rendah', 'Rendah', 'Sedang', 'Tinggi', 'Sangat Tinggi']
  return labels[riskLevel.value] || ''
})
</script>
