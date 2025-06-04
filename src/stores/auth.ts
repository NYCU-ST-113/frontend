import { getProfile } from '@/services/auth'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    username: localStorage.getItem('username') || '',
    email: localStorage.getItem('email') || '',
    loading: false,
  }),

  actions: {
    isAuthenticated() {
      return localStorage.getItem('token') !== null
    },

    async updateAuthStatus() {
    this.loading = true
      try {
        this.username = localStorage.getItem('username') || ''
        this.email = localStorage.getItem('email') || ''

        const username = await getProfile()
        if (username != this.username) {
          throw new Error('Username mismatch')
        }
      } catch (err) {
        console.error('Failed to update status:', err)

        this.username = ''
        this.email = ''

        localStorage.removeItem('token')
        localStorage.removeItem('username')
        localStorage.removeItem('email')

        window.location.href = '/login'
      } finally {
        this.loading = false
      }
    },
  },
})
