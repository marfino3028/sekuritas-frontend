<template>
  <div>
    <NuxtLayout name="auth">
      <div class="relative bg-white rounded-card shadow-card ring-1 ring-primary-50 border border-slate-100 p-7 overflow-hidden">
        <!-- soft gradient orbs -->
        <div class="pointer-events-none absolute -top-16 -right-16 w-44 h-44 rounded-full bg-brand-soft opacity-70 blur-2xl"></div>
        <div class="pointer-events-none absolute -bottom-20 -left-12 w-40 h-40 rounded-full bg-accent-100 opacity-50 blur-2xl"></div>

        <div class="relative">
        <!-- Badge promo/referral -->
        <div v-if="refCode" class="mb-5 flex items-center gap-2 rounded-xl bg-primary-50 border border-primary-100 px-3 py-2.5 text-sm">
          <span class="text-lg">🎁</span>
          <span class="text-primary-700">Kamu datang dari promo <b class="font-semibold">{{ refCode }}</b> — benefit otomatis tercatat setelah daftar.</span>
        </div>
        <!-- Step indicator -->
        <div class="flex items-center gap-2 mb-7">
          <div
            v-for="(s, i) in ['Nomor HP', 'OTP', 'Buat PIN']"
            :key="i"
            class="flex items-center"
          >
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
              :class="[
                step > i + 1 ? 'bg-brand-gradient text-white' : '',
                step === i + 1 ? 'bg-brand-gradient text-white ring-4 ring-primary-100' : '',
                step < i + 1 ? 'bg-primary-50 text-primary-300' : ''
              ]"
            >
              <svg v-if="step > i + 1" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
              </svg>
              <span v-else>{{ i + 1 }}</span>
            </div>
            <div v-if="i < 2" class="w-9 h-0.5 mx-1.5 rounded-full" :class="step > i + 1 ? 'bg-brand-gradient' : 'bg-primary-100'"></div>
          </div>
        </div>

        <!-- Step 1: Phone number -->
        <div v-if="step === 1">
          <span class="inline-flex items-center rounded-full bg-accent-100 text-accent-600 text-[11px] font-bold uppercase tracking-wider px-3 py-1 mb-3">Langkah 1</span>
          <h1 class="font-display text-3xl font-extrabold tracking-tight text-slate-900 mb-1.5">Daftar Akun</h1>
          <p class="text-slate-500 text-sm mb-7">Masukkan nomor HP yang aktif untuk mendaftar</p>

          <div class="mb-5">
            <label class="block text-sm font-semibold text-slate-700 mb-2">Nomor Handphone</label>
            <div class="flex">
              <div class="flex items-center px-3.5 bg-primary-50 border border-r-0 border-primary-100 rounded-l-xl text-sm text-primary-700 font-semibold">
                +62
              </div>
              <input
                v-model="phone"
                type="tel"
                placeholder="8xxxxxxxxxx"
                inputmode="numeric"
                class="flex-1 border border-slate-200 rounded-r-xl px-3.5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                @keyup.enter="sendOtp"
              />
            </div>
            <p v-if="phoneError" class="text-red-500 text-xs mt-1.5">{{ phoneError }}</p>
          </div>

          <!-- Terms -->
          <div class="mb-7">
            <label class="flex items-start gap-3 cursor-pointer">
              <input
                v-model="agreedToTerms"
                type="checkbox"
                class="mt-0.5 w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
              />
              <span class="text-sm text-slate-600">
                Saya menyetujui
                <a href="#" class="text-primary-600 font-semibold hover:underline">Syarat & Ketentuan</a>
                dan
                <a href="#" class="text-primary-600 font-semibold hover:underline">Kebijakan Privasi</a>
                PT Victoria Sekuritas Indonesia
              </span>
            </label>
          </div>

          <button
            @click="sendOtp"
            :disabled="loading || !phone || !agreedToTerms"
            class="w-full py-3.5 rounded-xl font-semibold text-sm transition-all"
            :class="phone && agreedToTerms && !loading ? 'bg-brand-gradient text-white shadow-card hover:shadow-card-hover hover:-translate-y-0.5 active:translate-y-0' : 'bg-slate-100 text-slate-400 cursor-not-allowed'"
          >
            <span v-if="loading" class="flex items-center justify-center gap-2">
              <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              Mengirim OTP...
            </span>
            <span v-else>Selanjutnya</span>
          </button>

          <p class="text-center text-sm text-slate-500 mt-6">
            Sudah punya akun?
            <NuxtLink to="/login" class="text-primary-600 font-semibold hover:underline">Masuk</NuxtLink>
          </p>
        </div>

        <!-- Step 2: OTP -->
        <div v-else-if="step === 2">
          <div class="text-center mb-7">
            <div class="w-14 h-14 bg-brand-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-card">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 class="font-display text-2xl font-extrabold tracking-tight text-slate-900 mb-1">Verifikasi OTP</h2>
            <p class="text-sm text-slate-500">Kode OTP dikirim ke <strong class="text-slate-700">+62{{ phone }}</strong></p>
          </div>

          <!-- Demo hint -->
          <div class="mb-5 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
            <span class="text-amber-500 text-sm">🔑</span>
            <p class="text-sm text-amber-700">
              <span class="font-semibold">Demo:</span> gunakan kode <span class="font-mono font-bold tracking-widest">123456</span>
            </p>
          </div>

          <div class="mb-7">
            <div class="flex gap-3 justify-center">
              <input
                v-for="(digit, idx) in otpDigits"
                :key="idx"
                :ref="(el) => { if (el) otpRefs[idx] = el as HTMLInputElement }"
                v-model="otpDigits[idx]"
                type="text"
                maxlength="1"
                inputmode="numeric"
                class="w-12 h-12 text-center text-xl font-bold border-2 rounded-xl focus:outline-none focus:border-primary-500 transition-colors"
                :class="otpDigits[idx] ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-200'"
                @input="onOtpInput(idx)"
                @keydown.backspace="onOtpBackspace(idx)"
              />
            </div>
            <p v-if="otpError" class="text-red-500 text-xs mt-2 text-center">{{ otpError }}</p>
          </div>

          <button
            @click="verifyOtp"
            :disabled="loading || otpFilled.length < 6"
            class="w-full py-3.5 rounded-xl font-semibold text-sm transition-all"
            :class="otpFilled.length === 6 && !loading ? 'bg-brand-gradient text-white shadow-card hover:shadow-card-hover hover:-translate-y-0.5 active:translate-y-0' : 'bg-slate-100 text-slate-400 cursor-not-allowed'"
          >
            <span v-if="loading">Memverifikasi...</span>
            <span v-else>Selanjutnya</span>
          </button>

          <div class="text-center mt-5">
            <button
              @click="resendOtp"
              :disabled="resendCooldown > 0"
              class="text-sm text-primary-600 font-semibold hover:underline disabled:text-slate-400"
            >
              {{ resendCooldown > 0 ? `Kirim ulang dalam ${resendCooldown}s` : 'Kirim ulang OTP' }}
            </button>
          </div>
          <button @click="step = 1" class="w-full text-center text-sm text-slate-500 mt-3 hover:text-primary-600">
            &larr; Ubah nomor HP
          </button>
        </div>

        <!-- Step 3: Create PIN -->
        <div v-else-if="step === 3">
          <div class="text-center mb-7">
            <div class="w-14 h-14 bg-brand-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-card">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 class="font-display text-2xl font-extrabold tracking-tight text-slate-900 mb-1">
              {{ confirmingPin ? 'Konfirmasi PIN' : 'Buat PIN' }}
            </h2>
            <p class="text-sm text-slate-500">
              {{ confirmingPin ? 'Masukkan ulang PIN yang sama' : 'Buat 6 digit PIN untuk keamanan akun Anda' }}
            </p>
          </div>

          <div class="mb-7">
            <div class="flex gap-3 justify-center">
              <div
                v-for="i in 6"
                :key="i"
                class="w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-colors"
                :class="(confirmingPin ? confirmPin : pinValue).length >= i ? 'border-primary-500 bg-primary-50' : 'border-slate-200'"
              >
                <div v-if="(confirmingPin ? confirmPin : pinValue).length >= i" class="w-3 h-3 bg-brand-gradient rounded-full"></div>
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
              class="h-14 rounded-xl font-semibold text-lg text-slate-700 transition-all"
              :class="key === '' ? 'invisible' : 'bg-primary-50 hover:bg-primary-100 active:bg-primary-200 hover:-translate-y-0.5'"
            >
              <span v-if="key === 'del'">
                <svg class="w-5 h-5 mx-auto text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
                </svg>
              </span>
              <span v-else>{{ key }}</span>
            </button>
          </div>

          <p v-if="loading" class="text-center text-sm text-primary-600 mt-4">Membuat akun...</p>
        </div>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'guest', layout: false })

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const { post } = useApi()

// Kode promo/referral bila datang dari link /promo/[kode]
const refCode = ref((route.query.ref as string) || '')

const step = ref(1)
const phone = ref('')
const agreedToTerms = ref(false)
const phoneError = ref('')
const otpDigits = ref(['', '', '', '', '', ''])
const otpRefs = ref<HTMLInputElement[]>([])
const otpError = ref('')
const pinValue = ref('')
const confirmPin = ref('')
const pinError = ref('')
const confirmingPin = ref(false)
const loading = ref(false)
const resendCooldown = ref(0)
const storedOtp = ref('')

const otpFilled = computed(() => otpDigits.value.filter(d => d !== '').join(''))
const pinKeypad = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del']

const onOtpInput = (idx: number) => {
  const val = otpDigits.value[idx]
  otpDigits.value[idx] = val.replace(/\D/g, '').slice(0, 1)
  if (otpDigits.value[idx] && idx < 5) {
    otpRefs.value[idx + 1]?.focus()
  }
}

const onOtpBackspace = (idx: number) => {
  if (!otpDigits.value[idx] && idx > 0) {
    otpDigits.value[idx - 1] = ''
    otpRefs.value[idx - 1]?.focus()
  }
}

const onPinKey = (key: string) => {
  const current = confirmingPin.value ? confirmPin : pinValue
  if (key === 'del') {
    current.value = current.value.slice(0, -1)
  } else if (current.value.length < 6) {
    current.value += key
    if (current.value.length === 6) {
      if (!confirmingPin.value) {
        confirmingPin.value = true
      } else {
        doRegister()
      }
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
    phoneError.value = e?.data?.message || 'Gagal mengirim OTP'
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
    storedOtp.value = otp
    step.value = 3
  } catch (e: any) {
    otpError.value = e?.data?.message || 'Kode OTP salah'
  } finally {
    loading.value = false
  }
}

const doRegister = async () => {
  pinError.value = ''
  if (pinValue.value !== confirmPin.value) {
    pinError.value = 'PIN tidak cocok. Ulangi lagi.'
    confirmPin.value = ''
    confirmingPin.value = false
    return
  }
  loading.value = true
  try {
    await authStore.register(phone.value, storedOtp.value, pinValue.value)
    // Jika datang dari link promo, catat pendaftaran event (abaikan bila gagal)
    if (refCode.value) {
      try { await post('/events/register', { code: refCode.value }) } catch { /* non-blocking */ }
    }
    router.push('/dashboard')
  } catch (e: any) {
    pinError.value = e?.data?.message || 'Gagal membuat akun'
    pinValue.value = ''
    confirmPin.value = ''
    confirmingPin.value = false
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
