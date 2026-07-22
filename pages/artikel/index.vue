<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 py-6 lg:py-10">
    <!-- Hero -->
    <div class="relative overflow-hidden bg-brand-gradient rounded-card shadow-card p-6 lg:p-10 mb-8">
      <div class="absolute -top-16 -right-10 w-56 h-56 rounded-full bg-accent-400/30 blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-20 -left-12 w-64 h-64 rounded-full bg-primary-400/30 blur-3xl pointer-events-none"></div>

      <div class="relative max-w-2xl">
        <span class="inline-flex items-center px-3 py-1 rounded-full bg-white/15 text-white text-[11px] font-bold tracking-wide uppercase backdrop-blur mb-4">
          Wawasan Pasar Modal
        </span>
        <h1 class="font-display font-extrabold tracking-tight text-3xl lg:text-4xl text-white">Artikel &amp; Berita</h1>
        <p class="text-primary-100 text-sm lg:text-base mt-2">
          Edukasi, analisis, dan kabar terbaru seputar reksa dana &amp; investasi untuk membantu keputusan finansial Anda.
        </p>

        <!-- Search box (inside hero) -->
        <div class="relative mt-6 max-w-md">
          <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-primary-300 pointer-events-none">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
          </span>
          <input
            v-model="search"
            type="text"
            placeholder="Cari artikel atau berita..."
            class="w-full pl-11 pr-4 py-3 rounded-xl bg-white/95 backdrop-blur border-0 text-sm text-slate-800 placeholder-slate-400 shadow-soft focus:ring-2 focus:ring-white/70 focus:outline-none"
          />
        </div>
      </div>
    </div>

    <!-- Category chips -->
    <div v-if="categories.length" class="flex flex-wrap gap-2 mb-7">
      <button
        @click="setCategory('')"
        class="px-4 py-2 rounded-full text-sm font-semibold transition-all border"
        :class="!activeCategory
          ? 'bg-primary-600 text-white border-primary-600 shadow-soft'
          : 'bg-white text-slate-600 border-slate-100 hover:border-primary-200 hover:text-primary-700'"
      >
        Semua
      </button>
      <button
        v-for="cat in categories"
        :key="cat"
        @click="setCategory(cat)"
        class="px-4 py-2 rounded-full text-sm font-semibold transition-all border"
        :class="activeCategory === cat
          ? 'bg-primary-600 text-white border-primary-600 shadow-soft'
          : 'bg-white text-slate-600 border-slate-100 hover:border-primary-200 hover:text-primary-700'"
      >
        {{ cat }}
      </button>
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="i in 6" :key="i" class="bg-white rounded-card border border-slate-100 shadow-card overflow-hidden animate-pulse">
        <div class="h-40 bg-primary-100"></div>
        <div class="p-5">
          <div class="h-3 bg-slate-100 rounded w-1/3 mb-3"></div>
          <div class="h-4 bg-slate-100 rounded w-5/6 mb-2"></div>
          <div class="h-4 bg-slate-100 rounded w-2/3 mb-4"></div>
          <div class="h-3 bg-slate-100 rounded w-full mb-2"></div>
          <div class="h-3 bg-slate-100 rounded w-4/5"></div>
        </div>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center py-16">
      <div class="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p class="text-slate-700 font-semibold">Gagal memuat artikel</p>
      <p class="text-slate-400 text-sm mt-1">Periksa koneksi Anda lalu coba lagi.</p>
      <button
        @click="fetchArticles"
        class="mt-5 inline-flex items-center px-5 py-2.5 bg-primary-600 text-white font-bold text-sm rounded-xl shadow-soft hover:bg-primary-700 transition-all"
      >
        Coba Lagi
      </button>
    </div>

    <!-- Empty state -->
    <div v-else-if="!articles.length" class="text-center py-16">
      <div class="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l6 6v8a2 2 0 01-2 2z M14 4v6h6" />
        </svg>
      </div>
      <p class="text-slate-600 font-medium">
        {{ search || activeCategory ? 'Tidak ada artikel yang cocok' : 'Belum ada artikel' }}
      </p>
      <p class="text-slate-400 text-sm mt-1">
        {{ search || activeCategory ? 'Coba ubah kata kunci atau kategori.' : 'Artikel & berita akan tampil di sini.' }}
      </p>
      <button
        v-if="search || activeCategory"
        @click="resetFilters"
        class="mt-5 inline-flex items-center px-5 py-2.5 bg-primary-50 text-primary-700 font-bold text-sm rounded-xl hover:bg-primary-100 transition-all"
      >
        Reset Filter
      </button>
    </div>

    <!-- Article grid -->
    <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <button
        v-for="article in articles"
        :key="article.id"
        @click="goToArticle(article.slug)"
        class="group text-left bg-white rounded-card border border-slate-100 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all overflow-hidden flex flex-col focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <!-- Cover -->
        <div
          class="relative h-44 overflow-hidden"
          :class="article.image_url ? '' : catCover(article.category)"
        >
          <img
            v-if="article.image_url"
            :src="article.image_url"
            :alt="article.title"
            class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            @error="onImgError($event, article)"
          />
          <!-- Gradient overlay / motif -->
          <template v-else>
            <div class="absolute -top-8 -right-6 w-32 h-32 rounded-full bg-white/15 blur-xl pointer-events-none"></div>
            <div class="absolute -bottom-10 -left-8 w-36 h-36 rounded-full bg-black/10 blur-2xl pointer-events-none"></div>
            <svg class="absolute right-4 bottom-3 w-20 h-20 text-white/25" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3v18h18M7 14l3-3 3 3 5-6" />
            </svg>
          </template>

          <!-- Category badge -->
          <div class="absolute top-3 left-3 z-10">
            <span
              class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide backdrop-blur"
              :class="article.image_url ? catBadgeOnImage : catBadge(article.category)"
            >
              {{ article.category }}
            </span>
          </div>
        </div>

        <!-- Body -->
        <div class="p-5 flex flex-col flex-1">
          <h3 class="font-display text-base font-extrabold tracking-tight text-slate-900 leading-snug group-hover:text-primary-700 transition-colors line-clamp-2">
            {{ article.title }}
          </h3>
          <p class="text-sm text-slate-500 mt-2 leading-relaxed line-clamp-3 flex-1">
            {{ article.excerpt }}
          </p>

          <!-- Meta -->
          <div class="flex items-center justify-between gap-2 mt-4 pt-4 border-t border-slate-100">
            <span class="text-xs text-slate-400">{{ formatDate(article.published_at) }}</span>
            <span class="text-xs font-semibold text-slate-500 truncate max-w-[50%]">{{ article.author }}</span>
          </div>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'public' })

interface Article {
  id: number
  title: string
  slug: string
  category: string
  excerpt: string
  content?: string
  image_url: string | null
  author: string
  source?: string
  is_published?: boolean
  published_at: string
  created_at?: string
}

const { get } = useApi()
const authStore = useAuthStore()

const loading = ref(true)
const error = ref(false)
const articles = ref<Article[]>([])
const categories = ref<string[]>([])
const activeCategory = ref('')
const search = ref('')

// --- Helpers ---
const formatDate = (date: string): string => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

// Category -> branded gradient cover
const catCover = (category: string): string => {
  const c = (category || '').toLowerCase()
  if (c.includes('edukasi')) return 'bg-gradient-to-br from-violet-600 to-accent-500'
  if (c.includes('tips')) return 'bg-gradient-to-br from-emerald-600 to-teal-500'
  if (c.includes('analisis')) return 'bg-gradient-to-br from-amber-500 to-orange-500'
  // Berita Pasar & default
  return 'bg-brand-gradient'
}

// Category -> badge color (on gradient covers)
const catBadge = (category: string): string => {
  const c = (category || '').toLowerCase()
  if (c.includes('edukasi')) return 'bg-white/20 text-white'
  if (c.includes('tips')) return 'bg-white/20 text-white'
  if (c.includes('analisis')) return 'bg-white/25 text-white'
  return 'bg-white/20 text-white'
}

const catBadgeOnImage = 'bg-white/90 text-primary-700'

const onImgError = (e: Event, article: Article) => {
  // Hilangkan <img> rusak -> fallback ke gradient cover
  article.image_url = null
}

// --- Navigation ---
const goToArticle = (slug: string) => {
  navigateTo('/artikel/' + slug)
}

const setCategory = (cat: string) => {
  activeCategory.value = cat
}

const resetFilters = () => {
  search.value = ''
  activeCategory.value = ''
}

// --- Data ---
const fetchArticles = async () => {
  loading.value = true
  error.value = false
  try {
    const params: Record<string, any> = { per_page: 9 }
    if (activeCategory.value) params.category = activeCategory.value
    if (search.value.trim()) params.search = search.value.trim()

    const res = await get<{
      success: boolean
      data: Article[]
      categories: string[]
      meta: any
    }>('/articles', params)

    articles.value = res.data || []
    if (res.categories?.length) categories.value = res.categories
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

// Debounced search; category change refetches immediately
let searchTimer: ReturnType<typeof setTimeout> | null = null
watch(search, () => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(fetchArticles, 350)
})
watch(activeCategory, fetchArticles)

onMounted(fetchArticles)

useHead({ title: 'Artikel & Berita — Victoria Sekuritas' })
</script>
