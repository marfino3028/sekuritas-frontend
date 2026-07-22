<template>
  <div class="max-w-3xl mx-auto px-4 py-8 lg:py-12">
    <NuxtLink to="/promo" class="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary-700 mb-6">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
      Semua Promo
    </NuxtLink>

    <div v-if="loading" class="h-72 rounded-card bg-slate-100 animate-pulse"></div>

    <div v-else-if="!event" class="text-center py-20">
      <p class="text-lg font-bold text-slate-700">Event tidak ditemukan</p>
      <p class="text-slate-500 text-sm mt-1">Kode promo tidak valid atau sudah berakhir.</p>
      <NuxtLink to="/promo" class="inline-block mt-6 text-primary-700 font-semibold">← Kembali ke Promo</NuxtLink>
    </div>

    <div v-else class="bg-white rounded-card border border-slate-100 shadow-card overflow-hidden">
      <div class="h-44 bg-brand-gradient relative flex items-end p-6">
        <img v-if="event.banner_url" :src="event.banner_url" class="absolute inset-0 w-full h-full object-cover" :alt="event.name" />
        <div class="relative">
          <span class="inline-flex items-center rounded-full bg-white/20 text-white px-2.5 py-1 text-xs font-semibold backdrop-blur mb-2">{{ event.event_type_label }}</span>
          <h1 class="text-2xl lg:text-3xl font-display font-extrabold text-white leading-tight">{{ event.name }}</h1>
        </div>
      </div>

      <div class="p-6 lg:p-8">
        <div class="flex flex-wrap gap-3 mb-5 text-sm">
          <span v-if="event.is_ongoing" class="inline-flex items-center gap-1.5 text-emerald-600 font-semibold"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Sedang berlangsung</span>
          <span class="text-slate-500">📅 {{ event.start_at }} — {{ event.end_at }}</span>
          <span v-if="event.location" class="text-slate-500">📍 {{ event.location }}</span>
        </div>

        <p class="text-slate-600 leading-relaxed mb-6">{{ event.description }}</p>

        <!-- Reward -->
        <div v-if="event.reward_description" class="rounded-xl bg-primary-50 border border-primary-100 p-5 mb-6">
          <p class="text-sm font-bold text-primary-800 flex items-center gap-2">🎁 Benefit Khusus via Link Ini</p>
          <p class="text-sm text-primary-700 mt-1.5">{{ event.reward_description }}</p>
          <p v-if="event.reward_quota" class="text-xs text-primary-500 mt-2">
            Kuota reward: {{ event.reward_slots_remaining }} / {{ event.reward_quota }} tersisa
          </p>
        </div>

        <p v-if="message" class="mb-4 p-3 rounded-xl text-sm"
           :class="messageOk ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'">{{ message }}</p>

        <button
          class="w-full sm:w-auto px-8 py-3 bg-brand-gradient text-white font-semibold rounded-xl shadow-card disabled:opacity-50"
          :disabled="submitting || event.is_full"
          @click="join">
          {{ event.is_full ? 'Kuota Penuh' : (submitting ? 'Memproses…' : 'Ikuti Event & Klaim Benefit') }}
        </button>
        <p class="text-xs text-slate-400 mt-2">Pendaftaran melalui link ini tercatat untuk keperluan reward promo.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'public' })
const { get, post } = useApi()
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const code = route.params.kode as string
const loading = ref(true)
const submitting = ref(false)
const event = ref<any>(null)
const message = ref('')
const messageOk = ref(false)

const fetchEvent = async () => {
  loading.value = true
  try {
    const res = await get<{ data: any }>(`/events/${code}`)
    event.value = res.data
  } catch {
    event.value = null
  } finally {
    loading.value = false
  }
}
onMounted(fetchEvent)

const join = async () => {
  // Belum login → arahkan ke registrasi dengan membawa kode referral
  if (!authStore.token) {
    router.push(`/register?ref=${encodeURIComponent(code)}`)
    return
  }
  submitting.value = true
  message.value = ''
  try {
    await post('/events/register', { code })
    messageOk.value = true
    message.value = 'Berhasil terdaftar di event ini! Benefit akan diproses sesuai ketentuan.'
    await fetchEvent()
  } catch (e: any) {
    messageOk.value = false
    message.value = e?.data?.message || 'Gagal mendaftar event. Coba lagi.'
  } finally {
    submitting.value = false
  }
}

useHead(() => ({ title: (event.value?.name || 'Promo') + ' — Victoria Sekuritas' }))
</script>
