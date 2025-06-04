<script setup lang="ts">
import ApplicationTable from '@/components/ApplicationTable.vue'
import { getUserApplications } from '@/services/application'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { onMounted, ref, type Ref } from 'vue'

const isLoading = ref(true)
const authStore = useAuthStore()
const { username } = storeToRefs(authStore)
const applications: Ref<any[]> = ref([])

onMounted(async () => {
  try {
    applications.value = await getUserApplications(username.value)
    applications.value = applications.value.map((app, index) => {
      return {
        index: index + 1,
        id: app.id,
        type: app.type,
        ...app.base,
        ...app.extra,
        applydate: app.base.apply_date.includes('T')
          ? app.base.apply_date.split('T')[0]
          : app.base.apply_date,
      }
    })
  } catch (err) {
    console.error('Failed to fetch applications:', err)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div v-if="!isLoading" class="flex flex-col px-8 py-4">
    <ApplicationTable :applications="applications" />
  </div>
</template>
