<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import { reactive, ref } from 'vue'

import { createApplication } from '@/services/application'
import { ApplicationStatus } from '@/types/application'
import Button from 'primevue/button'
import Calendar from 'primevue/calendar'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'

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

  applicant_unit: string
  domain_name: string
  application_project: string
  dns_manage_account: string
  reason: string
}

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

  applicant_unit?: string
  domain_name?: string
  application_project?: string
  dns_manage_account?: string
  reason?: string
}

interface ValidationField {
  key: keyof ApplicationFormData
  label: string
}

const toast = useToast()

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

  applicant_unit: '',
  domain_name: '',
  application_project: '',
  dns_manage_account: '',
  reason: '',
})

const errors = reactive<FormErrors>({})

const isSubmitting = ref<boolean>(false)

const validateForm = (): boolean => {
  Object.keys(errors).forEach((key) => delete errors[key as keyof FormErrors])

  let isValid = true

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
    { key: 'applicant_unit', label: '申請人單位' },
    { key: 'domain_name', label: '網域名稱' },
    { key: 'application_project', label: '申請專案' },
    { key: 'dns_manage_account', label: 'DNS管理帳號' },
    { key: 'reason', label: '申請原因' },
  ]

  requiredFields.forEach((field: ValidationField) => {
    const value = formData[field.key]
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      errors[field.key] = `${field.label}為必填欄位`
      isValid = false
    }
  })

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

  const phoneRegex = /^[0-9\-\+\(\)\s]+$/
  const phoneFields: (keyof ApplicationFormData)[] = ['applicant_phone', 'tech_contact_phone']

  phoneFields.forEach((field: keyof ApplicationFormData) => {
    const phone = formData[field] as string
    if (phone && !phoneRegex.test(phone)) {
      errors[field] = '請輸入正確的電話號碼格式'
      isValid = false
    }
  })

  const domainRegex =
    /^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*$/
  if (formData.domain_name && !domainRegex.test(formData.domain_name)) {
    errors.domain_name = '請輸入正確的網域名稱格式'
    isValid = false
  }

  return isValid
}

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
    const applicationForm = {
      department: formData.department,
      applicant_account: formData.applicant_account,
      applicant_name: formData.applicant_name,
      applicant_phone: formData.applicant_phone,
      applicant_email: formData.applicant_email,
      tech_contact_name: formData.tech_contact_name,
      tech_contact_phone: formData.tech_contact_phone,
      tech_contact_email: formData.tech_contact_email,
      supervisor_name: formData.supervisor_name,
      supervisor_id: formData.supervisor_id,
      supervisor_email: formData.supervisor_email,
      apply_date: formData.apply_date?.toISOString() || new Date().toISOString(),
      status: ApplicationStatus.pending,
    }
    const dnsForm = {
      applicant_unit: formData.applicant_unit,
      domain_name: formData.domain_name,
      application_project: formData.application_project,
      dns_manage_account: formData.dns_manage_account,
      reason: formData.reason,
    }
    await createApplication(applicationForm, dnsForm)

    console.log('提交的表單資料:', formData)

    toast.add({
      severity: 'success',
      summary: '申請成功',
      detail: '您已成功申請，請等待審核結果',
      life: 3000,
    })

    await new Promise(() =>
      setTimeout(() => {
        window.location.href = '/applications'
      }, 1000),
    )
  } catch (error) {
    console.error('申請失敗:', error)
    toast.add({
      severity: 'error',
      summary: '申請失敗',
      detail: '申請失敗，請稍後再試',
      life: 3000,
    })
  } finally {
    isSubmitting.value = false
  }
}

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
                <label for="applicant_unit" class="font-medium text-gray-700 mb-2 text-sm">
                  申請人單位 <span class="text-red-500">*</span>
                </label>
                <InputText
                  id="applicant_unit"
                  v-model="formData.applicant_unit"
                  :class="{ 'p-invalid': errors.applicant_unit }"
                  placeholder="請輸入申請人單位"
                  class="w-full"
                />
                <small v-if="errors.applicant_unit" class="text-red-500 text-xs mt-1">{{
                  errors.applicant_unit
                }}</small>
              </div>

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
            </div>

            <div class="grid grid-cols-1 gap-4 mb-4">
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

          <!-- 申請項目資訊 -->
          <div class="form-section">
            <div
              class="flex items-center gap-2 text-gray-700 text-lg font-semibold mb-4 pb-2 border-b-2 border-gray-200"
            >
              <i class="pi pi-folder"></i>
              申請項目資訊
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div class="flex flex-col">
                <label for="domain_name" class="font-medium text-gray-700 mb-2 text-sm">
                  網域名稱 <span class="text-red-500">*</span>
                </label>
                <InputText
                  id="domain_name"
                  v-model="formData.domain_name"
                  :class="{ 'p-invalid': errors.domain_name }"
                  placeholder="例如：example.com"
                  class="w-full"
                />
                <small v-if="errors.domain_name" class="text-red-500 text-xs mt-1">{{
                  errors.domain_name
                }}</small>
              </div>

              <div class="flex flex-col">
                <label for="dns_manage_account" class="font-medium text-gray-700 mb-2 text-sm">
                  DNS管理帳號 <span class="text-red-500">*</span>
                </label>
                <InputText
                  id="dns_manage_account"
                  v-model="formData.dns_manage_account"
                  :class="{ 'p-invalid': errors.dns_manage_account }"
                  placeholder="請輸入DNS管理帳號"
                  class="w-full"
                />
                <small v-if="errors.dns_manage_account" class="text-red-500 text-xs mt-1">{{
                  errors.dns_manage_account
                }}</small>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4 mb-4">
              <div class="flex flex-col">
                <label for="application_project" class="font-medium text-gray-700 mb-2 text-sm">
                  申請專案 <span class="text-red-500">*</span>
                </label>
                <InputText
                  id="application_project"
                  v-model="formData.application_project"
                  :class="{ 'p-invalid': errors.application_project }"
                  placeholder="請輸入申請專案名稱"
                  class="w-full"
                />
                <small v-if="errors.application_project" class="text-red-500 text-xs mt-1">{{
                  errors.application_project
                }}</small>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4 mb-4">
              <div class="flex flex-col">
                <label for="reason" class="font-medium text-gray-700 mb-2 text-sm">
                  申請原因 <span class="text-red-500">*</span>
                </label>
                <Textarea
                  id="reason"
                  v-model="formData.reason"
                  :class="{ 'p-invalid': errors.reason }"
                  placeholder="請詳細說明申請原因..."
                  rows="4"
                  class="w-full"
                />
                <small v-if="errors.reason" class="text-red-500 text-xs mt-1">{{
                  errors.reason
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

  <Toast />
</template>
