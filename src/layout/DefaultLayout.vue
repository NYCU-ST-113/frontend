<template>
  <div class="h-dvh w-dvw flex flex-col">
    <!-- Header -->
    <AppNavbar />

    <div class="flex">
      <!-- Main Content -->
      <Main class="flex-1 px-12 py-8">
        <Transition name="fade" mode="out-in">
          <router-view />
        </Transition>
      </Main>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppNavbar from '../components/AppNavbar.vue'
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
