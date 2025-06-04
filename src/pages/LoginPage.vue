<script setup lang="ts">
import { login } from '@/services/auth'
</script>

<template>
  <div class="h-dvh w-dvw flex flex-col mt-16">
    <div class="flex justify-center items-center">
      <h1 class="text-6xl">服務申請系統</h1>
    </div>
    <div class="flex flex-col justify-center items-center mt-32">
      <Button
        label="登入"
        rounded
        size="large"
        icon="pi pi-sign-in"
        raised
        data-test="login-button"
        @click="login"
      />
    </div>
  </div>
</template>

<style scoped></style>
