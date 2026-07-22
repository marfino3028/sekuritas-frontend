<template>
  <div class="p-4 lg:p-8 max-w-3xl mx-auto">
    <!-- Back button -->
    <NuxtLink to="/artikel" class="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 mb-6 transition-colors">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Kembali ke Artikel
    </NuxtLink>

    <!-- Loading skeleton -->
    <div v-if="loading" class="space-y-5">
      <div class="h-56 rounded-card bg-slate-200 animate-pulse"></div>
      <div class="rounded-card bg-white shadow-card border border-slate-100 p-6 animate-pulse space-y-4">
        <div class="h-8 bg-slate-200 rounded w-3/4"></div>
        <div class="h-4 bg-slate-200 rounded w-1/2"></div>
        <div class="space-y-2 pt-3">
          <div class="h-3.5 bg-slate-200 rounded w-full"></div>
          <div class="h-3.5 bg-slate-200 rounded w-full"></div>
          <div class="h-3.5 bg-slate-200 rounded w-5/6"></div>
          <div class="h-3.5 bg-slate-200 rounded w-full"></div>
          <div class="h-3.5 bg-slate-200 rounded w-2/3"></div>
        </div>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-center py-16">
      <div class="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <p class="text-slate-700 font-semibold">Gagal memuat artikel</p>
      <p class="text-slate-400 text-sm mt-1">{{ error }}</p>
      <button @click="loadArticle" class="mt-4 inline-flex px-5 py-2.5 rounded-xl text-sm font-semibold bg-primary-600 text-white hover:bg-primary-700 transition-all shadow-card">
        Coba Lagi
      </button>
    </div>

    <!-- Content -->
    <article v-else-if="article" class="space-y-8">
      <!-- Hero / cover -->
      <div class="relative overflow-hidden rounded-card shadow-card aspect-[16/9] sm:aspect-[2/1]">
        <!-- Real image when available -->
        <img
          v-if="article.image_url && !imgError"
          :src="article.image_url"
          :alt="article.title"
          class="absolute inset-0 w-full h-full object-cover"
          @error="imgError = true"
        />
        <!-- Branded gradient cover (default / fallback) -->
        <div v-else class="absolute inset-0 bg-brand-gradient">
          <div class="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 blur-2xl"></div>
          <div class="absolute -bottom-16 -left-10 w-56 h-56 rounded-full bg-accent-400/30 blur-3xl"></div>
          <!-- Chart motif -->
          <svg class="absolute right-6 bottom-6 w-28 h-28 text-white/15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3v18h18M7 14l3-3 3 3 5-6" />
          </svg>
        </div>
        <!-- Gradient scrim for readable badge -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
        <!-- Category badge -->
        <div class="absolute top-4 left-4">
          <span class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-soft" :class="categoryBadgeClass(article.category)">
            {{ article.category || 'Artikel' }}
          </span>
        </div>
      </div>

      <!-- Header -->
      <header>
        <h1 class="font-display font-extrabold tracking-tight text-3xl sm:text-4xl leading-[1.15] text-slate-900">
          {{ article.title }}
        </h1>
        <!-- Meta -->
        <div class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
          <span v-if="article.author" class="inline-flex items-center gap-1.5 font-semibold text-slate-700">
            <svg class="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {{ article.author }}
          </span>
          <span v-if="article.published_at" class="inline-flex items-center gap-1.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {{ formatDateLong(article.published_at) }}
          </span>
          <span v-if="article.source" class="inline-flex items-center gap-1.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 010 5.656l-3 3a4 4 0 01-5.656-5.656l1.5-1.5m6.656-2.828a4 4 0 010-5.656l3-3a4 4 0 115.656 5.656l-1.5 1.5" />
            </svg>
            Sumber: {{ article.source }}
          </span>
        </div>
        <p v-if="article.excerpt" class="mt-5 text-lg text-slate-600 leading-relaxed border-l-4 border-primary-200 pl-4">
          {{ article.excerpt }}
        </p>
      </header>

      <!-- Body content: render per paragraph -->
      <div class="max-w-prose">
        <p
          v-for="(para, i) in paragraphs"
          :key="i"
          class="text-slate-700 text-[1.0625rem] leading-8 mb-6 last:mb-0 whitespace-pre-line"
        >
          {{ para }}
        </p>
        <p v-if="!paragraphs.length" class="text-slate-400 italic">Konten belum tersedia.</p>
      </div>

      <!-- Related articles -->
      <section v-if="related.length" class="pt-6 border-t border-slate-100">
        <h2 class="font-display font-extrabold tracking-tight text-xl text-slate-900 mb-5">Artikel Terkait</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NuxtLink
            v-for="rel in related"
            :key="rel.id"
            :to="`/artikel/${rel.slug}`"
            class="group flex flex-col rounded-2xl bg-white border border-slate-100 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all overflow-hidden"
          >
            <!-- Mini cover -->
            <div class="relative h-28 overflow-hidden">
              <img
                v-if="rel.image_url"
                :src="rel.image_url"
                :alt="rel.title"
                class="absolute inset-0 w-full h-full object-cover"
              />
              <div v-else class="absolute inset-0 bg-brand-gradient">
                <div class="absolute -bottom-6 -right-4 w-24 h-24 rounded-full bg-white/10 blur-xl"></div>
                <svg class="absolute right-3 bottom-2 w-12 h-12 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3v18h18M7 14l3-3 3 3 5-6" />
                </svg>
              </div>
              <span class="absolute top-2.5 left-2.5 inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold shadow-soft" :class="categoryBadgeClass(rel.category)">
                {{ rel.category || 'Artikel' }}
              </span>
            </div>
            <div class="p-4 flex-1 flex flex-col">
              <h3 class="font-display font-bold text-sm leading-snug text-slate-900 line-clamp-2 group-hover:text-primary-700 transition-colors">
                {{ rel.title }}
              </h3>
              <p v-if="rel.excerpt" class="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">{{ rel.excerpt }}</p>
              <span v-if="rel.published_at" class="mt-auto pt-3 text-[11px] text-slate-400">{{ formatDateLong(rel.published_at) }}</span>
            </div>
          </NuxtLink>
        </div>
      </section>

      <!-- Bottom back link -->
      <div class="pt-2">
        <NuxtLink to="/artikel" class="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Kembali ke Artikel
        </NuxtLink>
      </div>
    </article>

    <!-- Not found -->
    <div v-else class="text-center py-16">
      <div class="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p class="text-slate-600 font-medium">Artikel tidak ditemukan</p>
      <NuxtLink to="/artikel" class="text-primary-600 text-sm font-medium hover:underline mt-2 block">
        Kembali ke daftar artikel
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'public' })

interface RelatedArticle {
  id: number
  title: string
  slug: string
  category?: string | null
  excerpt?: string | null
  image_url?: string | null
  published_at?: string | null
}

interface Article {
  id: number
  title: string
  slug: string
  category?: string | null
  excerpt?: string | null
  content?: string | null
  image_url?: string | null
  author?: string | null
  source?: string | null
  is_published?: boolean
  published_at?: string | null
  created_at?: string | null
}

const { get } = useApi()
const route = useRoute()
// auth opsional (navbar publik mengandalkan ini); tidak diperlukan untuk fetch
const authStore = useAuthStore()

const slug = computed(() => route.params.slug as string)

const loading = ref(true)
const error = ref<string | null>(null)
const article = ref<Article | null>(null)
const related = ref<RelatedArticle[]>([])
const imgError = ref(false)

// Pisah konten per paragraf (newline ganda) -> tiap blok jadi <p>
const paragraphs = computed(() => {
  const raw = article.value?.content || ''
  return raw
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0)
})

const formatDateLong = (d?: string | null) => {
  if (!d) return ''
  const date = new Date(d)
  if (isNaN(date.getTime())) return d
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

// Badge warna per kategori
const categoryBadgeClass = (category?: string | null) => {
  const c = (category || '').toLowerCase()
  if (c.includes('berita') || c.includes('pasar')) return 'bg-primary-100 text-primary-700'
  if (c.includes('edukasi')) return 'bg-accent-100 text-accent-700'
  if (c.includes('tips')) return 'bg-emerald-100 text-emerald-700'
  if (c.includes('analisis')) return 'bg-amber-100 text-amber-700'
  return 'bg-slate-100 text-slate-700'
}

const loadArticle = async () => {
  loading.value = true
  error.value = null
  article.value = null
  related.value = []
  imgError.value = false
  try {
    const res = await get<{ success: boolean; data: Article; related?: RelatedArticle[] }>(
      `/articles/${slug.value}`
    )
    article.value = res.data || null
    related.value = res.related || []
  } catch (e: any) {
    if (e?.response?.status === 404 || e?.statusCode === 404) {
      // not-found ditangani oleh state article === null
      article.value = null
    } else {
      error.value = e?.data?.message || e?.message || 'Terjadi kesalahan saat memuat artikel.'
    }
  } finally {
    loading.value = false
  }
}

// reload jika slug berubah (navigasi antar artikel terkait)
watch(slug, (val) => {
  if (val) loadArticle()
})

// SEO
watchEffect(() => {
  if (article.value) {
    useHead({
      title: `${article.value.title} — Victoria Sekuritas`,
      meta: [{ name: 'description', content: article.value.excerpt || article.value.title }],
    })
  }
})

onMounted(loadArticle)
</script>
