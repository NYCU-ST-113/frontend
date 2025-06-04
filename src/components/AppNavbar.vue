<script setup lang="ts">
import { logout } from '@/services/auth'
import { ref } from 'vue'

const items = ref([
  {
    label: '首頁',
    icon: 'pi pi-home',
    path: '/',
  },
  {
    label: '申請總覽',
    icon: 'pi pi-home',
    path: '/applications',
  },
  {
    label: '繳費總覽',
    icon: 'pi pi-home',
    path: '/payments',
  },
  {
    label: '使用規範',
    icon: 'pi pi-home',
    path: '/terms',
  },
])

const handleLogout = () => {
  try {
    console.log('Logging out...')

    logout()

    window.location.href = '/login'
  } catch (err) {
    console.error('Logout failed:', err)
  }
}
</script>

<template>
  <div class="sticky top-0 z-50 bg-white">
    <div class="card">
      <Menubar :model="items">
        <template #start>
          <Image src="/nycu-logo.png" width="60" height="60" />
        </template>
        <template #item="{ item, props, hasSubmenu, root }">
          <router-link v-ripple class="flex items-center" v-bind="props.action" :to="item.path">
            <span>{{ item.label }}</span>
            <Badge
              v-if="item.badge"
              :class="{ 'ml-auto': !root, 'ml-2': root }"
              :value="item.badge"
            />
            <span
              v-if="item.shortcut"
              class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1"
              >{{ item.shortcut }}
            </span>
            <i
              v-if="hasSubmenu"
              :class="[
                'pi pi-angle-down ml-auto',
                { 'pi-angle-down': root, 'pi-angle-right': !root },
              ]"
            />
          </router-link>
        </template>
        <template #end>
          <div class="flex items-center gap-2">
            <Button as-child outlined size="small" severity="secondary" data-test="admin-button">
              <RouterLink
                to="/admin"
                class="p-button p-button-outlined p-button-secondary p-button-sm flex items-center gap-2"
              >
                <i class="pi pi-angle-right" />
                <span>管理者</span>
              </RouterLink>
            </Button>
            <Button
              icon="pi pi-user"
              outlined
              size="small"
              label="登出"
              data-test="logout-button"
              @click="handleLogout"
            />
          </div>
        </template>
      </Menubar>
    </div>
  </div>
</template>
