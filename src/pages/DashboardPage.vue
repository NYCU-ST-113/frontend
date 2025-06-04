<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import { computed, onMounted, reactive, ref } from 'vue'

// PrimeVue 組件
import { getUserApplications } from '@/services/application'
import { getUserPayments } from '@/services/payment'
import { useAuthStore } from '@/stores/auth'
import { ApplicationStatus, type Application } from '@/types/application'
import { PaymentStatus } from '@/types/payment'
import { storeToRefs } from 'pinia'
import Avatar from 'primevue/avatar'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Tag from 'primevue/tag'
import Toast from 'primevue/toast'

// 簡化的資料類型
interface UserInfo {
  name: string
}

interface SimpleApplication {
  id: string
  title: string
  submitDate: Date
  status: ApplicationStatus
}

interface SimplePayment {
  id: string
  title: string
  amount: number
  status: string
}

interface QuickAction {
  title: string
  icon: string
  color: string
  action: () => void
}

interface Announcement {
  id: string
  title: string
  content: string
  publishDate: Date
  priority: 'high' | 'medium' | 'low'
  category: string
}

const toast = useToast()

const authStore = useAuthStore()
const { username } = storeToRefs(authStore)

const applicationsCount = ref(0)
const pendingApplicationsCount = ref(0)
const paymentsCount = ref(0)
const pendingPaymentsCount = ref(0)

// 使用者基本資訊
const userInfo = reactive<UserInfo>({
  name: username.value,
})

// 簡化統計數據
const stats = reactive({
  pendingApplications: 2,
  pendingPayments: 1,
  totalApplications: 8,
  totalPayments: 5,
})

// 最近申請（只顯示最新的3筆）
const recentApplications = ref<SimpleApplication[]>([])

// 待繳費項目（只顯示待處理的）
const pendingPayments = ref<SimplePayment[]>([])

// 快速操作
const quickActions = ref<QuickAction[]>([])

// 公告資料
const announcements = ref<Announcement[]>([])

// 載入狀態
const loading = ref(true)

// 問候語
const greetingMessage = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return '早安'
  if (hour < 18) return '午安'
  return '晚安'
})

// 載入最近申請
// const loadRecentApplications = () => {
//   recentApplications.value = [
//     {
//       id: 'APP-2024-156',
//       title: '軟體授權申請',
//       submitDate: new Date('2024-06-01'),
//       status: 'pending',
//     },
//     {
//       id: 'APP-2024-145',
//       title: '設備採購申請',
//       submitDate: new Date('2024-05-28'),
//       status: 'approved',
//     },
//     {
//       id: 'APP-2024-138',
//       title: '差旅費用申請',
//       submitDate: new Date('2024-05-25'),
//       status: 'pending',
//     },
//   ]
// }

// 載入待繳費項目
// const loadPendingPayments = () => {
//   pendingPayments.value = [
//     {
//       id: 'PAY-2024-089',
//       title: '設備採購申請',
//       amount: 45000,
//       status: 'pending',
//     },
//   ]
// }

// 載入快速操作
const loadQuickActions = () => {
  quickActions.value = [
    {
      title: '新增申請',
      icon: 'pi pi-plus',
      color: 'text-blue-600 bg-blue-100',
      action: () => handleNewApplication(),
    },
    {
      title: '我的申請',
      icon: 'pi pi-list',
      color: 'text-green-600 bg-green-100',
      action: () => handleViewApplications(),
    },
    {
      title: '繳費管理',
      icon: 'pi pi-credit-card',
      color: 'text-purple-600 bg-purple-100',
      action: () => handlePaymentManagement(),
    },
    {
      title: '使用規範',
      icon: 'pi pi-cog',
      color: 'text-gray-600 bg-gray-100',
      action: () => handleSettings(),
    },
  ]
}

// 載入公告資料
const loadAnnouncements = () => {
  announcements.value = [
    {
      id: 'ANN-2024-015',
      title: '系統維護通知',
      content: '本系統將於本週六凌晨2:00-4:00進行例行維護，期間暫停服務，敬請見諒。',
      publishDate: new Date('2024-06-01'),
      priority: 'high',
      category: '系統公告',
    },
    {
      id: 'ANN-2024-014',
      title: '新版本功能上線',
      content: '申請系統已新增批量上傳功能，提升使用者操作效率，歡迎多加利用。',
      publishDate: new Date('2024-05-30'),
      priority: 'medium',
      category: '功能更新',
    },
    {
      id: 'ANN-2024-013',
      title: '端午節假期提醒',
      content: '端午連假期間(6/10-6/12)，申請審核作業將順延至假期結束後處理。',
      publishDate: new Date('2024-05-28'),
      priority: 'medium',
      category: '假期通知',
    },
  ]
}

// 快速操作處理函數
const handleNewApplication = () => {
  toast.add({
    severity: 'info',
    summary: '導航',
    detail: '前往新增申請頁面',
    life: 2000,
  })
}

const handleViewApplications = () => {
  toast.add({
    severity: 'info',
    summary: '導航',
    detail: '前往申請列表頁面',
    life: 2000,
  })
}

const handlePaymentManagement = () => {
  toast.add({
    severity: 'info',
    summary: '導航',
    detail: '前往繳費管理頁面',
    life: 2000,
  })
}

const handleSettings = () => {
  toast.add({
    severity: 'info',
    summary: '導航',
    detail: '前往個人設定頁面',
    life: 2000,
  })
}

// 公告處理函數
const handleViewAllAnnouncements = () => {
  toast.add({
    severity: 'info',
    summary: '導航',
    detail: '前往公告列表頁面',
    life: 2000,
  })
}

const handleAnnouncementClick = (announcement: Announcement) => {
  toast.add({
    severity: 'info',
    summary: '查看公告',
    detail: `查看公告：${announcement.title}`,
    life: 2000,
  })
}

// 取得申請狀態
const getApplicationStatusSeverity = (status: string) => {
  switch (status) {
    case 'Approved':
      return 'success'
    case 'Pending':
      return 'info'
    case 'Rejected':
      return 'danger'
    default:
      return 'secondary'
  }
}

const getApplicationStatusText = (status: ApplicationStatus) => {
  switch (status) {
    case 'Approved':
      return '已核可'
    case 'Pending':
      return '待審核'
    case 'Rejected':
      return '已拒絕'
    default:
      return '未知'
  }
}

// 取得公告優先級
const getAnnouncementPrioritySeverity = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'danger'
    case 'medium':
      return 'warning'
    case 'low':
      return 'info'
    default:
      return 'secondary'
  }
}

const getAnnouncementPriorityText = (priority: string) => {
  switch (priority) {
    case 'high':
      return '重要'
    case 'medium':
      return '一般'
    case 'low':
      return '通知'
    default:
      return '未知'
  }
}

const getAnnouncementPriorityIcon = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'pi pi-exclamation-triangle'
    case 'medium':
      return 'pi pi-info-circle'
    case 'low':
      return 'pi pi-bell'
    default:
      return 'pi pi-info'
  }
}

// 格式化金額
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    maximumSignificantDigits: 4,
  }).format(amount)
}

// 格式化日期
const formatDate = (date: Date) => {
  return date.toLocaleDateString('zh-TW', {
    month: 'short',
    day: 'numeric',
  })
}

// 格式化完整日期
const formatFullDate = (date: Date) => {
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// 初始化資料
const fetchData = async () => {
  loading.value = true

  try {
    const applications = await getUserApplications(username.value)
    const payments = await getUserPayments(username.value)

    applicationsCount.value = applications.length
    pendingApplicationsCount.value = applications.filter(
      (app) => app.base.status === ApplicationStatus.pending,
    ).length
    paymentsCount.value = payments.length
    pendingPaymentsCount.value = payments.filter(
      (payment) => payment.status === PaymentStatus.pending,
    ).length

    recentApplications.value = applications.slice(0, 3).map((app) => ({
      id: app.id,
      title: app.type.toString(),
      submitDate: new Date(),
      status: app.base.status,
    }))
    pendingPayments.value = payments
      .filter((payment) => payment.status === PaymentStatus.pending)
      .map((payment) => ({
        id: payment.id,
        title: payment.serviceName,
        amount: payment.amount,
        status: payment.status,
      }))
    if (pendingPayments.value.length > 2) {
      pendingPayments.value = pendingPayments.value.slice(0, 2)
    }

    // loadRecentApplications()
    // loadPendingPayments()
    loadQuickActions()
    loadAnnouncements()
  } catch (error) {
    console.error('載入資料失敗:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="p-4 min-h-screen">
    <!-- 歡迎區域 -->
    <Card class="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <template #content>
        <div class="flex items-center gap-4">
          <Avatar icon="pi pi-user" size="large" class="bg-white text-blue-600 font-bold" />
          <div>
            <h1 class="text-2xl font-bold mb-1">{{ greetingMessage }}，{{ userInfo.name }}！</h1>
          </div>
        </div>
      </template>
    </Card>

    <!-- 統計卡片 -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <Card class="text-center hover:shadow-md transition-shadow">
        <template #content>
          <div class="text-blue-600 text-3xl">
            <i class="pi pi-file"></i>
          </div>
          <p class="text-2xl font-bold text-gray-900">{{ applicationsCount }}</p>
          <p class="text-sm text-gray-600">總申請數</p>
        </template>
      </Card>

      <Card class="text-center hover:shadow-md transition-shadow">
        <template #content>
          <div class="text-orange-600 text-3xl">
            <i class="pi pi-clock"></i>
          </div>
          <p class="text-2xl font-bold text-gray-900">{{ pendingApplicationsCount }}</p>
          <p class="text-sm text-gray-600">待審核</p>
        </template>
      </Card>

      <Card class="text-center hover:shadow-md transition-shadow">
        <template #content>
          <div class="text-purple-600 text-3xl">
            <i class="pi pi-credit-card"></i>
          </div>
          <p class="text-2xl font-bold text-gray-900">{{ paymentsCount }}</p>
          <p class="text-sm text-gray-600">總繳費數</p>
        </template>
      </Card>

      <Card class="text-center hover:shadow-md transition-shadow">
        <template #content>
          <div class="text-red-600 text-3xl">
            <i class="pi pi-exclamation-triangle"></i>
          </div>
          <p class="text-2xl font-bold text-gray-900">{{ pendingPaymentsCount }}</p>
          <p class="text-sm text-gray-600">待繳費</p>
        </template>
      </Card>
    </div>

    <!-- 快速操作 -->
    <!--
    <Card class="mb-6">
      <template #header>
        <div class="flex items-center gap-2 p-4 pb-0">
          <i class="pi pi-bolt text-yellow-600"></i>
          <h3 class="text-lg font-semibold">快速操作</h3>
        </div>
      </template>
      <template #content>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            v-for="action in quickActions"
            :key="action.title"
            class="flex flex-col items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            @click="action.action"
          >
            <div
              :class="action.color"
              class="w-12 h-12 rounded-full flex items-center justify-center"
            >
              <i :class="action.icon" class="text-xl"></i>
            </div>
            <span class="font-medium text-gray-900 text-center">{{ action.title }}</span>
          </div>
        </div>
      </template>
    </Card>
    -->

    <!-- 主要內容區域 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- 最近申請 -->
      <Card>
        <template #header>
          <div class="flex items-center justify-between p-4 pb-0">
            <div class="flex items-center gap-2">
              <i class="pi pi-list text-blue-600"></i>
              <h3 class="text-lg font-semibold">最近申請</h3>
            </div>
            <RouterLink :to="{ name: 'applications' }">
              <Button label="查看全部" link class="p-button-sm" />
            </RouterLink>
          </div>
        </template>
        <template #content>
          <div class="space-y-3">
            <div
              v-for="application in recentApplications"
              :key="application.id"
              class="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
            >
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <h4 class="font-medium text-gray-900">{{ application.title }}</h4>
                  <Tag
                    :value="getApplicationStatusText(application.status)"
                    :severity="getApplicationStatusSeverity(application.status)"
                    class="text-xs"
                  />
                </div>
                <div class="flex items-center gap-4 text-sm text-gray-500">
                  <span>{{ application.id }}</span>
                  <span>{{ formatDate(application.submitDate) }}</span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <!-- 待繳費項目 -->
      <Card>
        <template #header>
          <div class="flex items-center justify-between p-4 pb-0">
            <div class="flex items-center gap-2">
              <i class="pi pi-credit-card text-green-600"></i>
              <h3 class="text-lg font-semibold">待繳費項目</h3>
            </div>
            <RouterLink :to="{ name: 'payments' }">
              <Button label="查看全部" link class="p-button-sm" />
            </RouterLink>
          </div>
        </template>
        <template #content>
          <div v-if="pendingPayments.length === 0" class="text-center py-8 text-gray-500">
            <i class="pi pi-check-circle text-4xl mb-4 text-green-500"></i>
            <p>目前沒有待繳費項目</p>
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="payment in pendingPayments"
              :key="payment.id"
              class="p-4 border rounded-lg border-yellow-200 bg-yellow-50"
            >
              <div class="flex items-center justify-between mb-2">
                <h4 class="font-medium text-gray-900">{{ payment.title }}</h4>
                <Tag value="待繳費" severity="warning" />
              </div>
              <div class="flex items-center justify-between">
                <p class="text-lg font-bold text-gray-900">{{ formatCurrency(payment.amount) }}</p>
                <!--
                  <Button label="前往繳費" severity="primary" size="small" />
                -->
              </div>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- 公告欄 -->
    <Card>
      <template #header>
        <div class="flex items-center justify-between p-4 pb-0">
          <div class="flex items-center gap-2">
            <i class="pi pi-megaphone text-orange-600"></i>
            <h3 class="text-lg font-semibold">系統公告</h3>
          </div>
          <Button label="查看全部" link class="p-button-sm" @click="handleViewAllAnnouncements" />
        </div>
      </template>
      <template #content>
        <div class="space-y-3">
          <div
            v-for="announcement in announcements"
            :key="announcement.id"
            class="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            @click="handleAnnouncementClick(announcement)"
          >
            <div class="flex items-start gap-3">
              <div class="flex-shrink-0 mt-1">
                <i
                  :class="getAnnouncementPriorityIcon(announcement.priority)"
                  class="text-lg"
                  :style="{
                    color:
                      announcement.priority === 'high'
                        ? '#dc2626'
                        : announcement.priority === 'medium'
                          ? '#f59e0b'
                          : '#3b82f6',
                  }"
                ></i>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-2">
                  <h4 class="font-medium text-gray-900 truncate">{{ announcement.title }}</h4>
                  <Tag
                    :value="getAnnouncementPriorityText(announcement.priority)"
                    :severity="getAnnouncementPrioritySeverity(announcement.priority)"
                    class="text-xs flex-shrink-0"
                  />
                  <span
                    class="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full flex-shrink-0"
                  >
                    {{ announcement.category }}
                  </span>
                </div>
                <p class="text-sm text-gray-600 mb-2 line-clamp-2">{{ announcement.content }}</p>
                <div class="flex items-center justify-between">
                  <span class="text-xs text-gray-500">{{
                    formatFullDate(announcement.publishDate)
                  }}</span>
                  <i class="pi pi-chevron-right text-gray-400 text-xs"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Card>

    <Toast />
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
