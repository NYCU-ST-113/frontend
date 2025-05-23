<script setup lang="ts">
import type { MenuItem } from 'primevue/menuitem'
import { ref } from 'vue'

const menuItems = ref<MenuItem[]>([
  {
    label: '管理功能',
    items: [
      {
        label: '個人資訊',
        icon: 'pi pi-user',
      },
      {
        label: '紀錄總覽',
        icon: 'pi pi-list',
      },
      {
        label: '申請管理',
        icon: 'pi pi-file-edit',
      },
      {
        label: '繳費管理',
        icon: 'pi pi-file-edit',
      },
    ],
  },
])
</script>

<template>
  <aside class="card flex justify-center">
    <Menu
      class="w-full md:w-40"
      :model="menuItems"
      :pt="{ root: 'rounded-none border-r-1 border-y-0' }"
    />
  </aside>
</template>

<style scoped></style>
