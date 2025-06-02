<script setup lang="ts">
import { ApplicationStatus } from '@/types/application'
import { PaymentStatus } from '@/types/payment'
import { useToast } from 'primevue/usetoast'
import { onMounted, ref } from 'vue'

// PrimeVue 組件
import Button from 'primevue/button'
import Calendar from 'primevue/calendar'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import Dialog from 'primevue/dialog'
import Divider from 'primevue/divider'
import Tag from 'primevue/tag'
import Toast from 'primevue/toast'

const applications = ref()
const expandedRows = ref({})
const toast = useToast()

// 繳費申請對話框相關
const showPaymentDialog = ref(false)
const selectedApplication = ref<any>(null)
const paymentForm = ref({
  paymentDate: new Date(),
  note: '',
})
const isProcessing = ref(false)

onMounted(() => {
  applications.value = [
    {
      id: 'APP-001',
      applicationId: 'DNS-2024-001',
      type: 'DNS申請',
      applicantName: '王小明',
      department: '資訊工程學系',
      status: ApplicationStatus.approved, // 已通過審核
      approvedDate: new Date('2024-05-01T10:00:00').toLocaleString(),
      paymentStatus: null, // 尚未申請繳費
      suggestedAmount: 1500,
      description: 'DNS主機名稱申請',
      supervisorName: '陳教授',
      email: 'wang@nycu.edu.tw',
    },
    {
      id: 'APP-002',
      applicationId: 'VPN-2024-002',
      type: 'VPN申請',
      applicantName: '林美麗',
      department: '電機工程學系',
      status: ApplicationStatus.approved, // 已通過審核
      approvedDate: new Date('2024-05-03T14:30:00').toLocaleString(),
      paymentStatus: PaymentStatus.pending, // 已申請繳費，待處理
      suggestedAmount: 2000,
      description: 'VPN連線服務申請',
      supervisorName: '李教授',
      email: 'lin@nycu.edu.tw',
      paymentDate: new Date('2024-05-04T09:00:00').toLocaleString(),
    },
    {
      id: 'APP-003',
      applicationId: 'SSL-2024-003',
      type: 'SSL憑證申請',
      applicantName: '陳志強',
      department: '應用數學系',
      status: ApplicationStatus.approved, // 已通過審核
      approvedDate: new Date('2024-05-05T09:15:00').toLocaleString(),
      paymentStatus: PaymentStatus.paid, // 已完成繳費
      suggestedAmount: 1200,
      description: 'SSL憑證申請服務',
      supervisorName: '王教授',
      email: 'chen@nycu.edu.tw',
      paymentDate: new Date('2024-05-06T10:30:00').toLocaleString(),
      paidAmount: 1200,
    },
    {
      id: 'APP-004',
      applicationId: 'WEB-2024-004',
      type: '網站空間申請',
      applicantName: '張小華',
      department: '資訊管理與財金學系',
      status: ApplicationStatus.pending, // 審核中
      approvedDate: null,
      paymentStatus: null,
      suggestedAmount: 3000,
      description: '網站主機空間申請',
      supervisorName: '劉教授',
      email: 'zhang@nycu.edu.tw',
    },
  ]

  // 只顯示已通過審核的申請
  applications.value = applications.value.filter((app) => app.status === ApplicationStatus.approved)
})

const getApplicationStatusSeverity = (status: string) => {
  switch (status) {
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

const getPaymentStatusSeverity = (status: string | null) => {
  if (!status) return 'secondary'
  switch (status) {
    case PaymentStatus.paid:
      return 'success'
    case PaymentStatus.pending:
      return 'warning'
    case PaymentStatus.failed:
      return 'danger'
    default:
      return 'secondary'
  }
}

const getPaymentStatusText = (status: string | null) => {
  if (!status) return '未申請繳費'
  switch (status) {
    case PaymentStatus.paid:
      return '已完成繳費'
    case PaymentStatus.pending:
      return '繳費處理中'
    case PaymentStatus.failed:
      return '繳費失敗'
    default:
      return status
  }
}

// 開啟繳費申請對話框
const openPaymentDialog = (application: any) => {
  selectedApplication.value = application
  paymentForm.value = {
    paymentDate: new Date(),
    note: `${application.type} - ${application.description}`,
  }
  showPaymentDialog.value = true
}

// 申請繳費處理函數
const submitPaymentApplication = async () => {
  if (!selectedApplication.value) return

  // 驗證日期
  if (!paymentForm.value.paymentDate) {
    toast.add({
      severity: 'warn',
      summary: '驗證失敗',
      detail: '請選擇預計繳費日期',
      life: 3000,
    })
    return
  }

  isProcessing.value = true

  try {
    // 模擬 API 呼叫
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // 更新申請狀態
    selectedApplication.value.paymentStatus = PaymentStatus.pending
    selectedApplication.value.paymentDate = new Date().toLocaleString()
    selectedApplication.value.scheduledPaymentDate = paymentForm.value.paymentDate.toLocaleString()

    toast.add({
      severity: 'success',
      summary: '繳費申請成功',
      detail: `申請編號 ${selectedApplication.value.applicationId} 的繳費申請已送出`,
      life: 3000,
    })

    showPaymentDialog.value = false
  } catch (error) {
    console.error('繳費申請失敗:', error)
    toast.add({
      severity: 'error',
      summary: '繳費申請失敗',
      detail: '系統發生錯誤，請稍後再試',
      life: 3000,
    })
  } finally {
    isProcessing.value = false
  }
}

// 下載處理函數
const downloadApplicationRecord = (application: any) => {
  try {
    console.log('下載記錄:', application)

    const recordData = {
      申請編號: application.applicationId,
      申請類型: application.type,
      申請人: application.applicantName,
      部門: application.department,
      申請狀態: '已通過審核',
      審核日期: application.approvedDate,
      繳費狀態: getPaymentStatusText(application.paymentStatus),
      建議金額: new Intl.NumberFormat('zh-TW', {
        style: 'currency',
        currency: 'TWD',
      }).format(application.suggestedAmount),
      申請說明: application.description,
      主管姓名: application.supervisorName,
      電子郵件: application.email,
      ...(application.paymentDate && { 繳費申請日期: application.paymentDate }),
      ...(application.paidAmount && {
        實際繳費金額: new Intl.NumberFormat('zh-TW', {
          style: 'currency',
          currency: 'TWD',
        }).format(application.paidAmount),
      }),
    }

    const jsonContent = JSON.stringify(recordData, null, 2)
    const blob = new Blob([jsonContent], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `申請記錄_${application.applicationId}_${new Date().toISOString().split('T')[0]}.json`

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    toast.add({
      severity: 'success',
      summary: '下載成功',
      detail: `申請記錄 ${application.applicationId} 已開始下載`,
      life: 3000,
    })
  } catch (error) {
    console.error('下載失敗:', error)
    toast.add({
      severity: 'error',
      summary: '下載失敗',
      detail: '下載文件時發生錯誤，請稍後再試',
      life: 3000,
    })
  }
}

// 檢查是否可以申請繳費
const canApplyPayment = (application: any): boolean => {
  return application.status === ApplicationStatus.approved && !application.paymentStatus
}

// 取得操作按鈕樣式
const getActionButtonSeverity = (application: any): string => {
  if (canApplyPayment(application)) {
    return 'primary'
  } else if (application.paymentStatus === PaymentStatus.pending) {
    return 'warning'
  } else if (application.paymentStatus === PaymentStatus.paid) {
    return 'success'
  } else {
    return 'secondary'
  }
}

// 取得操作按鈕文字
const getActionButtonLabel = (application: any): string => {
  if (canApplyPayment(application)) {
    return '申請繳費'
  } else if (application.paymentStatus === PaymentStatus.pending) {
    return '繳費處理中'
  } else if (application.paymentStatus === PaymentStatus.paid) {
    return '已完成繳費'
  } else {
    return '無法操作'
  }
}

// 取得操作按鈕圖示
const getActionButtonIcon = (application: any): string => {
  if (canApplyPayment(application)) {
    return 'pi pi-credit-card'
  } else if (application.paymentStatus === PaymentStatus.pending) {
    return 'pi pi-clock'
  } else if (application.paymentStatus === PaymentStatus.paid) {
    return 'pi pi-check'
  } else {
    return 'pi pi-times'
  }
}

// 關閉對話框
const closePaymentDialog = () => {
  showPaymentDialog.value = false
  selectedApplication.value = null
  paymentForm.value = {
    paymentDate: new Date(),
    note: '',
  }
}
</script>

<template>
  <div class="p-4">
    <div class="mb-4">
      <h1 class="text-2xl font-bold text-gray-800 mb-2">個人繳費管理</h1>
      <p class="text-gray-600">管理已通過審核的申請項目，進行繳費申請</p>
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
            <h2 class="text-lg font-semibold text-gray-800">已通過審核的申請記錄</h2>
            <div class="flex gap-2">
              <Button icon="pi pi-refresh" label="重新整理" outlined size="small" />
            </div>
          </div>
        </template>

        <Column expander style="width: 5rem" />
        <Column field="applicationId" header="申請編號" sortable class="font-medium" />
        <Column field="type" header="申請類型" sortable />
        <Column header="申請人">
          <template #body="slotProps">
            <div>
              <div class="font-medium">{{ slotProps.data.applicantName }}</div>
              <div class="text-sm text-gray-500">{{ slotProps.data.department }}</div>
            </div>
          </template>
        </Column>
        <Column field="approvedDate" header="審核通過日期" sortable />
        <Column field="suggestedAmount" header="建議金額" sortable>
          <template #body="slotProps">
            <span class="font-semibold text-green-600">
              {{
                new Intl.NumberFormat('zh-TW', {
                  style: 'currency',
                  currency: 'TWD',
                }).format(slotProps.data.suggestedAmount)
              }}
            </span>
          </template>
        </Column>
        <Column header="繳費狀態" style="width: 10rem">
          <template #body="slotProps">
            <Tag
              :value="getPaymentStatusText(slotProps.data.paymentStatus)"
              :severity="getPaymentStatusSeverity(slotProps.data.paymentStatus)"
              class="text-xs"
            />
          </template>
        </Column>
        <Column header="操作" style="width: 16rem">
          <template #body="slotProps">
            <div class="flex gap-2">
              <Button
                :label="getActionButtonLabel(slotProps.data)"
                :severity="getActionButtonSeverity(slotProps.data)"
                :disabled="!canApplyPayment(slotProps.data)"
                :icon="getActionButtonIcon(slotProps.data)"
                size="small"
                class="flex-1"
                @click="openPaymentDialog(slotProps.data)"
              />
              <Button
                icon="pi pi-download"
                title="下載記錄"
                size="small"
                severity="secondary"
                outlined
                @click="downloadApplicationRecord(slotProps.data)"
              />
            </div>
          </template>
        </Column>

        <template #expansion="slotProps">
          <div class="p-6 bg-gray-50">
            <div class="flex justify-between items-center mb-4">
              <h4 class="text-lg font-medium text-gray-800">申請詳細資訊</h4>
              <Button
                label="下載完整記錄"
                icon="pi pi-download"
                size="small"
                outlined
                @click="downloadApplicationRecord(slotProps.data)"
              />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div class="bg-white p-3 rounded-lg border">
                <label class="text-sm font-medium text-gray-600">申請編號</label>
                <p class="text-gray-900 font-semibold">{{ slotProps.data.applicationId }}</p>
              </div>
              <div class="bg-white p-3 rounded-lg border">
                <label class="text-sm font-medium text-gray-600">申請類型</label>
                <p class="text-gray-900 font-semibold">{{ slotProps.data.type }}</p>
              </div>
              <div class="bg-white p-3 rounded-lg border">
                <label class="text-sm font-medium text-gray-600">申請說明</label>
                <p class="text-gray-900 font-semibold">{{ slotProps.data.description }}</p>
              </div>
              <div class="bg-white p-3 rounded-lg border">
                <label class="text-sm font-medium text-gray-600">主管姓名</label>
                <p class="text-gray-900 font-semibold">{{ slotProps.data.supervisorName }}</p>
              </div>
              <div class="bg-white p-3 rounded-lg border">
                <label class="text-sm font-medium text-gray-600">電子郵件</label>
                <p class="text-blue-600 font-semibold">{{ slotProps.data.email }}</p>
              </div>
              <div class="bg-white p-3 rounded-lg border">
                <label class="text-sm font-medium text-gray-600">審核通過日期</label>
                <p class="text-gray-900 font-semibold">{{ slotProps.data.approvedDate }}</p>
              </div>

              <!-- 繳費相關資訊 -->
              <div v-if="slotProps.data.paymentDate" class="bg-white p-3 rounded-lg border">
                <label class="text-sm font-medium text-gray-600">繳費申請日期</label>
                <p class="text-gray-900 font-semibold">{{ slotProps.data.paymentDate }}</p>
              </div>
              <div
                v-if="slotProps.data.scheduledPaymentDate"
                class="bg-white p-3 rounded-lg border"
              >
                <label class="text-sm font-medium text-gray-600">預計繳費日期</label>
                <p class="text-blue-600 font-semibold">{{ slotProps.data.scheduledPaymentDate }}</p>
              </div>
              <div v-if="slotProps.data.paidAmount" class="bg-white p-3 rounded-lg border">
                <label class="text-sm font-medium text-gray-600">實際繳費金額</label>
                <p class="text-green-600 font-semibold text-lg">
                  {{
                    new Intl.NumberFormat('zh-TW', {
                      style: 'currency',
                      currency: 'TWD',
                    }).format(slotProps.data.paidAmount)
                  }}
                </p>
              </div>
              <div class="bg-white p-3 rounded-lg border">
                <label class="text-sm font-medium text-gray-600">繳費狀態</label>
                <div class="mt-1">
                  <Tag
                    :value="getPaymentStatusText(slotProps.data.paymentStatus)"
                    :severity="getPaymentStatusSeverity(slotProps.data.paymentStatus)"
                  />
                </div>
              </div>
            </div>
          </div>
        </template>
      </DataTable>
    </div>

    <!-- 繳費申請對話框 -->
    <Dialog
      v-model:visible="showPaymentDialog"
      header="申請繳費"
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
              <span class="font-medium">{{ selectedApplication.applicationId }}</span>
            </div>
            <div>
              <span class="text-gray-600">申請類型：</span>
              <span>{{ selectedApplication.type }}</span>
            </div>
            <div>
              <span class="text-gray-600">申請人：</span>
              <span class="font-medium">{{ selectedApplication.applicantName }}</span>
            </div>
            <div>
              <span class="text-gray-600">部門：</span>
              <span>{{ selectedApplication.department }}</span>
            </div>
            <div class="col-span-2">
              <span class="text-gray-600">申請說明：</span>
              <p class="mt-1 text-gray-900">{{ selectedApplication.description }}</p>
            </div>
          </div>
        </div>

        <Divider />

        <!-- 預計繳費日期設定 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            預計繳費日期 <span class="text-red-500">*</span>
          </label>
          <Calendar
            v-model="paymentForm.paymentDate"
            show-icon
            :min-date="new Date()"
            date-format="yy/mm/dd"
            class="w-full"
            :disabled="isProcessing"
            placeholder="請選擇預計繳費日期"
          />
          <small class="text-gray-500 mt-1 block">
            請選擇您預計完成繳費的日期，最早可選擇今天
          </small>
        </div>

        <!-- 繳費金額顯示 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"> 繳費金額 </label>
          <div class="p-3 bg-gray-50 rounded border">
            <span class="text-lg font-semibold text-green-600">
              {{
                new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD' }).format(
                  selectedApplication.suggestedAmount,
                )
              }}
            </span>
            <span class="text-sm text-gray-500 ml-2">（系統建議金額）</span>
          </div>
        </div>

        <!-- 備註說明 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"> 備註說明 </label>
          <p class="text-sm text-gray-600 p-3 bg-gray-50 rounded border">
            {{ paymentForm.note }}
          </p>
        </div>

        <!-- 操作按鈕 -->
        <div class="flex justify-end gap-3 pt-4 border-t">
          <Button label="取消" outlined :disabled="isProcessing" @click="closePaymentDialog" />
          <Button
            label="送出繳費申請"
            severity="success"
            icon="pi pi-credit-card"
            :loading="isProcessing"
            @click="submitPaymentApplication"
          />
        </div>
      </div>
    </Dialog>

    <Toast />
  </div>
</template>
