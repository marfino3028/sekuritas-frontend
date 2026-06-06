<template>
  <div class="p-4 lg:p-6 max-w-xl mx-auto">
    <!-- Profile header -->
    <div class="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 text-white mb-4">
      <div class="flex items-center gap-4">
        <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold">
          {{ userInitial }}
        </div>
        <div>
          <h2 class="text-xl font-bold">{{ authStore.user?.name || 'Pengguna' }}</h2>
          <p class="text-teal-200 text-sm">+62{{ authStore.user?.phone }}</p>
          <div class="mt-1">
            <StatusBadge :status="kycStatus" />
          </div>
        </div>
      </div>

      <!-- KYC Status message -->
      <div
        v-if="!authStore.isKycApproved"
        class="mt-4 bg-white/10 rounded-xl p-3 flex items-start gap-2"
      >
        <svg class="w-4 h-4 text-yellow-300 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <p class="text-sm text-white">
          {{ authStore.isKycSubmitted
            ? 'Akun sedang diverifikasi. Mohon tunggu 1-2 hari kerja.'
            : 'Lengkapi verifikasi KYC untuk mulai berinvestasi.' }}
        </p>
      </div>
    </div>

    <!-- Account Info -->
    <div v-if="authStore.isKycApproved" class="bg-white rounded-2xl border border-gray-100 shadow-card p-5 mb-4">
      <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Informasi Akun</h3>
      <div class="space-y-3">
        <div class="flex justify-between">
          <span class="text-sm text-gray-500">Nomor SID</span>
          <span class="text-sm font-medium text-gray-800">{{ authStore.user?.sid_number || '-' }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-sm text-gray-500">Nomor IFUA</span>
          <span class="text-sm font-medium text-gray-800">{{ authStore.user?.ifua_number || '-' }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-sm text-gray-500">Profil Risiko</span>
          <span class="text-sm font-medium" :class="{
            'text-blue-600': authStore.user?.risk_profile === 'Low',
            'text-orange-500': authStore.user?.risk_profile === 'Moderate',
            'text-red-600': authStore.user?.risk_profile === 'High',
          }">{{ riskProfileLabel }}</span>
        </div>
      </div>
    </div>

    <!-- Settings menu -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden mb-4">
      <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider px-5 pt-4 pb-2">Pengaturan Akun</h3>
      <div class="divide-y divide-gray-100">
        <button
          v-for="item in accountSettings"
          :key="item.label"
          @click="handleMenuClick(item)"
          class="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors text-left"
        >
          <div class="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <span class="text-base">{{ item.icon }}</span>
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-800">{{ item.label }}</p>
            <p v-if="item.desc" class="text-xs text-gray-400">{{ item.desc }}</p>
          </div>
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Support & Legal -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden mb-4">
      <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider px-5 pt-4 pb-2">Bantuan & Legal</h3>
      <div class="divide-y divide-gray-100">
        <button
          v-for="item in supportItems"
          :key="item.label"
          @click="handleMenuClick(item)"
          class="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors text-left"
        >
          <div class="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <span class="text-base">{{ item.icon }}</span>
          </div>
          <span class="flex-1 text-sm font-medium text-gray-800">{{ item.label }}</span>
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Logout button -->
    <button
      @click="confirmLogout = true"
      class="w-full flex items-center justify-center gap-2 bg-red-50 border border-red-200 text-red-600 font-semibold py-3.5 rounded-xl hover:bg-red-100 transition-colors text-sm"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
      Keluar dari Akun
    </button>

    <!-- App version -->
    <p class="text-center text-xs text-gray-400 mt-6">Sekuritas v1.0.0 • Berizin dan Diawasi OJK</p>

    <!-- Logout confirmation modal -->
    <div v-if="confirmLogout" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="confirmLogout = false">
      <div class="absolute inset-0 bg-black/50" @click="confirmLogout = false"></div>
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 z-10 text-center">
        <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </div>
        <h3 class="text-lg font-bold text-gray-800 mb-2">Keluar dari Akun?</h3>
        <p class="text-gray-500 text-sm mb-6">Anda harus masuk kembali untuk mengakses akun Anda.</p>
        <div class="flex gap-3">
          <button
            @click="confirmLogout = false"
            class="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm"
          >
            Batal
          </button>
          <button
            @click="doLogout"
            class="flex-1 bg-red-600 text-white font-semibold py-2.5 rounded-xl hover:bg-red-700 transition-colors text-sm"
          >
            Keluar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import StatusBadge from '~/components/ui/StatusBadge.vue'

definePageMeta({ middleware: 'auth' })

const authStore = useAuthStore()
const router = useRouter()
const confirmLogout = ref(false)

const userInitial = computed(() => (authStore.user?.name || 'U').charAt(0).toUpperCase())

const kycStatus = computed(() => authStore.user?.kyc_status || 'pending')

const RISK_LABELS: Record<string, string> = {
  conservative: 'Konservatif',
  moderate_conservative: 'Moderat Konservatif',
  moderate: 'Moderat',
  moderate_aggressive: 'Moderat Agresif',
  aggressive: 'Agresif',
}
const riskProfileLabel = computed(() => RISK_LABELS[authStore.user?.risk_profile_result || ''] || '-')

const accountSettings = [
  { label: 'Ubah Email', desc: 'Perbarui alamat email Anda', icon: '📧', action: 'email' },
  { label: 'Ubah Nomor HP', desc: 'Verifikasi nomor HP baru', icon: '📱', action: 'phone' },
  { label: 'Ubah PIN', desc: 'Ganti PIN keamanan akun', icon: '🔒', action: 'pin' },
  { label: 'Data Profil', desc: 'Lihat informasi KYC Anda', icon: '👤', action: 'profile' },
  { label: 'Rekening Bank', desc: 'Kelola rekening bank terdaftar', icon: '🏦', action: 'bank' },
]

const supportItems = [
  { label: 'Hubungi Kami', icon: '💬', action: 'contact' },
  { label: 'Syarat & Ketentuan', icon: '📋', action: 'terms' },
  { label: 'Kebijakan Privasi', icon: '🔐', action: 'privacy' },
  { label: 'Pertanyaan Umum (FAQ)', icon: '❓', action: 'faq' },
]

const handleMenuClick = (item: any) => {
  if (item.action === 'terms') {
    // open terms
  } else if (item.action === 'privacy') {
    // open privacy
  } else if (item.action === 'contact') {
    window.open('https://wa.me/6281234567890', '_blank')
  } else {
    // Navigate to sub-pages
    // router.push(`/profil/${item.action}`)
  }
}

const doLogout = () => {
  confirmLogout.value = false
  authStore.logout()
}
</script>
