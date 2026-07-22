<template>
  <div class="max-w-6xl mx-auto px-4 py-8 lg:py-12">
    <div class="mb-8">
      <h1 class="text-3xl lg:text-4xl font-display font-extrabold tracking-tight text-slate-800">Promo & Event</h1>
      <p class="text-slate-500 mt-2">Ikuti event Victoria Sekuritas dan dapatkan reward khusus melalui link undangan.</p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <div v-for="i in 3" :key="i" class="h-64 rounded-card bg-slate-100 animate-pulse"></div>
    </div>

    <!-- Empty -->
    <div v-else-if="!events.length" class="text-center py-20">
      <div class="w-20 h-20 mx-auto rounded-full bg-primary-50 flex items-center justify-center mb-5">
        <svg class="w-9 h-9 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 010 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 010-4V7a2 2 0 00-2-2H5z"/></svg>
      </div>
      <p class="text-lg font-bold text-slate-700">Belum ada promo berlangsung</p>
      <p class="text-slate-500 text-sm mt-1">Nantikan info promo selanjutnya di website & media sosial Victoria Sekuritas.</p>
      <NuxtLink to="/produk" class="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-brand-gradient text-white text-sm font-semibold rounded-xl shadow-card">
        Mulai Investasi
      </NuxtLink>
    </div>

    <!-- List -->
    <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <NuxtLink v-for="e in events" :key="e.code" :to="`/promo/${e.code}`"
        class="group bg-white rounded-card border border-slate-100 shadow-card overflow-hidden hover:-translate-y-1 transition">
        <div class="h-32 bg-brand-gradient relative flex items-end p-4">
          <img v-if="e.banner_url" :src="e.banner_url" class="absolute inset-0 w-full h-full object-cover" :alt="e.name" />
          <span class="relative inline-flex items-center rounded-full bg-white/20 text-white px-2.5 py-1 text-xs font-semibold backdrop-blur">{{ e.event_type_label }}</span>
        </div>
        <div class="p-5">
          <div class="flex items-center gap-2 mb-2">
            <span v-if="e.is_ongoing" class="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Berlangsung
            </span>
            <span v-if="e.is_reward_available" class="text-xs font-semibold text-primary-600">🎁 Reward tersedia</span>
          </div>
          <h3 class="font-display font-bold text-slate-800 leading-snug line-clamp-2">{{ e.name }}</h3>
          <p class="text-sm text-slate-500 mt-1.5 line-clamp-2">{{ e.reward_description || e.description }}</p>
          <p class="text-xs text-slate-400 mt-3">{{ e.start_at }} — {{ e.end_at }}</p>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'public' })
const { get } = useApi()

const loading = ref(true)
const events = ref<any[]>([])

const fetchEvents = async () => {
  loading.value = true
  try {
    const res = await get<{ data: any[] }>('/events')
    events.value = res.data || []
  } catch {
    events.value = []
  } finally {
    loading.value = false
  }
}
onMounted(fetchEvents)

useHead({ title: 'Promo & Event — Victoria Sekuritas' })
</script>
