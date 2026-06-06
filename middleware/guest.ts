export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()

  if (authStore.token && authStore.user) {
    return navigateTo('/dashboard')
  }
})
