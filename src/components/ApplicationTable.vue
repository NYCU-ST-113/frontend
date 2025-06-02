<script setup lang="ts">
import { ApplicationStatus, ApplicationType, type ApplicationForm } from '@/types/application'
// import { useToast } from 'primevue/usetoast'
import { onMounted, ref } from 'vue'

// PrimeVue 組件
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import Tag from 'primevue/tag'
import Toast from 'primevue/toast'

const applications = ref()
const expandedRows = ref({})
// const toast = useToast()

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
      applicationId: 'DNS-2024-001',
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
        apply_date: new Date(1740270060000).toLocaleDateString(),
      },
    },
    {
      id: '2',
      applicationId: 'DNS-2024-002',
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
        apply_date: new Date().toLocaleDateString(),
      },
    },
    {
      id: '3',
      applicationId: 'DNS-2024-003',
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
        apply_date: new Date(1743380460000).toLocaleDateString(),
      },
    },
  ]

  applications.value.sort((a: any, b: any) => {
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()
    return dateB - dateA
  })
})

const getSeverity = (application: { status: string }) => {
  switch (application.status) {
    case ApplicationStatus.approved:
      return 'success'
    case ApplicationStatus.pending:
      return 'info'
    case ApplicationStatus.canceled:
      return 'danger'
    default:
      return 'secondary'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case ApplicationStatus.approved:
      return '已通過'
    case ApplicationStatus.pending:
      return '審核中'
    case ApplicationStatus.canceled:
      return '已拒絕'
    default:
      return status
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
    case ApplicationStatus.canceled:
      return 'danger'
    default:
      return 'secondary'
  }
}

// 取得操作按鈕文字
const getActionButtonLabel = (application: any): string => {
  switch (application.status) {
    case ApplicationStatus.approved:
      return '已通過'
    case ApplicationStatus.pending:
      return '審核中'
    case ApplicationStatus.canceled:
      return '已拒絕'
    default:
      return '無狀態'
  }
}

// 取得操作按鈕圖示
const getActionButtonIcon = (application: any): string => {
  switch (application.status) {
    case ApplicationStatus.approved:
      return 'pi pi-check'
    case ApplicationStatus.pending:
      return 'pi pi-clock'
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
      <h1 class="text-2xl font-bold text-gray-800 mb-2">服務申請管理</h1>
      <p class="text-gray-600">查看和管理您的服務申請記錄</p>
    </div>

    <div class="card bg-white rounded-lg shadow">
      <DataTable
        v-model:expanded-rows="expandedRows"
        :value="applications"
        data-key="id"
        table-style="min-width: 60rem"
        class="p-datatable-sm"
      >
        <template #header>
          <div class="flex flex-wrap justify-between items-center gap-2 p-4">
            <h2 class="text-lg font-semibold text-gray-800">申請記錄列表</h2>
            <div class="flex gap-2">
              <Button icon="pi pi-refresh" label="重新整理" outlined size="small" />
              <router-link to="/applications/create">
                <Button icon="pi pi-plus" label="新增申請" size="small" />
              </router-link>
            </div>
          </div>
        </template>

        <Column expander style="width: 5rem" />
        <Column field="applicationId" header="申請編號" sortable class="font-medium" />
        <Column field="date" header="申請日期" sortable />
        <Column field="type" header="申請類型" sortable>
          <template #body="slotProps">
            {{ getTypeText(slotProps.data.type) }}
          </template>
        </Column>
        <Column header="申請人">
          <template #body="slotProps">
            <div>
              <div class="font-medium">{{ slotProps.data.form.applicant_name }}</div>
              <div class="text-sm text-gray-500">{{ slotProps.data.form.department }}</div>
            </div>
          </template>
        </Column>
        <Column header="狀態" style="width: 8rem">
          <template #body="slotProps">
            <Tag
              :value="getStatusText(slotProps.data.status)"
              :severity="getSeverity(slotProps.data)"
              class="text-xs"
            />
          </template>
        </Column>
        <Column header="操作" style="width: 10rem">
          <template #body="slotProps">
            <Button
              :label="getActionButtonLabel(slotProps.data)"
              :severity="getActionButtonSeverity(slotProps.data)"
              :disabled="true"
              :icon="getActionButtonIcon(slotProps.data)"
              size="small"
              class="w-full"
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
                <p class="text-gray-900 font-semibold">{{ slotProps.data.applicationId }}</p>
              </div>
              <div class="bg-white p-3 rounded-lg border">
                <label class="text-sm font-medium text-gray-600">申請類型</label>
                <p class="text-gray-900 font-semibold">{{ getTypeText(slotProps.data.type) }}</p>
              </div>
              <div class="bg-white p-3 rounded-lg border">
                <label class="text-sm font-medium text-gray-600">申請日期</label>
                <p class="text-gray-900 font-semibold">{{ slotProps.data.date }}</p>
              </div>
              <div class="bg-white p-3 rounded-lg border">
                <label class="text-sm font-medium text-gray-600">申請狀態</label>
                <div class="mt-1">
                  <Tag
                    :value="getStatusText(slotProps.data.status)"
                    :severity="getSeverity(slotProps.data)"
                  />
                </div>
              </div>
            </div>

            <!-- 詳細申請資料 -->
            <div class="bg-white rounded-lg border">
              <h5 class="font-medium text-gray-800 p-4 border-b">申請表單詳細資料</h5>
              <DataTable
                :value="convertForm(slotProps.data.form)"
                data-key="key"
                class="border-none"
              >
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
