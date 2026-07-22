<template>
  <div class="max-w-6xl mx-auto px-4 py-8 lg:py-12">
    <div class="mb-6">
      <h1 class="text-3xl lg:text-4xl font-display font-extrabold tracking-tight text-slate-800">Bandingkan</h1>
      <p class="text-slate-500 mt-2">Pilih hingga 3 untuk membandingkan performa dan karakteristiknya.</p>
    </div>

    <!-- Tabs -->
    <div class="inline-flex rounded-xl bg-slate-100 p-1 mb-6">
      <button v-for="t in tabs" :key="t.key" @click="tab = t.key"
        class="px-4 py-2 text-sm font-semibold rounded-lg transition"
        :class="tab === t.key ? 'bg-white text-primary-700 shadow-sm' : 'text-slate-500'">
        {{ t.label }}
      </button>
    </div>

    <div v-if="loading" class="h-64 rounded-card bg-slate-100 animate-pulse"></div>

    <div v-else class="grid lg:grid-cols-3 gap-6">
      <!-- Picker -->
      <div class="lg:col-span-1">
        <input v-model="search" type="text" placeholder="Cari…"
          class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-primary-200" />
        <div class="space-y-1.5 max-h-[28rem] overflow-y-auto pr-1">
          <label v-for="item in filtered" :key="itemKey(item)"
            class="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition"
            :class="isSelected(item) ? 'border-primary-300 bg-primary-50' : 'border-slate-100 hover:border-primary-200'">
            <input type="checkbox" :checked="isSelected(item)" @change="toggle(item)"
              class="rounded text-primary-600 focus:ring-primary-300" />
            <div class="min-w-0">
              <p class="text-sm font-semibold text-slate-700 truncate">{{ tab === 'funds' ? item.name : item.investment_manager }}</p>
              <p class="text-xs text-slate-400 truncate">{{ tab === 'funds' ? item.investment_manager : (item.fund_count + ' produk') }}</p>
            </div>
          </label>
        </div>
        <p class="text-xs text-slate-400 mt-2">{{ selected.length }}/3 dipilih</p>
      </div>

      <!-- Comparison -->
      <div class="lg:col-span-2">
        <div v-if="!selected.length" class="h-full flex items-center justify-center text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-card p-10">
          Pilih item di kiri untuk mulai membandingkan.
        </div>

        <div v-else class="overflow-x-auto bg-white rounded-card border border-slate-100 shadow-card">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-slate-100">
                <th class="text-left p-4 text-slate-400 font-medium w-40">Parameter</th>
                <th v-for="s in selected" :key="itemKey(s)" class="text-left p-4 font-display font-bold text-slate-800">
                  <div class="flex items-start justify-between gap-2">
                    <span class="line-clamp-2">{{ tab === 'funds' ? s.name : s.investment_manager }}</span>
                    <button @click="toggle(s)" class="text-slate-300 hover:text-red-400 shrink-0">✕</button>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in rows" :key="row.label" class="border-b border-slate-50 last:border-0">
                <td class="p-4 text-slate-400">{{ row.label }}</td>
                <td v-for="s in selected" :key="itemKey(s) + row.label" class="p-4">
                  <span v-if="!row.bar" class="font-semibold text-slate-700" :class="row.color?.(s)">{{ row.value(s) }}</span>
                  <div v-else>
                    <span class="font-semibold" :class="row.color?.(s)">{{ row.value(s) }}</span>
                    <div class="mt-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div class="h-full bg-brand-gradient rounded-full" :style="{ width: row.barWidth!(s) + '%' }"></div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'public' })
const { get } = useApi()

const tabs = [
  { key: 'funds', label: 'Reksa Dana' },
  { key: 'managers', label: 'Manajer Investasi' },
]
const tab = ref<'funds' | 'managers'>('funds')
const loading = ref(true)
const search = ref('')
const funds = ref<any[]>([])
const managers = ref<any[]>([])
const selectedFunds = ref<any[]>([])
const selectedManagers = ref<any[]>([])

const fundTypeLabel = (t: string) => ({
  money_market: 'Pasar Uang', fixed_income: 'Pendapatan Tetap', balanced: 'Campuran',
  equity: 'Saham', sharia: 'Syariah',
}[t] || t)
const riskLabel = (n: number) => ['', 'Rendah', 'Konservatif', 'Moderat', 'Agresif', 'Tinggi'][n] || '-'

const load = async () => {
  loading.value = true
  try {
    const [f, m] = await Promise.all([
      get<{ data: any[] }>('/products', { per_page: 100 }),
      get<{ data: any[] }>('/products/managers'),
    ])
    funds.value = f.data || []
    managers.value = m.data || []
  } finally {
    loading.value = false
  }
}
onMounted(load)

const source = computed(() => (tab.value === 'funds' ? funds.value : managers.value))
const selected = computed(() => (tab.value === 'funds' ? selectedFunds.value : selectedManagers.value))

const itemKey = (i: any) => (tab.value === 'funds' ? i.id : i.investment_manager)
const isSelected = (i: any) => selected.value.some((s) => itemKey(s) === itemKey(i))
const toggle = (i: any) => {
  const arr = tab.value === 'funds' ? selectedFunds : selectedManagers
  const idx = arr.value.findIndex((s) => itemKey(s) === itemKey(i))
  if (idx >= 0) arr.value.splice(idx, 1)
  else if (arr.value.length < 3) arr.value.push(i)
}

const filtered = computed(() => {
  const q = search.value.toLowerCase().trim()
  if (!q) return source.value
  return source.value.filter((i) =>
    (tab.value === 'funds' ? `${i.name} ${i.investment_manager}` : i.investment_manager).toLowerCase().includes(q))
})

const maxPerf = computed(() => Math.max(1, ...selected.value.map((s: any) =>
  Math.abs(Number(tab.value === 'funds' ? s.performance_1yr : s.avg_performance_1yr) || 0))))
const maxAum = computed(() => Math.max(1, ...selected.value.map((s: any) => Number(s.total_aum) || 0)))

const perfColor = (v: number) => (v >= 0 ? 'text-emerald-600' : 'text-red-500')

const fundRows = [
  { label: 'Jenis', value: (s: any) => fundTypeLabel(s.fund_type) },
  { label: 'NAV / Unit', value: (s: any) => formatNumber(Number(s.nav_per_unit)) },
  { label: 'AUM', value: (s: any) => formatIDR(Number(s.total_aum)), bar: true, barWidth: (s: any) => (Number(s.total_aum) / maxAum.value) * 100 },
  { label: 'Return 1 Thn', value: (s: any) => formatPercent(Number(s.performance_1yr) || 0), color: (s: any) => perfColor(Number(s.performance_1yr) || 0), bar: true, barWidth: (s: any) => (Math.abs(Number(s.performance_1yr) || 0) / maxPerf.value) * 100 },
  { label: 'Return YTD', value: (s: any) => formatPercent(Number(s.performance_ytd) || 0), color: (s: any) => perfColor(Number(s.performance_ytd) || 0) },
  { label: 'Profil Risiko', value: (s: any) => riskLabel(Number(s.risk_level)) },
]
const managerRows = [
  { label: 'Jumlah Produk', value: (s: any) => `${s.fund_count} produk` },
  { label: 'Total AUM', value: (s: any) => formatIDR(Number(s.total_aum)), bar: true, barWidth: (s: any) => (Number(s.total_aum) / maxAum.value) * 100 },
  { label: 'Rata-rata Return 1 Thn', value: (s: any) => formatPercent(Number(s.avg_performance_1yr) || 0), color: (s: any) => perfColor(Number(s.avg_performance_1yr) || 0), bar: true, barWidth: (s: any) => (Math.abs(Number(s.avg_performance_1yr) || 0) / maxPerf.value) * 100 },
  { label: 'Rentang Risiko', value: (s: any) => `${riskLabel(Number(s.min_risk_level))} – ${riskLabel(Number(s.max_risk_level))}` },
]
const rows = computed<any[]>(() => (tab.value === 'funds' ? fundRows : managerRows))

useHead({ title: 'Bandingkan — Victoria Sekuritas' })
</script>
