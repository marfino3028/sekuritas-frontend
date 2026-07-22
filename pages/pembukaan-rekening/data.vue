<template>
  <div class="p-4 lg:p-8 max-w-3xl mx-auto">
    <!-- Hero -->
    <div class="relative overflow-hidden bg-brand-gradient rounded-card shadow-card p-6 lg:p-8 mb-6 text-white">
      <div class="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/10 blur-2xl"></div>
      <div class="relative">
        <span class="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide mb-4">Pembukaan Rekening</span>
        <h1 class="text-2xl lg:text-3xl font-display font-extrabold tracking-tight">Lengkapi Data Nasabah</h1>
      </div>
    </div>

    <!-- Stepper -->
    <div class="mb-6">
      <div class="flex justify-between text-xs">
        <span v-for="(s, i) in steps" :key="i" class="flex-1 text-center"
              :class="step >= i + 1 ? 'text-primary-700 font-bold' : 'text-slate-400'">
          <span class="block w-7 h-7 mx-auto mb-1 rounded-full grid place-items-center text-xs"
                :class="step >= i + 1 ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-400'">{{ i + 1 }}</span>
          {{ s }}
        </span>
      </div>
      <div class="w-full bg-slate-100 rounded-full h-1.5 mt-3">
        <div class="bg-brand-gradient h-1.5 rounded-full transition-all" :style="{ width: (step / steps.length) * 100 + '%' }"></div>
      </div>
    </div>

    <div class="bg-white rounded-card border border-slate-100 shadow-card p-6 lg:p-8">
      <p v-if="error" class="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">{{ error }}</p>

      <!-- STEP 1: Data Pribadi -->
      <div v-show="step === 1" class="space-y-4">
        <h2 class="text-lg font-display font-extrabold text-slate-800">Data Pribadi</h2>
        <F label="NIK (16 digit)"><input v-model="f.nik" maxlength="16" class="fld" placeholder="32xxxxxxxxxxxxxx" /></F>
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

      <!-- STEP 2: Data Pekerjaan -->
      <div v-show="step === 2" class="space-y-4">
        <h2 class="text-lg font-display font-extrabold text-slate-800">Data Pekerjaan</h2>
        <div class="grid grid-cols-2 gap-3">
          <F label="Pekerjaan"><select v-model="f.occupation" class="fld"><option value="">Pilih</option><option value="pns">PNS</option><option value="tni_polri">TNI/Polri</option><option value="karyawan_swasta">Karyawan Swasta</option><option value="wiraswasta">Wiraswasta</option><option value="profesional">Profesional</option><option value="ibu_rumah_tangga">Ibu Rumah Tangga</option><option value="pelajar">Pelajar/Mahasiswa</option><option value="pensiunan">Pensiunan</option><option value="other">Lainnya</option></select></F>
          <F label="Sumber Dana"><select v-model="f.source_of_fund" class="fld"><option value="">Pilih</option><option value="gaji">Gaji</option><option value="usaha">Usaha</option><option value="investasi">Hasil Investasi</option><option value="warisan">Warisan</option><option value="hadiah">Hadiah</option><option value="other">Lainnya</option></select></F>
        </div>
        <F label="Dalam hal ini bertindak sebagai">
          <div class="flex gap-6 text-sm pt-1">
            <label class="flex items-center gap-2"><input type="radio" value="diri_sendiri" v-model="emp.acting_as" class="text-primary-600" /> Diri Sendiri</label>
            <label class="flex items-center gap-2"><input type="radio" value="pihak_lain" v-model="emp.acting_as" class="text-primary-600" /> Pihak lain (beneficial owner)</label>
          </div>
        </F>
        <div class="grid grid-cols-2 gap-3">
          <F label="Nama Perusahaan"><input v-model="emp.company_name" class="fld" /></F>
          <F label="Jabatan"><input v-model="emp.position" class="fld" placeholder="mis. Staff / Manager" /></F>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <F label="Bidang Usaha"><input v-model="emp.business_field" class="fld" placeholder="mis. Teknologi Informasi" /></F>
          <F label="Lama Bekerja">
            <div class="flex gap-2 items-center">
              <input v-model.number="emp.work_years" type="number" min="0" class="fld" /> <span class="text-sm text-slate-500">th</span>
              <input v-model.number="emp.work_months" type="number" min="0" max="11" class="fld" /> <span class="text-sm text-slate-500">bln</span>
            </div>
          </F>
        </div>
        <F label="Pendapatan Kotor Per Tahun">
          <select v-model="f.income_level" class="fld"><option value="">Pilih</option><option value="below_5jt">&lt; Rp 10 juta</option><option value="5jt_10jt">Rp 10–50 juta</option><option value="10jt_25jt">Rp 50–100 juta</option><option value="25jt_50jt">Rp 100–500 juta</option><option value="above_50jt">&gt; Rp 500 juta</option></select>
        </F>
        <div class="pt-2 border-t border-slate-100">
          <p class="text-sm font-semibold text-primary-700 mb-3">Alamat Kantor</p>
          <div class="grid grid-cols-2 gap-3">
            <F label="Negara"><input v-model="emp.office.country" class="fld" placeholder="Indonesia" /></F>
            <F label="Kode Pos"><input v-model="emp.office.postal_code" class="fld" /></F>
            <F label="Provinsi"><input v-model="emp.office.province" class="fld" /></F>
            <F label="Kota"><input v-model="emp.office.city" class="fld" /></F>
            <F label="Kecamatan"><input v-model="emp.office.district" class="fld" /></F>
            <F label="Kelurahan"><input v-model="emp.office.subdistrict" class="fld" /></F>
          </div>
          <F label="Alamat (Jalan, Gedung, No.)" class="mt-3"><textarea v-model="emp.office.address" rows="2" class="fld"></textarea></F>
          <div class="grid grid-cols-2 gap-3 mt-3">
            <F label="Telp. Kantor"><input v-model="emp.office.phone" class="fld" placeholder="021xxxxxxx" /></F>
            <F label="E-mail Kantor"><input v-model="emp.office.email" type="email" class="fld" /></F>
          </div>
        </div>
      </div>

      <!-- STEP 3: Informasi Tambahan -->
      <div v-show="step === 3" class="space-y-5">
        <h2 class="text-lg font-display font-extrabold text-slate-800">Informasi Investasi</h2>
        <F label="Tujuan Investasi">
          <select v-model="add.investment_objective" class="fld"><option value="">Pilih</option><option value="keuntungan">Keuntungan</option><option value="jangka_panjang">Investasi Jangka Panjang</option><option value="penghasilan">Penghasilan</option><option value="spekulasi">Spekulasi</option><option value="lainnya">Lainnya</option></select>
        </F>
        <F label="Pengalaman Investasi">
          <select v-model="add.investment_experience" class="fld"><option value="">Pilih</option><option value="saham">Saham</option><option value="reksadana">Reksa Dana</option><option value="obligasi">Obligasi</option><option value="belum">Belum ada pengalaman</option><option value="lainnya">Lainnya</option></select>
        </F>

        <div class="pt-2 border-t border-slate-100">
          <p class="text-sm font-semibold text-primary-700 mb-2">Informasi Tambahan (jawab Ya/Tidak)</p>
          <div v-for="(q, i) in questions" :key="i" class="flex items-start justify-between gap-3 py-2 border-b border-slate-50 text-sm">
            <span class="text-slate-600 flex-1">{{ i + 1 }}. {{ q }}</span>
            <div class="flex gap-3 shrink-0">
              <label class="flex items-center gap-1"><input type="radio" :value="true" v-model="add.questions[i]" /> Ya</label>
              <label class="flex items-center gap-1"><input type="radio" :value="false" v-model="add.questions[i]" /> Tidak</label>
            </div>
          </div>
          <F label="Darimana Anda mengetahui Victoria Sekuritas?" class="mt-3">
            <select v-model="add.know_from" class="fld"><option value="">Pilih</option><option value="keluarga">Keluarga/Teman</option><option value="event">Event</option><option value="medsos">Media Sosial</option><option value="website">Website</option><option value="internet">Internet</option><option value="spm">Sekolah Pasar Modal</option><option value="lainnya">Lainnya</option></select>
          </F>
        </div>

        <div class="pt-2 border-t border-slate-100">
          <p class="text-sm font-semibold text-primary-700 mb-2">FATCA Deklarasi</p>
          <div v-for="(q, i) in fatca" :key="i" class="flex items-start justify-between gap-3 py-2 border-b border-slate-50 text-sm">
            <span class="text-slate-600 flex-1">{{ i + 1 }}. {{ q }}</span>
            <div class="flex gap-3 shrink-0">
              <label class="flex items-center gap-1"><input type="radio" :value="true" v-model="add.fatca[i]" /> Ya</label>
              <label class="flex items-center gap-1"><input type="radio" :value="false" v-model="add.fatca[i]" /> Tidak</label>
            </div>
          </div>
          <F label="Punya identitas pembayar pajak dari negara lain / residensi pajak selain Indonesia?" class="mt-3">
            <div class="flex gap-6 text-sm pt-1">
              <label class="flex items-center gap-2"><input type="radio" :value="true" v-model="add.tax_other" /> Ya</label>
              <label class="flex items-center gap-2"><input type="radio" :value="false" v-model="add.tax_other" /> Tidak</label>
            </div>
          </F>
        </div>
      </div>

      <!-- STEP 4: Persyaratan & Ketentuan -->
      <div v-show="step === 4" class="space-y-5">
        <h2 class="text-lg font-display font-extrabold text-slate-800">Persyaratan &amp; Ketentuan</h2>
        <div class="rounded-xl border border-slate-200 p-4 max-h-40 overflow-y-auto text-xs text-slate-500 leading-relaxed">
          <p class="font-semibold text-slate-700 mb-1">Persyaratan dan Ketentuan Umum</p>
          Persyaratan dan ketentuan ini mengatur hubungan antara PT Victoria Sekuritas Indonesia dan Nasabah. Nasabah memberi kuasa kepada Victoria Sekuritas untuk bertindak sesuai instruksi yang sah. Pesanan transaksi dilaksanakan apabila Nasabah telah memiliki SID atas namanya, tersedia dana/efek yang cukup, dan dalam batas trading limit. Nasabah wajib membuka Sub Rekening Efek serta RDN sesuai ketentuan KSEI & OJK.
        </div>
        <label class="flex items-start gap-3 text-sm text-slate-600">
          <input type="checkbox" v-model="agreeTnc" class="mt-0.5 rounded text-primary-600" />
          <span>Saya telah membaca, memahami, dan menyetujui seluruh <a href="#" class="text-primary-600 font-semibold">Syarat &amp; Ketentuan</a> yang berlaku.</span>
        </label>

        <div class="pt-2 border-t border-slate-100">
          <p class="text-sm font-semibold text-primary-700 mb-3">Pengambilan Foto Dokumen</p>
          <div class="grid grid-cols-2 gap-3">
            <Upload label="Foto NPWP" type="npwp" :done="uploads.npwp" @uploaded="uploads.npwp = true" @err="onUploadErr" />
            <Upload label="Buku Tabungan / Rekening" type="bank_book" :done="uploads.bank_book" @uploaded="uploads.bank_book = true" @err="onUploadErr" />
          </div>
        </div>

        <!-- Tanda Tangan & Paraf -->
        <div class="pt-2 border-t border-slate-100">
          <p class="text-sm font-semibold text-primary-700 mb-3">Tanda Tangan &amp; Paraf</p>
          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <p class="text-xs text-slate-500 mb-1.5">Tanda Tangan</p>
              <canvas ref="sigCanvas" class="w-full h-32 border border-slate-300 rounded-xl bg-white touch-none"></canvas>
              <button type="button" class="text-xs text-slate-500 mt-1" @click="clearPad('sig')">Hapus</button>
            </div>
            <div>
              <p class="text-xs text-slate-500 mb-1.5">Paraf</p>
              <canvas ref="parafCanvas" class="w-full h-32 border border-slate-300 rounded-xl bg-white touch-none"></canvas>
              <button type="button" class="text-xs text-slate-500 mt-1" @click="clearPad('paraf')">Hapus</button>
            </div>
          </div>
          <p class="text-xs text-slate-400 mt-2">*Bubuhkan di tengah kotak. Wajib diisi sebelum submit.</p>
        </div>
      </div>

      <!-- Actions -->
      <div class="mt-8 flex justify-between">
        <button v-if="step > 1" class="px-4 py-2.5 text-sm text-slate-500" :disabled="loading" @click="step--">Kembali</button>
        <span v-else></span>
        <button v-if="step < 4" class="px-6 py-2.5 bg-brand-gradient text-white text-sm font-semibold rounded-xl shadow-card disabled:opacity-50" :disabled="!stepValid" @click="step++">Berikutnya</button>
        <button v-else class="px-6 py-2.5 bg-brand-gradient text-white text-sm font-semibold rounded-xl shadow-card disabled:opacity-50" :disabled="loading || !agreeTnc || !hasSig || !hasParaf" @click="submit">{{ loading ? 'Mengirim…' : 'Submit' }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h, watch } from 'vue'

const { post, postFormData } = useApi()
const authStore = useAuthStore()
const router = useRouter()

// --- Tanda tangan & paraf (signature_pad) ---
const sigCanvas = ref<HTMLCanvasElement | null>(null)
const parafCanvas = ref<HTMLCanvasElement | null>(null)
let sigPad: any = null
let parafPad: any = null
const hasSig = ref(false)
const hasParaf = ref(false)

async function setupPads() {
  const { default: SignaturePad } = await import('signature_pad')
  const init = (canvas: HTMLCanvasElement | null, onEnd: () => void) => {
    if (!canvas) return null
    const ratio = Math.max(window.devicePixelRatio || 1, 1)
    canvas.width = canvas.offsetWidth * ratio
    canvas.height = canvas.offsetHeight * ratio
    canvas.getContext('2d')!.scale(ratio, ratio)
    const pad = new SignaturePad(canvas, { penColor: '#A40001', minWidth: 1, maxWidth: 2.5 })
    pad.addEventListener('endStroke', onEnd)
    return pad
  }
  sigPad = init(sigCanvas.value, () => (hasSig.value = !sigPad.isEmpty()))
  parafPad = init(parafCanvas.value, () => (hasParaf.value = !parafPad.isEmpty()))
}
function clearPad(which: 'sig' | 'paraf') {
  if (which === 'sig') { sigPad?.clear(); hasSig.value = false }
  else { parafPad?.clear(); hasParaf.value = false }
}
watch(step, (s) => { if (s === 4) requestAnimationFrame(setupPads) })

// data URL → File PNG untuk upload
function dataUrlToFile(dataUrl: string, name: string): File {
  const [head, b64] = dataUrl.split(',')
  const mime = head.match(/:(.*?);/)?.[1] || 'image/png'
  const bin = atob(b64)
  const arr = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i)
  return new File([arr], name, { type: mime })
}
async function uploadPad(type: string, pad: any, name: string) {
  if (!pad || pad.isEmpty()) return
  const fd = new FormData()
  fd.append('type', type)
  fd.append('file', dataUrlToFile(pad.toDataURL('image/png'), name))
  await postFormData('/kyc/upload', fd)
}

const steps = ['Data Pribadi', 'Data Pekerjaan', 'Informasi Tambahan', 'Persyaratan']
const step = ref(1)
const loading = ref(false)
const error = ref('')
const agreeTnc = ref(false)
const uploads = ref({ npwp: false, bank_book: false })

const f = ref({
  nik: '', mother_maiden_name: '', birth_date: '', gender: '', marital_status: '',
  education: '', address: '', province: '', city: '', postal_code: '',
  occupation: '', source_of_fund: '', income_level: '',
})
const emp = ref({
  acting_as: 'diri_sendiri', company_name: '', position: '', business_field: '',
  work_years: 0, work_months: 0,
  office: { country: 'Indonesia', postal_code: '', province: '', city: '', district: '', subdistrict: '', address: '', phone: '', email: '' },
})
const add = ref({
  investment_objective: '', investment_experience: '',
  questions: Array(7).fill(false), know_from: '',
  fatca: Array(4).fill(false), tax_other: false,
})

const questions = [
  'Apakah Anda/Keluarga memiliki rekening efek di Victoria Sekuritas?',
  'Apakah Anda memiliki hubungan dengan pemegang saham/Komisaris/Direksi/Karyawan Victoria Sekuritas?',
  'Apakah Anda pemegang saham pengendali dari perusahaan yang memiliki rekening efek di Victoria Sekuritas?',
  'Apakah Anda memiliki kendali terhadap salah satu rekening efek di Victoria Sekuritas?',
  'Apakah Anda memiliki 5% atau lebih saham suatu perusahaan publik?',
  'Apakah Anda/Keluarga menduduki/dicalonkan untuk posisi publik/politis (PEP)?',
  'Apakah data yang Anda berikan benar dan dapat dipertanggungjawabkan?',
]
const fatca = [
  'Saya Warga Negara Amerika Serikat',
  'Saya pemegang green card',
  'Saya tinggal di Amerika Serikat',
  'U.S Indicia lainnya',
]

onMounted(() => {
  if (!authStore.token) { router.push('/login'); return }
  // Auto-isi dari hasil OCR KTP di langkah eKYC
  if (process.client) {
    try {
      const raw = localStorage.getItem('ktp_ocr')
      if (raw) {
        const o = JSON.parse(raw)
        if (o.nik) f.value.nik = o.nik
        if (o.birth_date) f.value.birth_date = o.birth_date
        if (o.gender) f.value.gender = o.gender
        if (o.marital_status) f.value.marital_status = o.marital_status
        // Alamat lengkap: gabung alamat + RT/RW + kel + kecamatan bila ada
        const parts = [o.address, o.rt_rw ? `RT/RW ${o.rt_rw}` : '', o.village ? `Kel. ${o.village}` : '', o.district ? `Kec. ${o.district}` : '']
          .filter(Boolean)
        if (parts.length) f.value.address = parts.join(', ')
      }
    } catch { /* ignore */ }
  }
})

const stepValid = computed(() => {
  if (step.value === 1) return f.value.nik.length === 16 && f.value.mother_maiden_name && f.value.birth_date && f.value.gender && f.value.marital_status && f.value.education && f.value.address && f.value.province && f.value.city
  if (step.value === 2) return f.value.occupation && f.value.source_of_fund && f.value.income_level && emp.value.company_name
  if (step.value === 3) return !!add.value.investment_objective && !!add.value.investment_experience && !!add.value.know_from
  return true
})

// Map tujuan investasi CGS → enum backend
const objectiveMap: Record<string, string> = {
  keuntungan: 'pertumbuhan_aset', jangka_panjang: 'pertumbuhan_aset',
  penghasilan: 'pendapatan_rutin', spekulasi: 'other', lainnya: 'other',
}

const submit = async () => {
  error.value = ''
  loading.value = true
  try {
    // Unggah tanda tangan & paraf dulu
    await uploadPad('signature', sigPad, 'signature.png')
    await uploadPad('paraf', parafPad, 'paraf.png')
    await post('/kyc/submit', {
      ...f.value,
      investment_objective: objectiveMap[add.value.investment_objective] || 'other',
      employment: emp.value,
      additional_info: add.value,
    })
    router.push('/kyc?submitted=1')
  } catch (e: any) {
    error.value = e?.data?.message || (e?.data?.errors ? Object.values(e.data.errors)[0]?.[0] : '') || 'Gagal mengirim data.'
  } finally {
    loading.value = false
  }
}

const onUploadErr = (msg: string) => { error.value = msg }

// --- inline components ---
const F = (props: { label: string }, { slots }: any) =>
  h('div', {}, [h('label', { class: 'block text-xs font-semibold text-slate-600 mb-1.5' }, props.label), slots.default?.()])

const Upload = (props: { label: string; type: string; done: boolean }, { emit }: any) => {
  const onChange = async (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return
    const fd = new FormData()
    fd.append('type', props.type)
    fd.append('file', file)
    try { await postFormData('/kyc/upload', fd); emit('uploaded') }
    catch (err: any) { emit('err', err?.data?.message || 'Gagal upload dokumen.') }
  }
  return h('label', { class: `block border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition ${props.done ? 'border-primary-400 bg-primary-50' : 'border-slate-300 hover:border-primary-400'}` }, [
    h('p', { class: 'text-sm font-semibold text-slate-700' }, props.label),
    h('p', { class: `text-xs mt-1 ${props.done ? 'text-primary-600' : 'text-slate-400'}` }, props.done ? '✓ Terunggah' : 'Klik untuk ambil/pilih foto'),
    h('input', { type: 'file', accept: 'image/*', class: 'hidden', onChange }),
  ])
}
Upload.emits = ['uploaded', 'err']

useHead({ title: 'Lengkapi Data — Victoria Sekuritas' })
</script>

<style scoped>
.fld { @apply w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400; }
</style>
