<template>
  <div class="p-4 lg:p-8 max-w-4xl mx-auto">

    <!-- KYC Banner -->
    <div
      v-if="!authStore.isKycApproved"
      class="mb-6 rounded-card p-5 border"
      :class="{
        'bg-amber-50 border-amber-200': authStore.isKycSubmitted,
        'bg-primary-50 border-primary-100': authStore.isKycPending,
      }"
    >
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
             :class="authStore.isKycSubmitted ? 'bg-amber-100' : 'bg-primary-100'">
          <svg v-if="authStore.isKycSubmitted" class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <svg v-else class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="flex-1">
          <p class="text-sm font-semibold" :class="authStore.isKycSubmitted ? 'text-amber-800' : 'text-primary-800'">
            {{ authStore.isKycSubmitted ? 'Akun sedang diverifikasi' : 'Lengkapi Verifikasi KYC' }}
          </p>
          <p class="text-xs mt-0.5" :class="authStore.isKycSubmitted ? 'text-amber-700' : 'text-primary-700'">
            {{ authStore.isKycSubmitted
              ? 'Mohon tunggu maksimal 2 hari kerja.'
              : 'Verifikasi identitas Anda untuk mulai bertransaksi.' }}
          </p>
        </div>
        <NuxtLink
          v-if="!authStore.isKycSubmitted"
          to="/kyc"
          class="flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-primary-600 transition-all hover:bg-primary-700"
        >
          Lengkapi
        </NuxtLink>
      </div>
    </div>

    <!-- Greeting + date -->
    <div class="mb-6 flex items-start justify-between gap-4">
      <div>
        <h2 class="font-display text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900">
          Selamat Datang, {{ firstName }}!
        </h2>
        <p class="text-slate-400 text-xs mt-1">{{ todayDate }}</p>
      </div>
      <!-- Market pulse chip -->
      <div class="hidden sm:flex items-center gap-1.5 bg-green-50 border border-green-100 rounded-full px-3 py-1.5">
        <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
        <span class="text-xs font-medium text-green-700">Pasar Aktif</span>
      </div>
    </div>

    <!-- Portfolio Hero Card -->
    <div class="relative overflow-hidden rounded-card mb-6 text-white bg-brand-gradient shadow-soft">
      <!-- Decorative orbs -->
      <div class="absolute -top-20 -right-16 w-64 h-64 rounded-full opacity-25 blur-2xl"
           style="background: radial-gradient(circle, #A78BFA, transparent 70%)"></div>
      <div class="absolute -bottom-16 -left-12 w-48 h-48 rounded-full opacity-20 blur-2xl"
           style="background: radial-gradient(circle, #C7D2FE, transparent 70%)"></div>

      <div class="relative p-6 lg:p-7">
        <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <p class="text-xs font-medium mb-2 text-white/70">Total Nilai Portofolio</p>
            <p class="font-display text-4xl font-extrabold tracking-tight">{{ formatIDR(portfolioData.totalValue) }}</p>
            <div class="flex items-center gap-2 mt-3">
              <div class="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
                   :class="portfolioData.returnPercent >= 0 ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" :d="portfolioData.returnPercent >= 0
                    ? 'M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z'
                    : 'M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z'"
                   clip-rule="evenodd" />
                </svg>
                {{ portfolioData.returnPercent >= 0 ? '+' : '' }}{{ portfolioData.returnPercent.toFixed(2) }}%
              </div>
              <span class="text-xs text-white/60">dari modal awal</span>
            </div>
          </div>
        </div>

        <div class="mt-6 grid grid-cols-2 gap-3">
          <div class="rounded-xl p-4 bg-white/10 ring-1 ring-white/10">
            <p class="text-xs mb-1 text-white/60">Modal Investasi</p>
            <p class="text-sm font-semibold">{{ formatIDR(portfolioData.totalInvested) }}</p>
          </div>
          <div class="rounded-xl p-4 bg-white/10 ring-1 ring-white/10">
            <p class="text-xs mb-1 text-white/60">Imbal Hasil</p>
            <p class="text-sm font-semibold" :class="portfolioData.returnAmount >= 0 ? 'text-green-200' : 'text-red-200'">
              {{ portfolioData.returnAmount >= 0 ? '+' : '' }}{{ formatIDR(portfolioData.returnAmount) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-4 gap-3 mb-6">
      <NuxtLink
        v-for="action in quickActions"
        :key="action.label"
        :to="action.to"
        class="bg-white rounded-card p-4 border border-slate-100 shadow-card flex flex-col items-center gap-2.5 hover:shadow-card-hover hover:-translate-y-0.5 transition-all text-center"
      >
        <div class="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
             :style="`background: ${action.bg}`">
          {{ action.icon }}
        </div>
        <span class="text-xs font-semibold text-slate-600 leading-tight">{{ action.label }}</span>
      </NuxtLink>
    </div>

    <!-- Onboarding Checklist -->
    <div class="bg-white rounded-card border border-slate-100 shadow-card mb-6 overflow-hidden">
      <div class="px-6 py-5 flex items-center justify-between border-b border-slate-100">
        <div>
          <h3 class="font-display font-bold text-slate-900 text-sm">Aktivitas Akun</h3>
          <p class="text-xs text-slate-400 mt-0.5">Langkah untuk mulai berinvestasi</p>
        </div>
        <div class="text-xs font-semibold px-3 py-1 rounded-full bg-primary-50 text-primary-700">
          {{ checklist.filter(i => i.done).length }}/{{ checklist.length }}
        </div>
      </div>
      <div class="divide-y divide-slate-50">
        <div v-for="(item, idx) in checklist" :key="item.label" class="flex items-center gap-4 px-6 py-4">
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold"
            :class="item.done ? 'text-white bg-brand-gradient' : 'bg-slate-100 text-slate-400'"
          >
            <svg v-if="item.done" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
            </svg>
            <span v-else>{{ idx + 1 }}</span>
          </div>
          <div class="flex-1">
            <p class="text-sm font-semibold text-slate-800">{{ item.label }}</p>
            <p class="text-xs text-slate-400 mt-0.5">{{ item.desc }}</p>
          </div>
          <NuxtLink
            v-if="!item.done && item.link"
            :to="item.link"
            class="text-xs font-semibold px-3.5 py-1.5 rounded-xl text-white bg-primary-600 transition-all hover:bg-primary-700"
          >
            {{ item.action }}
          </NuxtLink>
          <span v-else-if="item.done" class="text-xs font-semibold text-primary-600">Selesai</span>
        </div>
      </div>
    </div>

    <!-- Recent transactions -->
    <div class="bg-white rounded-card border border-slate-100 shadow-card">
      <div class="flex items-center justify-between px-6 py-5 border-b border-slate-100">
        <div>
          <h3 class="font-display font-bold text-slate-900 text-sm">Transaksi Terkini</h3>
          <p class="text-xs text-slate-400 mt-0.5">Aktivitas investasi Anda</p>
        </div>
        <NuxtLink to="/transaksi" class="text-xs font-semibold text-primary-600 hover:text-primary-700 hover:underline">Lihat semua</NuxtLink>
      </div>
      <div v-if="recentTransactions.length === 0" class="px-6 py-14 text-center">
        <div class="w-16 h-16 rounded-2xl bg-brand-soft flex items-center justify-center mx-auto mb-4">
          <svg class="w-7 h-7 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p class="text-slate-400 text-sm font-medium">Belum ada transaksi</p>
        <NuxtLink to="/produk" class="inline-block mt-4 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-primary-600 transition-all hover:bg-primary-700">
          Mulai Investasi
        </NuxtLink>
      </div>
      <div v-else class="divide-y divide-slate-50">
        <div v-for="trx in recentTransactions" :key="trx.id" class="flex items-center gap-4 px-6 py-4">
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold"
            :class="{
              'bg-green-100 text-green-700': trx.type === 'subscription',
              'bg-red-100 text-red-700': trx.type === 'redemption',
              'bg-accent-100 text-accent-700': trx.type === 'switching',
            }"
          >
            {{ trx.type === 'subscription' ? '↓' : trx.type === 'redemption' ? '↑' : '⇄' }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-slate-800 truncate">{{ trx.fund_name }}</p>
            <p class="text-xs text-slate-400">{{ trx.date }}</p>
          </div>
          <div class="text-right">
            <p class="text-sm font-semibold" :class="trx.type === 'subscription' ? 'text-slate-800' : 'text-green-600'">
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
  { label: 'Beli', icon: '📈', to: '/produk', bg: 'linear-gradient(135deg, #E0E7FF, #C7D2FE)' },
  { label: 'Portofolio', icon: '💼', to: '/portofolio', bg: 'linear-gradient(135deg, #EDE9FE, #DDD6FE)' },
  { label: 'Transaksi', icon: '📋', to: '/transaksi', bg: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)' },
  { label: 'Profil', icon: '⚙️', to: '/profil', bg: 'linear-gradient(135deg, #F5F3FF, #EDE9FE)' },
]

const recentTransactions: any[] = []
</script>
