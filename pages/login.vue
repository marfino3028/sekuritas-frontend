<template>
  <div>
    <NuxtLayout name="auth">
      <div class="relative bg-white rounded-card shadow-card ring-1 ring-primary-50 border border-slate-100 p-7 overflow-hidden">
        <div class="pointer-events-none absolute -top-16 -right-16 w-44 h-44 rounded-full bg-brand-soft opacity-70 blur-2xl"></div>
        <div class="relative">
          <span class="inline-flex items-center rounded-full bg-accent-100 text-accent-600 text-[11px] font-bold uppercase tracking-wider px-3 py-1 mb-3">Masuk</span>
          <h1 class="font-display text-3xl font-extrabold tracking-tight text-slate-900 mb-1.5">Selamat Datang</h1>
          <p class="text-slate-500 text-sm mb-6">Masuk ke akun Victoria Sekuritas Anda.</p>

          <p v-if="error" class="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
            {{ error }}
            <NuxtLink v-if="needActivation" to="/register" class="font-semibold underline ml-1">Daftar ulang</NuxtLink>
          </p>

          <form @submit.prevent="submit" class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">Email</label>
              <input v-model="form.email" type="email" required placeholder="nama@email.com"
                class="w-full border border-slate-200 rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400" />
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <div class="relative">
                <input v-model="form.password" :type="show ? 'text' : 'password'" required placeholder="Password"
                  class="w-full border border-slate-200 rounded-xl px-3.5 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400" />
                <button type="button" @click="show = !show" class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                </button>
              </div>
            </div>

            <button type="submit" :disabled="authStore.loading || !form.email || !form.password"
              class="w-full py-3.5 rounded-xl font-semibold text-sm transition-all"
              :class="(form.email && form.password && !authStore.loading) ? 'bg-brand-gradient text-white shadow-card hover:-translate-y-0.5' : 'bg-slate-100 text-slate-400 cursor-not-allowed'">
              {{ authStore.loading ? 'Memproses…' : 'Masuk' }}
            </button>
          </form>

          <p class="text-center text-sm text-slate-500 mt-6">
            Belum punya akun?
            <NuxtLink to="/register" class="text-primary-600 font-semibold hover:underline">Daftar</NuxtLink>
          </p>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'guest', layout: false })

const authStore = useAuthStore()
const router = useRouter()

const form = ref({ email: '', password: '' })
const show = ref(false)
const error = ref('')
const needActivation = ref(false)

const submit = async () => {
  error.value = ''
  needActivation.value = false
  try {
    await authStore.loginEmail(form.value.email, form.value.password)
    // Datang dari link promo → catat pendaftaran event
    if (process.client) {
      const promoRef = localStorage.getItem('promo_ref')
      if (promoRef) {
        try { await useApi().post('/events/register', { code: promoRef }) } catch {}
        localStorage.removeItem('promo_ref')
      }
    }
    // KYC belum approved → lanjut pembukaan rekening; sudah → dashboard
    const approved = authStore.user?.kyc_status === 'approved'
    router.push(approved ? '/dashboard' : '/pembukaan-rekening/ekyc')
  } catch (e: any) {
    error.value = e?.data?.message || 'Email atau password salah.'
    needActivation.value = !!e?.data?.need_activation
  }
}

useHead({ title: 'Masuk — Victoria Sekuritas' })
</script>
