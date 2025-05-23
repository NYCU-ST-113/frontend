<template>
  <div class="flex flex-col min-h-screen">
    <!-- Header -->
    <AppNavbar />

    <div class="flex flex-1">
      <!-- Sidebar -->
      <AppSidebar />

      <!-- Main Content -->
      <Main class="flex-1 p-4">
        <router-view />
      </Main>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppNavbar from '../components/AppNavbar.vue'
import AppSidebar from '../components/AppSidebar.vue'
</script>

<style scoped></style>
