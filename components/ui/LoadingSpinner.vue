<template>
  <div class="flex items-center justify-center" :class="containerClass">
    <div
      class="rounded-full border-2 border-primary-100 animate-spin flex-shrink-0"
      :class="[spinnerSize, 'border-t-primary-600']"
    ></div>
    <span v-if="text" class="ml-3 text-sm font-medium text-primary-700/80">{{ text }}</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  text?: string
  fullPage?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  fullPage: false,
})

const SPINNER_SIZES: Record<string, string> = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
}
const spinnerSize = computed(() => SPINNER_SIZES[props.size])

const containerClass = computed(() =>
  props.fullPage ? 'fixed inset-0 bg-white/80 z-50' : 'py-8'
)
</script>
