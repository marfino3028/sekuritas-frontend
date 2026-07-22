<template>
  <div class="p-4 lg:p-8 max-w-2xl mx-auto">
    <!-- Hero -->
    <div class="relative overflow-hidden bg-brand-gradient rounded-card shadow-card p-6 lg:p-8 mb-8 text-white">
      <div class="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/10 blur-2xl"></div>
      <div class="relative">
        <span class="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide mb-4">eKYC Otomatis</span>
        <h1 class="text-3xl lg:text-4xl font-display font-extrabold tracking-tight">Verifikasi Identitas</h1>
        <p class="text-white/80 text-sm mt-2 max-w-md">Scan KTP, selfie, dan tanda tangan digital — diverifikasi otomatis dalam hitungan detik.</p>
      </div>
    </div>

    <!-- Progress -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-2">
        <span class="inline-flex items-center rounded-full bg-primary-50 text-primary-700 px-3 py-1 text-xs font-semibold">Langkah {{ step }} dari 5</span>
        <span class="text-sm font-extrabold text-primary-600">{{ Math.round((step / 5) * 100) }}%</span>
      </div>
      <div class="w-full bg-slate-100 rounded-full h-2.5">
        <div class="bg-brand-gradient h-2.5 rounded-full transition-all duration-500" :style="{ width: (step / 5) * 100 + '%' }"></div>
      </div>
    </div>

    <div class="bg-white rounded-card border border-slate-100 shadow-card p-6 lg:p-8">
      <p v-if="error" class="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">{{ error }}</p>

      <!-- Step 1: KTP -->
      <div v-if="step === 1">
        <h2 class="text-xl font-display font-extrabold text-slate-800 mb-1">Foto e-KTP</h2>
        <p class="text-sm text-slate-500 mb-5">Ambil foto KTP asli dengan jelas. Sistem akan membaca data secara otomatis (OCR).</p>
        <label class="block border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition"
               :class="ktpFile ? 'border-primary-400 bg-primary-50' : 'border-slate-300 hover:border-primary-400'">
          <img v-if="ktpPreview" :src="ktpPreview" class="max-h-48 mx-auto rounded-lg" alt="KTP" />
          <p v-else class="text-sm text-slate-600">Klik untuk ambil / pilih foto KTP</p>
          <input type="file" accept="image/*" capture="environment" class="hidden" @change="onFile($event, 'ktp')" />
        </label>
        <p v-if="ocrScanning" class="mt-3 text-sm text-primary-600 flex items-center gap-2">
          <span class="inline-block w-3 h-3 border-2 border-primary-300 border-t-primary-600 rounded-full animate-spin"></span>
          Membaca KTP (OCR on-device)…
        </p>
        <div v-if="localOcr && (localOcr.nik || localOcr.name)" class="mt-4 text-sm bg-primary-50 rounded-xl p-4">
          <p class="font-semibold text-primary-700 mb-1">Data terbaca otomatis</p>
          <p class="text-primary-600">NIK: <b>{{ localOcr.nik || '—' }}</b> · Nama: <b>{{ localOcr.name || '—' }}</b></p>
          <p class="text-xs text-primary-400 mt-1">Diproses gratis di perangkat Anda (Tesseract). Bisa dikoreksi di langkah berikutnya.</p>
        </div>
        <div v-if="ocrResult" class="mt-3 text-sm bg-slate-50 rounded-xl p-4">
          <p class="text-slate-500">Verifikasi server — Confidence: <b>{{ ocrResult.ocr_confidence }}%</b></p>
        </div>
      </div>

      <!-- Step 2: Selfie -->
      <div v-else-if="step === 2">
        <h2 class="text-xl font-display font-extrabold text-slate-800 mb-1">Selfie (Liveness)</h2>
        <p class="text-sm text-slate-500 mb-5">Ambil foto wajah Anda menghadap kamera. Digunakan untuk deteksi wajah asli & pencocokan dengan KTP.</p>
        <label class="block border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition"
               :class="selfieFile ? 'border-primary-400 bg-primary-50' : 'border-slate-300 hover:border-primary-400'">
          <img v-if="selfiePreview" :src="selfiePreview" class="max-h-48 mx-auto rounded-lg" alt="Selfie" />
          <p v-else class="text-sm text-slate-600">Klik untuk ambil selfie</p>
          <input type="file" accept="image/*" capture="user" class="hidden" @change="onFile($event, 'selfie')" />
        </label>
        <div v-if="livenessResult" class="mt-4 text-sm bg-slate-50 rounded-xl p-4">
          <p class="text-slate-500">Liveness: <b :class="livenessResult.liveness_passed ? 'text-emerald-600' : 'text-red-500'">{{ livenessResult.liveness_passed ? 'LOLOS' : 'GAGAL' }}</b> ({{ livenessResult.liveness_score }}%)</p>
          <p v-if="faceResult" class="text-slate-500 mt-1">Face Match: <b :class="faceResult.face_matched ? 'text-emerald-600' : 'text-red-500'">{{ faceResult.face_match_score }}%</b></p>
        </div>
      </div>

      <!-- Step 3: konfirmasi cocok -->
      <div v-else-if="step === 3">
        <h2 class="text-xl font-display font-extrabold text-slate-800 mb-1">Pencocokan Wajah</h2>
        <p class="text-sm text-slate-500 mb-5">Wajah selfie dicocokkan dengan foto pada KTP.</p>
        <div class="rounded-xl p-5 text-center" :class="faceResult?.face_matched ? 'bg-emerald-50' : 'bg-amber-50'">
          <p class="text-3xl font-extrabold" :class="faceResult?.face_matched ? 'text-emerald-600' : 'text-amber-600'">{{ faceResult?.face_match_score ?? 0 }}%</p>
          <p class="text-sm text-slate-500 mt-1">{{ faceResult?.face_matched ? 'Wajah cocok dengan KTP' : 'Kecocokan rendah — mungkin perlu ulang' }}</p>
        </div>
      </div>

      <!-- Step 4: Tanda tangan -->
      <div v-else-if="step === 4">
        <h2 class="text-xl font-display font-extrabold text-slate-800 mb-1">Tanda Tangan Digital</h2>
        <p class="text-sm text-slate-500 mb-5">Bubuhkan tanda tangan sesuai identitas Anda.</p>
        <canvas ref="canvasEl" class="w-full h-48 border border-slate-300 rounded-xl touch-none bg-white"></canvas>
        <button class="mt-2 text-xs text-slate-500 hover:text-slate-700" @click="clearCanvas">Hapus & ulangi</button>
      </div>

      <!-- Step 5: Hasil -->
      <div v-else-if="step === 5">
        <h2 class="text-xl font-display font-extrabold text-slate-800 mb-1">Hasil Verifikasi</h2>
        <div v-if="verifyResult" class="mt-4">
          <div class="rounded-xl p-6 text-center mb-4"
               :class="{ 'bg-emerald-50': verifyResult.decision === 'approved', 'bg-amber-50': verifyResult.decision === 'review', 'bg-red-50': verifyResult.decision === 'rejected' }">
            <p class="text-4xl font-extrabold"
               :class="{ 'text-emerald-600': verifyResult.decision === 'approved', 'text-amber-600': verifyResult.decision === 'review', 'text-red-500': verifyResult.decision === 'rejected' }">
              {{ verifyResult.final_score }}
            </p>
            <p class="text-sm font-semibold mt-1 uppercase tracking-wide"
               :class="{ 'text-emerald-600': verifyResult.decision === 'approved', 'text-amber-600': verifyResult.decision === 'review', 'text-red-500': verifyResult.decision === 'rejected' }">
              {{ decisionLabel }}
            </p>
          </div>
          <div class="grid grid-cols-3 gap-2 text-center text-sm">
            <div class="bg-slate-50 rounded-lg p-3"><p class="text-slate-400 text-xs">OCR</p><b>{{ verifyResult.ocr_score }}</b></div>
            <div class="bg-slate-50 rounded-lg p-3"><p class="text-slate-400 text-xs">Liveness</p><b>{{ verifyResult.liveness_score }}</b></div>
            <div class="bg-slate-50 rounded-lg p-3"><p class="text-slate-400 text-xs">Face</p><b>{{ verifyResult.face_match_score }}</b></div>
          </div>
          <p v-if="verifyResult.flags?.length" class="mt-3 text-xs text-red-500">Catatan: {{ verifyResult.flags.join(', ') }}</p>
        </div>
      </div>

      <!-- Actions -->
      <div class="mt-8 flex justify-between">
        <button v-if="step > 1 && step < 5" class="px-4 py-2.5 text-sm text-slate-500" :disabled="loading" @click="step--">Kembali</button>
        <span v-else></span>
        <button v-if="step < 5"
                class="px-6 py-2.5 bg-brand-gradient text-white text-sm font-semibold rounded-xl shadow-card disabled:opacity-50"
                :disabled="loading || !canNext" @click="next">
          {{ loading ? 'Memproses…' : nextLabel }}
        </button>
        <NuxtLink v-else to="/pembukaan-rekening/data" class="px-6 py-2.5 bg-brand-gradient text-white text-sm font-semibold rounded-xl shadow-card">
          Lanjut: Lengkapi Data
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const ekyc = useEkyc()
const ktpOcr = useKtpOcr()
const authStore = useAuthStore()
const router = useRouter()

const step = ref(1)
const loading = ref(false)
const error = ref('')
const sessionId = ref('')

const ktpFile = ref<File | null>(null)
const ktpPreview = ref('')
const selfieFile = ref<File | null>(null)
const selfiePreview = ref('')
const ocrResult = ref<any>(null)
const localOcr = ref<{ nik: string | null; name: string | null } | null>(null)
const ocrScanning = ref(false)
const livenessResult = ref<any>(null)
const faceResult = ref<any>(null)
const verifyResult = ref<any>(null)

const canvasEl = ref<HTMLCanvasElement | null>(null)
let signaturePad: any = null   // instance signature_pad (szimek)
const hasSignature = ref(false)

onMounted(async () => {
  if (!authStore.token) { router.push('/login'); return }
  try {
    const s = await ekyc.createSession()
    sessionId.value = s.id
  } catch (e: any) {
    error.value = 'Gagal memulai sesi eKYC. Pastikan sudah login.'
  }
})

const canNext = computed(() => {
  if (step.value === 1) return !!ktpFile.value
  if (step.value === 2) return !!selfieFile.value
  if (step.value === 3) return true
  if (step.value === 4) return hasSignature.value
  return true
})

const nextLabel = computed(() => {
  if (step.value === 1) return 'Proses OCR'
  if (step.value === 2) return 'Cek Liveness & Wajah'
  if (step.value === 3) return 'Lanjut'
  if (step.value === 4) return 'Kirim & Verifikasi'
  return 'Lanjut'
})

const decisionLabel = computed(() => ({
  approved: 'Terverifikasi',
  review: 'Menunggu Review',
  rejected: 'Ditolak',
}[verifyResult.value?.decision as string] || ''))

function onFile(e: Event, type: 'ktp' | 'selfie') {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const url = URL.createObjectURL(file)
  if (type === 'ktp') {
    ktpFile.value = file; ktpPreview.value = url
    // OCR gratis on-device (non-blocking) untuk auto-isi NIK & Nama
    ocrScanning.value = true
    localOcr.value = null
    ktpOcr.recognize(file)
      .then((r) => { localOcr.value = { nik: r.nik, name: r.name } })
      .catch(() => { /* OCR opsional; abaikan bila gagal/ dep belum terpasang */ })
      .finally(() => { ocrScanning.value = false })
  } else { selfieFile.value = file; selfiePreview.value = url }
}

async function next() {
  error.value = ''
  loading.value = true
  try {
    if (step.value === 1) {
      const override: Record<string, string> = {}
      if (localOcr.value?.nik) override.nik = localOcr.value.nik
      if (localOcr.value?.name) override.name = localOcr.value.name
      ocrResult.value = (await ekyc.ocr(sessionId.value, ktpFile.value!, override)).ocr
      step.value = 2
    } else if (step.value === 2) {
      const lv = await ekyc.liveness(sessionId.value, selfieFile.value!)
      livenessResult.value = lv.liveness
      const fm = await ekyc.faceMatch(sessionId.value)
      faceResult.value = fm.face_match
      step.value = 3
    } else if (step.value === 3) {
      step.value = 4
      // siapkan canvas pada frame berikutnya
      requestAnimationFrame(setupCanvas)
    } else if (step.value === 4) {
      if (!signaturePad || signaturePad.isEmpty()) {
        error.value = 'Tanda tangan belum dibuat.'
        return
      }
      const dataUrl = signaturePad.toDataURL('image/png')
      await ekyc.sign(sessionId.value, dataUrl)
      const v = await ekyc.verify(sessionId.value)
      verifyResult.value = v.result
      step.value = 5
    }
  } catch (e: any) {
    error.value = e?.data?.message || 'Terjadi kesalahan. Coba lagi.'
  } finally {
    loading.value = false
  }
}

// ---- Tanda tangan digital: signature_pad (github.com/szimek/signature_pad) ----
async function setupCanvas() {
  const c = canvasEl.value
  if (!c) return
  // Skala canvas mengikuti devicePixelRatio agar goresan tajam
  const ratio = Math.max(window.devicePixelRatio || 1, 1)
  c.width = c.offsetWidth * ratio
  c.height = c.offsetHeight * ratio
  c.getContext('2d')!.scale(ratio, ratio)

  const { default: SignaturePad } = await import('signature_pad')
  signaturePad = new SignaturePad(c, { penColor: '#7D0001', minWidth: 1, maxWidth: 2.5 })
  hasSignature.value = false
  signaturePad.addEventListener('endStroke', () => { hasSignature.value = !signaturePad.isEmpty() })
}
function clearCanvas() {
  signaturePad?.clear()
  hasSignature.value = false
}
</script>
