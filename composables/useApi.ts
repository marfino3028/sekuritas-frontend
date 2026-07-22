export const useApi = () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  const baseURL = config.public.apiBase

  const getHeaders = () => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }
    if (authStore.token) {
      headers['Authorization'] = `Bearer ${authStore.token}`
    }
    return headers
  }

  const get = async <T>(endpoint: string, params?: Record<string, any>): Promise<T> => {
    try {
      return await $fetch<T>(endpoint, {
        baseURL,
        headers: getHeaders(),
        params,
      })
    } catch (error: any) {
      handleError(error)
      throw error
    }
  }

  const post = async <T>(endpoint: string, body?: any): Promise<T> => {
    try {
      return await $fetch<T>(endpoint, {
        baseURL,
        method: 'POST',
        headers: getHeaders(),
        body,
      })
    } catch (error: any) {
      handleError(error)
      throw error
    }
  }

  const put = async <T>(endpoint: string, body?: any): Promise<T> => {
    try {
      return await $fetch<T>(endpoint, {
        baseURL,
        method: 'PUT',
        headers: getHeaders(),
        body,
      })
    } catch (error: any) {
      handleError(error)
      throw error
    }
  }

  const postFormData = async <T>(endpoint: string, formData: FormData): Promise<T> => {
    try {
      const headers: Record<string, string> = {
        Accept: 'application/json',
      }
      if (authStore.token) {
        headers['Authorization'] = `Bearer ${authStore.token}`
      }
      return await $fetch<T>(endpoint, {
        baseURL,
        method: 'POST',
        headers,
        body: formData,
      })
    } catch (error: any) {
      handleError(error)
      throw error
    }
  }

  const handleError = (error: any) => {
    if (error?.response?.status === 401) {
      authStore.logout()
    }
  }

  return { get, post, put, postFormData }
}

// API Laravel mengembalikan angka desimal sebagai STRING (mis. "18.67").
// Coerce defensif agar helper aman dipakai pada string maupun number.
const toNum = (v: unknown): number => {
  const n = typeof v === 'number' ? v : parseFloat(String(v ?? ''))
  return Number.isFinite(n) ? n : 0
}

// Helper to format IDR
export const formatIDR = (amount: number | string): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(toNum(amount))
}

// Helper to format number with thousand separator
export const formatNumber = (num: number | string): string => {
  return toNum(num).toLocaleString('id-ID')
}

// Helper to format percentage
export const formatPercent = (num: number | string, decimals = 2): string => {
  const n = toNum(num)
  return `${n >= 0 ? '+' : ''}${n.toFixed(decimals)}%`
}
