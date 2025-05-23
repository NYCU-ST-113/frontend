<script setup lang="ts">
import { ApplicationStatus, ApplicationType, type ApplicationForm } from '@/types/application'
import type { DataTableRowCollapseEvent } from 'primevue'
import { useToast } from 'primevue/usetoast'
import { onMounted, ref } from 'vue'

const applications = ref()
const expandedRows = ref({})
const toast = useToast()

const nestedColumns = {
  department: '系所單位',
  applicant_account: '申請人帳號',
  applicant_name: '申請人姓名',
  applicant_phone: '申請人電話',
  applicant_email: '申請人 Email',
  tech_contact_name: '技術聯絡人姓名',
  tech_contact_phone: '技術聯絡人電話',
  tech_contact_email: '技術聯絡人 Email',
  supervisor_name: '主管姓名',
  supervisor_id: '主管工號',
  supervisor_email: '主管 Email',
  apply_date: '申請日期',
}

onMounted(() => {
  applications.value = [
    {
      id: '1',

      date: new Date(1740270060000).toLocaleDateString(),
      type: ApplicationType.dns,
      status: ApplicationStatus.pending,

      form: {
        department: '資訊工程學系',
        applicant_account: 'b10901001',
        applicant_name: '王小明',
        applicant_phone: '0912345678',
        applicant_email: 'b10901001@nycu.edu.tw',
        tech_contact_name: '李大華',
        tech_contact_phone: '0922333444',
        tech_contact_email: 'tech@nycu.edu.tw',
        supervisor_name: '陳教授',
        supervisor_id: 'A123456789',
        supervisor_email: 'profchen@nycu.edu.tw',
      },
    },
    {
      id: '2',
      date: new Date().toLocaleDateString(),
      type: ApplicationType.dns,
      status: ApplicationStatus.approved,
      form: {
        department: '電機工程學系',
        applicant_account: 'b10902002',
        applicant_name: '林美麗',
        applicant_phone: '0987654321',
        applicant_email: 'b10902002@nycu.edu.tw',
        tech_contact_name: '張偉',
        tech_contact_phone: '0933555666',
        tech_contact_email: 'tech2@nycu.edu.tw',
        supervisor_name: '李教授',
        supervisor_id: 'B987654321',
        supervisor_email: 'profli@nycu.edu.tw',
      },
    },
    {
      id: '3',
      date: new Date(1743380460000).toLocaleDateString(),
      type: ApplicationType.dns,
      status: ApplicationStatus.canceled,
      form: {
        department: '應用數學系',
        applicant_account: 'b10903003',
        applicant_name: '陳志強',
        applicant_phone: '0977123456',
        applicant_email: 'b10903003@nycu.edu.tw',
        tech_contact_name: '王小華',
        tech_contact_phone: '0911222333',
        tech_contact_email: 'tech3@nycu.edu.tw',
        supervisor_name: '王教授',
        supervisor_id: 'C192837465',
        supervisor_email: 'profwang@nycu.edu.tw',
      },
    },
  ]

  applications.value.sort((a: any, b: any) => {
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()
    return dateB - dateA
  })
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
  expandedRows.value = applications.value.reduce(
    (acc: Record<string, boolean>, p: { id: string }) => (acc[p.id] = true) && acc,
    {} as Record<string, boolean>,
  )
}
const collapseAll = () => {
  expandedRows.value = {}
}
const getSeverity = (application: { status: string }) => {
  switch (application.status) {
    case 'Approved':
      return 'success'

    case 'Pending':
      return 'info'

    case 'Canceled':
      return 'danger'

    default:
      return 'secondary'
  }
}

const convertForm = (form: ApplicationForm) => {
  const data: { key: string; value: string }[] = []
  Object.entries(form).forEach(([key, value]) => {
    data.push({
      key: nestedColumns[key as keyof typeof nestedColumns],
      value: value,
    })
  })
  return data
}
</script>

<template>
  <div class="card">
    <DataTable
      v-model:expanded-rows="expandedRows"
      :value="applications"
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
      <Column field="id" header="編號" sortable />
      <Column field="date" header="申請日期" sortable />
      <Column field="type" header="申請類型" sortable />
      <Column header="狀態">
        <template #body="slotProps">
          <Tag :value="slotProps.data.status" :severity="getSeverity(slotProps.data)" />
        </template>
      </Column>
      <template #expansion="slotProps">
        <div class="p-4">
          <DataTable :value="convertForm(slotProps.data.form)" data-key="key">
            <Column key="key" field="key" header="欄位" />
            <Column key="value" field="value" header="值" />
          </DataTable>
        </div>
      </template>
    </DataTable>
    <Toast />
  </div>
</template>
