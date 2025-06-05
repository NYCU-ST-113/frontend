<script setup lang="ts">
import { ApplicationStatus, type ApplicationForm } from '@/types/application'
import { useToast } from 'primevue/usetoast'
import { ref, watch } from 'vue'

// PrimeVue 組件
import { approveApplication, deleteApplication, rejectApplication } from '@/services/application'
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import Tag from 'primevue/tag'
import Toast from 'primevue/toast'

const props = defineProps<{
  isLoading: boolean
  applications: any[]
}>()
const emit = defineEmits<{
  (e: 'refresh'): void
}>()

const formedApplications = ref<object[]>([])
const expandedRows = ref({})
const toast = useToast()

const processingIds = ref<Set<string>>(new Set())

const nestedColumns = {
  index: '編號',
  id: '申請編號',
  type: '申請類型',
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
  status: '申請狀態',
  applicant_unit: '申請人單位',
  domain_name: '網域名稱',
  application_project: '申請專案',
  dns_manage_account: 'DNS 管理帳號',
  reason: '申請原因',
}

const getSeverity = (application: { status: ApplicationStatus }) => {
  switch (application.status) {
    case ApplicationStatus.approved:
      return 'success'
    case ApplicationStatus.pending:
      return 'info'
    case ApplicationStatus.rejected:
      return 'danger'
    case ApplicationStatus.canceled:
      return 'secondary'
    default:
      return 'contrast'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case ApplicationStatus.approved:
      return '已核可'
    case ApplicationStatus.pending:
      return '審核中'
    case ApplicationStatus.rejected:
      return '已拒絕'
    case ApplicationStatus.canceled:
      return '已取消'
    default:
      return '未知狀態'
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

const canReview = (application: any): boolean => {
  return application.status === ApplicationStatus.pending
}

const isProcessing = (applicationId: string): boolean => {
  return processingIds.value.has(applicationId)
}

const handleApprove = async (application: any) => {
  processingIds.value.add(application.id)

  try {
    await approveApplication(application.id)

    const index = formedApplications.value.findIndex((app: any) => app.id === application.id)
    if (index !== -1) {
      formedApplications.value[index] = {
        ...formedApplications.value[index],
        status: ApplicationStatus.approved,
      }
    }

    toast.add({
      severity: 'success',
      summary: '審核完成',
      detail: `申請編號 ${application.id} 已通過審核`,
      life: 3000,
    })
  } catch (error) {
    console.error('審核失敗:', error)
    toast.add({
      severity: 'error',
      summary: '審核失敗',
      detail: '系統發生錯誤，請稍後再試',
      life: 3000,
    })
  } finally {
    processingIds.value.delete(application.id)
  }
}

const handleReject = async (application: any) => {
  processingIds.value.add(application.id)

  try {
    await rejectApplication(application.id)

    const index = formedApplications.value.findIndex((app: any) => app.id === application.id)
    if (index !== -1) {
      formedApplications.value[index] = {
        ...formedApplications.value[index],
        status: ApplicationStatus.rejected,
      }
    }

    toast.add({
      severity: 'info',
      summary: '審核完成',
      detail: `申請編號 ${application.id} 已拒絕`,
      life: 3000,
    })
  } catch (error) {
    console.error('審核失敗:', error)
    toast.add({
      severity: 'error',
      summary: '審核失敗',
      detail: '系統發生錯誤，請稍後再試',
      life: 3000,
    })
  } finally {
    processingIds.value.delete(application.id)
  }
}

const handleDelete = async (application: any) => {
  if (!confirm(`確定要刪除申請編號 ${application.id} 嗎？`)) {
    return
  }

  processingIds.value.add(application.id)

  try {
    await deleteApplication(application.id)

    const index = formedApplications.value.findIndex((app: any) => app.id === application.id)
    if (index !== -1) {
      formedApplications.value[index] = {
        ...formedApplications.value[index],
        status: ApplicationStatus.canceled,
      }
    }

    toast.add({
      severity: 'info',
      summary: '刪除完成',
      detail: `申請編號 ${application.id} 已刪除`,
      life: 3000,
    })
    emit('refresh')
  } catch (error) {
    console.error('審核失敗:', error)
    toast.add({
      severity: 'error',
      summary: '刪除失敗',
      detail: '系統發生錯誤，請稍後再試',
      life: 3000,
    })
  } finally {
    processingIds.value.delete(application.id)
  }
}

watch(
  () => props.applications,
  () => {
    formedApplications.value = props.applications
  },
  { immediate: true },
)
</script>

<template>
  <div class="p-4">
    <div class="mb-4">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">申請審核管理</h1>
      <p class="text-lg text-gray-600">管理和審核所有申請記錄</p>
    </div>

    <ProgressSpinner v-if="isLoading" />
    <div v-else class="card bg-white rounded-lg shadow">
      <DataTable
        v-model:expanded-rows="expandedRows"
        :value="formedApplications"
        data-key="id"
        table-style="min-width: 60rem"
        class="p-datatable-sm px-4"
      >
        <!--
        <template #header>
          <div class="flex flex-wrap justify-between items-center gap-2 p-4">
            <h2 class="text-lg font-semibold text-gray-800">申請列表</h2>
              <router-link to="/applications/create">
                <Button icon="pi pi-plus" label="新增申請" outlined />
              </router-link>
            </div>
          </template>
        -->

        <Column expander class="w-24" />
        <Column field="index" header="編號" sortable class="font-medium" />
        <Column field="apply_date" header="申請日期" sortable />
        <Column field="type" header="申請類型" sortable />
        <Column header="申請人">
          <template #body="slotProps">
            <div>
              <div class="font-medium">{{ slotProps.data.applicant_name }}</div>
              <div class="text-sm text-gray-500">{{ slotProps.data.department }}</div>
            </div>
          </template>
        </Column>
        <Column header="狀態" class="w-32">
          <template #body="slotProps">
            <Tag
              :value="getStatusText(slotProps.data.status)"
              :severity="getSeverity(slotProps.data)"
              class="text-xs"
            />
          </template>
        </Column>
        <Column header="操作" class="w-64">
          <template #body="slotProps">
            <div class="flex gap-2">
              <Button
                v-if="
                  slotProps.data.status === ApplicationStatus.pending ||
                  slotProps.data.status === ApplicationStatus.rejected
                "
                icon="pi pi-check"
                label="核可"
                size="small"
                severity="success"
                :loading="isProcessing(slotProps.data.id)"
                :disabled="isProcessing(slotProps.data.id)"
                @click="handleApprove(slotProps.data)"
              />
              <Button
                v-if="
                  slotProps.data.status === ApplicationStatus.pending ||
                  slotProps.data.status === ApplicationStatus.approved
                "
                icon="pi pi-times"
                label="拒絕"
                size="small"
                severity="danger"
                :loading="isProcessing(slotProps.data.id)"
                :disabled="isProcessing(slotProps.data.id)"
                @click="handleReject(slotProps.data)"
              />
              <Button
                icon="pi pi-trash"
                label="刪除"
                size="small"
                severity="contrast"
                :loading="isProcessing(slotProps.data.id)"
                :disabled="isProcessing(slotProps.data.id)"
                @click="handleDelete(slotProps.data)"
              />
            </div>
          </template>
        </Column>

        <template #expansion="slotProps">
          <div class="p-6 bg-gray-50">
            <h4 class="text-lg font-medium mb-4 text-gray-800">申請詳細資訊</h4>
            <DataTable
              :value="convertForm(slotProps.data)"
              data-key="key"
              class="bg-white rounded border"
            >
              <Column field="key" header="欄位" class="font-medium bg-gray-50" style="width: 30%" />
              <Column field="value" header="內容" />
            </DataTable>
          </div>
        </template>
      </DataTable>
    </div>

    <Toast />
  </div>
</template>
