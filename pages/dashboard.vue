<template>
  <div class="p-4 lg:p-6 max-w-4xl mx-auto">

    <!-- KYC Banner -->
    <div
      v-if="!authStore.isKycApproved"
      class="mb-5 rounded-2xl p-4 border"
      :class="{
        'bg-amber-50 border-amber-200': authStore.isKycSubmitted,
        'bg-sky-50 border-sky-200': authStore.isKycPending,
      }"
    >
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
             :class="authStore.isKycSubmitted ? 'bg-amber-100' : 'bg-sky-100'">
          <svg v-if="authStore.isKycSubmitted" class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <svg v-else class="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="flex-1">
          <p class="text-sm font-semibold" :class="authStore.isKycSubmitted ? 'text-amber-800' : 'text-sky-800'">
            {{ authStore.isKycSubmitted ? 'Akun sedang diverifikasi' : 'Lengkapi Verifikasi KYC' }}
          </p>
          <p class="text-xs mt-0.5" :class="authStore.isKycSubmitted ? 'text-amber-700' : 'text-sky-700'">
            {{ authStore.isKycSubmitted
              ? 'Mohon tunggu maksimal 2 hari kerja.'
              : 'Verifikasi identitas Anda untuk mulai bertransaksi.' }}
          </p>
        </div>
        <NuxtLink
          v-if="!authStore.isKycSubmitted"
          to="/kyc"
          class="flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90"
          style="background: linear-gradient(135deg, #0ea5e9, #14b8a6)"
        >
          Lengkapi
        </NuxtLink>
      </div>
    </div>

    <!-- Greeting + date -->
    <div class="mb-5 flex items-start justify-between">
      <div>
        <h2 class="text-xl font-bold text-gray-800">
          Selamat Datang, {{ firstName }}!
        </h2>
        <p class="text-gray-400 text-xs mt-0.5">{{ todayDate }}</p>
      </div>
      <!-- Market pulse chip -->
      <div class="hidden sm:flex items-center gap-1.5 bg-green-50 border border-green-100 rounded-full px-3 py-1.5">
        <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
        <span class="text-xs font-medium text-green-700">Pasar Aktif</span>
      </div>
    </div>

    <!-- Portfolio Hero Card -->
    <div class="relative overflow-hidden rounded-2xl mb-5 text-white"
         style="background: linear-gradient(135deg, #0f172a 0%, #134e4a 55%, #0c4a6e 100%)">
      <!-- Decorative circles -->
      <div class="absolute -top-16 -right-16 w-56 h-56 rounded-full opacity-10"
           style="background: radial-gradient(circle, #5eead4, transparent)"></div>
      <div class="absolute -bottom-10 -left-10 w-40 h-40 rounded-full opacity-10"
           style="background: radial-gradient(circle, #38bdf8, transparent)"></div>

      <div class="relative p-5">
        <p class="text-xs font-medium mb-1" style="color: rgba(255,255,255,0.6)">Total Nilai Portofolio</p>
        <p class="text-3xl font-bold tracking-tight">{{ formatIDR(portfolioData.totalValue) }}</p>
        <div class="flex items-center gap-1.5 mt-1.5">
          <div class="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
               :class="portfolioData.returnPercent >= 0 ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" :d="portfolioData.returnPercent >= 0
                ? 'M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z'
                : 'M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z'"
               clip-rule="evenodd" />
            </svg>
            {{ portfolioData.returnPercent >= 0 ? '+' : '' }}{{ portfolioData.returnPercent.toFixed(2) }}%
          </div>
          <span class="text-xs" style="color: rgba(255,255,255,0.5)">dari modal awal</span>
        </div>

        <div class="mt-4 grid grid-cols-2 gap-3">
          <div class="rounded-xl p-3" style="background: rgba(255,255,255,0.08)">
            <p class="text-xs mb-1" style="color: rgba(255,255,255,0.5)">Modal Investasi</p>
            <p class="text-sm font-semibold">{{ formatIDR(portfolioData.totalInvested) }}</p>
          </div>
          <div class="rounded-xl p-3" style="background: rgba(255,255,255,0.08)">
            <p class="text-xs mb-1" style="color: rgba(255,255,255,0.5)">Imbal Hasil</p>
            <p class="text-sm font-semibold" :class="portfolioData.returnAmount >= 0 ? 'text-green-300' : 'text-red-300'">
              {{ portfolioData.returnAmount >= 0 ? '+' : '' }}{{ formatIDR(portfolioData.returnAmount) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-4 gap-3 mb-5">
      <NuxtLink
        v-for="action in quickActions"
        :key="action.label"
        :to="action.to"
        class="bg-white rounded-2xl p-3 border border-gray-100 shadow-card flex flex-col items-center gap-2 hover:border-teal-200 hover:shadow-md transition-all text-center"
      >
        <div class="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
             :style="`background: ${action.bg}`">
          {{ action.icon }}
        </div>
        <span class="text-xs font-medium text-gray-600 leading-tight">{{ action.label }}</span>
      </NuxtLink>
    </div>

    <!-- Onboarding Checklist -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-card mb-5 overflow-hidden">
      <div class="px-5 py-4 flex items-center justify-between" style="border-bottom: 1px solid #f3f4f6">
        <div>
          <h3 class="font-semibold text-gray-800 text-sm">Aktivitas Akun</h3>
          <p class="text-xs text-gray-400 mt-0.5">Langkah untuk mulai berinvestasi</p>
        </div>
        <div class="text-xs font-medium px-2.5 py-1 rounded-full bg-teal-50 text-teal-700">
          {{ checklist.filter(i => i.done).length }}/{{ checklist.length }}
        </div>
      </div>
      <div class="divide-y divide-gray-50">
        <div v-for="(item, idx) in checklist" :key="item.label" class="flex items-center gap-4 px-5 py-4">
          <div
            class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold"
            :class="item.done ? 'text-white' : 'bg-gray-100 text-gray-400'"
            :style="item.done ? 'background: linear-gradient(135deg, #14b8a6, #0ea5e9)' : ''"
          >
            <svg v-if="item.done" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
            </svg>
            <span v-else>{{ idx + 1 }}</span>
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-800">{{ item.label }}</p>
            <p class="text-xs text-gray-400 mt-0.5">{{ item.desc }}</p>
          </div>
          <NuxtLink
            v-if="!item.done && item.link"
            :to="item.link"
            class="text-xs font-semibold px-3 py-1.5 rounded-lg text-white transition-all hover:opacity-90"
            style="background: linear-gradient(135deg, #14b8a6, #0ea5e9)"
          >
            {{ item.action }}
          </NuxtLink>
          <span v-else-if="item.done" class="text-xs font-medium text-teal-600">Selesai</span>
        </div>
      </div>
    </div>

    <!-- Recent transactions -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-card">
      <div class="flex items-center justify-between px-5 py-4" style="border-bottom: 1px solid #f3f4f6">
        <div>
          <h3 class="font-semibold text-gray-800 text-sm">Transaksi Terkini</h3>
          <p class="text-xs text-gray-400 mt-0.5">Aktivitas investasi Anda</p>
        </div>
        <NuxtLink to="/transaksi" class="text-xs font-semibold text-teal-600 hover:underline">Lihat semua</NuxtLink>
      </div>
      <div v-if="recentTransactions.length === 0" class="px-5 py-12 text-center">
        <div class="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-3">
          <svg class="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p class="text-gray-400 text-sm font-medium">Belum ada transaksi</p>
        <NuxtLink to="/produk" class="inline-block mt-3 px-4 py-2 rounded-xl text-xs font-semibold text-white"
                  style="background: linear-gradient(135deg, #14b8a6, #0ea5e9)">
          Mulai Investasi
        </NuxtLink>
      </div>
      <div v-else class="divide-y divide-gray-50">
        <div v-for="trx in recentTransactions" :key="trx.id" class="flex items-center gap-4 px-5 py-4">
          <div
            class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold"
            :class="{
              'bg-green-100 text-green-700': trx.type === 'subscription',
              'bg-red-100 text-red-700': trx.type === 'redemption',
              'bg-orange-100 text-orange-700': trx.type === 'switching',
            }"
          >
            {{ trx.type === 'subscription' ? '↓' : trx.type === 'redemption' ? '↑' : '⇄' }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-800 truncate">{{ trx.fund_name }}</p>
            <p class="text-xs text-gray-400">{{ trx.date }}</p>
          </div>
          <div class="text-right">
            <p class="text-sm font-semibold" :class="trx.type === 'subscription' ? 'text-gray-800' : 'text-green-600'">
              {{ trx.type === 'subscription' ? '-' : '+' }}{{ formatIDR(trx.amount) }}
            </p>
            <StatusBadge :status="trx.status" size="xs" />
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import StatusBadge from '~/components/ui/StatusBadge.vue'
import { formatIDR } from '~/composables/useApi'

definePageMeta({ middleware: 'auth' })

const authStore = useAuthStore()

const firstName = computed(() => {
  return authStore.user?.name?.split(' ')[0] || 'Investor'
})

const todayDate = computed(() => {
  return new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
})

const portfolioData = reactive({
  totalValue: 0,
  totalInvested: 0,
  returnAmount: 0,
  returnPercent: 0,
})

const checklist = computed(() => [
  {
    label: 'Daftar Akun',
    desc: 'Akun berhasil dibuat',
    done: true,
    link: null,
    action: null,
  },
  {
    label: 'Verifikasi KYC',
    desc: authStore.isKycApproved
      ? 'Identitas Anda sudah diverifikasi'
      : authStore.isKycSubmitted
        ? 'Sedang dalam proses verifikasi (1-2 hari kerja)'
        : 'Lengkapi data diri dan upload KTP',
    done: authStore.isKycApproved,
    link: authStore.isKycPending ? '/kyc' : null,
    action: 'Lengkapi KYC',
  },
  {
    label: 'Mulai Investasi',
    desc: portfolioData.totalValue > 0 ? 'Anda sudah mulai berinvestasi' : 'Beli reksa dana pertama Anda',
    done: portfolioData.totalValue > 0,
    link: authStore.isKycApproved ? '/produk' : null,
    action: 'Beli Reksa Dana',
  },
])

const quickActions = [
  { label: 'Beli', icon: '📈', to: '/produk', bg: 'linear-gradient(135deg, #d1fae5, #a7f3d0)' },
  { label: 'Portofolio', icon: '💼', to: '/portofolio', bg: 'linear-gradient(135deg, #e0f2fe, #bae6fd)' },
  { label: 'Transaksi', icon: '📋', to: '/transaksi', bg: 'linear-gradient(135deg, #fef3c7, #fde68a)' },
  { label: 'Profil', icon: '⚙️', to: '/profil', bg: 'linear-gradient(135deg, #f3e8ff, #e9d5ff)' },
]

const recentTransactions: any[] = []
</script>
