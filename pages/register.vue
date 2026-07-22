<template>
  <div>
    <NuxtLayout name="auth">
      <div class="relative bg-white rounded-card shadow-card ring-1 ring-primary-50 border border-slate-100 p-7 overflow-hidden">
        <div class="pointer-events-none absolute -top-16 -right-16 w-44 h-44 rounded-full bg-brand-soft opacity-70 blur-2xl"></div>

        <div class="relative">
          <!-- Sukses: cek email -->
          <div v-if="done" class="text-center py-4">
            <div class="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            </div>
            <h1 class="font-display text-2xl font-extrabold text-slate-900 mb-1.5">Cek Email Anda</h1>
            <p class="text-sm text-slate-500 mb-1">Kami mengirim link aktivasi ke</p>
            <p class="text-sm font-semibold text-primary-700 mb-5">{{ form.email }}</p>
            <p class="text-xs text-slate-400 mb-6">Klik link di email untuk mengaktifkan akun, lalu login untuk melanjutkan pembukaan rekening.</p>
            <NuxtLink to="/login" class="inline-block bg-brand-gradient text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-card">Ke Halaman Masuk</NuxtLink>
            <p class="text-xs text-slate-400 mt-4">Mode demo: link aktivasi juga muncul di <code>storage/logs/laravel.log</code>.</p>
          </div>

          <!-- Form daftar -->
          <template v-else>
            <span class="inline-flex items-center rounded-full bg-accent-100 text-accent-600 text-[11px] font-bold uppercase tracking-wider px-3 py-1 mb-3">Daftar</span>
            <h1 class="font-display text-3xl font-extrabold tracking-tight text-slate-900 mb-1.5">Buat Akun</h1>
            <p class="text-slate-500 text-sm mb-6">Daftar dengan email untuk mendapatkan User ID Anda.</p>

            <p v-if="error" class="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">{{ error }}</p>

            <form @submit.prevent="submit" class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                <input v-model="form.email" type="email" required placeholder="nama@email.com"
                  class="w-full border border-slate-200 rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                <input v-model="form.password" type="password" required placeholder="Min. 8 karakter"
                  class="w-full border border-slate-200 rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400" />
                <p class="text-xs text-slate-400 mt-1">Minimal 8 karakter.</p>
              </div>
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">Konfirmasi Password</label>
                <input v-model="form.confirm" type="password" required placeholder="Ulangi password"
                  class="w-full border border-slate-200 rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400" />
              </div>

              <label class="flex items-start gap-3 text-sm text-slate-600">
                <input v-model="agree" type="checkbox" class="mt-0.5 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                <span>Saya menyetujui <a href="#" class="text-primary-600 font-semibold">Syarat &amp; Ketentuan</a> dan <a href="#" class="text-primary-600 font-semibold">Kebijakan Privasi</a> PT Victoria Sekuritas Indonesia.</span>
              </label>

              <button type="submit" :disabled="!canSubmit || authStore.loading"
                class="w-full py-3.5 rounded-xl font-semibold text-sm transition-all"
                :class="canSubmit && !authStore.loading ? 'bg-brand-gradient text-white shadow-card hover:-translate-y-0.5' : 'bg-slate-100 text-slate-400 cursor-not-allowed'">
                {{ authStore.loading ? 'Memproses…' : 'Daftar' }}
              </button>
            </form>

            <p class="text-center text-sm text-slate-500 mt-6">
              Sudah punya akun?
              <NuxtLink to="/login" class="text-primary-600 font-semibold hover:underline">Masuk</NuxtLink>
            </p>
          </template>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'guest', layout: false })

const authStore = useAuthStore()
const route = useRoute()

const form = ref({ email: '', password: '', confirm: '' })
const agree = ref(false)
const error = ref('')
const done = ref(false)
const refCode = ref((route.query.ref as string) || '')

const canSubmit = computed(() =>
  !!form.value.email && form.value.password.length >= 8 && form.value.password === form.value.confirm && agree.value)

const submit = async () => {
  error.value = ''
  if (form.value.password !== form.value.confirm) { error.value = 'Konfirmasi password tidak cocok.'; return }
  if (form.value.password.length < 8) { error.value = 'Password minimal 8 karakter.'; return }
  try {
    await authStore.registerEmail(form.value.email, form.value.password)
    if (refCode.value && process.client) localStorage.setItem('promo_ref', refCode.value)
    done.value = true
  } catch (e: any) {
    error.value = e?.data?.message || (e?.data?.errors ? Object.values(e.data.errors)[0]?.[0] : '') || 'Gagal mendaftar.'
  }
}

useHead({ title: 'Daftar — Victoria Sekuritas' })
</script>
