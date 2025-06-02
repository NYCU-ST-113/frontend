<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import { reactive, ref } from 'vue'

// PrimeVue 組件
import Button from 'primevue/button'
import Calendar from 'primevue/calendar'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'

// 定義表單資料類型
interface ApplicationFormData {
  department: string
  applicant_account: string
  applicant_name: string
  applicant_phone: string
  applicant_email: string
  tech_contact_name: string
  tech_contact_phone: string
  tech_contact_email: string
  supervisor_name: string
  supervisor_id: string
  supervisor_email: string
  apply_date: Date | null
}

// 定義錯誤訊息類型
interface FormErrors {
  department?: string
  applicant_account?: string
  applicant_name?: string
  applicant_phone?: string
  applicant_email?: string
  tech_contact_name?: string
  tech_contact_phone?: string
  tech_contact_email?: string
  supervisor_name?: string
  supervisor_id?: string
  supervisor_email?: string
  apply_date?: string
}

// 定義驗證欄位類型
interface ValidationField {
  key: keyof ApplicationFormData
  label: string
}

const toast = useToast()

// 表單資料
const formData = reactive<ApplicationFormData>({
  department: '',
  applicant_account: '',
  applicant_name: '',
  applicant_phone: '',
  applicant_email: '',
  tech_contact_name: '',
  tech_contact_phone: '',
  tech_contact_email: '',
  supervisor_name: '',
  supervisor_id: '',
  supervisor_email: '',
  apply_date: new Date(),
})

// 錯誤訊息
const errors = reactive<FormErrors>({})

// 提交狀態
const isSubmitting = ref<boolean>(false)

// 驗證規則
const validateForm = (): boolean => {
  // 清空錯誤
  Object.keys(errors).forEach((key) => delete errors[key as keyof FormErrors])

  let isValid = true

  // 必填欄位驗證
  const requiredFields: ValidationField[] = [
    { key: 'department', label: '部門' },
    { key: 'applicant_account', label: '申請人帳號' },
    { key: 'applicant_name', label: '申請人姓名' },
    { key: 'applicant_phone', label: '申請人電話' },
    { key: 'applicant_email', label: '申請人電子郵件' },
    { key: 'tech_contact_name', label: '技術聯絡人姓名' },
    { key: 'tech_contact_phone', label: '技術聯絡人電話' },
    { key: 'tech_contact_email', label: '技術聯絡人電子郵件' },
    { key: 'supervisor_name', label: '主管姓名' },
    { key: 'supervisor_id', label: '主管編號' },
    { key: 'supervisor_email', label: '主管電子郵件' },
    { key: 'apply_date', label: '申請日期' },
  ]

  requiredFields.forEach((field: ValidationField) => {
    const value = formData[field.key]
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      errors[field.key] = `${field.label}為必填欄位`
      isValid = false
    }
  })

  // Email 格式驗證
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const emailFields: (keyof ApplicationFormData)[] = [
    'applicant_email',
    'tech_contact_email',
    'supervisor_email',
  ]

  emailFields.forEach((field: keyof ApplicationFormData) => {
    const email = formData[field] as string
    if (email && !emailRegex.test(email)) {
      errors[field] = '請輸入正確的電子郵件格式'
      isValid = false
    }
  })

  // 電話號碼格式驗證 (簡單的台灣電話號碼格式)
  const phoneRegex = /^[0-9\-\+\(\)\s]+$/
  const phoneFields: (keyof ApplicationFormData)[] = ['applicant_phone', 'tech_contact_phone']

  phoneFields.forEach((field: keyof ApplicationFormData) => {
    const phone = formData[field] as string
    if (phone && !phoneRegex.test(phone)) {
      errors[field] = '請輸入正確的電話號碼格式'
      isValid = false
    }
  })

  return isValid
}

// 提交表單
const submitForm = async (): Promise<void> => {
  if (!validateForm()) {
    toast.add({
      severity: 'warn',
      summary: '表單驗證失敗',
      detail: '請檢查並修正表單中的錯誤',
      life: 3000,
    })
    return
  }

  isSubmitting.value = true

  try {
    // 模擬 API 呼叫
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log('提交的表單資料:', formData)

    toast.add({
      severity: 'success',
      summary: '申請提交成功',
      detail: '您的申請已成功提交，請等待審核結果',
      life: 3000,
    })

    // 可以在這裡添加實際的 API 呼叫邏輯
    // await api.submitApplication(formData)
  } catch (error) {
    console.error('提交失敗:', error)
    toast.add({
      severity: 'error',
      summary: '提交失敗',
      detail: '申請提交時發生錯誤，請稍後再試',
      life: 3000,
    })
  } finally {
    isSubmitting.value = false
  }
}

// 重置表單
const resetForm = (): void => {
  Object.keys(formData).forEach((key: string) => {
    const typedKey = key as keyof ApplicationFormData
    if (typedKey === 'apply_date') {
      formData[typedKey] = new Date()
    } else {
      ;(formData[typedKey] as string) = ''
    }
  })
  Object.keys(errors).forEach((key) => delete errors[key as keyof FormErrors])

  toast.add({
    severity: 'info',
    summary: '表單已重置',
    detail: '所有欄位已清空',
    life: 2000,
  })
}

// 如果需要暴露給父組件使用的方法或資料
defineExpose({
  formData,
  submitForm,
  resetForm,
  validateForm,
})
</script>

<template>
  <div class="p-4 min-h-screen">
    <Card class="max-w-5xl mx-auto">
      <template #header>
        <div
          class="text-center p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg mb-0"
        >
          <i class="pi pi-file-edit text-4xl block mb-2"></i>
          <h1 class="text-3xl font-semibold">申請表單</h1>
        </div>
      </template>

      <template #content>
        <form class="space-y-8" @submit.prevent="submitForm">
          <!-- 基本資訊 -->
          <div class="form-section">
            <div
              class="flex items-center gap-2 text-gray-700 text-lg font-semibold mb-4 pb-2 border-b-2 border-gray-200"
            >
              <i class="pi pi-info-circle"></i>
              基本資訊
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div class="flex flex-col">
                <label for="department" class="font-medium text-gray-700 mb-2 text-sm">
                  部門 <span class="text-red-500">*</span>
                </label>
                <InputText
                  id="department"
                  v-model="formData.department"
                  :class="{ 'p-invalid': errors.department }"
                  placeholder="請輸入部門名稱"
                  class="w-full"
                />
                <small v-if="errors.department" class="text-red-500 text-xs mt-1">{{
                  errors.department
                }}</small>
              </div>

              <div class="flex flex-col">
                <label for="apply_date" class="font-medium text-gray-700 mb-2 text-sm">
                  申請日期 <span class="text-red-500">*</span>
                </label>
                <Calendar
                  id="apply_date"
                  v-model="formData.apply_date"
                  :class="{ 'p-invalid': errors.apply_date }"
                  date-format="yy/mm/dd"
                  placeholder="選擇申請日期"
                  show-icon
                  class="w-full"
                />
                <small v-if="errors.apply_date" class="text-red-500 text-xs mt-1">{{
                  errors.apply_date
                }}</small>
              </div>
            </div>
          </div>

          <!-- 申請人資訊 -->
          <div class="form-section">
            <div
              class="flex items-center gap-2 text-gray-700 text-lg font-semibold mb-4 pb-2 border-b-2 border-gray-200"
            >
              <i class="pi pi-user"></i>
              申請人資訊
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div class="flex flex-col">
                <label for="applicant_account" class="font-medium text-gray-700 mb-2 text-sm">
                  申請人帳號 <span class="text-red-500">*</span>
                </label>
                <InputText
                  id="applicant_account"
                  v-model="formData.applicant_account"
                  :class="{ 'p-invalid': errors.applicant_account }"
                  placeholder="請輸入申請人帳號"
                  class="w-full"
                />
                <small v-if="errors.applicant_account" class="text-red-500 text-xs mt-1">{{
                  errors.applicant_account
                }}</small>
              </div>

              <div class="flex flex-col">
                <label for="applicant_name" class="font-medium text-gray-700 mb-2 text-sm">
                  申請人姓名 <span class="text-red-500">*</span>
                </label>
                <InputText
                  id="applicant_name"
                  v-model="formData.applicant_name"
                  :class="{ 'p-invalid': errors.applicant_name }"
                  placeholder="請輸入申請人姓名"
                  class="w-full"
                />
                <small v-if="errors.applicant_name" class="text-red-500 text-xs mt-1">{{
                  errors.applicant_name
                }}</small>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div class="flex flex-col">
                <label for="applicant_phone" class="font-medium text-gray-700 mb-2 text-sm">
                  申請人電話 <span class="text-red-500">*</span>
                </label>
                <InputText
                  id="applicant_phone"
                  v-model="formData.applicant_phone"
                  :class="{ 'p-invalid': errors.applicant_phone }"
                  placeholder="請輸入電話號碼"
                  class="w-full"
                />
                <small v-if="errors.applicant_phone" class="text-red-500 text-xs mt-1">{{
                  errors.applicant_phone
                }}</small>
              </div>

              <div class="flex flex-col">
                <label for="applicant_email" class="font-medium text-gray-700 mb-2 text-sm">
                  申請人電子郵件 <span class="text-red-500">*</span>
                </label>
                <InputText
                  id="applicant_email"
                  v-model="formData.applicant_email"
                  :class="{ 'p-invalid': errors.applicant_email }"
                  placeholder="請輸入電子郵件"
                  type="email"
                  class="w-full"
                />
                <small v-if="errors.applicant_email" class="text-red-500 text-xs mt-1">{{
                  errors.applicant_email
                }}</small>
              </div>
            </div>
          </div>

          <!-- 技術聯絡人資訊 -->
          <div class="form-section">
            <div
              class="flex items-center gap-2 text-gray-700 text-lg font-semibold mb-4 pb-2 border-b-2 border-gray-200"
            >
              <i class="pi pi-cog"></i>
              技術聯絡人資訊
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div class="flex flex-col">
                <label for="tech_contact_name" class="font-medium text-gray-700 mb-2 text-sm">
                  技術聯絡人姓名 <span class="text-red-500">*</span>
                </label>
                <InputText
                  id="tech_contact_name"
                  v-model="formData.tech_contact_name"
                  :class="{ 'p-invalid': errors.tech_contact_name }"
                  placeholder="請輸入技術聯絡人姓名"
                  class="w-full"
                />
                <small v-if="errors.tech_contact_name" class="text-red-500 text-xs mt-1">{{
                  errors.tech_contact_name
                }}</small>
              </div>

              <div class="flex flex-col">
                <label for="tech_contact_phone" class="font-medium text-gray-700 mb-2 text-sm">
                  技術聯絡人電話 <span class="text-red-500">*</span>
                </label>
                <InputText
                  id="tech_contact_phone"
                  v-model="formData.tech_contact_phone"
                  :class="{ 'p-invalid': errors.tech_contact_phone }"
                  placeholder="請輸入電話號碼"
                  class="w-full"
                />
                <small v-if="errors.tech_contact_phone" class="text-red-500 text-xs mt-1">{{
                  errors.tech_contact_phone
                }}</small>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4 mb-4">
              <div class="flex flex-col">
                <label for="tech_contact_email" class="font-medium text-gray-700 mb-2 text-sm">
                  技術聯絡人電子郵件 <span class="text-red-500">*</span>
                </label>
                <InputText
                  id="tech_contact_email"
                  v-model="formData.tech_contact_email"
                  :class="{ 'p-invalid': errors.tech_contact_email }"
                  placeholder="請輸入電子郵件"
                  type="email"
                  class="w-full"
                />
                <small v-if="errors.tech_contact_email" class="text-red-500 text-xs mt-1">{{
                  errors.tech_contact_email
                }}</small>
              </div>
            </div>
          </div>

          <!-- 主管資訊 -->
          <div class="form-section">
            <div
              class="flex items-center gap-2 text-gray-700 text-lg font-semibold mb-4 pb-2 border-b-2 border-gray-200"
            >
              <i class="pi pi-users"></i>
              主管資訊
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div class="flex flex-col">
                <label for="supervisor_name" class="font-medium text-gray-700 mb-2 text-sm">
                  主管姓名 <span class="text-red-500">*</span>
                </label>
                <InputText
                  id="supervisor_name"
                  v-model="formData.supervisor_name"
                  :class="{ 'p-invalid': errors.supervisor_name }"
                  placeholder="請輸入主管姓名"
                  class="w-full"
                />
                <small v-if="errors.supervisor_name" class="text-red-500 text-xs mt-1">{{
                  errors.supervisor_name
                }}</small>
              </div>

              <div class="flex flex-col">
                <label for="supervisor_id" class="font-medium text-gray-700 mb-2 text-sm">
                  主管編號 <span class="text-red-500">*</span>
                </label>
                <InputText
                  id="supervisor_id"
                  v-model="formData.supervisor_id"
                  :class="{ 'p-invalid': errors.supervisor_id }"
                  placeholder="請輸入主管編號"
                  class="w-full"
                />
                <small v-if="errors.supervisor_id" class="text-red-500 text-xs mt-1">{{
                  errors.supervisor_id
                }}</small>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4 mb-4">
              <div class="flex flex-col">
                <label for="supervisor_email" class="font-medium text-gray-700 mb-2 text-sm">
                  主管電子郵件 <span class="text-red-500">*</span>
                </label>
                <InputText
                  id="supervisor_email"
                  v-model="formData.supervisor_email"
                  :class="{ 'p-invalid': errors.supervisor_email }"
                  placeholder="請輸入電子郵件"
                  type="email"
                  class="w-full"
                />
                <small v-if="errors.supervisor_email" class="text-red-500 text-xs mt-1">{{
                  errors.supervisor_email
                }}</small>
              </div>
            </div>
          </div>

          <!-- 提交按鈕 -->
          <div class="text-center mt-8 pt-8 border-t border-gray-200">
            <Button
              type="submit"
              label="提交申請"
              icon="pi pi-check"
              class="p-button-lg mr-2 mb-2 md:mb-0"
              :loading="isSubmitting"
            />
            <Button
              type="button"
              label="重置"
              icon="pi pi-refresh"
              class="p-button-secondary p-button-lg"
              @click="resetForm"
            />
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>
