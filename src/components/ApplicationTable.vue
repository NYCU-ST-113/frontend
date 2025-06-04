<script setup lang="ts">
import { ApplicationStatus, ApplicationType, type ApplicationForm } from '@/types/application'
// import { useToast } from 'primevue/usetoast'
import { onMounted, ref, type Ref } from 'vue'

// PrimeVue 組件
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import Tag from 'primevue/tag'
import Toast from 'primevue/toast'

const props = defineProps<{
  applications: any[]
}>()
const formedApplications: Ref<object[]> = ref([])
const expandedRows = ref({})
// const toast = useToast()

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

onMounted(() => {
  formedApplications.value = props.applications
})

const getSeverity = (application: { status: string }) => {
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

const getTypeText = (type: string) => {
  switch (type) {
    case ApplicationType.dns:
      return 'DNS申請'
    default:
      return type
  }
}

// 檢查是否可以重新送出
// const canResubmit = (application: any): boolean => {
//   return false // 永遠不允許重新送出
// }

// 取得操作按鈕樣式
const getActionButtonSeverity = (application: any): string => {
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

// 取得操作按鈕文字
const getActionButtonLabel = (application: any): string => {
  switch (application.status) {
    case ApplicationStatus.approved:
      return '已通過'
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

// 取得操作按鈕圖示
const getActionButtonIcon = (application: any): string => {
  switch (application.status) {
    case ApplicationStatus.approved:
      return 'pi pi-check'
    case ApplicationStatus.pending:
      return 'pi pi-clock'
    case ApplicationStatus.rejected:
      return 'pi pi-times'
    case ApplicationStatus.canceled:
      return 'pi pi-times'
    default:
      return 'pi pi-question'
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
  <div class="p-4">
    <div class="mb-4">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">服務申請管理</h1>
      <p class="text-lg text-gray-600">查看和管理您的服務申請記錄</p>
    </div>

    <div class="card bg-white rounded-lg shadow">
      <DataTable
        v-model:expanded-rows="expandedRows"
        :value="formedApplications"
        data-key="id"
        table-style="min-width: 60rem"
        class="p-datatable-sm px-4"
      >
        <template #header>
          <div class="flex flex-wrap justify-between items-center gap-2 p-4">
            <h2 class="text-lg font-semibold text-gray-800"></h2>

            <div class="flex gap-2">
              <!--
                <Button icon="pi pi-refresh" label="重新整理" outlined size="small" />
              -->
              <router-link to="/applications/create">
                <Button icon="pi pi-plus" label="新增申請" size="small" />
              </router-link>
            </div>
          </div>
        </template>

        <Column expander class="w-24" />
        <Column field="index" header="編號" sortable class="font-medium" />
        <Column field="apply_date" header="申請日期" sortable />
        <Column field="type" header="申請類型" sortable>
          <template #body="slotProps">
            {{ getTypeText(slotProps.data.type) }}
          </template>
        </Column>
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

        <template #expansion="slotProps">
          <div class="p-6 bg-gray-50">
            <h4 class="text-lg font-medium text-gray-800 mb-4">申請詳細資訊</h4>

            <!-- 基本資訊 -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div class="bg-white p-3 rounded-lg border">
                <label class="text-sm font-medium text-gray-600">申請編號</label>
                <p class="text-gray-900 font-semibold">{{ slotProps.data.id }}</p>
              </div>
              <div class="bg-white p-3 rounded-lg border">
                <label class="text-sm font-medium text-gray-600">申請日期</label>
                <p class="text-gray-900 font-semibold">{{ slotProps.data.apply_date }}</p>
              </div>
              <div class="bg-white p-3 rounded-lg border">
                <label class="text-sm font-medium text-gray-600">申請類型</label>
                <p class="text-gray-900 font-semibold">{{ getTypeText(slotProps.data.type) }}</p>
              </div>
              <!--
              <div class="bg-white p-3 rounded-lg border">
                <label class="text-sm font-medium text-gray-600">申請狀態</label>
                <div class="mt-1">
                  <Tag
                    :value="getStatusText(slotProps.data.status)"
                    :severity="getSeverity(slotProps.data)"
                  />
                </div>
              </div>
              -->
            </div>

            <!-- 詳細申請資料 -->
            <div class="bg-white rounded-lg border">
              <h5 class="font-medium text-gray-800 p-4 border-b">申請表單詳細資料</h5>
              <DataTable :value="convertForm(slotProps.data)" data-key="key" class="border-none">
                <Column
                  field="key"
                  header="欄位"
                  class="font-medium bg-gray-50 border-r"
                  style="width: 30%"
                />
                <Column field="value" header="內容" class="break-all" />
              </DataTable>
            </div>
          </div>
        </template>
      </DataTable>
    </div>

    <Toast />
  </div>
</template>
