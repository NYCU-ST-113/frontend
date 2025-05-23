import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  function getProfile() {
    return null
  }

  return { getProfile }
})
