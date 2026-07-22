<template>
  <div class="p-4 lg:p-8 max-w-xl mx-auto">
    <!-- Back -->
    <NuxtLink :to="fundId ? `/produk/${fundId}` : '/produk'" class="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-800 mb-6 transition-colors">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Kembali
    </NuxtLink>

    <!-- Success state -->
    <div v-if="step === 'success'" class="py-2">
      <div class="text-center mb-6">
        <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 class="text-2xl font-display font-extrabold tracking-tight text-slate-900 mb-2">Pembelian Berhasil!</h2>
        <p class="text-slate-500">Pesanan Anda sedang diproses. Lakukan pembayaran sebelum batas waktu.</p>
      </div>

      <!-- Payment instruction -->
      <div class="bg-white rounded-card border border-slate-100 shadow-card p-6 text-left mb-4">
        <h3 class="font-display font-bold text-slate-900 mb-4">Instruksi Pembayaran</h3>
        <div v-if="form.payment_method === 'va'" class="space-y-3">
          <div class="bg-brand-soft ring-1 ring-primary-100 rounded-xl p-4">
            <p class="text-xs text-primary-700 font-semibold uppercase tracking-wide mb-1">Nomor Virtual Account</p>
            <div class="flex items-center gap-2">
              <p class="text-2xl font-display font-extrabold text-primary-800 tracking-wider">{{ vaNumber }}</p>
              <button @click="copyVA" class="text-xs text-accent-600 font-semibold hover:underline">Salin</button>
            </div>
            <p class="text-xs text-primary-600 mt-1">Bank Transfer BCA</p>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-slate-500">Total Pembayaran</span>
            <span class="text-sm font-bold text-slate-900">{{ formatIDR(totalAmount) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-slate-500">Batas Pembayaran</span>
            <span class="text-sm font-semibold text-red-600">{{ paymentDeadline }}</span>
          </div>
        </div>
        <div v-else class="space-y-3">
          <div class="bg-slate-50 rounded-xl p-4">
            <p class="text-xs text-slate-500 mb-1">Transfer ke Rekening</p>
            <p class="font-bold text-slate-900">BCA - 8127-0000-1234</p>
            <p class="text-sm text-slate-600">a/n PT Victoria Sekuritas Indonesia</p>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-slate-500">Jumlah Transfer</span>
            <span class="text-sm font-bold text-slate-900">{{ formatIDR(totalAmount) }}</span>
          </div>
          <p class="text-xs text-amber-700 bg-amber-50 p-3 rounded-lg">
            Transfer dengan nominal tepat termasuk kode unik agar transaksi diverifikasi otomatis.
          </p>
        </div>
      </div>

      <div class="flex gap-3">
        <NuxtLink to="/transaksi" class="flex-1 border-2 border-accent-500 text-accent-600 font-semibold py-3 rounded-xl hover:bg-accent-50 transition-colors text-center text-sm">
          Lihat Transaksi
        </NuxtLink>
        <NuxtLink to="/dashboard" class="flex-1 bg-primary-600 text-white font-semibold py-3 rounded-xl hover:bg-primary-700 transition-colors text-center text-sm">
          Ke Beranda
        </NuxtLink>
      </div>
    </div>

    <!-- Form state -->
    <div v-else>
      <!-- Hero — indigo, asimetris, rata-kiri dengan orb gradient lembut -->
      <div class="relative overflow-hidden bg-brand-gradient rounded-card shadow-card p-6 mb-6 text-white">
        <div class="absolute -top-10 -right-8 w-40 h-40 rounded-full bg-white/15 blur-2xl"></div>
        <div class="absolute -bottom-12 -left-6 w-32 h-32 rounded-full bg-accent-300/30 blur-2xl"></div>
        <div class="relative">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur-sm mb-3">
            Transaksi Pembelian
          </span>
          <h1 class="text-2xl font-display font-extrabold tracking-tight mb-1">Pembelian Reksa Dana</h1>
          <p class="text-primary-100 text-sm">Isi detail pembelian reksa dana</p>
        </div>
      </div>

      <!-- Fund info -->
      <div v-if="fund" class="bg-white rounded-card border border-slate-100 shadow-card p-5 mb-4 flex items-center gap-3">
        <div class="w-11 h-11 rounded-xl flex items-center justify-center text-white font-display font-bold flex-shrink-0 bg-brand-gradient">
          {{ fund.name?.charAt(0) }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-slate-900 truncate">{{ fund.name }}</p>
          <p class="text-xs text-slate-500">{{ fund.type }} • NAV: {{ formatIDR(fund.nav) }}</p>
        </div>
        <div class="text-right">
          <p class="text-sm font-semibold" :class="fund.return_1y >= 0 ? 'text-green-600' : 'text-red-500'">
            {{ fund.return_1y >= 0 ? '+' : '' }}{{ fund.return_1y?.toFixed(2) }}%
          </p>
          <p class="text-xs text-slate-400">1 Tahun</p>
        </div>
      </div>

      <!-- Amount input -->
      <div class="bg-white rounded-card border border-slate-100 shadow-card p-6 mb-4">
        <label class="block text-sm font-semibold text-slate-700 mb-3">Jumlah Pembelian</label>
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">Rp</span>
          <input
            v-model="amountInput"
            type="text"
            inputmode="numeric"
            placeholder="0"
            class="w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl text-lg font-bold focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-right"
            @input="formatAmountInput"
          />
        </div>
        <p v-if="amountError" class="text-red-500 text-xs mt-1">{{ amountError }}</p>

        <!-- Quick amounts -->
        <div class="flex gap-2 mt-3 flex-wrap">
          <button
            v-for="quick in quickAmounts"
            :key="quick"
            @click="setAmount(quick)"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
            :class="form.amount === quick ? 'bg-primary-600 border-primary-600 text-white' : 'border-slate-200 text-slate-600 hover:border-primary-400 hover:text-primary-600'"
          >
            {{ formatIDR(quick) }}
          </button>
        </div>

        <!-- Estimated units -->
        <div v-if="form.amount > 0 && fund" class="mt-4 p-4 bg-brand-soft ring-1 ring-primary-100 rounded-xl">
          <div class="flex justify-between text-sm">
            <span class="text-primary-700">Estimasi Unit</span>
            <span class="font-semibold text-primary-800">{{ estimatedUnits.toFixed(4) }} unit</span>
          </div>
          <div class="flex justify-between text-xs mt-1">
            <span class="text-primary-600">Biaya Pembelian ({{ fund.buy_fee || 0 }}%)</span>
            <span class="text-primary-700">{{ formatIDR(buyFee) }}</span>
          </div>
        </div>
      </div>

      <!-- Payment method -->
      <div class="bg-white rounded-card border border-slate-100 shadow-card p-6 mb-6">
        <label class="block text-sm font-semibold text-slate-700 mb-3">Metode Pembayaran</label>
        <div class="space-y-3">
          <label
            v-for="method in paymentMethods"
            :key="method.value"
            class="flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all"
            :class="form.payment_method === method.value ? 'border-primary-500 bg-brand-soft ring-1 ring-primary-100' : 'border-slate-200 hover:border-primary-300'"
          >
            <input
              type="radio"
              :value="method.value"
              v-model="form.payment_method"
              class="mt-0.5 text-primary-600 focus:ring-primary-500"
            />
            <div>
              <p class="text-sm font-medium text-slate-900">{{ method.label }}</p>
              <p class="text-xs text-slate-500">{{ method.desc }}</p>
            </div>
          </label>
        </div>
      </div>

      <!-- Order summary -->
      <div v-if="form.amount > 0" class="bg-white rounded-card border border-slate-100 shadow-card p-6 mb-4">
        <h3 class="font-display font-bold text-slate-900 mb-3">Ringkasan Pesanan</h3>
        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-slate-500">Nominal Investasi</span>
            <span class="font-medium text-slate-900">{{ formatIDR(form.amount) }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-slate-500">Biaya Pembelian</span>
            <span class="font-medium text-slate-900">{{ formatIDR(buyFee) }}</span>
          </div>
          <div class="border-t border-slate-100 my-2"></div>
          <div class="flex justify-between">
            <span class="text-sm font-semibold text-slate-900">Total Pembayaran</span>
            <span class="text-sm font-bold text-primary-700">{{ formatIDR(totalAmount) }}</span>
          </div>
        </div>
      </div>

      <!-- Submit button -->
      <button
        @click="submitOrder"
        :disabled="loading || !canSubmit"
        class="w-full py-4 rounded-xl font-bold text-sm transition-all"
        :class="canSubmit && !loading ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-card hover:shadow-card-hover hover:-translate-y-0.5' : 'bg-slate-200 text-slate-400 cursor-not-allowed'"
      >
        <span v-if="loading" class="flex items-center justify-center gap-2">
          <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          Memproses...
        </span>
        <span v-else>Konfirmasi Pembelian</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatIDR } from '~/composables/useApi'

definePageMeta({ middleware: 'auth' })

const { get, post } = useApi()
const route = useRoute()

const fundId = computed(() => route.query.fund_id as string)
const fundCode = computed(() => route.query.fund_code as string)

const step = ref<'form' | 'success'>('form')
const loading = ref(false)
const fund = ref<any>(null)
const amountInput = ref('')
const amountError = ref('')
const vaNumber = ref('8001234567890')
const paymentDeadline = computed(() => {
  const d = new Date()
  d.setHours(d.getHours() + 24)
  return d.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
})

const form = reactive({
  amount: 0,
  payment_method: 'va',
})

const quickAmounts = [100000, 500000, 1000000, 5000000]

const paymentMethods = [
  { value: 'va', label: 'Virtual Account', desc: 'Transfer via VA BCA, BNI, BRI, Mandiri' },
  { value: 'transfer', label: 'Transfer Bank', desc: 'Transfer langsung ke rekening PT Victoria Sekuritas' },
]

const buyFee = computed(() => form.amount * ((fund.value?.buy_fee || 0) / 100))
const totalAmount = computed(() => form.amount + buyFee.value)
const estimatedUnits = computed(() => {
  if (!fund.value?.nav || form.amount <= 0) return 0
  return form.amount / fund.value.nav
})

const canSubmit = computed(() =>
  form.amount >= 10000 && form.payment_method && fund.value
)

const setAmount = (amount: number) => {
  form.amount = amount
  amountInput.value = amount.toLocaleString('id-ID')
}

const formatAmountInput = () => {
  const raw = amountInput.value.replace(/\D/g, '')
  form.amount = parseInt(raw) || 0
  amountInput.value = form.amount > 0 ? form.amount.toLocaleString('id-ID') : ''
  if (form.amount > 0 && form.amount < 10000) {
    amountError.value = 'Minimum pembelian adalah Rp10.000'
  } else {
    amountError.value = ''
  }
}

const copyVA = () => {
  navigator.clipboard.writeText(vaNumber.value)
}

const submitOrder = async () => {
  if (!canSubmit.value) return
  loading.value = true
  try {
    await post('/transactions/subscribe', {
      fund_code: fundCode.value,
      amount: form.amount,
      payment_method: form.payment_method,
    })
    step.value = 'success'
  } catch {
    // Demo: just show success
    step.value = 'success'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (!fundId.value) return
  try {
    const data = await get<{ data: any }>(`/products/${fundId.value}`)
    fund.value = data.data
  } catch {
    fund.value = {
      id: fundId.value,
      code: fundCode.value || 'RDPU001',
      name: 'Sequis Dana Kas Prima',
      type: 'Pasar Uang',
      nav: 1250.45,
      return_1y: 6.8,
      buy_fee: 0,
    }
  }
})
</script>
