<template>
  <div>
    <!-- ================= HERO ================= -->
    <section class="relative bg-surface-hero overflow-hidden">
      <img src="/images/hero.jpg" alt="" class="absolute inset-y-0 right-0 h-full w-full lg:w-[68%] object-cover object-center" />
      <div class="absolute inset-0 bg-hero-fade"></div>
      <div class="absolute inset-0 bg-white/60 lg:hidden"></div>

      <div class="relative max-w-container mx-auto px-4 sm:px-6 lg:px-8 pt-14 lg:pt-24 pb-40 lg:pb-48">
        <div class="max-w-2xl">
          <span class="inline-flex items-center rounded-full bg-white/80 border border-primary-600/10 px-5 py-2.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-eyebrow text-primary-600 mb-7">
            Danapathi Asset Management
          </span>
          <h1 class="font-display font-bold text-[40px] sm:text-[52px] lg:text-[68px] leading-[1.06] tracking-[-0.03em] mb-6">
            <span class="block text-primary-800 font-extrabold">Investasi Reksa Dana</span>
            <span class="block text-accent-500 font-semibold">Buka Rekening Online</span>
          </h1>
          <p class="text-[16px] lg:text-[17px] leading-[1.7] text-[#5F6F7F] mb-9 max-w-xl">
            Mulai berinvestasi pada reksa dana Danapathi langsung dari ponsel Anda. Verifikasi identitas
            dengan e-KTP &amp; swafoto, tanda tangan digital, tanpa perlu datang ke kantor.
          </p>
          <div class="flex flex-col sm:flex-row gap-3">
            <NuxtLink to="/register" class="btn-primary">Buka Rekening Sekarang</NuxtLink>
            <NuxtLink to="/produk" class="btn-secondary">Lihat Produk</NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Trust strip menumpuk di bawah hero -->
    <section class="relative z-10 -mt-28 lg:-mt-32">
      <div class="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-4 bg-white rounded-strip shadow-strip overflow-hidden">
          <div class="bg-trust text-white p-7 lg:p-8 flex items-center gap-4">
            <div class="w-14 h-14 rounded-2xl bg-white/10 grid place-items-center shrink-0">
              <svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15a6 6 0 100-12 6 6 0 000 12zm0 0l-3.5 6 3.5-1.5 3.5 1.5L12 15z"/></svg>
            </div>
            <div>
              <p class="text-xs text-white/70 mb-1">Dipercaya Investor</p>
              <p class="font-display font-bold text-xl leading-tight tracking-[-0.02em]">Manajer Investasi Profesional</p>
            </div>
          </div>
          <div v-for="t in trust" :key="t.title" class="p-7 lg:p-8 text-center border-t md:border-t-0 md:border-l border-slate-100">
            <div class="w-11 h-11 mx-auto mb-3 rounded-xl bg-surface-soft grid place-items-center text-primary-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" :d="t.icon"/></svg>
            </div>
            <p class="font-display font-bold text-primary-900 mb-1">{{ t.title }}</p>
            <p class="text-sm text-ink leading-relaxed">{{ t.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= PRODUK UNGGULAN ================= -->
    <section class="py-16 lg:py-20">
      <div class="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-10">
          <div>
            <span class="eyebrow eyebrow-bar mb-3">Produk Unggulan</span>
            <h2 class="h-section">Reksa Dana Danapathi</h2>
          </div>
          <NuxtLink to="/produk" class="btn-outline self-start sm:self-auto">
            Lihat Semua Produk
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M13 6l6 6-6 6"/></svg>
          </NuxtLink>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <NuxtLink
            v-for="f in funds"
            :key="f.id"
            :to="`/produk/${f.id}`"
            class="group bg-white rounded-card border border-primary-900/[0.06] shadow-card p-6 hover:-translate-y-1 hover:shadow-card-hover transition-all duration-200"
          >
            <span class="inline-flex rounded-full bg-surface-soft px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#5D7288] mb-4">
              {{ f.fund_type_label }}
            </span>
            <h3 class="font-display font-bold text-[17px] leading-snug text-primary-900 mb-6 min-h-[48px] group-hover:text-primary-600">{{ f.name }}</h3>
            <p class="text-xs text-ink-muted mb-1">NAB / Unit</p>
            <p class="font-display font-bold text-[26px] tracking-[-0.045em] text-primary-700 mb-3">{{ formatNab(f.nav_per_unit) }}</p>
            <p class="text-xs text-ink-muted">
              Return 1 Tahun
              <span class="font-bold ml-1" :class="f.performance_1yr >= 0 ? 'text-up' : 'text-down'">
                {{ f.performance_1yr >= 0 ? '▲' : '▼' }} {{ Math.abs(f.performance_1yr).toFixed(2) }}%
              </span>
            </p>
          </NuxtLink>
        </div>
        <p v-if="navDate" class="text-xs text-ink-muted mt-5">NAB per {{ navDate }}</p>
      </div>
    </section>

    <!-- ================= BUKA REKENING ONLINE (eKYC) ================= -->
    <section class="py-16 lg:py-20 bg-brand-soft">
      <div class="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-12 gap-10 items-center">
          <div class="lg:col-span-5">
            <span class="eyebrow eyebrow-bar mb-3">Pembukaan Rekening Online</span>
            <h2 class="h-section mb-5">Cukup 10 Menit, Tanpa Tatap Muka</h2>
            <p class="p-section mb-8">
              Data e-KTP terbaca otomatis, wajah Anda dicocokkan dengan foto KTP, dan dokumen ditandatangani
              secara digital. Tim kami memverifikasi, lalu rekening Anda aktif dan siap bertransaksi.
            </p>
            <NuxtLink to="/register" class="btn-primary">Mulai Buka Rekening</NuxtLink>
          </div>
          <div class="lg:col-span-7 grid sm:grid-cols-2 gap-4">
            <div v-for="(s, i) in openSteps" :key="s.title" class="bg-white rounded-card border border-primary-900/[0.06] shadow-card p-6">
              <div class="flex items-center gap-3 mb-4">
                <span class="w-10 h-10 rounded-xl bg-primary-600 text-white font-display font-bold grid place-items-center">{{ i + 1 }}</span>
                <span class="text-[11px] font-bold uppercase tracking-[0.12em] text-accent-500">{{ s.tag }}</span>
              </div>
              <h3 class="font-display font-bold text-lg text-primary-900 mb-1.5">{{ s.title }}</h3>
              <p class="text-sm leading-relaxed text-ink">{{ s.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= TENTANG + FAQ ================= -->
    <section class="py-16 lg:py-20">
      <div class="max-w-container mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-panel border border-primary-900/[0.06] shadow-soft p-7 lg:p-10">
          <span class="eyebrow eyebrow-bar mb-3">Tentang Kami</span>
          <h2 class="font-display font-bold text-[28px] lg:text-[31px] leading-[1.15] tracking-heading text-primary-600 mb-4">Tentang Danapathi Asset Management</h2>
          <p class="p-section mb-7">
            PT Danapathi Asset Management adalah perusahaan manajer investasi yang menyediakan layanan pengelolaan
            reksa dana untuk investor individu maupun institusi, dengan proses investasi yang disiplin dan terukur.
          </p>
          <div class="grid sm:grid-cols-2 gap-3 mb-8">
            <div v-for="b in benefits" :key="b.title" class="rounded-2xl bg-surface-soft p-5">
              <p class="font-display font-bold text-primary-900 mb-1">{{ b.title }}</p>
              <p class="text-sm text-ink leading-relaxed">{{ b.desc }}</p>
            </div>
          </div>
          <NuxtLink to="/artikel" class="inline-flex items-center px-[22px] py-[13px] rounded-btn bg-primary-600 text-white text-sm font-display font-semibold hover:bg-accent-500 transition-colors">
            Pelajari Lebih Lanjut
          </NuxtLink>
        </div>

        <div class="bg-white rounded-panel border border-primary-900/[0.06] shadow-soft p-7 lg:p-10">
          <span class="eyebrow eyebrow-bar mb-3">FAQ</span>
          <h2 class="font-display font-bold text-[28px] lg:text-[31px] leading-[1.15] tracking-heading text-primary-600 mb-6">Pertanyaan Umum</h2>
          <div class="space-y-3">
            <div v-for="(q, i) in faqs" :key="i" class="rounded-2xl border border-slate-100 overflow-hidden">
              <button class="w-full flex items-center gap-4 p-4 text-left" @click="openFaq = openFaq === i ? -1 : i">
                <span class="w-8 h-8 rounded-full bg-primary-900 text-white text-xs font-bold grid place-items-center shrink-0">{{ String(i + 1).padStart(2, '0') }}</span>
                <span class="flex-1 font-display font-semibold text-primary-900">{{ q.q }}</span>
                <svg class="w-5 h-5 text-primary-600 transition-transform" :class="openFaq === i ? 'rotate-180' : ''" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 9l6 6 6-6"/></svg>
              </button>
              <p v-show="openFaq === i" class="px-4 pb-4 pl-16 text-sm leading-relaxed text-ink">{{ q.a }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= SIMULASI INVESTASI ================= -->
    <section class="py-16 lg:py-20 bg-brand-soft">
      <div class="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-12 bg-white rounded-box border border-primary-900/[0.06] shadow-soft overflow-hidden">
          <div class="lg:col-span-4 bg-brand-gradient text-white p-8 lg:p-10">
            <span class="text-[11px] font-bold uppercase tracking-eyebrow text-white/60">Simulasi Investasi</span>
            <h2 class="font-display font-bold text-[30px] lg:text-[36px] leading-[1.1] tracking-[-0.045em] mt-3 mb-4">Hitung Potensi Hasil Investasi Anda</h2>
            <p class="text-sm leading-relaxed text-white/75">Perkiraan menggunakan return 1 tahun terakhir produk. Bukan jaminan hasil di masa depan.</p>
          </div>
          <div class="lg:col-span-4 p-8 lg:p-10 space-y-5">
            <div class="flex gap-2 p-1 bg-surface-soft rounded-2xl">
              <button v-for="m in simModes" :key="m.key" class="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                :class="sim.mode === m.key ? 'bg-primary-600 text-white' : 'text-primary-600'" @click="sim.mode = m.key">{{ m.label }}</button>
            </div>
            <label class="block">
              <span class="text-sm font-semibold text-primary-900">Produk</span>
              <select v-model="sim.fundId" class="mt-2 w-full rounded-input border-[#DBE2EA] text-sm text-primary-900 focus:border-primary-500 focus:ring-primary-500">
                <option v-for="f in funds" :key="f.id" :value="f.id">{{ f.name }}</option>
              </select>
            </label>
            <label class="block">
              <span class="text-sm font-semibold text-primary-900">{{ sim.mode === 'rutin' ? 'Investasi per bulan' : 'Nominal investasi' }} (Rp)</span>
              <input v-model.number="sim.amount" type="number" min="10000" step="100000" class="mt-2 w-full rounded-input border-[#DBE2EA] text-sm text-primary-900 focus:border-primary-500 focus:ring-primary-500" />
            </label>
            <label class="block">
              <span class="text-sm font-semibold text-primary-900">Jangka waktu: {{ sim.years }} tahun</span>
              <input v-model.number="sim.years" type="range" min="1" max="20" class="mt-3 w-full accent-primary-600" />
            </label>
          </div>
          <div class="lg:col-span-4 p-8 lg:p-10 bg-surface-soft flex flex-col justify-center">
            <p class="text-sm text-ink-muted">Total modal</p>
            <p class="font-display font-bold text-2xl text-primary-900 mb-5">{{ formatRp(simResult.principal) }}</p>
            <p class="text-sm text-ink-muted">Perkiraan nilai akhir</p>
            <p class="font-display font-bold text-[34px] tracking-[-0.04em] text-primary-700 mb-2">{{ formatRp(simResult.final) }}</p>
            <p class="text-sm font-semibold text-accent-500 mb-6">+ {{ formatRp(simResult.profit) }} potensi keuntungan</p>
            <NuxtLink to="/register" class="btn-primary w-full">Mulai Investasi</NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= ARTIKEL ================= -->
    <section v-if="articles.length" class="py-16 lg:py-20">
      <div class="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-10">
          <div>
            <span class="eyebrow eyebrow-bar mb-3">Publikasi &amp; Informasi</span>
            <h2 class="h-section">Berita &amp; Artikel Terbaru</h2>
          </div>
          <NuxtLink to="/artikel" class="btn-outline self-start sm:self-auto">
            Lihat Semua Artikel
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M13 6l6 6-6 6"/></svg>
          </NuxtLink>
        </div>
        <div class="grid md:grid-cols-3 gap-5">
          <NuxtLink v-for="a in articles" :key="a.id" :to="`/artikel/${a.slug}`"
            class="group bg-white rounded-card border border-primary-900/[0.06] shadow-card overflow-hidden hover:-translate-y-1 hover:shadow-card-hover transition-all">
            <div class="relative h-44 bg-brand-gradient overflow-hidden">
              <img v-if="a.image_url" :src="a.image_url" :alt="a.title" class="absolute inset-0 w-full h-full object-cover" />
              <img v-else src="/logo-white.png" alt="" class="absolute inset-0 m-auto h-12 opacity-30" />
              <span v-if="a.category" class="absolute top-4 left-4 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-primary-600">{{ a.category }}</span>
            </div>
            <div class="p-6">
              <p class="text-xs text-ink-muted mb-2">{{ formatArticleDate(a.published_at) }}</p>
              <h3 class="font-display font-bold text-lg leading-snug text-primary-900 line-clamp-2 group-hover:text-primary-600">{{ a.title }}</h3>
              <p v-if="a.excerpt" class="text-sm text-ink leading-relaxed line-clamp-2 mt-2">{{ a.excerpt }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'public' })
useHead({ title: 'Danapathi Asset Management — Investasi Reksa Dana Online' })

interface Fund {
  id: number
  name: string
  fund_type_label: string
  nav_per_unit: number
  nav_date: string
  performance_1yr: number
}
interface Article {
  id: number | string
  title: string
  slug: string
  category: string | null
  excerpt: string | null
  image_url: string | null
  published_at: string | null
}

const { get } = useApi()
const funds = ref<Fund[]>([])
const articles = ref<Article[]>([])

try {
  const res = await get<any>('/products', { per_page: 5 })
  const list = res?.data?.data ?? res?.data ?? []
  funds.value = list.map((f: any) => ({ ...f, nav_per_unit: Number(f.nav_per_unit), performance_1yr: Number(f.performance_1yr) }))
} catch { funds.value = [] }

try {
  const res = await get<{ data: Article[] }>('/articles', { per_page: 3 })
  articles.value = res?.data ?? []
} catch { articles.value = [] }

const navDate = computed(() => {
  const d = funds.value[0]?.nav_date
  return d ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : ''
})

const formatNab = (n: number) => n.toLocaleString('id-ID', { minimumFractionDigits: 4, maximumFractionDigits: 4 })
const formatRp = (n: number) => 'Rp' + Math.round(n).toLocaleString('id-ID')
const formatArticleDate = (d: string | null) =>
  d ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : ''

// ---------- Simulasi ----------
const simModes = [{ key: 'sekali', label: 'Sekali' }, { key: 'rutin', label: 'Rutin' }] as const
const sim = reactive<{ mode: 'sekali' | 'rutin'; fundId: number | null; amount: number; years: number }>({
  mode: 'sekali', fundId: null, amount: 10_000_000, years: 5,
})
watch(funds, (list) => { if (!sim.fundId && list.length) sim.fundId = list[0].id }, { immediate: true })

const simResult = computed(() => {
  const f = funds.value.find((x) => x.id === sim.fundId)
  const r = (f?.performance_1yr ?? 6) / 100
  const amount = Math.max(0, sim.amount || 0)
  if (sim.mode === 'sekali') {
    const final = amount * Math.pow(1 + r, sim.years)
    return { principal: amount, final, profit: final - amount }
  }
  const months = sim.years * 12
  const rm = Math.pow(1 + r, 1 / 12) - 1
  const final = rm > 0 ? amount * ((Math.pow(1 + rm, months) - 1) / rm) * (1 + rm) : amount * months
  return { principal: amount * months, final, profit: final - amount * months }
})

// ---------- Konten statis ----------
const openFaq = ref(0)

const trust = [
  { title: 'Berizin dan Diawasi OJK', desc: 'Danapathi Asset Management berizin dan diawasi oleh OJK.', icon: 'M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3zm-3 9l2 2 4-4' },
  { title: 'Bank Kustodian', desc: 'Dana investasi disimpan melalui bank kustodian independen.', icon: 'M3 21h18M5 21V10m4 11V10m6 11V10m4 11V10M2 10l10-6 10 6' },
  { title: 'Rekening 100% Online', desc: 'Verifikasi e-KTP, swafoto, dan tanda tangan digital.', icon: 'M8 3h8a2 2 0 012 2v14a2 2 0 01-2 2H8a2 2 0 01-2-2V5a2 2 0 012-2zm3 15h2' },
]

const openSteps = [
  { tag: 'Akun', title: 'Daftar dengan Email', desc: 'Buat akun dan aktivasi lewat tautan yang dikirim ke email Anda.' },
  { tag: 'e-KTP', title: 'Foto e-KTP', desc: 'Data NIK, nama, dan alamat terbaca otomatis untuk mengisi formulir.' },
  { tag: 'Verifikasi Wajah', title: 'Swafoto dengan e-KTP', desc: 'Wajah dicocokkan dengan foto KTP disertai pemeriksaan keaslian (liveness).' },
  { tag: 'Tanda Tangan', title: 'Tanda Tangan Digital', desc: 'Setujui dokumen secara digital. Setelah diverifikasi, siap berinvestasi.' },
]

const benefits = [
  { title: 'Pengelolaan Profesional', desc: 'Dikelola tim manajer investasi berpengalaman.' },
  { title: 'Pilihan Lengkap', desc: 'Pasar uang, pendapatan tetap, syariah, campuran, dan saham.' },
  { title: 'Transparan', desc: 'NAB diperbarui setiap hari bursa.' },
  { title: 'Mulai Terjangkau', desc: 'Investasi mulai dari Rp100.000.' },
]

const faqs = [
  { q: 'Apa itu reksa dana?', a: 'Reksa dana adalah wadah untuk menghimpun dana dari investor yang kemudian diinvestasikan oleh Manajer Investasi ke dalam portofolio efek seperti saham, obligasi, dan instrumen pasar uang.' },
  { q: 'Apa saja syarat membuka rekening?', a: 'Warga negara Indonesia berusia minimal 17 tahun dengan e-KTP, alamat email aktif, dan rekening bank atas nama sendiri. Seluruh proses dilakukan secara online.' },
  { q: 'Berapa lama proses verifikasi?', a: 'Verifikasi otomatis berjalan dalam hitungan menit. Setelah itu tim kami meninjau data dan menerbitkan SID dalam 1 hari kerja.' },
  { q: 'Apakah dana saya aman?', a: 'Dana investasi disimpan di bank kustodian yang terpisah dari kekayaan Manajer Investasi, dan kegiatan kami diawasi oleh OJK.' },
]
</script>
