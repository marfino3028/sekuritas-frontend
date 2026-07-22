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
        <!-- Kamera live -->
        <div v-if="cameraFor === 'ktp'" class="rounded-xl overflow-hidden bg-black">
          <video ref="videoEl" autoplay playsinline class="w-full max-h-72 object-contain bg-black"></video>
          <div class="flex gap-2 p-3 bg-slate-900">
            <button class="flex-1 py-2.5 bg-brand-gradient text-white text-sm font-semibold rounded-lg" @click="capture('ktp')">📸 Ambil Foto</button>
            <button class="px-4 py-2.5 bg-white/10 text-white text-sm rounded-lg" @click="closeCamera">Batal</button>
          </div>
        </div>
        <!-- Preview -->
        <div v-else-if="ktpPreview" class="border-2 border-primary-400 bg-primary-50 rounded-xl p-4 text-center">
          <img :src="ktpPreview" class="max-h-48 mx-auto rounded-lg" alt="KTP" />
          <button class="mt-2 text-xs text-slate-500 hover:text-slate-700" @click="ktpFile = null; ktpPreview = ''">Ganti foto</button>
        </div>
        <!-- Pilihan: Upload / Kamera -->
        <div v-else class="grid grid-cols-2 gap-3">
          <button class="flex flex-col items-center gap-2 py-6 border-2 border-dashed border-slate-300 rounded-xl hover:border-primary-400 transition" @click="ktpInput?.click()">
            <svg class="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M4 20h16a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            <span class="text-sm font-semibold text-slate-700">Upload File</span>
          </button>
          <button class="flex flex-col items-center gap-2 py-6 border-2 border-dashed border-slate-300 rounded-xl hover:border-primary-400 transition" @click="openCamera('ktp', 'environment')">
            <svg class="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <span class="text-sm font-semibold text-slate-700">Buka Kamera</span>
          </button>
          <input ref="ktpInput" type="file" accept="image/*" class="hidden" @change="onFile($event, 'ktp')" />
        </div>
        <p v-if="ocrScanning" class="mt-3 text-sm text-primary-600 flex items-center gap-2">
          <span class="inline-block w-3 h-3 border-2 border-primary-300 border-t-primary-600 rounded-full animate-spin"></span>
          Membaca KTP (OCR on-device)…
        </p>
        <div v-if="localOcr && (localOcr.nik || localOcr.name)" class="mt-4 text-sm bg-primary-50 rounded-xl p-4">
          <p class="font-semibold text-primary-700 mb-2">Data terbaca otomatis</p>
          <div class="grid grid-cols-2 gap-x-3 gap-y-1 text-primary-700">
            <span class="text-primary-400">NIK</span><b>{{ localOcr.nik || '—' }}</b>
            <span class="text-primary-400">Nama</span><b>{{ localOcr.name || '—' }}</b>
            <span class="text-primary-400">TTL</span><b>{{ [localOcr.birth_place, localOcr.birth_date].filter(Boolean).join(', ') || '—' }}</b>
            <span class="text-primary-400">Kelamin</span><b>{{ localOcr.gender === 'F' ? 'Perempuan' : localOcr.gender === 'M' ? 'Laki-laki' : '—' }}</b>
            <span class="text-primary-400">Alamat</span><b>{{ localOcr.address || '—' }}</b>
            <span class="text-primary-400">RT/RW</span><b>{{ localOcr.rt_rw || '—' }}</b>
            <span class="text-primary-400">Kel/Kec</span><b>{{ [localOcr.village, localOcr.district].filter(Boolean).join(' / ') || '—' }}</b>
            <span class="text-primary-400">Agama</span><b>{{ localOcr.religion || '—' }}</b>
            <span class="text-primary-400">Status</span><b>{{ localOcr.marital_status || '—' }}</b>
            <span class="text-primary-400">Pekerjaan</span><b>{{ localOcr.occupation || '—' }}</b>
          </div>
          <p class="text-xs text-primary-400 mt-2">Diproses gratis di perangkat Anda (Tesseract). Data otomatis mengisi form berikutnya — bisa dikoreksi.</p>
        </div>
        <div v-if="ocrResult" class="mt-3 text-sm bg-slate-50 rounded-xl p-4">
          <p class="text-slate-500">OCR server ({{ ocrResult.engine || ocrResult.raw_ocr?.engine || 'stub' }}) — Confidence: <b>{{ ocrResult.ocr_confidence }}%</b></p>
        </div>
        <div v-if="dukcapil" class="mt-3 text-sm rounded-xl p-4 flex items-center gap-2"
             :class="dukcapil.verified ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'">
          <svg v-if="dukcapil.verified" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <span>Dukcapil: <b>{{ dukcapil.verified ? 'NIK terverifikasi' : 'Belum terverifikasi' }}</b> <span class="text-xs opacity-70">({{ dukcapil.source }})</span> — {{ dukcapil.message }}</span>
        </div>
      </div>

      <!-- Step 2: Selfie -->
      <div v-else-if="step === 2">
        <h2 class="text-xl font-display font-extrabold text-slate-800 mb-1">Selfie (Liveness)</h2>
        <p class="text-sm text-slate-500 mb-5">Ambil foto wajah Anda menghadap kamera. Digunakan untuk deteksi wajah asli & pencocokan dengan KTP.</p>
        <!-- Kamera live -->
        <div v-if="cameraFor === 'selfie'" class="rounded-xl overflow-hidden bg-black">
          <video ref="videoEl" autoplay playsinline class="w-full max-h-72 object-contain bg-black" style="transform: scaleX(-1)"></video>
          <div class="flex gap-2 p-3 bg-slate-900">
            <button class="flex-1 py-2.5 bg-brand-gradient text-white text-sm font-semibold rounded-lg" @click="capture('selfie')">📸 Ambil Foto</button>
            <button class="px-4 py-2.5 bg-white/10 text-white text-sm rounded-lg" @click="closeCamera">Batal</button>
          </div>
        </div>
        <div v-else-if="selfiePreview" class="border-2 border-primary-400 bg-primary-50 rounded-xl p-4 text-center">
          <img :src="selfiePreview" class="max-h-48 mx-auto rounded-lg" alt="Selfie" />
          <button class="mt-2 text-xs text-slate-500 hover:text-slate-700" @click="selfieFile = null; selfiePreview = ''">Ganti foto</button>
        </div>
        <div v-else class="grid grid-cols-2 gap-3">
          <button class="flex flex-col items-center gap-2 py-6 border-2 border-dashed border-slate-300 rounded-xl hover:border-primary-400 transition" @click="selfieInput?.click()">
            <svg class="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M4 20h16a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            <span class="text-sm font-semibold text-slate-700">Upload File</span>
          </button>
          <button class="flex flex-col items-center gap-2 py-6 border-2 border-dashed border-slate-300 rounded-xl hover:border-primary-400 transition" @click="openCamera('selfie', 'user')">
            <svg class="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <span class="text-sm font-semibold text-slate-700">Buka Kamera</span>
          </button>
          <input ref="selfieInput" type="file" accept="image/*" class="hidden" @change="onFile($event, 'selfie')" />
        </div>
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
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'

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
const dukcapil = ref<any>(null)

// Gabungkan hasil OCR server (PaddleOCR) ke penyimpanan untuk auto-isi form.
function mergeServerOcr(doc: any) {
  if (!doc) return
  const norm = (g: any) => {
    const u = String(g || '').toUpperCase()
    if (u.includes('PEREMPUAN') || u === 'F') return 'F'
    if (u.includes('LAKI') || u === 'M') return 'M'
    return null
  }
  const prev = (() => { try { return JSON.parse(localStorage.getItem('ktp_ocr') || '{}') } catch { return {} } })()
  const server = {
    nik: doc.nik, name: doc.name, birth_place: doc.birth_place, birth_date: doc.birth_date,
    gender: norm(doc.gender), address: doc.address, religion: doc.religion,
    marital_status: doc.marital_status, occupation: doc.occupation,
  }
  // server non-null menimpa hasil on-device
  const merged: any = { ...prev }
  for (const [k, v] of Object.entries(server)) if (v) merged[k] = v
  if (process.client) localStorage.setItem('ktp_ocr', JSON.stringify(merged))
  localOcr.value = merged
}

const canvasEl = ref<HTMLCanvasElement | null>(null)
let signaturePad: any = null   // instance signature_pad (szimek)
const hasSignature = ref(false)

// --- Upload / Kamera ---
const ktpInput = ref<HTMLInputElement | null>(null)
const selfieInput = ref<HTMLInputElement | null>(null)
const videoEl = ref<HTMLVideoElement | null>(null)
const cameraFor = ref<'ktp' | 'selfie' | null>(null)
let mediaStream: MediaStream | null = null

async function openCamera(which: 'ktp' | 'selfie', facing: 'environment' | 'user') {
  error.value = ''
  cameraFor.value = which
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: facing }, audio: false })
    await nextTick()
    if (videoEl.value) { videoEl.value.srcObject = mediaStream; await videoEl.value.play() }
  } catch (e: any) {
    cameraFor.value = null
    error.value = 'Tidak bisa akses kamera. Izinkan kamera di browser, atau pakai Upload File.'
  }
}
function closeCamera() {
  mediaStream?.getTracks().forEach((t) => t.stop())
  mediaStream = null
  cameraFor.value = null
}
function capture(which: 'ktp' | 'selfie') {
  const v = videoEl.value
  if (!v) return
  const canvas = document.createElement('canvas')
  canvas.width = v.videoWidth || 1280
  canvas.height = v.videoHeight || 720
  canvas.getContext('2d')!.drawImage(v, 0, 0, canvas.width, canvas.height)
  canvas.toBlob((blob) => {
    if (blob) setImage(new File([blob], `${which}.jpg`, { type: 'image/jpeg' }), which)
    closeCamera()
  }, 'image/jpeg', 0.9)
}

const startSession = async () => {
  error.value = ''
  if (!authStore.token) { router.push('/login'); return }
  try {
    const s = await ekyc.createSession()
    sessionId.value = s.id
  } catch (e: any) {
    const status = e?.response?.status || e?.statusCode
    if (status === 401) {
      error.value = 'Sesi login berakhir. Silakan login ulang.'
      router.push('/login')
    } else {
      error.value = `Gagal memulai sesi eKYC${status ? ' (' + status + ')' : ''}: ${e?.data?.message || e?.message || 'error tidak diketahui'}`
    }
  }
}
onMounted(startSession)
onBeforeUnmount(closeCamera)

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
  if (file) setImage(file, type)
}

function setImage(file: File, type: 'ktp' | 'selfie') {
  const url = URL.createObjectURL(file)
  if (type === 'ktp') {
    ktpFile.value = file; ktpPreview.value = url
    // OCR gratis on-device → simpan SEMUA field untuk auto-isi form data
    ocrScanning.value = true
    localOcr.value = null
    ktpOcr.recognize(file)
      .then((r) => {
        localOcr.value = r
        if (process.client) localStorage.setItem('ktp_ocr', JSON.stringify(r))
      })
      .catch(() => { /* OCR opsional */ })
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
      const res = await ekyc.ocr(sessionId.value, ktpFile.value!, override)
      ocrResult.value = res.ocr
      // Gabungkan hasil OCR SERVER (PaddleOCR bila aktif) — server prioritas untuk auto-isi form
      mergeServerOcr(res.ocr)
      // Verifikasi NIK ke Dukcapil (mock/asli)
      if (ocrResult.value?.nik) {
        try { dukcapil.value = (await ekyc.verifyNik(sessionId.value)).dukcapil } catch { /* opsional */ }
      }
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
