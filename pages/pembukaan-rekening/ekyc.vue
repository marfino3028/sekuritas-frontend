<template>
  <div class="p-4 lg:p-8 max-w-3xl mx-auto">
    <!-- Hero -->
    <div class="relative overflow-hidden bg-brand-gradient rounded-card shadow-card p-6 lg:p-8 mb-6 text-white">
      <div class="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/10 blur-2xl"></div>
      <div class="relative">
        <span class="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide mb-3">Pembukaan Rekening Online</span>
        <h1 class="text-2xl lg:text-3xl font-display font-extrabold tracking-tight">{{ steps[step - 1] }}</h1>
      </div>
    </div>

    <!-- Stepper -->
    <div class="mb-6">
      <div class="flex justify-between text-[11px]">
        <span v-for="(s, i) in steps" :key="i" class="flex-1 text-center" :class="step >= i + 1 ? 'text-primary-700 font-bold' : 'text-slate-400'">
          <span class="block w-7 h-7 mx-auto mb-1 rounded-full grid place-items-center" :class="step >= i + 1 ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-400'">{{ i + 1 }}</span>
          {{ s }}
        </span>
      </div>
      <div class="w-full bg-slate-100 rounded-full h-1.5 mt-3"><div class="bg-brand-gradient h-1.5 rounded-full transition-all" :style="{ width: (step / steps.length) * 100 + '%' }"></div></div>
    </div>

    <div class="bg-white rounded-card border border-slate-100 shadow-card p-6 lg:p-8">
      <p v-if="error" class="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">{{ error }}</p>

      <!-- STEP 1: Verifikasi (Foto KTP) -->
      <div v-show="step === 1">
        <h2 class="text-lg font-display font-extrabold text-slate-800 mb-1">Foto e-KTP</h2>
        <p class="text-sm text-slate-500 mb-5">Ambil / unggah foto KTP asli. Data akan terbaca otomatis (OCR) dan mengisi form.</p>
        <div v-if="cameraFor === 'ktp'" class="rounded-xl overflow-hidden bg-black">
          <video ref="videoEl" autoplay playsinline class="w-full max-h-72 bg-black"></video>
          <div class="flex gap-2 p-3 bg-slate-900">
            <button class="flex-1 py-2.5 bg-brand-gradient text-white text-sm font-semibold rounded-lg" @click="capture('ktp')">📸 Ambil Foto</button>
            <button class="px-4 py-2.5 bg-white/10 text-white text-sm rounded-lg" @click="closeCamera">Batal</button>
          </div>
        </div>
        <div v-else-if="ktpPreview" class="border-2 border-primary-400 bg-primary-50 rounded-xl p-4 text-center">
          <img :src="ktpPreview" class="max-h-52 mx-auto rounded-lg" alt="KTP" />
          <button class="mt-2 text-xs text-slate-500" @click="ktpFile = null; ktpPreview = ''">Ganti foto</button>
        </div>
        <div v-else class="grid grid-cols-2 gap-3">
          <button class="flex flex-col items-center gap-2 py-6 border-2 border-dashed border-slate-300 rounded-xl hover:border-primary-400" @click="ktpInput?.click()"><span class="text-2xl">📁</span><span class="text-sm font-semibold text-slate-700">Upload File</span></button>
          <button class="flex flex-col items-center gap-2 py-6 border-2 border-dashed border-slate-300 rounded-xl hover:border-primary-400" @click="openCamera('ktp', 'environment')"><span class="text-2xl">📷</span><span class="text-sm font-semibold text-slate-700">Buka Kamera</span></button>
          <input ref="ktpInput" type="file" accept="image/*" class="hidden" @change="onPick($event, 'ktp')" />
        </div>
        <p v-if="ocrScanning" class="mt-3 text-sm text-primary-600 flex items-center gap-2">
          <span class="inline-block w-3 h-3 border-2 border-primary-300 border-t-primary-600 rounded-full animate-spin"></span> Membaca KTP…
        </p>
        <div v-if="localOcr && (localOcr.nik || localOcr.name)" class="mt-4 text-sm bg-primary-50 rounded-xl p-4">
          <p class="font-semibold text-primary-700 mb-2">Data terbaca otomatis</p>
          <div class="grid grid-cols-2 gap-x-3 gap-y-1 text-primary-700">
            <span class="text-primary-400">NIK</span><b>{{ localOcr.nik || '—' }}</b>
            <span class="text-primary-400">Nama</span><b>{{ localOcr.name || '—' }}</b>
            <span class="text-primary-400">TTL</span><b>{{ [localOcr.birth_place, localOcr.birth_date].filter(Boolean).join(', ') || '—' }}</b>
            <span class="text-primary-400">Kelamin</span><b>{{ localOcr.gender === 'F' ? 'Perempuan' : localOcr.gender === 'M' ? 'Laki-laki' : '—' }}</b>
            <span class="text-primary-400">Alamat</span><b>{{ localOcr.address || '—' }}</b>
          </div>
        </div>
        <div v-if="dukcapil" class="mt-3 text-sm rounded-xl p-4 flex items-center gap-2" :class="dukcapil.verified ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'">
          <span>🪪 Verifikasi NIK: <b>{{ dukcapil.verified ? 'Valid' : 'Belum valid' }}</b> <span class="text-xs opacity-70">({{ dukcapil.source }})</span></span>
        </div>
      </div>

      <!-- STEP 2: Data Pribadi -->
      <div v-show="step === 2" class="space-y-4">
        <h2 class="text-lg font-display font-extrabold text-slate-800">Data Pribadi</h2>
        <p class="text-xs text-slate-400 -mt-2">Sebagian terisi otomatis dari KTP — periksa & lengkapi.</p>
        <F label="NIK (16 digit)"><input v-model="f.nik" maxlength="16" class="fld" /></F>
        <F label="Nama Ibu Kandung"><input v-model="f.mother_maiden_name" class="fld" /></F>
        <div class="grid grid-cols-2 gap-3">
          <F label="Tanggal Lahir"><input v-model="f.birth_date" type="date" class="fld" /></F>
          <F label="Jenis Kelamin"><select v-model="f.gender" class="fld"><option value="">Pilih</option><option value="M">Laki-laki</option><option value="F">Perempuan</option></select></F>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <F label="Status Perkawinan"><select v-model="f.marital_status" class="fld"><option value="">Pilih</option><option value="single">Belum Menikah</option><option value="married">Menikah</option><option value="divorced">Cerai</option><option value="widowed">Janda/Duda</option></select></F>
          <F label="Pendidikan"><select v-model="f.education" class="fld"><option value="">Pilih</option><option value="sd">SD</option><option value="smp">SMP</option><option value="sma">SMA</option><option value="diploma">Diploma</option><option value="s1">S1</option><option value="s2">S2</option><option value="s3">S3</option><option value="other">Lainnya</option></select></F>
        </div>
        <F label="Alamat Domisili"><textarea v-model="f.address" rows="2" class="fld"></textarea></F>
        <div class="grid grid-cols-3 gap-3">
          <F label="Provinsi"><input v-model="f.province" class="fld" /></F>
          <F label="Kota"><input v-model="f.city" class="fld" /></F>
          <F label="Kode Pos"><input v-model="f.postal_code" maxlength="10" class="fld" /></F>
        </div>
      </div>

      <!-- STEP 3: Data Pekerjaan -->
      <div v-show="step === 3" class="space-y-4">
        <h2 class="text-lg font-display font-extrabold text-slate-800">Data Pekerjaan</h2>
        <div class="grid grid-cols-2 gap-3">
          <F label="Pekerjaan"><select v-model="f.occupation" class="fld"><option value="">Pilih</option><option value="pns">PNS</option><option value="tni_polri">TNI/Polri</option><option value="karyawan_swasta">Karyawan Swasta</option><option value="wiraswasta">Wiraswasta</option><option value="profesional">Profesional</option><option value="ibu_rumah_tangga">Ibu Rumah Tangga</option><option value="pelajar">Pelajar/Mahasiswa</option><option value="pensiunan">Pensiunan</option><option value="other">Lainnya</option></select></F>
          <F label="Sumber Dana"><select v-model="f.source_of_fund" class="fld"><option value="">Pilih</option><option value="gaji">Gaji</option><option value="usaha">Usaha</option><option value="investasi">Hasil Investasi</option><option value="warisan">Warisan</option><option value="hadiah">Hadiah</option><option value="other">Lainnya</option></select></F>
        </div>
        <F label="Dalam hal ini bertindak sebagai">
          <div class="flex gap-6 text-sm pt-1">
            <label class="flex items-center gap-2"><input type="radio" value="diri_sendiri" v-model="emp.acting_as" /> Diri Sendiri</label>
            <label class="flex items-center gap-2"><input type="radio" value="pihak_lain" v-model="emp.acting_as" /> Pihak lain</label>
          </div>
        </F>
        <div class="grid grid-cols-2 gap-3">
          <F label="Nama Perusahaan"><input v-model="emp.company_name" class="fld" /></F>
          <F label="Jabatan"><input v-model="emp.position" class="fld" /></F>
          <F label="Bidang Usaha"><input v-model="emp.business_field" class="fld" /></F>
          <F label="Lama Bekerja">
            <div class="flex gap-2 items-center"><input v-model.number="emp.work_years" type="number" min="0" class="fld" /><span class="text-sm text-slate-500">th</span><input v-model.number="emp.work_months" type="number" min="0" max="11" class="fld" /><span class="text-sm text-slate-500">bln</span></div>
          </F>
        </div>
        <F label="Pendapatan Kotor Per Tahun"><select v-model="f.income_level" class="fld"><option value="">Pilih</option><option value="below_5jt">&lt; Rp 10 juta</option><option value="5jt_10jt">Rp 10–50 juta</option><option value="10jt_25jt">Rp 50–100 juta</option><option value="25jt_50jt">Rp 100–500 juta</option><option value="above_50jt">&gt; Rp 500 juta</option></select></F>
        <div class="pt-2 border-t border-slate-100">
          <p class="text-sm font-semibold text-primary-700 mb-3">Alamat Kantor</p>
          <div class="grid grid-cols-2 gap-3">
            <F label="Negara"><input v-model="emp.office.country" class="fld" /></F>
            <F label="Kode Pos"><input v-model="emp.office.postal_code" class="fld" /></F>
            <F label="Provinsi"><input v-model="emp.office.province" class="fld" /></F>
            <F label="Kota"><input v-model="emp.office.city" class="fld" /></F>
          </div>
          <F label="Alamat Kantor" class="mt-3"><textarea v-model="emp.office.address" rows="2" class="fld"></textarea></F>
          <div class="grid grid-cols-2 gap-3 mt-3">
            <F label="Telp. Kantor"><input v-model="emp.office.phone" class="fld" /></F>
            <F label="E-mail Kantor"><input v-model="emp.office.email" type="email" class="fld" /></F>
          </div>
        </div>
      </div>

      <!-- STEP 4: Informasi Tambahan -->
      <div v-show="step === 4" class="space-y-5">
        <h2 class="text-lg font-display font-extrabold text-slate-800">Informasi Investasi</h2>
        <div class="grid grid-cols-2 gap-3">
          <F label="Tujuan Investasi"><select v-model="add.investment_objective" class="fld"><option value="">Pilih</option><option value="keuntungan">Keuntungan</option><option value="jangka_panjang">Jangka Panjang</option><option value="penghasilan">Penghasilan</option><option value="spekulasi">Spekulasi</option><option value="lainnya">Lainnya</option></select></F>
          <F label="Pengalaman Investasi"><select v-model="add.investment_experience" class="fld"><option value="">Pilih</option><option value="saham">Saham</option><option value="reksadana">Reksa Dana</option><option value="obligasi">Obligasi</option><option value="belum">Belum ada</option><option value="lainnya">Lainnya</option></select></F>
        </div>
        <div class="pt-2 border-t border-slate-100">
          <p class="text-sm font-semibold text-primary-700 mb-2">Informasi Tambahan</p>
          <div v-for="(q, i) in questions" :key="i" class="flex items-start justify-between gap-3 py-2 border-b border-slate-50 text-sm">
            <span class="text-slate-600 flex-1">{{ i + 1 }}. {{ q }}</span>
            <div class="flex gap-3 shrink-0"><label class="flex items-center gap-1"><input type="radio" :value="true" v-model="add.questions[i]" /> Ya</label><label class="flex items-center gap-1"><input type="radio" :value="false" v-model="add.questions[i]" /> Tidak</label></div>
          </div>
          <F label="Darimana Anda mengetahui Victoria Sekuritas?" class="mt-3"><select v-model="add.know_from" class="fld"><option value="">Pilih</option><option value="keluarga">Keluarga/Teman</option><option value="event">Event</option><option value="medsos">Media Sosial</option><option value="website">Website</option><option value="internet">Internet</option><option value="spm">Sekolah Pasar Modal</option><option value="lainnya">Lainnya</option></select></F>
        </div>
        <div class="pt-2 border-t border-slate-100">
          <p class="text-sm font-semibold text-primary-700 mb-2">FATCA Deklarasi</p>
          <div v-for="(q, i) in fatca" :key="i" class="flex items-start justify-between gap-3 py-2 border-b border-slate-50 text-sm">
            <span class="text-slate-600 flex-1">{{ i + 1 }}. {{ q }}</span>
            <div class="flex gap-3 shrink-0"><label class="flex items-center gap-1"><input type="radio" :value="true" v-model="add.fatca[i]" /> Ya</label><label class="flex items-center gap-1"><input type="radio" :value="false" v-model="add.fatca[i]" /> Tidak</label></div>
          </div>
          <F label="Punya residensi/identitas pajak negara lain?" class="mt-3">
            <div class="flex gap-6 text-sm pt-1"><label class="flex items-center gap-2"><input type="radio" :value="true" v-model="add.tax_other" /> Ya</label><label class="flex items-center gap-2"><input type="radio" :value="false" v-model="add.tax_other" /> Tidak</label></div>
          </F>
        </div>
      </div>

      <!-- STEP 5: Persyaratan & Ketentuan -->
      <div v-show="step === 5" class="space-y-5">
        <h2 class="text-lg font-display font-extrabold text-slate-800">Persyaratan &amp; Ketentuan</h2>
        <div class="rounded-xl border border-slate-200 p-4 max-h-40 overflow-y-auto text-xs text-slate-500 leading-relaxed">
          <p class="font-semibold text-slate-700 mb-1">Persyaratan dan Ketentuan Umum</p>
          Persyaratan dan ketentuan ini mengatur hubungan antara PT Victoria Sekuritas Indonesia dan Nasabah. Nasabah memberi kuasa kepada Victoria Sekuritas untuk bertindak sesuai instruksi yang sah. Pesanan transaksi dilaksanakan apabila Nasabah telah memiliki SID atas namanya, tersedia dana/efek yang cukup, dan dalam batas trading limit. Nasabah wajib membuka Sub Rekening Efek serta RDN sesuai ketentuan KSEI &amp; OJK. Dengan menyetujui, Nasabah menyatakan seluruh data yang diberikan benar.
        </div>
        <label class="flex items-start gap-3 text-sm text-slate-600">
          <input type="checkbox" v-model="agreeTnc" class="mt-0.5 rounded text-primary-600" />
          <span>Saya telah membaca, memahami, dan menyetujui seluruh Syarat &amp; Ketentuan yang berlaku.</span>
        </label>

        <!-- Selfie dengan KTP (liveness + face match) -->
        <div class="pt-2 border-t border-slate-100">
          <p class="text-sm font-semibold text-primary-700 mb-1">Selfie dengan e-KTP</p>
          <p class="text-xs text-slate-400 mb-3">Foto wajah sambil memegang KTP (dagu & KTP terlihat). Digunakan untuk verifikasi wajah.</p>
          <div v-if="cameraFor === 'selfie'" class="rounded-xl overflow-hidden bg-black">
            <video ref="videoEl" autoplay playsinline class="w-full max-h-72 bg-black" style="transform: scaleX(-1)"></video>
            <div class="flex gap-2 p-3 bg-slate-900">
              <button class="flex-1 py-2.5 bg-brand-gradient text-white text-sm font-semibold rounded-lg" @click="capture('selfie')">📸 Ambil Foto</button>
              <button class="px-4 py-2.5 bg-white/10 text-white text-sm rounded-lg" @click="closeCamera">Batal</button>
            </div>
          </div>
          <div v-else-if="selfiePreview" class="border-2 border-primary-400 bg-primary-50 rounded-xl p-4 text-center">
            <img :src="selfiePreview" class="max-h-52 mx-auto rounded-lg" alt="Selfie dengan KTP" />
            <button class="mt-2 text-xs text-slate-500" @click="selfieFile = null; selfiePreview = ''">Ganti foto</button>
          </div>
          <div v-else class="grid grid-cols-2 gap-3">
            <button class="flex flex-col items-center gap-2 py-6 border-2 border-dashed border-slate-300 rounded-xl hover:border-primary-400" @click="selfieInput?.click()"><span class="text-2xl">📁</span><span class="text-sm font-semibold text-slate-700">Upload File</span></button>
            <button class="flex flex-col items-center gap-2 py-6 border-2 border-dashed border-slate-300 rounded-xl hover:border-primary-400" @click="openCamera('selfie', 'user')"><span class="text-2xl">📷</span><span class="text-sm font-semibold text-slate-700">Buka Kamera</span></button>
            <input ref="selfieInput" type="file" accept="image/*" class="hidden" @change="onPick($event, 'selfie')" />
          </div>
          <div v-if="livenessResult" class="mt-2 text-xs text-slate-500">Liveness: <b :class="livenessResult.liveness_passed ? 'text-emerald-600' : 'text-red-500'">{{ livenessResult.liveness_passed ? 'LOLOS' : 'GAGAL' }}</b> · Face: <b>{{ faceResult?.face_match_score ?? '-' }}%</b></div>
        </div>

        <!-- Dokumen -->
        <div class="pt-2 border-t border-slate-100">
          <p class="text-sm font-semibold text-primary-700 mb-3">Foto Dokumen</p>
          <div class="grid grid-cols-2 gap-3">
            <Upload label="Foto NPWP" type="npwp" :done="uploads.npwp" @uploaded="uploads.npwp = true" @err="(m:string)=>error=m" />
            <Upload label="Buku Tabungan / Screenshot m-banking" type="bank_book" :done="uploads.bank_book" @uploaded="uploads.bank_book = true" @err="(m:string)=>error=m" />
          </div>
        </div>

        <!-- Tanda tangan & paraf -->
        <div class="pt-2 border-t border-slate-100">
          <p class="text-sm font-semibold text-primary-700 mb-3">Tanda Tangan &amp; Paraf</p>
          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <p class="text-xs text-slate-500 mb-1.5">Tanda Tangan</p>
              <canvas ref="sigCanvas" class="w-full h-28 border border-slate-300 rounded-xl bg-white touch-none"></canvas>
              <button type="button" class="text-xs text-slate-500 mt-1" @click="clearPad('sig')">Hapus</button>
            </div>
            <div>
              <p class="text-xs text-slate-500 mb-1.5">Paraf</p>
              <canvas ref="parafCanvas" class="w-full h-28 border border-slate-300 rounded-xl bg-white touch-none"></canvas>
              <button type="button" class="text-xs text-slate-500 mt-1" @click="clearPad('paraf')">Hapus</button>
            </div>
          </div>
        </div>
      </div>

      <!-- STEP 6: Hasil -->
      <div v-show="step === 6" class="text-center">
        <div class="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 grid place-items-center mb-4">
          <svg class="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
        </div>
        <h2 class="text-xl font-display font-extrabold text-slate-800 mb-1">Pengajuan Terkirim!</h2>
        <p class="text-sm text-slate-500 mb-2">Data pembukaan rekening Anda sedang diverifikasi tim kami.</p>
        <p v-if="verifyResult" class="text-sm text-slate-500 mb-6">Skor eKYC: <b>{{ verifyResult.final_score }}</b> ({{ verifyResult.decision }})</p>
        <NuxtLink to="/dashboard" class="inline-block px-6 py-3 bg-brand-gradient text-white text-sm font-semibold rounded-xl shadow-card">Ke Dashboard</NuxtLink>
      </div>

      <!-- Actions -->
      <div v-if="step <= 5" class="mt-8 flex justify-between">
        <button v-if="step > 1" class="px-4 py-2.5 text-sm text-slate-500" :disabled="loading" @click="step--">Kembali</button>
        <span v-else></span>
        <button v-if="step < 5" class="px-6 py-2.5 bg-brand-gradient text-white text-sm font-semibold rounded-xl shadow-card disabled:opacity-50" :disabled="!stepValid || loading" @click="nextStep">
          {{ loading ? 'Memproses…' : 'Berikutnya' }}
        </button>
        <button v-else class="px-6 py-2.5 bg-brand-gradient text-white text-sm font-semibold rounded-xl shadow-card disabled:opacity-50" :disabled="loading || !canSubmit" @click="submit">
          {{ loading ? 'Mengirim…' : 'Submit' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'

const ekyc = useEkyc()
const ktpOcr = useKtpOcr()
const { post, postFormData } = useApi()
const authStore = useAuthStore()
const router = useRouter()

const steps = ['Verifikasi', 'Data Pribadi', 'Data Pekerjaan', 'Informasi Tambahan', 'Persyaratan']
const step = ref(1)
const loading = ref(false)
const error = ref('')
const sessionId = ref('')

// KTP + OCR
const ktpFile = ref<File | null>(null)
const ktpPreview = ref('')
const localOcr = ref<any>(null)
const ocrScanning = ref(false)
const ocrResult = ref<any>(null)
const dukcapil = ref<any>(null)

// Selfie dengan KTP
const selfieFile = ref<File | null>(null)
const selfiePreview = ref('')
const livenessResult = ref<any>(null)
const faceResult = ref<any>(null)

// Data
const f = ref({ nik: '', mother_maiden_name: '', birth_date: '', gender: '', marital_status: '', education: '', address: '', province: '', city: '', postal_code: '', occupation: '', source_of_fund: '', income_level: '' })
const emp = ref({ acting_as: 'diri_sendiri', company_name: '', position: '', business_field: '', work_years: 0, work_months: 0, office: { country: 'Indonesia', postal_code: '', province: '', city: '', address: '', phone: '', email: '' } })
const add = ref({ investment_objective: '', investment_experience: '', questions: Array(7).fill(false), know_from: '', fatca: Array(4).fill(false), tax_other: false })

const uploads = ref({ npwp: false, bank_book: false })
const agreeTnc = ref(false)

const questions = ['Apakah Anda/Keluarga memiliki rekening efek di Victoria Sekuritas?', 'Hubungan dengan pemegang saham/Komisaris/Direksi/Karyawan Victoria Sekuritas?', 'Pemegang saham pengendali perusahaan yang punya rekening efek di Victoria Sekuritas?', 'Punya kendali atas salah satu rekening efek di Victoria Sekuritas?', 'Memiliki 5% atau lebih saham perusahaan publik?', 'Anda/Keluarga menduduki/dicalonkan posisi publik/politis (PEP)?', 'Data yang diberikan benar dan dapat dipertanggungjawabkan?']
const fatca = ['Saya Warga Negara Amerika Serikat', 'Saya pemegang green card', 'Saya tinggal di Amerika Serikat', 'U.S Indicia lainnya']

// signature pads
const sigCanvas = ref<HTMLCanvasElement | null>(null)
const parafCanvas = ref<HTMLCanvasElement | null>(null)
let sigPad: any = null, parafPad: any = null
const hasSig = ref(false), hasParaf = ref(false)

// camera (state parent)
const cameraFor = ref<'ktp' | 'selfie' | null>(null)
const videoEl = ref<HTMLVideoElement | null>(null)
const ktpInput = ref<HTMLInputElement | null>(null)
const selfieInput = ref<HTMLInputElement | null>(null)
let mediaStream: MediaStream | null = null

function onPick(e: Event, type: 'ktp' | 'selfie') {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) setImage(file, type)
}
async function openCamera(which: 'ktp' | 'selfie', facing: 'environment' | 'user') {
  error.value = ''
  cameraFor.value = which
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: facing }, audio: false })
    await nextTick()
    if (videoEl.value) { videoEl.value.srcObject = mediaStream; await videoEl.value.play() }
  } catch { cameraFor.value = null; error.value = 'Tidak bisa akses kamera. Izinkan kamera atau pakai Upload File.' }
}
function capture(which: 'ktp' | 'selfie') {
  const v = videoEl.value; if (!v) return
  const c = document.createElement('canvas'); c.width = v.videoWidth || 1280; c.height = v.videoHeight || 720
  c.getContext('2d')!.drawImage(v, 0, 0, c.width, c.height)
  c.toBlob((b) => { if (b) setImage(new File([b], `${which}.jpg`, { type: 'image/jpeg' })); closeCamera() }, 'image/jpeg', 0.9)
}
function closeCamera() { mediaStream?.getTracks().forEach((t) => t.stop()); mediaStream = null; cameraFor.value = null }

onMounted(async () => {
  if (!authStore.token) { router.push('/login'); return }
  try { sessionId.value = (await ekyc.createSession()).id }
  catch (e: any) {
    if ((e?.response?.status || e?.statusCode) === 401) { router.push('/login'); return }
    error.value = `Gagal memulai sesi eKYC: ${e?.data?.message || e?.message || 'error'}`
  }
})
onBeforeUnmount(() => closeCamera())

function setImage(file: File, type: 'ktp' | 'selfie') {
  const url = URL.createObjectURL(file)
  if (type === 'ktp') {
    ktpFile.value = file; ktpPreview.value = url; ocrScanning.value = true; localOcr.value = null
    ktpOcr.recognize(file).then((r) => { localOcr.value = r }).catch(() => {}).finally(() => (ocrScanning.value = false))
  } else { selfieFile.value = file; selfiePreview.value = url }
}

function autofill() {
  const o = localOcr.value || {}
  const d = dukcapil.value?.data || {}
  if (o.nik) f.value.nik = o.nik
  if (o.birth_date || d.tgl_lahir) f.value.birth_date = o.birth_date || d.tgl_lahir
  if (o.gender || d.kelamin) f.value.gender = o.gender || (String(d.kelamin).toUpperCase().includes('PEREMPUAN') ? 'F' : 'M')
  if (o.marital_status) f.value.marital_status = o.marital_status
  const parts = [o.address, o.rt_rw ? `RT/RW ${o.rt_rw}` : '', o.village ? `Kel. ${o.village}` : '', o.district || d.kecamatan ? `Kec. ${o.district || d.kecamatan}` : ''].filter(Boolean)
  if (parts.length) f.value.address = parts.join(', ')
  if (d.provinsi) f.value.province = d.provinsi
  if (d.kabupaten) f.value.city = d.kabupaten
  if (d.kode_pos) f.value.postal_code = String(d.kode_pos)
}

const stepValid = computed(() => {
  if (step.value === 1) return !!ktpFile.value
  if (step.value === 2) return f.value.nik.length === 16 && f.value.mother_maiden_name && f.value.birth_date && f.value.gender && f.value.marital_status && f.value.education && f.value.address && f.value.province && f.value.city
  if (step.value === 3) return f.value.occupation && f.value.source_of_fund && f.value.income_level && emp.value.company_name
  if (step.value === 4) return !!add.value.investment_objective && !!add.value.investment_experience && !!add.value.know_from
  return true
})
const canSubmit = computed(() => agreeTnc.value && !!selfieFile.value && hasSig.value && hasParaf.value)

async function nextStep() {
  error.value = ''
  if (step.value === 1) {
    loading.value = true
    try {
      const override: any = {}
      if (localOcr.value?.nik) override.nik = localOcr.value.nik
      if (localOcr.value?.name) override.name = localOcr.value.name
      const res = await ekyc.ocr(sessionId.value, ktpFile.value!, override)
      ocrResult.value = res.ocr
      // gabungkan hasil server (PaddleOCR) → localOcr
      if (res.ocr) {
        const norm = (g: any) => { const u = String(g || '').toUpperCase(); return u.includes('PEREMPUAN') ? 'F' : u.includes('LAKI') ? 'M' : (g || null) }
        for (const k of ['nik', 'name', 'birth_place', 'birth_date', 'address', 'religion', 'marital_status', 'occupation']) if (res.ocr[k]) (localOcr.value ||= {})[k] = res.ocr[k]
        if (res.ocr.gender) localOcr.value.gender = norm(res.ocr.gender)
      }
      if (ocrResult.value?.nik) { try { dukcapil.value = (await ekyc.verifyNik(sessionId.value)).dukcapil } catch {} }
      autofill()
      step.value = 2
    } catch (e: any) { error.value = e?.data?.message || 'Gagal memproses OCR.' } finally { loading.value = false }
  } else { step.value++ }
}

async function submit() {
  error.value = ''
  loading.value = true
  try {
    // 1) Selfie dengan KTP → liveness + face match
    await ekyc.liveness(sessionId.value, selfieFile.value!).then((r) => (livenessResult.value = r.liveness))
    await ekyc.faceMatch(sessionId.value).then((r) => (faceResult.value = r.face_match))
    // 2) tanda tangan & paraf
    await uploadPad('signature', sigPad, 'signature.png')
    await uploadPad('paraf', parafPad, 'paraf.png')
    // 3) hitung skor eKYC
    await ekyc.verify(sessionId.value).then((r) => (verifyResult.value = r.result))
    // 4) submit data lengkap
    const objMap: any = { keuntungan: 'pertumbuhan_aset', jangka_panjang: 'pertumbuhan_aset', penghasilan: 'pendapatan_rutin', spekulasi: 'other', lainnya: 'other' }
    await post('/kyc/submit', { ...f.value, investment_objective: objMap[add.value.investment_objective] || 'other', employment: emp.value, additional_info: add.value })
    step.value = 6
  } catch (e: any) {
    error.value = e?.data?.message || (e?.data?.errors ? Object.values(e.data.errors)[0]?.[0] : '') || 'Gagal submit.'
  } finally { loading.value = false }
}
const verifyResult = ref<any>(null)

// ---- tanda tangan ----
async function setupPads() {
  const { default: SignaturePad } = await import('signature_pad')
  const init = (c: HTMLCanvasElement | null, onEnd: () => void) => {
    if (!c) return null
    const ratio = Math.max(window.devicePixelRatio || 1, 1)
    c.width = c.offsetWidth * ratio; c.height = c.offsetHeight * ratio; c.getContext('2d')!.scale(ratio, ratio)
    const p = new SignaturePad(c, { penColor: '#A40001', minWidth: 1, maxWidth: 2.5 })
    p.addEventListener('endStroke', onEnd); return p
  }
  sigPad = init(sigCanvas.value, () => (hasSig.value = !sigPad.isEmpty()))
  parafPad = init(parafCanvas.value, () => (hasParaf.value = !parafPad.isEmpty()))
}
function clearPad(w: 'sig' | 'paraf') { if (w === 'sig') { sigPad?.clear(); hasSig.value = false } else { parafPad?.clear(); hasParaf.value = false } }
watch(step, (s) => { if (s === 5) requestAnimationFrame(setupPads) })

function dataUrlToFile(u: string, n: string): File {
  const [head, b64] = u.split(','); const mime = head.match(/:(.*?);/)?.[1] || 'image/png'
  const bin = atob(b64); const arr = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i)
  return new File([arr], n, { type: mime })
}
async function uploadPad(type: string, pad: any, name: string) {
  if (!pad || pad.isEmpty()) return
  const fd = new FormData(); fd.append('type', type); fd.append('file', dataUrlToFile(pad.toDataURL('image/png'), name))
  await postFormData('/kyc/upload', fd)
}

// ---- inline components ----
const F = (props: { label: string }, { slots }: any) => h('div', {}, [h('label', { class: 'block text-xs font-semibold text-slate-600 mb-1.5' }, props.label), slots.default?.()])

const Upload = (props: any, { emit }: any) => {
  const onChange = async (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0]; if (!file) return
    const fd = new FormData(); fd.append('type', props.type); fd.append('file', file)
    try { await postFormData('/kyc/upload', fd); emit('uploaded') } catch (err: any) { emit('err', err?.data?.message || 'Gagal upload.') }
  }
  return h('label', { class: `block border-2 border-dashed rounded-xl p-4 text-center cursor-pointer ${props.done ? 'border-primary-400 bg-primary-50' : 'border-slate-300 hover:border-primary-400'}` }, [
    h('p', { class: 'text-sm font-semibold text-slate-700' }, props.label),
    h('p', { class: `text-xs mt-1 ${props.done ? 'text-primary-600' : 'text-slate-400'}` }, props.done ? '✓ Terunggah' : 'Klik ambil/pilih foto'),
    h('input', { type: 'file', accept: 'image/*', class: 'hidden', onChange }),
  ])
}
Upload.props = ['label', 'type', 'done']
Upload.emits = ['uploaded', 'err']

useHead({ title: 'Pembukaan Rekening — Victoria Sekuritas' })
</script>

<style scoped>
.fld { @apply w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400; }
</style>
