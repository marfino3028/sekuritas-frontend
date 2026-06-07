<template>
  <div class="p-4 lg:p-8 max-w-2xl mx-auto">
    <!-- Hero header (indigo, asimetris, rata-kiri + orb) -->
    <div class="relative overflow-hidden bg-brand-gradient rounded-card shadow-card p-6 lg:p-8 mb-8 text-white">
      <div class="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/10 blur-2xl"></div>
      <div class="absolute -bottom-12 -left-6 w-36 h-36 rounded-full bg-accent-300/20 blur-2xl"></div>
      <div class="relative">
        <span class="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide mb-4">Verifikasi Akun</span>
        <h1 class="text-3xl lg:text-4xl font-display font-extrabold tracking-tight">Verifikasi KYC</h1>
        <p class="text-white/80 text-sm mt-2 max-w-md">Lengkapi data untuk memulai investasi</p>
      </div>
    </div>

    <!-- Progress -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-2">
        <span class="inline-flex items-center rounded-full bg-primary-50 text-primary-700 px-3 py-1 text-xs font-semibold">Langkah {{ currentStep }} dari {{ totalSteps }}</span>
        <span class="text-sm font-extrabold text-primary-600">{{ progressPercent }}%</span>
      </div>
      <div class="w-full bg-slate-100 rounded-full h-2.5">
        <div
          class="bg-brand-gradient h-2.5 rounded-full transition-all duration-500"
          :style="{ width: progressPercent + '%' }"
        ></div>
      </div>
      <!-- Step labels -->
      <div class="flex justify-between mt-3">
        <div
          v-for="(step, i) in steps"
          :key="i"
          class="flex flex-col items-center"
          :style="{ width: (100 / totalSteps) + '%' }"
        >
          <div
            class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
            :class="{
              'bg-primary-600 text-white': currentStep > i + 1,
              'bg-primary-600 text-white ring-4 ring-primary-100': currentStep === i + 1,
              'bg-slate-100 text-slate-400': currentStep < i + 1,
            }"
          >
            <svg v-if="currentStep > i + 1" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
            </svg>
            <span v-else>{{ i + 1 }}</span>
          </div>
          <span class="text-xs text-slate-500 text-center mt-1.5 hidden sm:block">{{ step.shortLabel }}</span>
        </div>
      </div>
    </div>

    <!-- Step content card -->
    <div class="bg-white rounded-card border border-slate-100 shadow-card overflow-hidden">
      <!-- Step 1: Risk Profile -->
      <div v-if="currentStep === 1" class="p-6 lg:p-8">
        <h2 class="text-xl font-display font-extrabold tracking-tight text-slate-800 mb-1">Profil Risiko</h2>
        <p class="text-sm text-slate-500 mb-6">Jawab pertanyaan berikut untuk menentukan profil risiko investasi Anda</p>

        <div class="space-y-6">
          <div v-for="(q, qi) in riskQuestions" :key="qi">
            <p class="text-sm font-semibold text-slate-800 mb-3">{{ qi + 1 }}. {{ q.question }}</p>
            <div class="space-y-2.5">
              <label
                v-for="(opt, oi) in q.options"
                :key="oi"
                class="flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all"
                :class="riskAnswers[qi] === oi ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-200' : 'border-slate-200 hover:border-primary-300 hover:bg-slate-50'"
              >
                <input
                  type="radio"
                  :name="'q' + qi"
                  :value="oi"
                  v-model="riskAnswers[qi]"
                  class="mt-0.5 text-primary-600 focus:ring-primary-500"
                />
                <span class="text-sm text-slate-700">{{ opt }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 2: KTP Photo -->
      <div v-else-if="currentStep === 2" class="p-6 lg:p-8">
        <h2 class="text-xl font-display font-extrabold tracking-tight text-slate-800 mb-1">Foto KTP</h2>
        <p class="text-sm text-slate-500 mb-6">Upload foto KTP Anda dengan jelas dan tidak buram</p>

        <div class="bg-primary-50 border border-primary-100 rounded-xl p-4 mb-6">
          <p class="text-sm font-semibold text-primary-800 mb-2">Panduan Foto KTP:</p>
          <ul class="space-y-1">
            <li v-for="tip in ktpTips" :key="tip" class="flex items-start gap-2 text-sm text-primary-700">
              <svg class="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              {{ tip }}
            </li>
          </ul>
        </div>

        <div
          class="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all"
          :class="ktpFile ? 'border-primary-400 bg-primary-50' : 'border-slate-300 hover:border-primary-400 hover:bg-slate-50'"
          @click="$refs.ktpInput.click()"
          @dragover.prevent
          @drop.prevent="handleFileDrop($event, 'ktp')"
        >
          <div v-if="ktpPreview">
            <img :src="ktpPreview" class="max-h-48 mx-auto rounded-lg" alt="KTP Preview" />
            <p class="text-sm text-primary-700 font-medium mt-2">{{ ktpFile?.name }}</p>
          </div>
          <div v-else>
            <svg class="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p class="text-sm font-medium text-slate-600">Klik atau drag foto KTP di sini</p>
            <p class="text-xs text-slate-400 mt-1">JPG, PNG, max 5MB</p>
          </div>
        </div>
        <input ref="ktpInput" type="file" accept="image/*" class="hidden" @change="handleFileChange($event, 'ktp')" />
      </div>

      <!-- Step 3: Selfie -->
      <div v-else-if="currentStep === 3" class="p-6 lg:p-8">
        <h2 class="text-xl font-display font-extrabold tracking-tight text-slate-800 mb-1">Foto Selfie dengan KTP</h2>
        <p class="text-sm text-slate-500 mb-6">Upload foto selfie Anda sambil memegang KTP</p>

        <div class="bg-accent-50 border border-accent-100 rounded-xl p-4 mb-6">
          <p class="text-sm font-semibold text-accent-800 mb-2">Panduan Foto Selfie:</p>
          <ul class="space-y-1">
            <li v-for="tip in selfieTips" :key="tip" class="flex items-start gap-2 text-sm text-accent-700">
              <svg class="w-4 h-4 text-accent-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              {{ tip }}
            </li>
          </ul>
        </div>

        <div
          class="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all"
          :class="selfieFile ? 'border-primary-400 bg-primary-50' : 'border-slate-300 hover:border-primary-400 hover:bg-slate-50'"
          @click="$refs.selfieInput.click()"
        >
          <div v-if="selfiePreview">
            <img :src="selfiePreview" class="max-h-48 mx-auto rounded-lg" alt="Selfie Preview" />
            <p class="text-sm text-primary-700 font-medium mt-2">{{ selfieFile?.name }}</p>
          </div>
          <div v-else>
            <svg class="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p class="text-sm font-medium text-slate-600">Klik atau drag foto selfie di sini</p>
            <p class="text-xs text-slate-400 mt-1">JPG, PNG, max 5MB</p>
          </div>
        </div>
        <input ref="selfieInput" type="file" accept="image/*" class="hidden" @change="handleFileChange($event, 'selfie')" />
      </div>

      <!-- Step 4: Personal Data -->
      <div v-else-if="currentStep === 4" class="p-6 lg:p-8">
        <h2 class="text-xl font-display font-extrabold tracking-tight text-slate-800 mb-1">Data Pribadi</h2>
        <p class="text-sm text-slate-500 mb-6">Lengkapi data pribadi sesuai KTP Anda</p>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Nomor KTP (NIK)</label>
            <input
              v-model="personalData.nik"
              type="text"
              inputmode="numeric"
              maxlength="16"
              placeholder="16 digit NIK"
              class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Nama Gadis Ibu Kandung</label>
            <input
              v-model="personalData.mother_name"
              type="text"
              placeholder="Nama gadis ibu kandung"
              class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Tanggal Lahir</label>
            <input
              v-model="personalData.birth_date"
              type="date"
              class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Jenis Kelamin</label>
            <div class="flex gap-3">
              <label
                v-for="g in genderOptions"
                :key="g.value"
                class="flex-1 flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all"
                :class="personalData.gender === g.value ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-200' : 'border-slate-200 hover:border-primary-300'"
              >
                <input type="radio" :value="g.value" v-model="personalData.gender" class="text-primary-600 focus:ring-primary-500" />
                <span class="text-sm text-slate-700">{{ g.label }}</span>
              </label>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Status Pernikahan</label>
            <select
              v-model="personalData.marital_status"
              class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            >
              <option value="">Pilih status</option>
              <option value="single">Belum Menikah</option>
              <option value="married">Menikah</option>
              <option value="divorced">Cerai Hidup</option>
              <option value="widowed">Cerai Mati</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Pendidikan Terakhir</label>
            <select
              v-model="personalData.education"
              class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            >
              <option value="">Pilih pendidikan</option>
              <option value="sd">SD</option>
              <option value="smp">SMP</option>
              <option value="sma">SMA/SMK</option>
              <option value="d3">D3</option>
              <option value="s1">S1</option>
              <option value="s2">S2</option>
              <option value="s3">S3</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Step 5: Bank Data -->
      <div v-else-if="currentStep === 5" class="p-6 lg:p-8">
        <h2 class="text-xl font-display font-extrabold tracking-tight text-slate-800 mb-1">Data Rekening Bank</h2>
        <p class="text-sm text-slate-500 mb-6">Rekening ini digunakan untuk pencairan dana investasi</p>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Nama Bank</label>
            <select
              v-model="bankData.bank_name"
              class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            >
              <option value="">Pilih bank</option>
              <option v-for="bank in bankList" :key="bank" :value="bank">{{ bank }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Nomor Rekening</label>
            <input
              v-model="bankData.account_number"
              type="text"
              inputmode="numeric"
              placeholder="Nomor rekening"
              class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Nama Pemilik Rekening</label>
            <input
              v-model="bankData.account_name"
              type="text"
              placeholder="Nama sesuai rekening bank"
              class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <!-- Signature upload -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Tanda Tangan</label>
            <p class="text-xs text-slate-500 mb-3">Upload foto tanda tangan Anda di atas kertas putih polos</p>
            <div
              class="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all"
              :class="signatureFile ? 'border-primary-400 bg-primary-50' : 'border-slate-300 hover:border-primary-400 hover:bg-slate-50'"
              @click="$refs.signatureInput.click()"
            >
              <div v-if="signaturePreview">
                <img :src="signaturePreview" class="max-h-24 mx-auto" alt="Signature" />
                <p class="text-sm text-primary-700 font-medium mt-2">{{ signatureFile?.name }}</p>
              </div>
              <div v-else>
                <svg class="w-10 h-10 text-slate-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <p class="text-sm font-medium text-slate-600">Upload tanda tangan</p>
              </div>
            </div>
            <input ref="signatureInput" type="file" accept="image/*" class="hidden" @change="handleFileChange($event, 'signature')" />
          </div>
        </div>
      </div>

      <!-- Navigation buttons -->
      <div class="px-6 lg:px-8 py-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
        <button
          v-if="currentStep > 1"
          @click="prevStep"
          class="flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Sebelumnya
        </button>
        <div v-else></div>

        <button
          @click="nextStep"
          :disabled="!canProceed || loading"
          class="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all"
          :class="canProceed && !loading ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-card hover:shadow-card-hover hover:-translate-y-0.5' : 'bg-slate-100 text-slate-400 cursor-not-allowed'"
        >
          <span v-if="loading">Menyimpan...</span>
          <span v-else-if="currentStep === totalSteps">Kirim untuk Verifikasi</span>
          <span v-else>Selanjutnya</span>
          <svg v-if="!loading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { postFormData } = useApi()
const router = useRouter()

const currentStep = ref(1)
const totalSteps = 5
const loading = ref(false)

const progressPercent = computed(() => Math.round((currentStep.value / totalSteps) * 100))

const steps = [
  { shortLabel: 'Profil Risiko' },
  { shortLabel: 'Foto KTP' },
  { shortLabel: 'Foto Selfie' },
  { shortLabel: 'Data Pribadi' },
  { shortLabel: 'Rekening' },
]

// Step 1: Risk profile
const riskAnswers = ref<Record<number, number>>({})
const riskQuestions = [
  {
    question: 'Apa tujuan keuangan utama Anda berinvestasi?',
    options: [
      'Melindungi nilai kekayaan dari inflasi',
      'Mendapatkan pendapatan berkala yang stabil',
      'Pertumbuhan kekayaan jangka menengah (1-3 tahun)',
      'Pertumbuhan kekayaan jangka panjang (>5 tahun)',
      'Memaksimalkan pertumbuhan kekayaan tanpa batas waktu',
    ],
  },
  {
    question: 'Berapa lama rencana investasi Anda?',
    options: ['Kurang dari 1 tahun', '1 - 3 tahun', '3 - 5 tahun', 'Lebih dari 5 tahun'],
  },
  {
    question: 'Bagaimana pengetahuan investasi Anda?',
    options: [
      'Tidak memiliki pengetahuan investasi',
      'Mengenal reksa dana pasar uang',
      'Mengenal reksa dana pendapatan tetap dan campuran',
      'Mengenal reksa dana saham dan instrumen lainnya',
    ],
  },
  {
    question: 'Berapa persen aset Anda yang dialokasikan untuk investasi?',
    options: ['< 25%', '25% - 50%', '50% - 75%', '> 75%'],
  },
  {
    question: 'Jika investasi Anda turun 20% dalam 1 bulan, apa yang Anda lakukan?',
    options: [
      'Tarik semua dana segera',
      'Tarik sebagian dana',
      'Tahan dan tunggu pemulihan',
      'Tambah investasi untuk rata-rata harga',
    ],
  },
]

// Step 2: KTP
const ktpFile = ref<File | null>(null)
const ktpPreview = ref('')
const ktpTips = [
  'Letakkan KTP pada permukaan datar dengan pencahayaan cukup',
  'Pastikan semua teks pada KTP terbaca dengan jelas',
  'Hindari pantulan cahaya atau bayangan pada KTP',
  'Foto dalam posisi landscape (horizontal)',
]

// Step 3: Selfie
const selfieFile = ref<File | null>(null)
const selfiePreview = ref('')
const selfieTips = [
  'Pegang KTP di depan dada dengan wajah terlihat jelas',
  'Pastikan wajah dan KTP terlihat jelas dalam satu foto',
  'Gunakan pencahayaan yang cukup, jangan backlight',
  'Tidak menggunakan kacamata gelap atau topi',
]

// Step 4: Personal data
const personalData = reactive({
  nik: '',
  mother_name: '',
  birth_date: '',
  gender: '',
  marital_status: '',
  education: '',
})

const genderOptions = [
  { label: 'Laki-laki', value: 'male' },
  { label: 'Perempuan', value: 'female' },
]

// Step 5: Bank data
const bankData = reactive({
  bank_name: '',
  account_number: '',
  account_name: '',
})
const signatureFile = ref<File | null>(null)
const signaturePreview = ref('')

const bankList = [
  'BCA', 'BNI', 'BRI', 'Bank Mandiri', 'CIMB Niaga', 'Danamon', 'Permata',
  'BTN', 'Bank Syariah Indonesia', 'BNI Syariah', 'BCA Syariah', 'Muamalat',
  'OCBC NISP', 'Maybank', 'Standard Chartered', 'HSBC Indonesia',
]

const canProceed = computed(() => {
  if (currentStep.value === 1) return Object.keys(riskAnswers.value).length === riskQuestions.length
  if (currentStep.value === 2) return !!ktpFile.value
  if (currentStep.value === 3) return !!selfieFile.value
  if (currentStep.value === 4) {
    return !!(personalData.nik && personalData.mother_name && personalData.birth_date
      && personalData.gender && personalData.marital_status && personalData.education)
  }
  if (currentStep.value === 5) {
    return !!(bankData.bank_name && bankData.account_number && bankData.account_name && signatureFile.value)
  }
  return false
})

const handleFileChange = (event: Event, type: string) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  handleFile(file, type)
}

const handleFileDrop = (event: DragEvent, type: string) => {
  const file = event.dataTransfer?.files[0]
  if (!file) return
  handleFile(file, type)
}

const handleFile = (file: File, type: string) => {
  const url = URL.createObjectURL(file)
  if (type === 'ktp') { ktpFile.value = file; ktpPreview.value = url }
  else if (type === 'selfie') { selfieFile.value = file; selfiePreview.value = url }
  else if (type === 'signature') { signatureFile.value = file; signaturePreview.value = url }
}

const nextStep = async () => {
  if (!canProceed.value) return
  if (currentStep.value < totalSteps) {
    currentStep.value++
  } else {
    await submitKyc()
  }
}

const prevStep = () => {
  if (currentStep.value > 1) currentStep.value--
}

const submitKyc = async () => {
  loading.value = true
  try {
    const formData = new FormData()
    formData.append('risk_answers', JSON.stringify(riskAnswers.value))
    if (ktpFile.value) formData.append('ktp_photo', ktpFile.value)
    if (selfieFile.value) formData.append('selfie_photo', selfieFile.value)
    if (signatureFile.value) formData.append('signature', signatureFile.value)
    Object.entries(personalData).forEach(([k, v]) => formData.append(k, v))
    Object.entries(bankData).forEach(([k, v]) => formData.append(k, v))

    await postFormData('/kyc/submit', formData)
    router.push('/dashboard')
  } catch (e: any) {
    alert(e?.data?.message || 'Gagal mengirim data KYC. Coba lagi.')
  } finally {
    loading.value = false
  }
}
</script>
