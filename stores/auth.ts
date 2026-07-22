import { defineStore } from 'pinia'

export interface User {
  id: number
  name: string
  phone: string
  email?: string
  kyc_status: 'pending' | 'submitted' | 'approved' | 'rejected' | null
  sid_number?: string
  ifua_number?: string
  risk_profile?: string
  avatar?: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: (process.client ? localStorage.getItem('auth_token') : null) as string | null,
    loading: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    isKycApproved: (state) => state.user?.kyc_status === 'approved',
    isKycSubmitted: (state) => state.user?.kyc_status === 'submitted',
    isKycPending: (state) => !state.user?.kyc_status || state.user?.kyc_status === 'pending',
    isSidActive: (state) => !!state.user?.sid_number,
    isIfuaActive: (state) => !!state.user?.ifua_number,
  },

  actions: {
    async login(phone: string, pin: string) {
      const config = useRuntimeConfig()
      this.loading = true
      try {
        const data = await $fetch<{ data: { token: string; user: User } }>('/auth/login', {
          baseURL: config.public.apiBase,
          method: 'POST',
          body: { phone, pin },
        })
        this.token = data.data.token
        this.user = data.data.user
        if (process.client) {
          localStorage.setItem('auth_token', this.token)
        }
        return data
      } finally {
        this.loading = false
      }
    },

    // --- Flow WEB (email + password) ---
    async registerEmail(email: string, password: string, name?: string) {
      const config = useRuntimeConfig()
      this.loading = true
      try {
        return await $fetch('/auth/register-email', {
          baseURL: config.public.apiBase,
          method: 'POST',
          body: { email, password, name },
        })
      } finally {
        this.loading = false
      }
    },

    async activate(token: string) {
      const config = useRuntimeConfig()
      return $fetch('/auth/activate', {
        baseURL: config.public.apiBase,
        method: 'POST',
        body: { token },
      })
    },

    async loginEmail(email: string, password: string) {
      const config = useRuntimeConfig()
      this.loading = true
      try {
        const data = await $fetch<{ data: { token: string; user: User } }>('/auth/login-email', {
          baseURL: config.public.apiBase,
          method: 'POST',
          body: { email, password },
        })
        this.token = data.data.token
        this.user = data.data.user
        if (process.client) localStorage.setItem('auth_token', this.token)
        return data
      } finally {
        this.loading = false
      }
    },

    async sendOtp(phone: string) {
      const config = useRuntimeConfig()
      return $fetch('/auth/send-otp', {
        baseURL: config.public.apiBase,
        method: 'POST',
        body: { phone },
      })
    },

    async verifyOtp(phone: string, otp: string) {
      const config = useRuntimeConfig()
      return $fetch('/auth/verify-otp', {
        baseURL: config.public.apiBase,
        method: 'POST',
        body: { phone, otp },
      })
    },

    async register(phone: string, otp: string, pin: string) {
      const config = useRuntimeConfig()
      this.loading = true
      try {
        const data = await $fetch<{ data: { token: string; user: User } }>('/auth/register', {
          baseURL: config.public.apiBase,
          method: 'POST',
          body: { phone, otp, pin },
        })
        this.token = data.data.token
        this.user = data.data.user
        if (process.client) {
          localStorage.setItem('auth_token', this.token)
        }
        return data
      } finally {
        this.loading = false
      }
    },

    async fetchMe() {
      const config = useRuntimeConfig()
      if (!this.token) return
      const data = await $fetch<{ data: User }>('/auth/me', {
        baseURL: config.public.apiBase,
        headers: { Authorization: `Bearer ${this.token}` },
      })
      this.user = data.data
    },

    logout() {
      this.user = null
      this.token = null
      if (process.client) {
        localStorage.removeItem('auth_token')
      }
      navigateTo('/login')
    },
  },
})
