<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import { computed, reactive, ref, watch } from 'vue'

// PrimeVue 組件
import Button from 'primevue/button'
import Card from 'primevue/card'
import Checkbox from 'primevue/checkbox'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import Dialog from 'primevue/dialog'
import Divider from 'primevue/divider'
import Dropdown from 'primevue/dropdown'
import FileUpload from 'primevue/fileupload'
import InputText from 'primevue/inputtext'
import MultiSelect from 'primevue/multiselect'
import Tag from 'primevue/tag'
import Textarea from 'primevue/textarea'
import Toast from 'primevue/toast'

// 定義資料類型
interface EmailTemplate {
  id: string
  name: string
  subject: string
  content: string
  type: 'approval' | 'rejection' | 'payment' | 'reminder' | 'notification' | 'custom'
}

interface Recipient {
  id: string
  name: string
  email: string
  department: string
  type: 'applicant' | 'supervisor' | 'admin'
}

interface EmailRecord {
  id: string
  subject: string
  recipients: string[]
  type: string
  status: 'sent' | 'pending' | 'failed'
  sentTime: Date
  sentBy: string
}

const toast = useToast()

// 表單資料
const emailForm = reactive({
  templateType: '',
  customTemplate: '',
  subject: '',
  content: '',
  recipients: [] as string[],
  recipientType: 'manual', // 'manual' | 'auto'
  sendImmediately: true,
  scheduleTime: null as Date | null,
  attachments: [] as File[],
})

// 載入狀態
const isSending = ref(false)
const isLoadingTemplates = ref(false)

// 對話框狀態
const showPreviewDialog = ref(false)
const showHistoryDialog = ref(false)

// 郵件模板
const emailTemplates = ref<EmailTemplate[]>([])

// 收件人列表
const availableRecipients = ref<Recipient[]>([])

// 發送記錄
const emailHistory = ref<EmailRecord[]>([])

// 模板類型選項
const templateTypes = [
  { label: '申請通過通知', value: 'approval' },
  { label: '申請拒絕通知', value: 'rejection' },
  { label: '繳費通知', value: 'payment' },
  { label: '催繳提醒', value: 'reminder' },
  { label: '系統公告', value: 'notification' },
  { label: '自訂模板', value: 'custom' },
]

// 收件人類型選項
const recipientTypeOptions = [
  { label: '手動選擇', value: 'manual' },
  { label: '所有申請人', value: 'all_applicants' },
  { label: '所有主管', value: 'all_supervisors' },
  { label: '所有管理員', value: 'all_admins' },
  { label: '待審核申請人', value: 'pending_applicants' },
  { label: '待繳費申請人', value: 'payment_pending' },
]

// 計算屬性
const selectedTemplate = computed(() => {
  return emailTemplates.value.find((t) => t.id === emailForm.templateType)
})

const recipientCount = computed(() => {
  if (emailForm.recipientType === 'manual') {
    return emailForm.recipients.length
  }
  // 這裡可以根據不同類型計算實際收件人數量
  switch (emailForm.recipientType) {
    case 'all_applicants':
      return 156
    case 'all_supervisors':
      return 23
    case 'all_admins':
      return 8
    case 'pending_applicants':
      return 12
    case 'payment_pending':
      return 5
    default:
      return 0
  }
})

const canSend = computed(() => {
  return (
    emailForm.subject.trim() &&
    emailForm.content.trim() &&
    (emailForm.recipientType !== 'manual' || emailForm.recipients.length > 0)
  )
})

// 載入郵件模板
const loadEmailTemplates = () => {
  isLoadingTemplates.value = true

  setTimeout(() => {
    emailTemplates.value = [
      {
        id: 'approval_001',
        name: '申請通過標準模板',
        subject: '申請審核通過通知 - 申請編號 {APPLICATION_ID}',
        content: `親愛的 {APPLICANT_NAME}：

您好！

您於 {APPLY_DATE} 提交的申請（編號：{APPLICATION_ID}）已通過審核。

申請詳情：
- 申請類型：{APPLICATION_TYPE}
- 申請部門：{DEPARTMENT}
- 審核日期：{APPROVAL_DATE}

請於收到此通知後，依照相關流程進行後續作業。如有任何疑問，請聯絡承辦人員。

此致
敬禮

系統管理處
{SYSTEM_DATE}`,
        type: 'approval',
      },
      {
        id: 'rejection_001',
        name: '申請拒絕標準模板',
        subject: '申請審核結果通知 - 申請編號 {APPLICATION_ID}',
        content: `親愛的 {APPLICANT_NAME}：

您好！

很抱歉通知您，您於 {APPLY_DATE} 提交的申請（編號：{APPLICATION_ID}）未通過審核。

拒絕原因：{REJECTION_REASON}

如對審核結果有疑問，請聯絡相關承辦人員進行詢問。您也可以在修正相關問題後重新提出申請。

此致
敬禮

系統管理處
{SYSTEM_DATE}`,
        type: 'rejection',
      },
      {
        id: 'payment_001',
        name: '繳費通知標準模板',
        subject: '繳費通知 - 申請編號 {APPLICATION_ID}',
        content: `親愛的 {APPLICANT_NAME}：

您好！

您的申請（編號：{APPLICATION_ID}）已通過審核，請依照以下資訊完成繳費：

繳費資訊：
- 繳費金額：{PAYMENT_AMOUNT}
- 繳費期限：{PAYMENT_DEADLINE}
- 繳費方式：{PAYMENT_METHOD}

請於期限內完成繳費，逾期可能影響您的申請處理。

此致
敬禮

系統管理處
{SYSTEM_DATE}`,
        type: 'payment',
      },
    ]
    isLoadingTemplates.value = false
  }, 1000)
}

// 載入收件人列表
const loadRecipients = () => {
  availableRecipients.value = [
    {
      id: 'U001',
      name: '王小明',
      email: 'wang@nycu.edu.tw',
      department: '資訊工程學系',
      type: 'applicant',
    },
    {
      id: 'U002',
      name: '林美麗',
      email: 'lin@nycu.edu.tw',
      department: '電機工程學系',
      type: 'applicant',
    },
    {
      id: 'S001',
      name: '陳教授',
      email: 'chen@nycu.edu.tw',
      department: '資訊工程學系',
      type: 'supervisor',
    },
    {
      id: 'A001',
      name: '張管理員',
      email: 'admin@nycu.edu.tw',
      department: '系統管理處',
      type: 'admin',
    },
  ]
}

// 載入發送記錄
const loadEmailHistory = () => {
  emailHistory.value = [
    {
      id: 'EMAIL_001',
      subject: '申請審核通過通知',
      recipients: ['wang@nycu.edu.tw', 'chen@nycu.edu.tw'],
      type: 'approval',
      status: 'sent',
      sentTime: new Date('2024-06-01T10:30:00'),
      sentBy: 'admin001',
    },
    {
      id: 'EMAIL_002',
      subject: '系統維護通知',
      recipients: ['all_users@nycu.edu.tw'],
      type: 'notification',
      status: 'sent',
      sentTime: new Date('2024-05-31T16:00:00'),
      sentBy: 'admin002',
    },
    {
      id: 'EMAIL_003',
      subject: '繳費提醒通知',
      recipients: ['lin@nycu.edu.tw'],
      type: 'reminder',
      status: 'sent',
      sentTime: new Date('2024-05-30T14:20:00'),
      sentBy: 'admin001',
    },
  ]
}

// 監聽模板選擇變化
watch(
  () => emailForm.templateType,
  (newValue) => {
    if (newValue && newValue !== 'custom') {
      const template = selectedTemplate.value
      if (template) {
        emailForm.subject = template.subject
        emailForm.content = template.content
      }
    } else if (newValue === 'custom') {
      emailForm.subject = ''
      emailForm.content = ''
    }
  },
)

// 處理檔案上傳
const onFileSelect = (event: any) => {
  emailForm.attachments = Array.from(event.files)
}

// 移除附件
const removeAttachment = (index: number) => {
  emailForm.attachments.splice(index, 1)
}

// 預覽郵件
const previewEmail = () => {
  showPreviewDialog.value = true
}

// 發送郵件
const sendEmail = async () => {
  if (!canSend.value) {
    toast.add({
      severity: 'warn',
      summary: '表單驗證失敗',
      detail: '請填寫必要資訊並選擇收件人',
      life: 3000,
    })
    return
  }

  isSending.value = true

  try {
    await sendMail({
      to: emailForm.recipientType === 'manual' ? emailForm.recipients : [emailForm.recipientType],
      subject: emailForm.subject,
      body: emailForm.content,
      html_body: emailForm.content,
      cc: [],
      bcc: [],
      sender: 'admin@nycu.edu.tw',
      source_service: 'NYCU-SAS',
      attachments: emailForm.attachments.map((file) => ({
        [file.name]: file,
      })),
    })
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // 添加到發送記錄
    const newRecord: EmailRecord = {
      id: `EMAIL_${Date.now()}`,
      subject: emailForm.subject,
      recipients:
        emailForm.recipientType === 'manual' ? emailForm.recipients : [emailForm.recipientType],
      type: emailForm.templateType || 'custom',
      status: 'sent',
      sentTime: new Date(),
      sentBy: 'admin001',
    }
    emailHistory.value.unshift(newRecord)

    toast.add({
      severity: 'success',
      summary: '郵件發送成功',
      detail: `已成功發送給 ${recipientCount.value} 位收件人`,
      life: 3000,
    })

    // 重置表單
    resetForm()
  } catch (error) {
    console.error('郵件發送失敗:', error)
    toast.add({
      severity: 'error',
      summary: '郵件發送失敗',
      detail: '系統發生錯誤，請稍後再試',
      life: 3000,
    })
  } finally {
    isSending.value = false
  }
}

// 重置表單
const resetForm = () => {
  Object.assign(emailForm, {
    templateType: '',
    customTemplate: '',
    subject: '',
    content: '',
    recipients: [],
    recipientType: 'manual',
    sendImmediately: true,
    scheduleTime: null,
    attachments: [],
  })
}

// 取得狀態標籤樣式
const getStatusSeverity = (status: string) => {
  switch (status) {
    case 'sent':
      return 'success'
    case 'pending':
      return 'warning'
    case 'failed':
      return 'danger'
    default:
      return 'secondary'
  }
}

// 取得狀態文字
const getStatusText = (status: string) => {
  switch (status) {
    case 'sent':
      return '已發送'
    case 'pending':
      return '待發送'
    case 'failed':
      return '發送失敗'
    default:
      return status
  }
}

// 初始化
const initialize = () => {
  loadEmailTemplates()
  loadRecipients()
  loadEmailHistory()
}

// 組件掛載時初始化
import { sendMail } from '@/services/mail'
import { onMounted } from 'vue'
onMounted(() => {
  initialize()
})
</script>

<template>
  <div class="p-4 bg-gray-50 min-h-screen">
    <div class="max-w-6xl mx-auto">
      <!-- 頁面標題 -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">系統信件發送</h1>
        <p class="text-gray-600">發送系統通知信件給使用者、管理員或特定群組</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- 主要發送表單 -->
        <div class="lg:col-span-2">
          <Card>
            <template #header>
              <div class="flex items-center gap-2 p-6 pb-0">
                <i class="pi pi-send text-blue-600 text-xl"></i>
                <h2 class="text-xl font-semibold text-gray-800">郵件撰寫</h2>
              </div>
            </template>

            <template #content>
              <div class="space-y-6">
                <!-- 模板選擇 -->
                <!--
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2"> 選擇郵件模板 </label>
                    <Dropdown
                    v-model="emailForm.templateType"
                    :options="templateTypes"
                    option-label="label"
                    option-value="value"
                    placeholder="請選擇郵件模板"
                    class="w-full"
                    :loading="isLoadingTemplates"
                    />
                  </div>
                -->

                <!-- 收件人設定 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    收件人設定 <span class="text-red-500">*</span>
                  </label>
                  <Dropdown
                    v-model="emailForm.recipientType"
                    :options="recipientTypeOptions"
                    option-label="label"
                    option-value="value"
                    placeholder="請選擇收件人類型"
                    class="w-full mb-3"
                  />

                  <!-- 手動選擇收件人 -->
                  <MultiSelect
                    v-if="emailForm.recipientType === 'manual'"
                    v-model="emailForm.recipients"
                    :options="availableRecipients"
                    option-label="name"
                    option-value="email"
                    placeholder="請選擇收件人"
                    class="w-full"
                    display="chip"
                  >
                    <template #option="slotProps">
                      <div class="flex items-center gap-2">
                        <div>
                          <div class="font-medium">{{ slotProps.option.name }}</div>
                          <div class="text-sm text-gray-500">
                            {{ slotProps.option.email }} | {{ slotProps.option.department }}
                          </div>
                        </div>
                      </div>
                    </template>
                  </MultiSelect>

                  <!-- 顯示預估收件人數量 -->
                  <div v-if="recipientCount > 0" class="mt-2 text-sm text-gray-600">
                    <i class="pi pi-users mr-1"></i>
                    預估收件人數量：{{ recipientCount }} 人
                  </div>
                </div>

                <!-- 郵件主旨 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    郵件主旨 <span class="text-red-500">*</span>
                  </label>
                  <InputText
                    v-model="emailForm.subject"
                    placeholder="請輸入郵件主旨"
                    class="w-full"
                  />
                </div>

                <!-- 郵件內容 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    郵件內容 <span class="text-red-500">*</span>
                  </label>
                  <Textarea
                    v-model="emailForm.content"
                    placeholder="請輸入郵件內容..."
                    rows="12"
                    class="w-full"
                  />
                  <!--
                    <small class="text-gray-500 mt-1 block">
                      可使用變數：{APPLICANT_NAME}, {APPLICATION_ID}, {APPLY_DATE}, {DEPARTMENT} 等
                    </small>
                  -->
                </div>

                <!-- 附件上傳 -->
                <div>
                  <!--
                  <label class="block text-sm font-medium text-gray-700 mb-2"> 附件 </label>
                  <FileUpload
                    mode="basic"
                    name="attachments"
                    accept="*"
                    :multiple="true"
                    :auto="false"
                    choose-label="選擇檔案"
                    class="w-full"
                    @select="onFileSelect"
                  />
                -->

                  <!-- 已上傳附件列表 -->

                  <!--
                  <div v-if="emailForm.attachments.length > 0" class="mt-2">
                    <div
                      v-for="(file, index) in emailForm.attachments"
                      :key="index"
                      class="flex items-center justify-between bg-gray-100 p-2 rounded mb-1"
                    >
                      <span class="text-sm">{{ file.name }}</span>
                      <Button
                        icon="pi pi-times"
                        class="p-button-rounded p-button-text p-button-sm"
                        @click="removeAttachment(index)"
                      />
                    </div>
                  </div>
                  -->
                </div>

                <!-- 發送選項 -->
                <!--
                  <div>
                    <div class="flex items-center gap-3">
                      <Checkbox v-model="emailForm.sendImmediately" binary />
                      <label class="text-sm font-medium text-gray-700">立即發送</label>
                    </div>
                  </div>
                -->

                <!-- 操作按鈕 -->
                <div class="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    label="重置"
                    outlined
                    icon="pi pi-refresh"
                    :disabled="isSending"
                    @click="resetForm"
                  />
                  <Button
                    label="預覽"
                    outlined
                    icon="pi pi-eye"
                    :disabled="!emailForm.subject || !emailForm.content"
                    @click="previewEmail"
                  />
                  <Button
                    label="發送郵件"
                    icon="pi pi-send"
                    severity="success"
                    :loading="isSending"
                    :disabled="!canSend"
                    @click="sendEmail"
                  />
                </div>
              </div>
            </template>
          </Card>
        </div>

        <!-- 側邊資訊 -->
        <div class="space-y-6">
          <!-- 快速統計 -->
          <Card>
            <template #header>
              <div class="flex items-center gap-2 p-4 pb-0">
                <i class="pi pi-chart-bar text-green-600"></i>
                <h3 class="text-lg font-semibold text-gray-800">發送統計</h3>
              </div>
            </template>
            <template #content>
              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">今日發送</span>
                  <span class="text-2xl font-bold text-green-600">12</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">本週發送</span>
                  <span class="text-2xl font-bold text-blue-600">45</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">發送失敗</span>
                  <span class="text-2xl font-bold text-red-600">2</span>
                </div>
              </div>
            </template>
          </Card>

          <!-- 發送記錄 -->
          <Card>
            <template #header>
              <div class="flex items-center justify-between p-4 pb-0">
                <div class="flex items-center gap-2">
                  <i class="pi pi-history text-purple-600"></i>
                  <h3 class="text-lg font-semibold text-gray-800">最近發送</h3>
                </div>
                <Button label="查看全部" link size="small" @click="showHistoryDialog = true" />
              </div>
            </template>
            <template #content>
              <div class="space-y-3 max-h-64 overflow-y-auto">
                <div
                  v-for="record in emailHistory.slice(0, 5)"
                  :key="record.id"
                  class="p-3 border rounded-lg"
                >
                  <div class="flex items-center justify-between mb-1">
                    <span class="font-medium text-sm"
                      >{{ record.subject.substring(0, 30) }}...</span
                    >
                    <Tag
                      :value="getStatusText(record.status)"
                      :severity="getStatusSeverity(record.status)"
                      class="text-xs"
                    />
                  </div>
                  <div class="text-xs text-gray-500">
                    {{ record.sentTime.toLocaleString('zh-TW') }}
                  </div>
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>
    </div>

    <!-- 郵件預覽對話框 -->
    <Dialog
      v-model:visible="showPreviewDialog"
      header="郵件預覽"
      :style="{ width: '600px' }"
      :modal="true"
    >
      <div class="space-y-4">
        <div>
          <label class="text-sm font-medium text-gray-600">主旨：</label>
          <p class="font-medium">{{ emailForm.subject }}</p>
        </div>
        <div>
          <label class="text-sm font-medium text-gray-600">收件人：</label>
          <p>{{ recipientCount }} 人</p>
        </div>
        <Divider />
        <div>
          <label class="text-sm font-medium text-gray-600">內容：</label>
          <div class="mt-2 p-4 bg-gray-50 rounded border whitespace-pre-wrap">
            {{ emailForm.content }}
          </div>
        </div>
      </div>
      <template #footer>
        <Button label="關閉" outlined @click="showPreviewDialog = false" />
      </template>
    </Dialog>

    <!-- 發送記錄對話框 -->
    <Dialog
      v-model:visible="showHistoryDialog"
      header="發送記錄"
      :style="{ width: '80vw' }"
      :modal="true"
    >
      <DataTable :value="emailHistory" :paginator="true" :rows="10">
        <Column field="subject" header="主旨" sortable />
        <Column field="type" header="類型" />
        <Column field="recipients" header="收件人">
          <template #body="slotProps">
            {{
              Array.isArray(slotProps.data.recipients)
                ? slotProps.data.recipients.length + ' 人'
                : slotProps.data.recipients
            }}
          </template>
        </Column>
        <Column field="status" header="狀態">
          <template #body="slotProps">
            <Tag
              :value="getStatusText(slotProps.data.status)"
              :severity="getStatusSeverity(slotProps.data.status)"
            />
          </template>
        </Column>
        <Column field="sentTime" header="發送時間" sortable>
          <template #body="slotProps">
            {{ slotProps.data.sentTime.toLocaleString('zh-TW') }}
          </template>
        </Column>
        <Column field="sentBy" header="發送者" />
      </DataTable>
    </Dialog>

    <Toast />
  </div>
</template>
