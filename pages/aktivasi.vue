<template>
  <div>
    <NuxtLayout name="auth">
      <div class="bg-white rounded-card shadow-card ring-1 ring-primary-50 border border-slate-100 p-8 text-center">
        <div v-if="state === 'loading'">
          <div class="w-14 h-14 mx-auto mb-4 rounded-full border-4 border-primary-100 border-t-primary-600 animate-spin"></div>
          <p class="text-slate-500 text-sm">Mengaktivasi akun Anda…</p>
        </div>

        <div v-else-if="state === 'success'">
          <div class="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
          </div>
          <h1 class="font-display text-2xl font-extrabold text-slate-900 mb-1.5">Akun Aktif!</h1>
          <p class="text-sm text-slate-500 mb-6">Akun Anda berhasil diaktivasi. Silakan login untuk melanjutkan pembukaan rekening.</p>
          <NuxtLink to="/login" class="inline-block bg-brand-gradient text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-card">Masuk Sekarang</NuxtLink>
        </div>

        <div v-else>
          <div class="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </div>
          <h1 class="font-display text-2xl font-extrabold text-slate-900 mb-1.5">Aktivasi Gagal</h1>
          <p class="text-sm text-slate-500 mb-6">{{ message }}</p>
          <NuxtLink to="/register" class="inline-block text-primary-600 font-semibold">Daftar ulang</NuxtLink>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const authStore = useAuthStore()
const route = useRoute()

const state = ref<'loading' | 'success' | 'error'>('loading')
const message = ref('')

onMounted(async () => {
  const token = route.query.token as string
  if (!token) { state.value = 'error'; message.value = 'Token aktivasi tidak ada.'; return }
  try {
    await authStore.activate(token)
    state.value = 'success'
  } catch (e: any) {
    state.value = 'error'
    message.value = e?.data?.message || 'Token tidak valid atau sudah digunakan.'
  }
})

useHead({ title: 'Aktivasi Akun — Victoria Sekuritas' })
</script>
