<script setup lang="ts">
import AdminApplicationTable from '@/components/AdminApplicationTable.vue'
import { getAllApplications } from '@/services/application'
import { onMounted, ref, type Ref } from 'vue'

const isLoading = ref(false)
const applications: Ref<any[]> = ref([])

const fetchData = async () => {
  try {
    isLoading.value = true
    applications.value = await getAllApplications()
    applications.value = applications.value.map((app, index) => {
      return {
        index: index + 1,
        id: app.id,
        type: app.type,
        ...app.base,
        ...app.extra,
        apply_date: app.base.apply_date.includes('T')
          ? app.base.apply_date.split('T')[0]
          : app.base.apply_date,
      }
    })
  } catch (err) {
    console.error('Failed to fetch applications:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await fetchData()
})
</script>

<template>
  <div class="flex flex-col px-8 py-4">
    <AdminApplicationTable
      :is-loading="isLoading"
      :applications="applications"
      @refresh="fetchData"
    />
  </div>
</template>
