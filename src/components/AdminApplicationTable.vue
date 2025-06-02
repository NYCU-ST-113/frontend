<script setup lang="ts">
import { ApplicationStatus, ApplicationType, type ApplicationForm } from '@/types/application'
import { useToast } from 'primevue/usetoast'
import { onMounted, ref } from 'vue'

// PrimeVue 組件
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import Dialog from 'primevue/dialog'
import Tag from 'primevue/tag'
import Textarea from 'primevue/textarea'
import Toast from 'primevue/toast'

const applications = ref()
const expandedRows = ref({})
const toast = useToast()

// 審核對話框相關
const showReviewDialog = ref(false)
const selectedApplication = ref<any>(null)
const reviewComment = ref('')
const isProcessing = ref(false)

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
        apply_date: '2024-06-01',
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
        apply_date: '2024-05-28',
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
        apply_date: '2024-05-25',
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

const getStatusText = (status: string) => {
  switch (status) {
    case 'Approved':
      return '已通過'
    case 'Pending':
      return '待審核'
    case 'Canceled':
      return '已拒絕'
    default:
      return status
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

// 檢查是否可以審核
const canReview = (application: any): boolean => {
  return application.status === ApplicationStatus.pending
}

// 開始審核流程
const startReview = (application: any) => {
  selectedApplication.value = application
  reviewComment.value = ''
  showReviewDialog.value = true
}

// 通過申請
const approveApplication = async () => {
  if (!selectedApplication.value) return

  isProcessing.value = true

  try {
    // 模擬 API 呼叫
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // 更新申請狀態
    selectedApplication.value.status = ApplicationStatus.approved

    toast.add({
      severity: 'success',
      summary: '審核完成',
      detail: `申請編號 ${selectedApplication.value.id} 已通過審核`,
      life: 3000,
    })

    showReviewDialog.value = false
  } catch (error) {
    console.error('審核失敗:', error)
    toast.add({
      severity: 'error',
      summary: '審核失敗',
      detail: '系統發生錯誤，請稍後再試',
      life: 3000,
    })
  } finally {
    isProcessing.value = false
  }
}

// 拒絕申請
const rejectApplication = async () => {
  if (!selectedApplication.value) return

  if (!reviewComment.value.trim()) {
    toast.add({
      severity: 'warn',
      summary: '請輸入拒絕原因',
      detail: '拒絕申請時必須提供原因說明',
      life: 3000,
    })
    return
  }

  isProcessing.value = true

  try {
    // 模擬 API 呼叫
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // 更新申請狀態
    selectedApplication.value.status = ApplicationStatus.canceled

    toast.add({
      severity: 'info',
      summary: '審核完成',
      detail: `申請編號 ${selectedApplication.value.id} 已拒絕`,
      life: 3000,
    })

    showReviewDialog.value = false
  } catch (error) {
    console.error('審核失敗:', error)
    toast.add({
      severity: 'error',
      summary: '審核失敗',
      detail: '系統發生錯誤，請稍後再試',
      life: 3000,
    })
  } finally {
    isProcessing.value = false
  }
}

// 關閉對話框
const closeReviewDialog = () => {
  showReviewDialog.value = false
  selectedApplication.value = null
  reviewComment.value = ''
}
</script>

<template>
  <div class="p-4">
    <div class="mb-4">
      <h1 class="text-2xl font-bold text-gray-800 mb-2">申請審核管理</h1>
      <p class="text-gray-600">管理和審核所有申請記錄</p>
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
            <h2 class="text-lg font-semibold text-gray-800">申請列表</h2>
            <router-link to="/applications/create">
              <Button icon="pi pi-plus" label="新增申請" outlined />
            </router-link>
          </div>
        </template>

        <Column expander style="width: 5rem" />
        <Column field="id" header="編號" sortable class="font-medium" />
        <Column field="date" header="申請日期" sortable />
        <Column field="type" header="申請類型" sortable />
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
            <div class="flex gap-2">
              <Button
                v-if="canReview(slotProps.data)"
                icon="pi pi-eye"
                label="審核"
                size="small"
                outlined
                @click="startReview(slotProps.data)"
              />
              <span v-else class="text-sm text-gray-500 px-3 py-2"> 已處理 </span>
            </div>
          </template>
        </Column>

        <template #expansion="slotProps">
          <div class="p-6 bg-gray-50">
            <h4 class="text-lg font-medium mb-4 text-gray-800">申請詳細資訊</h4>
            <DataTable
              :value="convertForm(slotProps.data.form)"
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

    <!-- 審核對話框 -->
    <Dialog
      v-model:visible="showReviewDialog"
      header="申請審核"
      :style="{ width: '500px' }"
      :modal="true"
      :closable="!isProcessing"
    >
      <div v-if="selectedApplication" class="space-y-4">
        <!-- 申請基本資訊 -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-medium text-gray-800 mb-2">申請資訊</h4>
          <div class="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span class="text-gray-600">申請編號：</span>
              <span class="font-medium">{{ selectedApplication.id }}</span>
            </div>
            <div>
              <span class="text-gray-600">申請日期：</span>
              <span>{{ selectedApplication.date }}</span>
            </div>
            <div>
              <span class="text-gray-600">申請人：</span>
              <span class="font-medium">{{ selectedApplication.form.applicant_name }}</span>
            </div>
            <div>
              <span class="text-gray-600">部門：</span>
              <span>{{ selectedApplication.form.department }}</span>
            </div>
          </div>
        </div>

        <!-- 審核意見 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            審核意見 <span class="text-red-500">*（拒絕時必填）</span>
          </label>
          <Textarea
            v-model="reviewComment"
            placeholder="請輸入審核意見或拒絕原因..."
            rows="4"
            class="w-full"
            :disabled="isProcessing"
          />
        </div>

        <!-- 操作按鈕 -->
        <div class="flex justify-end gap-3 pt-4 border-t">
          <Button label="取消" outlined :disabled="isProcessing" @click="closeReviewDialog" />
          <Button
            label="拒絕申請"
            severity="danger"
            icon="pi pi-times"
            :loading="isProcessing"
            @click="rejectApplication"
          />
          <Button
            label="通過審核"
            severity="success"
            icon="pi pi-check"
            :loading="isProcessing"
            @click="approveApplication"
          />
        </div>
      </div>
    </Dialog>

    <Toast />
  </div>
</template>
