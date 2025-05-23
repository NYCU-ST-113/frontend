<script setup lang="ts">
import { PaymentStatus } from '@/types/payment'
import type { DataTableRowCollapseEvent } from 'primevue'
import { useToast } from 'primevue/usetoast'
import { onMounted, ref } from 'vue'

const payments = ref()
const expandedRows = ref({})
const toast = useToast()

onMounted(() => {
  payments.value = [
    {
      id: '1',
      serviceId: 'SVC001',
      amount: 1500,
      user_id: 'U001',
      status: PaymentStatus.paid,
      date: new Date('2024-05-01T10:00:00').toLocaleString(),
      email: 'user1@example.com',
    },
    {
      id: '2',
      serviceId: 'SVC002',
      amount: 2000,
      user_id: 'U002',
      status: PaymentStatus.pending,
      date: new Date('2024-05-03T14:30:00').toLocaleString(),
      email: 'user2@example.com',
    },
    {
      id: '3',
      serviceId: 'SVC003',
      amount: 1200,
      user_id: 'U003',
      status: PaymentStatus.failed,
      date: new Date('2024-05-05T09:15:00').toLocaleString(),
      email: 'user3@example.com',
    },
  ]
})

const onRowExpand = (event: DataTableRowCollapseEvent) => {
  toast.add({ severity: 'info', summary: 'Product Expanded', detail: event.data.name, life: 3000 })
}

const onRowCollapse = (event: DataTableRowCollapseEvent) => {
  toast.add({
    severity: 'success',
    summary: 'Product Collapsed',
    detail: event.data.name,
    life: 3000,
  })
}

const expandAll = () => {
  expandedRows.value = payments.value.reduce(
    (acc: Record<string, boolean>, p: { id: string }) => (acc[p.id] = true) && acc,
    {} as Record<string, boolean>,
  )
}

const collapseAll = () => {
  expandedRows.value = {}
}

const getSeverity = (application: { status: string }) => {
  switch (application.status) {
    case PaymentStatus.paid:
      return 'success'

    case PaymentStatus.pending:
      return 'info'

    case PaymentStatus.failed:
      return 'danger'

    default:
      return 'secondary'
  }
}
</script>

<template>
  <div class="card">
    <DataTable
      v-model:expanded-rows="expandedRows"
      :value="payments"
      data-key="id"
      table-style="min-width: 60rem"
      @row-expand="onRowExpand"
      @row-collapse="onRowCollapse"
    >
      <template #header>
        <div class="flex flex-wrap justify-end gap-2">
          <Button text icon="pi pi-plus" label="Expand All" @click="expandAll" />
          <Button text icon="pi pi-minus" label="Collapse All" @click="collapseAll" />
        </div>
      </template>
      <Column expander style="width: 5rem" />
      <Column field="id" header="編號" />
      <Column field="date" header="繳費申請日期" />
      <Column field="amount" header="金額" />
      <Column header="狀態">
        <template #body="slotProps">
          <Tag :value="slotProps.data.status" :severity="getSeverity(slotProps.data)" />
        </template>
      </Column>
      <template #expansion="slotProps">
        <div class="p-4">
          <DataTable :value="slotProps.data" data-key="key"></DataTable>
        </div>
      </template>
    </DataTable>
    <Toast />
  </div>
</template>
