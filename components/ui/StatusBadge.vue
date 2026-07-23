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

// NOTE: kyc_* dan transaksi punya beberapa nilai status yang sama secara string
// (mis. keduanya punya 'pending'), jadi masing-masing WAJIB pakai key dengan
// prefix sendiri di sini. Jangan gabung ke satu key polos seperti 'pending'
// lagi -- itu penyebab bug lama (transaksi pending nampil sebagai "Belum KYC").
const statusMap: Record<string, StatusConfig> = {
  // KYC statuses (prefix kyc_)
  kyc_pending: { color: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400', label: 'Belum KYC' },
  kyc_submitted: { color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500', label: 'Menunggu Verifikasi' },
  kyc_approved: { color: 'bg-green-100 text-green-700', dot: 'bg-green-500', label: 'Terverifikasi' },
  kyc_rejected: { color: 'bg-red-100 text-red-600', dot: 'bg-red-500', label: 'Ditolak' },

  // Transaction statuses — harus persis sama dengan konstanta di
  // app/Models/Transaction.php (STATUS_PENDING, STATUS_PAID, dst)
  pending: { color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500', label: 'Menunggu Pembayaran' },
  paid: { color: 'bg-primary-100 text-primary-700', dot: 'bg-primary-500', label: 'Pembayaran Diterima' },
  processing: { color: 'bg-primary-100 text-primary-700', dot: 'bg-primary-500', label: 'Sedang Diproses' },
  settled: { color: 'bg-green-100 text-green-700', dot: 'bg-green-500', label: 'Selesai' },
  failed: { color: 'bg-red-100 text-red-600', dot: 'bg-red-500', label: 'Gagal' },

  // Legacy aliases (dipertahankan untuk kompatibilitas mundur bila masih dipakai)
  waiting_payment: { color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500', label: 'Menunggu Bayar' },
  waiting_confirm: { color: 'bg-primary-100 text-primary-700', dot: 'bg-primary-500', label: 'Diproses' },
  approve: { color: 'bg-accent-100 text-accent-700', dot: 'bg-accent-500', label: 'Disetujui' },
  completed: { color: 'bg-green-100 text-green-700', dot: 'bg-green-500', label: 'Selesai' },
  cancelled: { color: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400', label: 'Dibatalkan' },

  // Aliases lain
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
