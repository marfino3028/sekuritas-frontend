<template>
  <div class="p-4 lg:p-6 max-w-xl mx-auto">
    <!-- Back -->
    <NuxtLink :to="fundId ? `/produk/${fundId}` : '/produk'" class="flex items-center gap-1 text-sm text-gray-500 hover:text-teal-600 mb-4 transition-colors">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Kembali
    </NuxtLink>

    <!-- Success state -->
    <div v-if="step === 'success'" class="text-center py-8">
      <div class="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-10 h-10 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-gray-800 mb-2">Pembelian Berhasil!</h2>
      <p class="text-gray-500 mb-6">Pesanan Anda sedang diproses. Lakukan pembayaran sebelum batas waktu.</p>

      <!-- Payment instruction -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-card p-5 text-left mb-4">
        <h3 class="font-semibold text-gray-800 mb-4">Instruksi Pembayaran</h3>
        <div v-if="form.payment_method === 'va'" class="space-y-3">
          <div class="bg-teal-50 rounded-xl p-4">
            <p class="text-xs text-teal-700 font-medium mb-1">Nomor Virtual Account</p>
            <div class="flex items-center gap-2">
              <p class="text-2xl font-bold text-teal-800 tracking-wider">{{ vaNumber }}</p>
              <button @click="copyVA" class="text-xs text-teal-600 font-medium hover:underline">Salin</button>
            </div>
            <p class="text-xs text-teal-600 mt-1">Bank Transfer BCA</p>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-500">Total Pembayaran</span>
            <span class="text-sm font-bold text-gray-800">{{ formatIDR(totalAmount) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-500">Batas Pembayaran</span>
            <span class="text-sm font-semibold text-red-600">{{ paymentDeadline }}</span>
          </div>
        </div>
        <div v-else class="space-y-3">
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-xs text-gray-500 mb-1">Transfer ke Rekening</p>
            <p class="font-bold text-gray-800">BCA - 8127-0000-1234</p>
            <p class="text-sm text-gray-600">a/n PT Sekuritas Indonesia</p>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-500">Jumlah Transfer</span>
            <span class="text-sm font-bold text-gray-800">{{ formatIDR(totalAmount) }}</span>
          </div>
          <p class="text-xs text-yellow-700 bg-yellow-50 p-3 rounded-lg">
            Transfer dengan nominal tepat termasuk kode unik agar transaksi diverifikasi otomatis.
          </p>
        </div>
      </div>

      <div class="flex gap-3">
        <NuxtLink to="/transaksi" class="flex-1 border-2 border-teal-600 text-teal-600 font-semibold py-3 rounded-xl hover:bg-teal-50 transition-colors text-center text-sm">
          Lihat Transaksi
        </NuxtLink>
        <NuxtLink to="/dashboard" class="flex-1 bg-teal-600 text-white font-semibold py-3 rounded-xl hover:bg-teal-700 transition-colors text-center text-sm">
          Ke Beranda
        </NuxtLink>
      </div>
    </div>

    <!-- Form state -->
    <div v-else>
      <h1 class="text-2xl font-bold text-gray-800 mb-1">Pembelian Reksa Dana</h1>
      <p class="text-gray-500 text-sm mb-6">Isi detail pembelian reksa dana</p>

      <!-- Fund info -->
      <div v-if="fund" class="bg-white rounded-2xl border border-gray-100 shadow-card p-4 mb-4 flex items-center gap-3">
        <div
          class="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0"
          style="background-color: #009688;"
        >
          {{ fund.name?.charAt(0) }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-gray-800 truncate">{{ fund.name }}</p>
          <p class="text-xs text-gray-500">{{ fund.type }} • NAV: {{ formatIDR(fund.nav) }}</p>
        </div>
        <div class="text-right">
          <p class="text-sm font-semibold" :class="fund.return_1y >= 0 ? 'text-green-600' : 'text-red-500'">
            {{ fund.return_1y >= 0 ? '+' : '' }}{{ fund.return_1y?.toFixed(2) }}%
          </p>
          <p class="text-xs text-gray-400">1 Tahun</p>
        </div>
      </div>

      <!-- Amount input -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-card p-5 mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-3">Jumlah Pembelian</label>
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-500">Rp</span>
          <input
            v-model="amountInput"
            type="text"
            inputmode="numeric"
            placeholder="0"
            class="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-lg font-bold focus:outline-none focus:ring-2 focus:ring-teal-500 text-right"
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
            class="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors"
            :class="form.amount === quick ? 'bg-teal-600 border-teal-600 text-white' : 'border-gray-200 text-gray-600 hover:border-teal-400'"
          >
            {{ formatIDR(quick) }}
          </button>
        </div>

        <!-- Estimated units -->
        <div v-if="form.amount > 0 && fund" class="mt-4 p-3 bg-teal-50 rounded-xl">
          <div class="flex justify-between text-sm">
            <span class="text-teal-700">Estimasi Unit</span>
            <span class="font-semibold text-teal-800">{{ estimatedUnits.toFixed(4) }} unit</span>
          </div>
          <div class="flex justify-between text-xs mt-1">
            <span class="text-teal-600">Biaya Pembelian ({{ fund.buy_fee || 0 }}%)</span>
            <span class="text-teal-700">{{ formatIDR(buyFee) }}</span>
          </div>
        </div>
      </div>

      <!-- Payment method -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-card p-5 mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-3">Metode Pembayaran</label>
        <div class="space-y-3">
          <label
            v-for="method in paymentMethods"
            :key="method.value"
            class="flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors"
            :class="form.payment_method === method.value ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-gray-300'"
          >
            <input
              type="radio"
              :value="method.value"
              v-model="form.payment_method"
              class="mt-0.5 text-teal-600 focus:ring-teal-500"
            />
            <div>
              <p class="text-sm font-medium text-gray-800">{{ method.label }}</p>
              <p class="text-xs text-gray-500">{{ method.desc }}</p>
            </div>
          </label>
        </div>
      </div>

      <!-- Order summary -->
      <div v-if="form.amount > 0" class="bg-white rounded-2xl border border-gray-100 shadow-card p-5 mb-4">
        <h3 class="font-semibold text-gray-800 mb-3">Ringkasan Pesanan</h3>
        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">Nominal Investasi</span>
            <span class="font-medium text-gray-800">{{ formatIDR(form.amount) }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">Biaya Pembelian</span>
            <span class="font-medium text-gray-800">{{ formatIDR(buyFee) }}</span>
          </div>
          <div class="border-t border-gray-100 my-2"></div>
          <div class="flex justify-between">
            <span class="text-sm font-semibold text-gray-800">Total Pembayaran</span>
            <span class="text-sm font-bold text-teal-700">{{ formatIDR(totalAmount) }}</span>
          </div>
        </div>
      </div>

      <!-- Submit button -->
      <button
        @click="submitOrder"
        :disabled="loading || !canSubmit"
        class="w-full py-4 rounded-xl font-bold text-sm transition-colors"
        :class="canSubmit && !loading ? 'bg-teal-600 text-white hover:bg-teal-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'"
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
  { value: 'transfer', label: 'Transfer Bank', desc: 'Transfer langsung ke rekening PT Sekuritas' },
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
