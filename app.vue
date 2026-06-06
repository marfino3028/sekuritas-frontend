<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()

// Try to restore auth on app load
onMounted(async () => {
  if (authStore.token) {
    try {
      await authStore.fetchMe()
    } catch {
      authStore.logout()
    }
  }
})
</script>
