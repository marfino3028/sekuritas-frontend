<template>
  <span
    class="inline-flex items-center gap-1.5 font-semibold rounded-full ring-1 ring-inset ring-black/5 tracking-tight"
    :class="[sizeClass, colorClass]"
  >
    <span v-if="showDot" class="w-1.5 h-1.5 rounded-full" :class="dotClass"></span>
    {{ label }}
  </span>
</template>

<script setup lang="ts">
interface Props {
  status: string
  size?: 'xs' | 'sm' | 'md'
  showDot?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'sm',
  showDot: true,
})

const SIZE_CLASSES: Record<string, string> = {
  xs: 'px-2 py-0.5 text-xs',
  sm: 'px-2.5 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
}
const sizeClass = computed(() => SIZE_CLASSES[props.size])

type StatusConfig = { color: string; dot: string; label: string }

const statusMap: Record<string, StatusConfig> = {
  // KYC statuses
  pending: { color: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400', label: 'Belum KYC' },
  submitted: { color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500', label: 'Menunggu Verifikasi' },
  approved: { color: 'bg-green-100 text-green-700', dot: 'bg-green-500', label: 'Terverifikasi' },
  rejected: { color: 'bg-red-100 text-red-600', dot: 'bg-red-500', label: 'Ditolak' },

  // Transaction statuses
  waiting_payment: { color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500', label: 'Menunggu Bayar' },
  waiting_confirm: { color: 'bg-primary-100 text-primary-700', dot: 'bg-primary-500', label: 'Diproses' },
  approve: { color: 'bg-accent-100 text-accent-700', dot: 'bg-accent-500', label: 'Disetujui' },
  completed: { color: 'bg-green-100 text-green-700', dot: 'bg-green-500', label: 'Selesai' },
  cancelled: { color: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400', label: 'Dibatalkan' },
  failed: { color: 'bg-red-100 text-red-600', dot: 'bg-red-500', label: 'Gagal' },

  // Aliases
  active: { color: 'bg-green-100 text-green-700', dot: 'bg-green-500', label: 'Aktif' },
  inactive: { color: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400', label: 'Tidak Aktif' },
}

const config = computed<StatusConfig>(() => statusMap[props.status] || {
  color: 'bg-gray-100 text-gray-600',
  dot: 'bg-gray-400',
  label: props.status,
})

const colorClass = computed(() => config.value.color)
const dotClass = computed(() => config.value.dot)
const label = computed(() => config.value.label)
</script>
