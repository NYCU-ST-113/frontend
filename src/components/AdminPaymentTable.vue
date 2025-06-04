<script setup lang="ts">
import { PaymentStatus } from '@/types/payment'
import { useToast } from 'primevue/usetoast'
import { ref } from 'vue'

// PrimeVue 組件
import { updatePayment } from '@/services/payment'
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import Dialog from 'primevue/dialog'
import Divider from 'primevue/divider'
import Dropdown from 'primevue/dropdown'
import InputNumber from 'primevue/inputnumber'
import Tag from 'primevue/tag'
import Textarea from 'primevue/textarea'
import Toast from 'primevue/toast'

defineProps<{
  isLoading: boolean
  data: any[]
}>()

const expandedRows = ref({})
const toast = useToast()

// 編輯對話框相關
const showEditDialog = ref(false)
const selectedPayment = ref<any>(null)
const editForm = ref({
  paymentAmount: 0,
  paymentStatus: '',
  adminNote: '',
})
const isProcessing = ref(false)

// 狀態選項
const statusOptions = [
  { label: '待繳費', value: PaymentStatus.pending },
  { label: '已繳費', value: PaymentStatus.paid },
  { label: '已取消', value: PaymentStatus.failed },
]

const getSeverity = (datum: { paymentStatus: string }) => {
  switch (datum.paymentStatus) {
    case PaymentStatus.paid:
      return 'success'
    case PaymentStatus.pending:
      return 'info'
    case PaymentStatus.failed:
      return 'secondary'
    default:
      return 'contrast'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case PaymentStatus.paid:
      return '已繳費'
    case PaymentStatus.pending:
      return '待繳費'
    case PaymentStatus.failed:
      return '已取消'
    default:
      return status
  }
}

// 開啟編輯對話框
const openEditDialog = (payment: any) => {
  selectedPayment.value = payment
  editForm.value = {
    paymentAmount: payment.paymentAmount,
    paymentStatus: payment.paymentStatus,
    adminNote: payment.adminNote || '',
  }
  showEditDialog.value = true
}

// 儲存變更
const saveChanges = async () => {
  if (!selectedPayment.value) return

  // 驗證金額
  if (!editForm.value.paymentAmount || editForm.value.paymentAmount <= 0) {
    toast.add({
      severity: 'warn',
      summary: '驗證失敗',
      detail: '請輸入正確的金額',
      life: 3000,
    })
    return
  }

  isProcessing.value = true

  try {
    await updatePayment(selectedPayment.value.paymentId, selectedPayment.value.paymentStatus)

    // 更新資料
    const oldAmount = selectedPayment.value.paymentAmount
    const oldStatus = selectedPayment.value.paymentStatus

    selectedPayment.value.paymentAmount = editForm.value.paymentAmount
    selectedPayment.value.paymentStatus = editForm.value.paymentStatus
    selectedPayment.value.adminNote = editForm.value.adminNote
    selectedPayment.value.lastModified = new Date().toLocaleString()
    selectedPayment.value.modifiedBy = 'admin001' // 這裡應該是當前登入的管理員

    // 記錄變更
    const changes = []
    if (oldAmount !== editForm.value.paymentAmount) {
      changes.push(`金額: ${oldAmount} → ${editForm.value.paymentAmount}`)
    }
    if (oldStatus !== editForm.value.paymentStatus) {
      changes.push(
        `狀態: ${getStatusText(oldStatus)} → ${getStatusText(editForm.value.paymentStatus)}`,
      )
    }

    toast.add({
      severity: 'success',
      summary: '更新成功',
      detail: `繳費記錄 ${selectedPayment.value.id} 已更新${changes.length > 0 ? ': ' + changes.join(', ') : ''}`,
      life: 4000,
    })

    showEditDialog.value = false
  } catch (error) {
    console.error('更新失敗:', error)
    toast.add({
      severity: 'error',
      summary: '更新失敗',
      detail: '系統發生錯誤，請稍後再試',
      life: 3000,
    })
  } finally {
    isProcessing.value = false
  }
}

// 快速狀態變更
const quickStatusChange = async (payment: any, newStatus: string) => {
  const oldStatus = payment.paymentStatus

  try {
    await updatePayment(payment.paymentId, newStatus)

    payment.paymentStatus = newStatus
    payment.lastModified = new Date().toLocaleString()
    payment.modifiedBy = 'admin001'

    toast.add({
      severity: 'success',
      summary: '狀態已更新',
      detail: `${payment.id} 狀態已從「${getStatusText(oldStatus)}」變更為「${getStatusText(newStatus)}」`,
      life: 3000,
    })
  } catch (error) {
    console.error('狀態變更失敗:', error)
    payment.paymentStatus = oldStatus // 復原狀態
    toast.add({
      severity: 'error',
      summary: '狀態變更失敗',
      detail: '系統發生錯誤，請稍後再試',
      life: 3000,
    })
  }
}

// 關閉對話框
const closeEditDialog = () => {
  showEditDialog.value = false
  selectedPayment.value = null
  editForm.value = {
    paymentAmount: 0,
    paymentStatus: '',
    adminNote: '',
  }
}

// 格式化金額
const formatCurrency = (paymentAmount: number) => {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    maximumSignificantDigits: 4,
  }).format(paymentAmount)
}
</script>

<template>
  <div class="p-4">
    <div class="mb-4">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">繳費管理</h1>
      <p class="text-lg text-gray-600">管理和處理所有繳費記錄，設定金額和更新狀態</p>
    </div>

    <ProgressSpinner v-if="isLoading" />
    <div v-else class="card bg-white rounded-lg shadow">
      <DataTable
        v-model:expanded-rows="expandedRows"
        :value="data"
        data-key="paymentId"
        table-style="min-width: 60rem"
        class="p-datatable-sm px-4"
      >
        <!--
        <template #header>
          <div class="flex flex-wrap justify-between items-center gap-2 p-4">
            <h2 class="text-lg font-semibold text-gray-800"></h2>
            <div class="flex gap-2">
              <Button icon="pi pi-refresh" label="重新整理" outlined size="small" />
              <Button icon="pi pi-download" label="匯出" outlined size="small" />
            </div>
          </div>
        </template>
      -->

        <Column expander style="width: 5rem" />
        <Column field="index" header="編號" sortable class="font-medium" />
        <Column field="paymentCreatedAt" header="申請日期" sortable />
        <Column header="申請人">
          <template #body="slotProps">
            <div>
              <div class="font-medium">{{ slotProps.data.applicantName }}</div>
              <div class="text-sm text-gray-500">{{ slotProps.data.department }}</div>
            </div>
          </template>
        </Column>
        <Column field="paymentAmount" header="金額" sortable>
          <template #body="slotProps">
            <span class="font-semibold text-green-600">
              {{ formatCurrency(slotProps.data.paymentAmount) }}
            </span>
          </template>
        </Column>
        <Column header="狀態" style="width: 10rem">
          <template #body="slotProps">
            <Tag
              :value="getStatusText(slotProps.data.paymentStatus)"
              :severity="getSeverity(slotProps.data)"
              class="text-xs"
            />
          </template>
        </Column>
        <Column header="快速操作" style="width: 12rem">
          <template #body="slotProps">
            <div class="flex gap-1">
              <Button
                v-if="slotProps.data.paymentStatus !== PaymentStatus.paid"
                icon="pi pi-check"
                size="small"
                severity="success"
                title="標記為已繳費"
                @click="quickStatusChange(slotProps.data, PaymentStatus.paid)"
              />
              <Button
                v-if="slotProps.data.paymentStatus !== PaymentStatus.pending"
                icon="pi pi-clock"
                size="small"
                severity="info"
                title="標記為待繳費"
                @click="quickStatusChange(slotProps.data, PaymentStatus.pending)"
              />
              <Button
                v-if="slotProps.data.paymentStatus !== PaymentStatus.failed"
                icon="pi pi-times"
                size="small"
                severity="secondary"
                title="標記為已取消"
                @click="quickStatusChange(slotProps.data, PaymentStatus.failed)"
              />
            </div>
          </template>
        </Column>
        <Column header="管理" style="width: 8rem">
          <template #body="slotProps">
            <Button
              icon="pi pi-pencil"
              label="編輯"
              size="small"
              outlined
              @click="openEditDialog(slotProps.data)"
            />
          </template>
        </Column>

        <template #expansion="slotProps">
          <div class="p-6 bg-gray-50">
            <h4 class="text-lg font-medium mb-4 text-gray-800">詳細資訊</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div class="bg-white p-3 rounded-lg border">
                <label class="text-sm font-medium text-gray-600">申請編號</label>
                <p class="text-gray-900 font-semibold">{{ slotProps.data.paymentId }}</p>
              </div>
              <div class="bg-white p-3 rounded-lg border">
                <label class="text-sm font-medium text-gray-600">使用者編號</label>
                <p class="text-gray-900 font-semibold">{{ slotProps.data.applicantAccount }}</p>
              </div>
              <div class="bg-white p-3 rounded-lg border">
                <label class="text-sm font-medium text-gray-600">電子郵件</label>
                <p class="text-blue-600 font-semibold">{{ slotProps.data.applicantEmail }}</p>
              </div>
              <div class="bg-white p-3 rounded-lg border">
                <label class="text-sm font-medium text-gray-600">申請日期</label>
                <p class="text-gray-900 font-semibold">{{ slotProps.data.paymentCreatedAt }}</p>
              </div>
              <div class="bg-white p-3 rounded-lg border">
                <label class="text-sm font-medium text-gray-600">金額</label>
                <p class="text-green-600 font-semibold text-lg">
                  {{ formatCurrency(slotProps.data.paymentAmount) }}
                </p>
              </div>
              <!--
                <div class="bg-white p-3 rounded-lg border">
                  <label class="text-sm font-medium text-gray-600">當前狀態</label>
                  <div class="mt-1">
                    <Tag
                    :value="getStatusText(slotProps.data.paymentStatus)"
                    :severity="getSeverity(slotProps.data)"
                    />
                  </div>
                </div>
              -->
            </div>

            <!-- 管理資訊 -->
            <div v-if="slotProps.data.lastModified" class="bg-white p-4 rounded-lg border">
              <h5 class="font-medium text-gray-800 mb-2">管理資訊</h5>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="text-gray-600">最後修改時間：</span>
                  <span>{{ slotProps.data.lastModified }}</span>
                </div>
                <div>
                  <span class="text-gray-600">修改者：</span>
                  <span class="font-medium">{{ slotProps.data.modifiedBy }}</span>
                </div>
                <div class="md:col-span-2">
                  <span class="text-gray-600">管理員備註：</span>
                  <p class="mt-1 text-gray-900">{{ slotProps.data.adminNote || '無備註' }}</p>
                </div>
              </div>
            </div>
          </div>
        </template>
      </DataTable>
    </div>

    <!-- 編輯對話框 -->
    <Dialog
      v-model:visible="showEditDialog"
      header="編輯繳費記錄"
      :style="{ width: '500px' }"
      :modal="true"
      :closable="!isProcessing"
    >
      <div v-if="selectedPayment" class="space-y-4">
        <!-- 基本資訊顯示 -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-medium text-gray-800 mb-2">繳費記錄資訊</h4>
          <div class="grid grid-cols-1 gap-2 text-sm">
            <div>
              <span class="text-gray-600">申請編號：</span>
              <span class="font-medium">{{ selectedPayment.paymentId }}</span>
            </div>
            <div>
              <span class="text-gray-600">申請人：</span>
              <span class="font-medium">{{ selectedPayment.applicantName }}</span>
            </div>
            <div>
              <span class="text-gray-600">服務名稱：</span>
              <span>{{ selectedPayment.paymentServiceName }}</span>
            </div>
            <div>
              <span class="text-gray-600">申請日期：</span>
              <span>{{ selectedPayment.paymentCreatedAt.split(' ')[0] }}</span>
            </div>
          </div>
        </div>

        <Divider />

        <!-- 編輯表單 -->
        <div class="space-y-4">
          <!-- 金額設定 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              繳費金額<span class="text-red-500">*</span>
            </label>
            <InputNumber
              v-model="editForm.paymentAmount"
              mode="currency"
              currency="TWD"
              locale="zh-TW"
              :min="0"
              class="w-full"
              :disabled="isProcessing"
            />
          </div>

          <!-- 狀態選擇 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              繳費狀態 <span class="text-red-500">*</span>
            </label>
            <Dropdown
              v-model="editForm.paymentStatus"
              :options="statusOptions"
              option-label="label"
              option-value="value"
              placeholder="請選擇狀態"
              class="w-full"
              :disabled="isProcessing"
            />
          </div>

          <!-- 管理員備註 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">管理員備註</label>
            <Textarea
              v-model="editForm.adminNote"
              placeholder="請輸入管理員備註..."
              rows="3"
              class="w-full"
              :disabled="isProcessing"
            />
          </div>
        </div>

        <!-- 操作按鈕 -->
        <div class="flex justify-end gap-3 pt-4 border-t">
          <Button label="取消" outlined :disabled="isProcessing" @click="closeEditDialog" />
          <Button
            label="儲存變更"
            severity="success"
            icon="pi pi-check"
            :loading="isProcessing"
            @click="saveChanges"
          />
        </div>
      </div>
    </Dialog>

    <Toast />
  </div>
</template>
