<script setup lang="ts">
import type { MenuItem } from 'primevue/menuitem'
import { ref } from 'vue'

const menuItems = ref<MenuItem[]>([
  {
    label: '管理功能',
    items: [
      {
        label: '管理儀表板',
        icon: 'pi pi-home',
        url: '/admin',
      },
      {
        label: '個人審核資訊',
        icon: 'pi pi-user',
        url: '/admin/profile',
      },
      {
        label: '申請管理',
        icon: 'pi pi-file-edit',
        url: '/admin/applications',
      },
      {
        label: '繳費管理',
        icon: 'pi pi-dollar',
        url: '/admin/payments',
      },
      {
        label: '寄送通知',
        icon: 'pi pi-envelope',
        url: '/admin/mail',
      },
    ],
  },
])
</script>

<template>
  <aside class="card flex justify-center">
    <Menu
      class="w-full md:w-40 hidden md:flex"
      :model="menuItems"
      :pt="{ root: 'rounded-none border-r-1 border-y-0' }"
    />
  </aside>
</template>

<style scoped></style>
