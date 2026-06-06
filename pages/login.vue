<template>
  <div>
    <NuxtLayout name="auth">
      <div class="bg-white rounded-2xl shadow-card p-8">
        <!-- Logo/Title -->
        <div class="text-center mb-8">
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
               style="background: linear-gradient(135deg, #14b8a6, #0ea5e9)">
            <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-800">Masuk ke Akun</h1>
          <p class="text-gray-500 text-sm mt-1">Selamat datang kembali di Sekuritas</p>
        </div>

        <!-- Step 1: Phone input -->
        <div v-if="step === 1">
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">Nomor Handphone</label>
            <div class="flex">
              <div class="flex items-center px-3 bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg text-sm text-gray-600 font-medium">
                +62
              </div>
              <input
                v-model="phone"
                type="tel"
                placeholder="8xxxxxxxxxx"
                class="flex-1 border border-gray-300 rounded-r-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                @keyup.enter="sendOtp"
                inputmode="numeric"
              />
            </div>
            <p v-if="phoneError" class="text-red-500 text-xs mt-1">{{ phoneError }}</p>
          </div>

          <button
            @click="sendOtp"
            :disabled="loading || !phone"
            class="w-full py-3.5 rounded-xl font-semibold text-sm transition-all shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99]"
            :class="phone && !loading ? 'text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'"
            :style="phone && !loading ? 'background: linear-gradient(135deg, #14b8a6, #0ea5e9)' : ''"
          >
            <span v-if="loading" class="flex items-center justify-center gap-2">
              <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              Mengirim OTP...
            </span>
            <span v-else>Kirim Kode OTP</span>
          </button>

          <p class="text-center text-sm text-gray-500 mt-5">
            Belum punya akun?
            <NuxtLink to="/register" class="text-teal-600 font-semibold hover:underline">Daftar Sekarang</NuxtLink>
          </p>
        </div>

        <!-- Step 2: OTP Verification -->
        <div v-else-if="step === 2">
          <div class="text-center mb-6">
            <div class="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg class="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <p class="text-sm text-gray-600">Kode OTP dikirim ke</p>
            <p class="font-semibold text-gray-800">+62{{ phone }}</p>
          </div>

          <!-- Demo hint -->
          <div class="mb-4 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
            <span class="text-amber-500 text-sm">🔑</span>
            <p class="text-sm text-amber-700">
              <span class="font-semibold">Demo:</span> gunakan kode <span class="font-mono font-bold tracking-widest">123456</span>
            </p>
          </div>

          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2 text-center">Masukkan Kode OTP</label>
            <div class="flex gap-3 justify-center">
              <input
                v-for="(digit, idx) in otpDigits"
                :key="idx"
                :ref="(el) => { if (el) otpRefs[idx] = el as HTMLInputElement }"
                v-model="otpDigits[idx]"
                type="text"
                maxlength="1"
                inputmode="numeric"
                class="w-12 h-12 text-center text-xl font-bold border-2 rounded-xl focus:outline-none focus:border-teal-500 transition-colors"
                :class="otpDigits[idx] ? 'border-teal-500 bg-teal-50' : 'border-gray-300'"
                @input="onOtpInput(idx)"
                @keydown.backspace="onOtpBackspace(idx)"
              />
            </div>
            <p v-if="otpError" class="text-red-500 text-xs mt-2 text-center">{{ otpError }}</p>
          </div>

          <button
            @click="verifyOtp"
            :disabled="loading || otpFilled.length < 6"
            class="w-full py-3.5 rounded-xl font-semibold text-sm transition-all shadow-sm hover:shadow-md"
            :class="otpFilled.length === 6 && !loading ? 'text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'"
            :style="otpFilled.length === 6 && !loading ? 'background: linear-gradient(135deg, #14b8a6, #0ea5e9)' : ''"
          >
            <span v-if="loading">Memverifikasi...</span>
            <span v-else>Verifikasi OTP</span>
          </button>

          <div class="text-center mt-4">
            <button
              @click="resendOtp"
              :disabled="resendCooldown > 0"
              class="text-sm text-teal-600 font-medium hover:underline disabled:text-gray-400"
            >
              {{ resendCooldown > 0 ? `Kirim ulang dalam ${resendCooldown}s` : 'Kirim ulang OTP' }}
            </button>
          </div>

          <button @click="step = 1" class="w-full text-center text-sm text-gray-500 mt-3 hover:text-gray-700">
            &larr; Ubah nomor HP
          </button>
        </div>

        <!-- Step 3: Enter PIN -->
        <div v-else-if="step === 3">
          <div class="text-center mb-6">
            <div class="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg class="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 class="text-lg font-semibold text-gray-800">Masukkan PIN</h2>
            <p class="text-sm text-gray-500">Masukkan 6 digit PIN Anda</p>
          </div>

          <div class="mb-6">
            <div class="flex gap-3 justify-center">
              <div
                v-for="i in 6"
                :key="i"
                class="w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-colors"
                :class="pinValue.length >= i ? 'border-teal-500 bg-teal-50' : 'border-gray-300'"
              >
                <div v-if="pinValue.length >= i" class="w-3 h-3 bg-teal-600 rounded-full"></div>
              </div>
            </div>
            <p v-if="pinError" class="text-red-500 text-xs mt-2 text-center">{{ pinError }}</p>
          </div>

          <!-- PIN Keypad -->
          <div class="grid grid-cols-3 gap-3 max-w-xs mx-auto">
            <button
              v-for="key in pinKeypad"
              :key="key"
              @click="onPinKey(key)"
              class="h-14 rounded-xl font-semibold text-gray-700 transition-colors"
              :class="key === '' ? 'invisible' : 'bg-gray-100 hover:bg-gray-200 active:bg-gray-300'"
            >
              <span v-if="key === 'del'">
                <svg class="w-5 h-5 mx-auto text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
                </svg>
              </span>
              <span v-else>{{ key }}</span>
            </button>
          </div>

          <p v-if="loading" class="text-center text-sm text-teal-600 mt-4">Memverifikasi PIN...</p>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'guest', layout: false })

const authStore = useAuthStore()
const router = useRouter()

const step = ref(1)
const phone = ref('')
const phoneError = ref('')
const otpDigits = ref(['', '', '', '', '', ''])
const otpRefs = ref<HTMLInputElement[]>([])
const otpError = ref('')
const pinValue = ref('')
const pinError = ref('')
const loading = ref(false)
const resendCooldown = ref(0)

const otpFilled = computed(() => otpDigits.value.filter(d => d !== '').join(''))

const pinKeypad = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del']

const onOtpInput = (idx: number) => {
  const val = otpDigits.value[idx]
  if (val && idx < 5) {
    otpRefs.value[idx + 1]?.focus()
  }
  otpDigits.value[idx] = val.replace(/\D/g, '').slice(0, 1)
}

const onOtpBackspace = (idx: number) => {
  if (!otpDigits.value[idx] && idx > 0) {
    otpDigits.value[idx - 1] = ''
    otpRefs.value[idx - 1]?.focus()
  }
}

const onPinKey = (key: string) => {
  if (key === 'del') {
    pinValue.value = pinValue.value.slice(0, -1)
  } else if (pinValue.value.length < 6) {
    pinValue.value += key
    if (pinValue.value.length === 6) {
      doLogin()
    }
  }
}

const sendOtp = async () => {
  phoneError.value = ''
  if (!phone.value || phone.value.length < 9) {
    phoneError.value = 'Nomor HP tidak valid'
    return
  }
  loading.value = true
  try {
    await authStore.sendOtp(phone.value)
    step.value = 2
    startResendCooldown()
  } catch (e: any) {
    phoneError.value = e?.data?.message || 'Gagal mengirim OTP. Coba lagi.'
  } finally {
    loading.value = false
  }
}

const verifyOtp = async () => {
  otpError.value = ''
  const otp = otpDigits.value.join('')
  loading.value = true
  try {
    await authStore.verifyOtp(phone.value, otp)
    step.value = 3
  } catch (e: any) {
    otpError.value = e?.data?.message || 'Kode OTP salah. Coba lagi.'
  } finally {
    loading.value = false
  }
}

const doLogin = async () => {
  pinError.value = ''
  loading.value = true
  try {
    await authStore.login(phone.value, pinValue.value)
    router.push('/dashboard')
  } catch (e: any) {
    pinError.value = e?.data?.message || 'PIN salah. Coba lagi.'
    pinValue.value = ''
    loading.value = false
  }
}

const resendOtp = async () => {
  if (resendCooldown.value > 0) return
  await sendOtp()
}

const startResendCooldown = () => {
  resendCooldown.value = 60
  const interval = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0) clearInterval(interval)
  }, 1000)
}
</script>
