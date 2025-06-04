<template>
  <div class="h-dvh w-dvw flex flex-col">
    <!-- Header -->
    <AppNavbar />

    <div class="flex">
      <!-- Main Content -->
      <main class="flex-1 md:px-12 md:py-4">
        <Transition name="fade" mode="out-in">
          <RouterView />
        </Transition>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppNavbar from '../components/AppNavbar.vue'
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease;
}

.fade-enter-from,
.fade-leave-to {
  transition: none;
  opacity: 0;
}
</style>
