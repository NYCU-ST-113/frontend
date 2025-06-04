<script setup lang="ts">
import { Form } from '@primevue/forms'
import { useToast } from 'primevue/usetoast'
import { onMounted, reactive, ref } from 'vue'

// PrimeVue 組件
import Button from 'primevue/button'
import Card from 'primevue/card'
import Divider from 'primevue/divider'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import Toast from 'primevue/toast'

const toast = useToast()

const initialValues = reactive({
  username: '',
  name: '',
  phone: '',
  email: '',
  department: '',
  position: '',
  extensionNumber: '',
})

const isLoading = ref(false)
const formKey = ref(0)

const resolver = ({ values }: { values: any }) => {
  const errors: { [key: string]: any } = {}

  if (!values.username?.trim()) {
    errors.username = [{ message: '工號為必填欄位' }]
  } else if (values.username.length < 3) {
    errors.username = [{ message: '工號至少需要3個字元' }]
  }

  if (!values.name?.trim()) {
    errors.name = [{ message: '姓名為必填欄位' }]
  } else if (values.name.length < 2) {
    errors.name = [{ message: '姓名至少需要2個字元' }]
  }

  if (!values.phone?.trim()) {
    errors.phone = [{ message: '聯絡電話為必填欄位' }]
  } else if (!/^[0-9\-\+\(\)\s#ext]+$/.test(values.phone)) {
    errors.phone = [{ message: '請輸入正確的電話號碼格式' }]
  }

  if (!values.email?.trim()) {
    errors.email = [{ message: '電子郵件為必填欄位' }]
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = [{ message: '請輸入正確的電子郵件格式' }]
  }

  if (!values.department?.trim()) {
    errors.department = [{ message: '部門為必填欄位' }]
  }

  if (!values.position?.trim()) {
    errors.position = [{ message: '職位為必填欄位' }]
  }

  return {
    values,
    errors,
  }
}

const onFormSubmit = async ({ valid, values }: { valid: boolean; values: any }) => {
  console.log('Form submitted with values:', values)

  if (!valid) {
    toast.add({
      severity: 'warn',
      summary: '表單驗證失敗',
      detail: '請檢查並修正表單中的錯誤',
      life: 3000,
    })
    return
  }

  isLoading.value = true

  try {
    await new Promise((resolve) => setTimeout(resolve, 2000))

    Object.assign(initialValues, values)

    toast.add({
      severity: 'success',
      summary: '儲存成功',
      detail: '審核用資訊已成功更新',
      life: 3000,
    })
  } catch (error) {
    console.error('儲存失敗:', error)
    toast.add({
      severity: 'error',
      summary: '儲存失敗',
      detail: '系統發生錯誤，請稍後再試',
      life: 3000,
    })
  } finally {
    isLoading.value = false
  }
}

const resetForm = () => {
  Object.keys(initialValues).forEach((key) => {
    ;(initialValues as any)[key] = ''
  })

  formKey.value++

  toast.add({
    severity: 'info',
    summary: '表單已重置',
    detail: '所有欄位已清空',
    life: 2000,
  })
}

const loadExistingData = () => {
  Object.assign(initialValues, {
    username: 'REV001',
    name: '張三',
    phone: '03-5712121#1234',
    email: 'zhang@nycu.edu.tw',
    department: '教務處',
    position: '專員',
    extensionNumber: '1234',
  })

  formKey.value++

  // toast.add({
  //   severity: 'info',
  //   summary: '資料已載入',
  //   detail: '現有審核人員資料已載入表單',
  //   life: 2000,
  // })
}

onMounted(() => {
  loadExistingData()
})
</script>

<template>
  <div class="p-6 min-h-screen">
    <div class="max-w-4xl mx-auto">
      <!-- 頁面標題 -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">審核用資訊設定</h1>
        <p class="text-gray-600">設定和更新審核人員的基本資料，用於申請審核流程中的聯絡資訊</p>
      </div>

      <Card class="shadow-sm">
        <template #header>
          <div class="flex items-center justify-between p-6 pb-0">
            <div class="flex items-center gap-2">
              <i class="pi pi-user-edit text-blue-600 text-xl"></i>
              <h2 class="text-xl font-semibold text-gray-800">審核人員資料</h2>
            </div>
            <!--
            <Button
              label="載入現有資料"
              icon="pi pi-refresh"
              outlined
              size="small"
              @click="loadExistingData"
            />
            -->
          </div>
        </template>

        <template #content>
          <Form
            :key="formKey"
            v-slot="$form"
            :resolver
            :initial-values="initialValues"
            class="space-y-6"
            @submit="onFormSubmit"
          >
            <!-- 基本資訊區塊 -->
            <div>
              <div class="flex items-center gap-2 mb-4">
                <i class="pi pi-id-card text-gray-600"></i>
                <h3 class="text-lg font-medium text-gray-800">基本資訊</h3>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- 工號 -->
                <div class="flex flex-col gap-2">
                  <label class="text-sm font-medium text-gray-700">
                    工號 <span class="text-red-500">*</span>
                  </label>
                  <InputText
                    name="username"
                    placeholder="請輸入工號"
                    class="w-full"
                    :class="{ 'p-invalid': $form.username?.invalid }"
                  />
                  <Message
                    v-if="$form.username?.invalid"
                    severity="error"
                    size="small"
                    variant="simple"
                    class="mt-1"
                  >
                    {{ $form.username.error?.message }}
                  </Message>
                </div>

                <!-- 姓名 -->
                <div class="flex flex-col gap-2">
                  <label class="text-sm font-medium text-gray-700">
                    承辦人姓名 <span class="text-red-500">*</span>
                  </label>
                  <InputText
                    name="name"
                    placeholder="請輸入承辦人姓名"
                    class="w-full"
                    :class="{ 'p-invalid': $form.name?.invalid }"
                  />
                  <Message
                    v-if="$form.name?.invalid"
                    severity="error"
                    size="small"
                    variant="simple"
                    class="mt-1"
                  >
                    {{ $form.name.error?.message }}
                  </Message>
                </div>

                <!-- 部門 -->
                <div class="flex flex-col gap-2">
                  <label class="text-sm font-medium text-gray-700">
                    所屬部門 <span class="text-red-500">*</span>
                  </label>
                  <InputText
                    name="department"
                    placeholder="請輸入所屬部門"
                    class="w-full"
                    :class="{ 'p-invalid': $form.department?.invalid }"
                  />
                  <Message
                    v-if="$form.department?.invalid"
                    severity="error"
                    size="small"
                    variant="simple"
                    class="mt-1"
                  >
                    {{ $form.department.error?.message }}
                  </Message>
                </div>

                <!-- 職位 -->
                <div class="flex flex-col gap-2">
                  <label class="text-sm font-medium text-gray-700">
                    職位 <span class="text-red-500">*</span>
                  </label>
                  <InputText
                    name="position"
                    placeholder="請輸入職位"
                    class="w-full"
                    :class="{ 'p-invalid': $form.position?.invalid }"
                  />
                  <Message
                    v-if="$form.position?.invalid"
                    severity="error"
                    size="small"
                    variant="simple"
                    class="mt-1"
                  >
                    {{ $form.position.error?.message }}
                  </Message>
                </div>
              </div>
            </div>

            <Divider />

            <!-- 聯絡資訊區塊 -->
            <div>
              <div class="flex items-center gap-2 mb-4">
                <i class="pi pi-phone text-gray-600"></i>
                <h3 class="text-lg font-medium text-gray-800">聯絡資訊</h3>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- 聯絡電話 -->
                <div class="flex flex-col gap-2">
                  <label class="text-sm font-medium text-gray-700">
                    聯絡電話 <span class="text-red-500">*</span>
                  </label>
                  <InputText
                    name="phone"
                    placeholder="例：03-5712121#1234"
                    class="w-full"
                    :class="{ 'p-invalid': $form.phone?.invalid }"
                  />
                  <small class="text-gray-500">可包含分機號碼，格式：電話號碼#分機</small>
                  <Message
                    v-if="$form.phone?.invalid"
                    severity="error"
                    size="small"
                    variant="simple"
                    class="mt-1"
                  >
                    {{ $form.phone.error?.message }}
                  </Message>
                </div>

                <!-- 校內分機 -->
                <div class="flex flex-col gap-2">
                  <label class="text-sm font-medium text-gray-700">校內分機</label>
                  <InputText
                    name="extensionNumber"
                    placeholder="請輸入校內分機號碼"
                    class="w-full"
                  />
                  <small class="text-gray-500">選填，僅填寫分機號碼即可</small>
                </div>

                <!-- 電子郵件 -->
                <div class="flex flex-col gap-2 md:col-span-2">
                  <label class="text-sm font-medium text-gray-700">
                    電子郵件 <span class="text-red-500">*</span>
                  </label>
                  <InputText
                    name="email"
                    type="email"
                    placeholder="請輸入電子郵件地址"
                    class="w-full"
                    :class="{ 'p-invalid': $form.email?.invalid }"
                  />
                  <Message
                    v-if="$form.email?.invalid"
                    severity="error"
                    size="small"
                    variant="simple"
                    class="mt-1"
                  >
                    {{ $form.email.error?.message }}
                  </Message>
                </div>
              </div>
            </div>

            <!-- 提交按鈕區域 -->
            <div class="flex justify-end gap-3 pt-6 border-t border-gray-200">
              <Button
                type="button"
                label="重置表單"
                icon="pi pi-refresh"
                outlined
                severity="secondary"
                :disabled="isLoading"
                @click="resetForm"
              />
              <Button
                type="submit"
                label="儲存修改"
                icon="pi pi-check"
                severity="success"
                :loading="isLoading"
              />
            </div>
          </Form>
        </template>
      </Card>
    </div>

    <Toast />
  </div>
</template>
