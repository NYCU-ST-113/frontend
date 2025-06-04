<script setup lang="ts">
import AppNavbar from '../components/AppNavbar.vue'
import AppSidebar from '../components/AppSidebar.vue'
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <!-- Header -->
    <AppNavbar />

    <div class="flex flex-1">
      <!-- Sidebar -->
      <AppSidebar />

      <!-- Main Content -->
      <main class="flex-1 p-4">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped></style>
