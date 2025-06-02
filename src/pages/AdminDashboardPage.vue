<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import { computed, onMounted, reactive, ref } from 'vue'

// PrimeVue 組件
import Badge from 'primevue/badge'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Chart from 'primevue/chart'
import Message from 'primevue/message'
import ProgressBar from 'primevue/progressbar'
import Tag from 'primevue/tag'
import Timeline from 'primevue/timeline'
import Toast from 'primevue/toast'

// 定義資料類型
interface SystemBanner {
  id: string
  message: string
  type: 'info' | 'warn' | 'error' | 'success'
  startDate: Date
  endDate: Date
  isActive: boolean
}

interface Announcement {
  id: string
  title: string
  content: string
  date: Date
  priority: 'high' | 'medium' | 'low'
  isRead: boolean
}

interface ApplicationStatus {
  pending: number
  approved: number
  rejected: number
  total: number
}

interface PaymentStatus {
  pendingPayment: number
  completed: number
  overdue: number
  total: number
}

interface RecentActivity {
  id: string
  action: string
  description: string
  timestamp: Date
  type: 'application' | 'payment' | 'system'
}

interface QuickStats {
  label: string
  value: number
  icon: string
  color: string
  trend: number
}

const toast = useToast()

// 系統橫幅
const systemBanner = ref<SystemBanner | null>(null)

// 公告資料
const announcements = ref<Announcement[]>([])
// const selectedAnnouncement = ref<Announcement | null>(null)

// 申請狀態統計
const applicationStats = reactive<ApplicationStatus>({
  pending: 0,
  approved: 0,
  rejected: 0,
  total: 0,
})

// 繳費狀態統計
const paymentStats = reactive<PaymentStatus>({
  pendingPayment: 0,
  completed: 0,
  overdue: 0,
  total: 0,
})

// 最近活動
const recentActivities = ref<RecentActivity[]>([])

// 快速統計資料
const quickStats = ref<QuickStats[]>([])

// 圖表資料
const chartData = ref()
const chartOptions = ref()

// 載入中狀態
const loading = ref(true)

// 計算屬性
const pendingApplicationsPercentage = computed(() => {
  return applicationStats.total > 0 ? (applicationStats.pending / applicationStats.total) * 100 : 0
})

// const overduePaymentsPercentage = computed(() => {
//   return paymentStats.total > 0 ? (paymentStats.overdue / paymentStats.total) * 100 : 0
// })

// 載入系統橫幅
const loadSystemBanner = () => {
  const now = new Date()
  const banner: SystemBanner = {
    id: 'banner-001',
    message: '🎉 系統維護通知：將於本週六凌晨 2:00-4:00 進行系統更新，期間服務可能暫停，敬請見諒！',
    type: 'warn',
    startDate: new Date('2024-06-01'),
    endDate: new Date('2024-06-10'),
    isActive: true,
  }

  if (banner.isActive && now >= banner.startDate && now <= banner.endDate) {
    systemBanner.value = banner
  }
}

// 載入公告資料
const loadAnnouncements = () => {
  announcements.value = [
    {
      id: '1',
      title: '新版申請系統上線',
      content:
        '全新的申請系統已正式上線，提供更便利的申請流程和更直觀的操作介面。歡迎大家體驗新功能！',
      date: new Date('2024-06-01T09:00:00'),
      priority: 'high',
      isRead: false,
    },
    {
      id: '2',
      title: '繳費方式新增支援',
      content: '現在支援更多繳費方式，包括電子支付、信用卡分期等選項，讓繳費更加便利。',
      date: new Date('2024-05-28T14:30:00'),
      priority: 'medium',
      isRead: true,
    },
    {
      id: '3',
      title: '系統安全性提升',
      content: '我們已加強系統的安全防護機制，包括雙因子認證和加密傳輸，保障您的資料安全。',
      date: new Date('2024-05-25T11:15:00'),
      priority: 'medium',
      isRead: true,
    },
    {
      id: '4',
      title: '假期服務調整',
      content: '端午節連假期間，客服時間調整為週一至週五 9:00-17:00，如有緊急需求請使用線上客服。',
      date: new Date('2024-05-20T16:45:00'),
      priority: 'low',
      isRead: false,
    },
  ]
}

// 載入申請統計
const loadApplicationStats = () => {
  applicationStats.pending = 12
  applicationStats.approved = 45
  applicationStats.rejected = 3
  applicationStats.total = 60
}

// 載入繳費統計
const loadPaymentStats = () => {
  paymentStats.pendingPayment = 8
  paymentStats.completed = 35
  paymentStats.overdue = 2
  paymentStats.total = 45
}

// 載入最近活動
const loadRecentActivities = () => {
  recentActivities.value = [
    {
      id: '1',
      action: '申請提交',
      description: '您提交了新的服務申請 #APP-2024-156',
      timestamp: new Date('2024-06-01T10:30:00'),
      type: 'application',
    },
    {
      id: '2',
      action: '繳費完成',
      description: '申請 #APP-2024-145 的繳費已完成',
      timestamp: new Date('2024-05-31T15:20:00'),
      type: 'payment',
    },
    {
      id: '3',
      action: '申請審核',
      description: '申請 #APP-2024-144 已通過審核',
      timestamp: new Date('2024-05-30T09:15:00'),
      type: 'application',
    },
    {
      id: '4',
      action: '系統通知',
      description: '您的帳戶安全設定已更新',
      timestamp: new Date('2024-05-29T14:45:00'),
      type: 'system',
    },
    {
      id: '5',
      action: '申請提交',
      description: '您提交了新的服務申請 #APP-2024-143',
      timestamp: new Date('2024-05-28T11:00:00'),
      type: 'application',
    },
  ]
}

// 載入快速統計
const loadQuickStats = () => {
  quickStats.value = [
    {
      label: '本月申請數',
      value: 28,
      icon: 'pi pi-file',
      color: 'text-blue-600',
      trend: 12,
    },
    {
      label: '待處理事項',
      value: 5,
      icon: 'pi pi-clock',
      color: 'text-orange-600',
      trend: -3,
    },
    {
      label: '已完成申請',
      value: 42,
      icon: 'pi pi-check-circle',
      color: 'text-green-600',
      trend: 8,
    },
    {
      label: '系統使用天數',
      value: 89,
      icon: 'pi pi-calendar',
      color: 'text-purple-600',
      trend: 1,
    },
  ]
}

// 載入圖表資料
const loadChartData = () => {
  chartData.value = {
    labels: ['一月', '二月', '三月', '四月', '五月', '六月'],
    datasets: [
      {
        label: '申請數量',
        data: [12, 19, 15, 25, 22, 28],
        fill: false,
        borderColor: '#42A5F5',
        backgroundColor: 'rgba(66, 165, 245, 0.1)',
        tension: 0.4,
      },
      {
        label: '完成數量',
        data: [8, 16, 12, 22, 20, 25],
        fill: false,
        borderColor: '#66BB6A',
        backgroundColor: 'rgba(102, 187, 106, 0.1)',
        tension: 0.4,
      },
    ],
  }

  chartOptions.value = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }
}

// 標記公告為已讀
const markAsRead = (announcement: Announcement) => {
  announcement.isRead = true
  toast.add({
    severity: 'info',
    summary: '已標記為已讀',
    detail: announcement.title,
    life: 2000,
  })
}

// 取得優先級顏色
const getPriorityColor = (priority: string) => {
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

// 取得活動類型圖示
const getActivityIcon = (type: string) => {
  switch (type) {
    case 'application':
      return 'pi pi-file'
    case 'payment':
      return 'pi pi-credit-card'
    case 'system':
      return 'pi pi-cog'
    default:
      return 'pi pi-info-circle'
  }
}

// 取得活動類型顏色
const getActivityColor = (type: string) => {
  switch (type) {
    case 'application':
      return 'text-blue-600'
    case 'payment':
      return 'text-green-600'
    case 'system':
      return 'text-purple-600'
    default:
      return 'text-gray-600'
  }
}

// 格式化時間
const formatTime = (date: Date) => {
  return date.toLocaleString('zh-TW', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// 關閉系統橫幅
const closeBanner = () => {
  systemBanner.value = null
}

// 初始化資料
const initializeData = async () => {
  loading.value = true

  try {
    // 模擬 API 載入時間
    await new Promise((resolve) => setTimeout(resolve, 1000))

    loadSystemBanner()
    loadAnnouncements()
    loadApplicationStats()
    loadPaymentStats()
    loadRecentActivities()
    loadQuickStats()
    loadChartData()
  } catch (error) {
    console.error('載入資料失敗:', error)
    toast.add({
      severity: 'error',
      summary: '載入失敗',
      detail: '無法載入儀表板資料',
      life: 3000,
    })
  } finally {
    loading.value = false
  }
}

// 組件掛載
onMounted(() => {
  initializeData()
})
</script>

<template>
  <div class="p-4 min-h-screen">
    <!-- 系統橫幅 -->
    <div v-if="systemBanner" class="mb-6">
      <Message :severity="systemBanner.type" :closable="true" class="w-full" @close="closeBanner">
        <span class="font-medium">{{ systemBanner.message }}</span>
      </Message>
    </div>

    <!-- 頁面標題 -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">儀表板</h1>
      <p class="text-gray-600">歡迎回來！以下是您的系統概況和最新資訊</p>
    </div>

    <!-- 快速統計卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card
        v-for="stat in quickStats"
        :key="stat.label"
        class="bg-white shadow-sm hover:shadow-md transition-shadow"
      >
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 mb-1">{{ stat.label }}</p>
              <p class="text-3xl font-bold text-gray-900">{{ stat.value }}</p>
              <div class="flex items-center mt-2">
                <i
                  :class="
                    stat.trend > 0
                      ? 'pi pi-arrow-up text-green-500'
                      : 'pi pi-arrow-down text-red-500'
                  "
                  class="text-xs mr-1"
                ></i>
                <span
                  :class="stat.trend > 0 ? 'text-green-600' : 'text-red-600'"
                  class="text-sm font-medium"
                >
                  {{ Math.abs(stat.trend) }}
                </span>
                <span class="text-gray-500 text-sm ml-1">vs 上月</span>
              </div>
            </div>
            <div :class="stat.color" class="text-4xl opacity-80">
              <i :class="stat.icon"></i>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- 主要內容區域 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <!-- 申請狀態統計 -->
      <Card class="lg:col-span-1">
        <template #header>
          <div class="flex items-center gap-2 p-4 pb-0">
            <i class="pi pi-chart-pie text-blue-600"></i>
            <h3 class="text-lg font-semibold">申請狀態</h3>
          </div>
        </template>
        <template #content>
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-gray-600">正在審核</span>
              <div class="flex items-center gap-2">
                <Badge :value="applicationStats.pending" severity="warning" />
                <span class="text-sm text-gray-500"
                  >{{ pendingApplicationsPercentage.toFixed(1) }}%</span
                >
              </div>
            </div>
            <ProgressBar :value="pendingApplicationsPercentage" class="h-2" />

            <div class="grid grid-cols-3 gap-4 pt-4 border-t">
              <div class="text-center">
                <p class="text-2xl font-bold text-green-600">{{ applicationStats.approved }}</p>
                <p class="text-sm text-gray-600">已通過</p>
              </div>
              <div class="text-center">
                <p class="text-2xl font-bold text-orange-600">{{ applicationStats.pending }}</p>
                <p class="text-sm text-gray-600">審核中</p>
              </div>
              <div class="text-center">
                <p class="text-2xl font-bold text-red-600">{{ applicationStats.rejected }}</p>
                <p class="text-sm text-gray-600">已拒絕</p>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <!-- 繳費狀態統計 -->
      <Card class="lg:col-span-1">
        <template #header>
          <div class="flex items-center gap-2 p-4 pb-0">
            <i class="pi pi-credit-card text-green-600"></i>
            <h3 class="text-lg font-semibold">繳費狀態</h3>
          </div>
        </template>
        <template #content>
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-gray-600">待繳費</span>
              <div class="flex items-center gap-2">
                <Badge :value="paymentStats.pendingPayment" severity="info" />
                <span class="text-sm text-gray-500">
                  {{ ((paymentStats.pendingPayment / paymentStats.total) * 100).toFixed(1) }}%
                </span>
              </div>
            </div>
            <ProgressBar
              :value="(paymentStats.pendingPayment / paymentStats.total) * 100"
              class="h-2"
            />

            <div class="grid grid-cols-3 gap-4 pt-4 border-t">
              <div class="text-center">
                <p class="text-2xl font-bold text-green-600">{{ paymentStats.completed }}</p>
                <p class="text-sm text-gray-600">已完成</p>
              </div>
              <div class="text-center">
                <p class="text-2xl font-bold text-blue-600">{{ paymentStats.pendingPayment }}</p>
                <p class="text-sm text-gray-600">待繳費</p>
              </div>
              <div class="text-center">
                <p class="text-2xl font-bold text-red-600">{{ paymentStats.overdue }}</p>
                <p class="text-sm text-gray-600">逾期</p>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <!-- 月度趨勢圖表 -->
      <Card class="lg:col-span-1">
        <template #header>
          <div class="flex items-center gap-2 p-4 pb-0">
            <i class="pi pi-chart-line text-purple-600"></i>
            <h3 class="text-lg font-semibold">月度趨勢</h3>
          </div>
        </template>
        <template #content>
          <div class="h-64">
            <Chart type="line" :data="chartData" :options="chartOptions" class="h-full" />
          </div>
        </template>
      </Card>
    </div>

    <!-- 公告和活動區域 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 公告欄 -->
      <Card>
        <template #header>
          <div class="flex items-center justify-between p-4 pb-0">
            <div class="flex items-center gap-2">
              <i class="pi pi-megaphone text-orange-600"></i>
              <h3 class="text-lg font-semibold">系統公告</h3>
            </div>
            <Button label="查看全部" link class="p-button-sm" />
          </div>
        </template>
        <template #content>
          <div class="space-y-3 max-h-96 overflow-y-auto">
            <div
              v-for="announcement in announcements"
              :key="announcement.id"
              class="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              :class="{ 'bg-blue-50 border-blue-200': !announcement.isRead }"
              @click="markAsRead(announcement)"
            >
              <div class="flex items-start justify-between mb-2">
                <h4 class="font-medium text-gray-900 flex-1">{{ announcement.title }}</h4>
                <div class="flex items-center gap-2 ml-2">
                  <Tag
                    :value="announcement.priority"
                    :severity="getPriorityColor(announcement.priority)"
                    class="text-xs"
                  />
                  <div v-if="!announcement.isRead" class="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
              </div>
              <p class="text-sm text-gray-600 mb-2 line-clamp-2">{{ announcement.content }}</p>
              <p class="text-xs text-gray-500">{{ formatTime(announcement.date) }}</p>
            </div>
          </div>
        </template>
      </Card>

      <!-- 最近活動 -->
      <Card>
        <template #header>
          <div class="flex items-center justify-between p-4 pb-0">
            <div class="flex items-center gap-2">
              <i class="pi pi-history text-indigo-600"></i>
              <h3 class="text-lg font-semibold">最近活動</h3>
            </div>
            <Button label="查看全部" link class="p-button-sm" />
          </div>
        </template>
        <template #content>
          <Timeline :value="recentActivities" class="max-h-96 overflow-y-auto">
            <template #marker="{ item }">
              <div
                :class="getActivityColor(item.type)"
                class="flex items-center justify-center w-8 h-8 bg-white border-2 border-current rounded-full"
              >
                <i :class="getActivityIcon(item.type)" class="text-sm"></i>
              </div>
            </template>
            <template #content="{ item }">
              <div class="ml-4">
                <div class="flex items-center gap-2 mb-1">
                  <h5 class="font-medium text-gray-900">{{ item.action }}</h5>
                  <span class="text-xs text-gray-500">{{ formatTime(item.timestamp) }}</span>
                </div>
                <p class="text-sm text-gray-600">{{ item.description }}</p>
              </div>
            </template>
          </Timeline>
        </template>
      </Card>
    </div>

    <Toast />
  </div>
</template>
