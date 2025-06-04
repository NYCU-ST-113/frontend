<script setup lang="ts">
import { callback } from '@/services/auth'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

const authStore = useAuthStore()
const route = useRoute()

const { username } = storeToRefs(authStore)

onMounted(() => {
  const code = route.query.code as string

  callback(code).finally(async () => {
    await authStore.updateAuthStatus()
    window.location.href = '/'
  })
})
</script>

<template>{{ username }}</template>

<style scoped></style>
