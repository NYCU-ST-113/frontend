<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import { computed, onMounted, reactive, ref } from 'vue'

// PrimeVue 組件
import Avatar from 'primevue/avatar'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Tag from 'primevue/tag'
import Toast from 'primevue/toast'

// 簡化的資料類型
interface UserInfo {
  name: string
  department: string
}

interface SimpleApplication {
  id: string
  title: string
  submitDate: Date
  status: 'pending' | 'approved' | 'rejected'
}

interface SimplePayment {
  id: string
  title: string
  amount: number
  status: 'pending' | 'paid' | 'overdue'
}

interface QuickAction {
  title: string
  icon: string
  color: string
  action: () => void
}

const toast = useToast()

// 使用者基本資訊
const userInfo = reactive<UserInfo>({
  name: '王小明',
  department: '資訊技術部',
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
const loadRecentApplications = () => {
  recentApplications.value = [
    {
      id: 'APP-2024-156',
      title: '軟體授權申請',
      submitDate: new Date('2024-06-01'),
      status: 'pending',
    },
    {
      id: 'APP-2024-145',
      title: '設備採購申請',
      submitDate: new Date('2024-05-28'),
      status: 'approved',
    },
    {
      id: 'APP-2024-138',
      title: '差旅費用申請',
      submitDate: new Date('2024-05-25'),
      status: 'pending',
    },
  ]
}

// 載入待繳費項目
const loadPendingPayments = () => {
  pendingPayments.value = [
    {
      id: 'PAY-2024-089',
      title: '設備採購申請',
      amount: 45000,
      status: 'pending',
    },
  ]
}

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
      title: '個人設定',
      icon: 'pi pi-cog',
      color: 'text-gray-600 bg-gray-100',
      action: () => handleSettings(),
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

// 取得申請狀態
const getApplicationStatusSeverity = (status: string) => {
  switch (status) {
    case 'approved':
      return 'success'
    case 'pending':
      return 'warning'
    case 'rejected':
      return 'danger'
    default:
      return 'secondary'
  }
}

const getApplicationStatusText = (status: string) => {
  switch (status) {
    case 'approved':
      return '已通過'
    case 'pending':
      return '待審核'
    case 'rejected':
      return '已拒絕'
    default:
      return '未知'
  }
}

// 格式化金額
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
  }).format(amount)
}

// 格式化日期
const formatDate = (date: Date) => {
  return date.toLocaleDateString('zh-TW', {
    month: 'short',
    day: 'numeric',
  })
}

// 初始化資料
const initializeData = async () => {
  loading.value = true

  try {
    await new Promise((resolve) => setTimeout(resolve, 500))

    loadRecentApplications()
    loadPendingPayments()
    loadQuickActions()
  } catch (error) {
    console.error('載入資料失敗:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  initializeData()
})
</script>

<template>
  <div class="p-4 min-h-screen">
    <!-- 歡迎區域 -->
    <Card class="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <template #content>
        <div class="flex items-center gap-4">
          <Avatar
            :label="userInfo.name.charAt(0)"
            size="large"
            class="bg-white text-blue-600 font-bold"
          />
          <div>
            <h1 class="text-2xl font-bold mb-1">{{ greetingMessage }}，{{ userInfo.name }}！</h1>
            <p class="text-blue-100">{{ userInfo.department }}</p>
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
          <p class="text-2xl font-bold text-gray-900">{{ stats.totalApplications }}</p>
          <p class="text-sm text-gray-600">總申請數</p>
        </template>
      </Card>

      <Card class="text-center hover:shadow-md transition-shadow">
        <template #content>
          <div class="text-orange-600 text-3xl">
            <i class="pi pi-clock"></i>
          </div>
          <p class="text-2xl font-bold text-gray-900">{{ stats.pendingApplications }}</p>
          <p class="text-sm text-gray-600">待審核</p>
        </template>
      </Card>

      <Card class="text-center hover:shadow-md transition-shadow">
        <template #content>
          <div class="text-purple-600 text-3xl">
            <i class="pi pi-credit-card"></i>
          </div>
          <p class="text-2xl font-bold text-gray-900">{{ stats.totalPayments }}</p>
          <p class="text-sm text-gray-600">總繳費數</p>
        </template>
      </Card>

      <Card class="text-center hover:shadow-md transition-shadow">
        <template #content>
          <div class="text-red-600 text-3xl">
            <i class="pi pi-exclamation-triangle"></i>
          </div>
          <p class="text-2xl font-bold text-gray-900">{{ stats.pendingPayments }}</p>
          <p class="text-sm text-gray-600">待繳費</p>
        </template>
      </Card>
    </div>

    <!-- 快速操作 -->
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

    <!-- 主要內容區域 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 最近申請 -->
      <Card>
        <template #header>
          <div class="flex items-center justify-between p-4 pb-0">
            <div class="flex items-center gap-2">
              <i class="pi pi-list text-blue-600"></i>
              <h3 class="text-lg font-semibold">最近申請</h3>
            </div>
            <Button label="查看全部" link class="p-button-sm" />
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
            <Button label="查看全部" link class="p-button-sm" />
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
                <Button label="前往繳費" severity="primary" size="small" />
              </div>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <Toast />
  </div>
</template>
