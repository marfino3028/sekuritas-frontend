<template>
  <div class="p-4 lg:p-8 max-w-2xl mx-auto">
    <!-- Hero -->
    <div class="relative overflow-hidden bg-brand-gradient rounded-card shadow-card p-6 lg:p-8 mb-8 text-white">
      <div class="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/10 blur-2xl"></div>
      <div class="relative">
        <span class="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide mb-4">Pembukaan Rekening</span>
        <h1 class="text-3xl lg:text-4xl font-display font-extrabold tracking-tight">Lengkapi Data</h1>
        <p class="text-white/80 text-sm mt-2 max-w-md">Data Pribadi, Pekerjaan, dan Informasi Tambahan sesuai ketentuan OJK.</p>
      </div>
    </div>

    <!-- Stepper -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-2">
        <span class="inline-flex items-center rounded-full bg-primary-50 text-primary-700 px-3 py-1 text-xs font-semibold">Langkah {{ step }} dari 3</span>
        <span class="text-sm font-extrabold text-primary-600">{{ Math.round((step / 3) * 100) }}%</span>
      </div>
      <div class="w-full bg-slate-100 rounded-full h-2.5">
        <div class="bg-brand-gradient h-2.5 rounded-full transition-all duration-500" :style="{ width: (step / 3) * 100 + '%' }"></div>
      </div>
      <div class="flex justify-between mt-3 text-xs text-slate-500">
        <span :class="step >= 1 ? 'text-primary-700 font-semibold' : ''">Data Pribadi</span>
        <span :class="step >= 2 ? 'text-primary-700 font-semibold' : ''">Data Pekerjaan</span>
        <span :class="step >= 3 ? 'text-primary-700 font-semibold' : ''">Informasi Tambahan</span>
      </div>
    </div>

    <div class="bg-white rounded-card border border-slate-100 shadow-card p-6 lg:p-8">
      <p v-if="error" class="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">{{ error }}</p>

      <!-- Step 1: Data Pribadi -->
      <div v-if="step === 1" class="space-y-4">
        <h2 class="text-lg font-display font-extrabold text-slate-800">Data Pribadi</h2>
        <Field label="NIK (16 digit)"><input v-model="form.nik" maxlength="16" class="fld" placeholder="32xxxxxxxxxxxxxx" /></Field>
        <Field label="Nama Ibu Kandung"><input v-model="form.mother_maiden_name" class="fld" /></Field>
        <div class="grid grid-cols-2 gap-3">
          <Field label="Tanggal Lahir"><input v-model="form.birth_date" type="date" class="fld" /></Field>
          <Field label="Jenis Kelamin">
            <select v-model="form.gender" class="fld"><option value="">Pilih</option><option value="M">Laki-laki</option><option value="F">Perempuan</option></select>
          </Field>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <Field label="Status Perkawinan">
            <select v-model="form.marital_status" class="fld"><option value="">Pilih</option><option value="single">Belum Menikah</option><option value="married">Menikah</option><option value="divorced">Cerai</option><option value="widowed">Janda/Duda</option></select>
          </Field>
          <Field label="Pendidikan">
            <select v-model="form.education" class="fld"><option value="">Pilih</option><option value="sd">SD</option><option value="smp">SMP</option><option value="sma">SMA</option><option value="diploma">Diploma</option><option value="s1">S1</option><option value="s2">S2</option><option value="s3">S3</option><option value="other">Lainnya</option></select>
          </Field>
        </div>
        <Field label="Alamat Domisili"><textarea v-model="form.address" rows="2" class="fld" placeholder="Jl. ..."></textarea></Field>
        <div class="grid grid-cols-3 gap-3">
          <Field label="Provinsi"><input v-model="form.province" class="fld" /></Field>
          <Field label="Kota"><input v-model="form.city" class="fld" /></Field>
          <Field label="Kode Pos"><input v-model="form.postal_code" maxlength="10" class="fld" /></Field>
        </div>
      </div>

      <!-- Step 2: Data Pekerjaan -->
      <div v-else-if="step === 2" class="space-y-4">
        <h2 class="text-lg font-display font-extrabold text-slate-800">Data Pekerjaan</h2>
        <Field label="Pekerjaan">
          <select v-model="form.occupation" class="fld"><option value="">Pilih</option><option value="pns">PNS</option><option value="tni_polri">TNI/Polri</option><option value="karyawan_swasta">Karyawan Swasta</option><option value="wiraswasta">Wiraswasta</option><option value="profesional">Profesional</option><option value="ibu_rumah_tangga">Ibu Rumah Tangga</option><option value="pelajar">Pelajar/Mahasiswa</option><option value="pensiunan">Pensiunan</option><option value="other">Lainnya</option></select>
        </Field>
        <Field label="Penghasilan per Tahun">
          <select v-model="form.income_level" class="fld"><option value="">Pilih</option><option value="below_5jt">&lt; Rp 5 juta</option><option value="5jt_10jt">Rp 5–10 juta</option><option value="10jt_25jt">Rp 10–25 juta</option><option value="25jt_50jt">Rp 25–50 juta</option><option value="above_50jt">&gt; Rp 50 juta</option></select>
        </Field>
        <Field label="Sumber Dana">
          <select v-model="form.source_of_fund" class="fld"><option value="">Pilih</option><option value="gaji">Gaji</option><option value="usaha">Usaha</option><option value="investasi">Hasil Investasi</option><option value="warisan">Warisan</option><option value="hadiah">Hadiah</option><option value="other">Lainnya</option></select>
        </Field>
      </div>

      <!-- Step 3: Informasi Tambahan -->
      <div v-else-if="step === 3" class="space-y-4">
        <h2 class="text-lg font-display font-extrabold text-slate-800">Informasi Tambahan</h2>
        <Field label="Tujuan Investasi">
          <select v-model="form.investment_objective" class="fld"><option value="">Pilih</option><option value="pendidikan">Pendidikan</option><option value="pensiun">Dana Pensiun</option><option value="dana_darurat">Dana Darurat</option><option value="pertumbuhan_aset">Pertumbuhan Aset</option><option value="pendapatan_rutin">Pendapatan Rutin</option><option value="other">Lainnya</option></select>
        </Field>
        <label class="flex items-start gap-3 text-sm text-slate-600 pt-2">
          <input type="checkbox" v-model="agree" class="mt-0.5 rounded text-primary-600 focus:ring-primary-300" />
          <span>Saya menyatakan data yang diisi benar &amp; lengkap, serta menyetujui <a href="#" class="text-primary-600 font-semibold">Syarat &amp; Ketentuan</a> Victoria Sekuritas.</span>
        </label>
      </div>

      <!-- Actions -->
      <div class="mt-8 flex justify-between">
        <button v-if="step > 1" class="px-4 py-2.5 text-sm text-slate-500" :disabled="loading" @click="step--">Kembali</button>
        <span v-else></span>
        <button v-if="step < 3" class="px-6 py-2.5 bg-brand-gradient text-white text-sm font-semibold rounded-xl shadow-card disabled:opacity-50" :disabled="!stepValid" @click="step++">Berikutnya</button>
        <button v-else class="px-6 py-2.5 bg-brand-gradient text-white text-sm font-semibold rounded-xl shadow-card disabled:opacity-50" :disabled="loading || !agree || !stepValid" @click="submit">{{ loading ? 'Mengirim…' : 'Kirim Data' }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h } from 'vue'

const { post } = useApi()
const authStore = useAuthStore()
const router = useRouter()

const step = ref(1)
const loading = ref(false)
const error = ref('')
const agree = ref(false)

const form = ref({
  nik: '', mother_maiden_name: '', birth_date: '', gender: '', marital_status: '',
  education: '', address: '', province: '', city: '', postal_code: '',
  occupation: '', income_level: '', source_of_fund: '', investment_objective: '',
})

onMounted(() => { if (!authStore.token) router.push('/login') })

const stepValid = computed(() => {
  const f = form.value
  if (step.value === 1) return f.nik.length === 16 && f.mother_maiden_name && f.birth_date && f.gender && f.marital_status && f.education && f.address && f.province && f.city
  if (step.value === 2) return f.occupation && f.income_level && f.source_of_fund
  if (step.value === 3) return !!f.investment_objective
  return true
})

const submit = async () => {
  error.value = ''
  loading.value = true
  try {
    await post('/kyc/submit', form.value)
    router.push('/kyc?submitted=1')
  } catch (e: any) {
    error.value = e?.data?.message || (e?.data?.errors ? Object.values(e.data.errors)[0]?.[0] : '') || 'Gagal mengirim data.'
  } finally {
    loading.value = false
  }
}

// Komponen field kecil (label + slot)
const Field = (props: { label: string }, { slots }: any) =>
  h('div', {}, [
    h('label', { class: 'block text-xs font-semibold text-slate-600 mb-1.5' }, props.label),
    slots.default?.(),
  ])

useHead({ title: 'Lengkapi Data — Victoria Sekuritas' })
</script>

<style scoped>
.fld { @apply w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400; }
</style>
