<script setup lang="ts">
import PaymentTable from '@/components/PaymentTable.vue'
import { getUserPayments } from '@/services//payment'
import { getUserApplications } from '@/services/application'
import { useAuthStore } from '@/stores/auth'
import { ApplicationStatus, type Application } from '@/types/application'
import type { Payment } from '@/types/payment'
import { storeToRefs } from 'pinia'
import { onMounted, ref, type Ref } from 'vue'

const authStore = useAuthStore()
const { username } = storeToRefs(authStore)
const isLoading: Ref<boolean> = ref(false)
const data: Ref<any[]> = ref([])

const fetchData = async () => {
  isLoading.value = true

  try {
    const applications = await getUserApplications(username.value)
    const payments = await getUserPayments(username.value)

    console.log('Fetched payments:', payments)

    let counter = 1
    data.value = applications.reduce((acc: any[], app: Application) => {
      if (app.base.status !== ApplicationStatus.approved) {
        return acc
      }

      const payment = payments.find((p: Payment) => p.id === app.id)
      acc.push({
        index: counter++,
        id: app.id,
        type: app.type,

        department: app.base.department,
        applicantAccount: app.base.applicant_account,
        applicantName: app.base.applicant_name,
        applicantPhone: app.base.applicant_phone,
        applicantEmail: app.base.applicant_email,
        techContactName: app.base.tech_contact_name,
        techContactPhone: app.base.tech_contact_phone,
        techContactEmail: app.base.tech_contact_email,
        supervisorName: app.base.supervisor_name,
        supervisorId: app.base.supervisor_id,
        supervisorEmail: app.base.supervisor_email,
        applyDate: app.base.apply_date,
        status: app.base.status,

        applicantUnit: app.extra.applicant_unit,
        domainName: app.extra.domain_name,
        appProject: app.extra.application_project,
        dnsManageAccount: app.extra.dns_manage_account,
        reason: app.extra.reason,

        paymentId: payment ? payment.id : '',
        paymentServiceId: payment ? payment.serviceId : '',
        paymentServiceName: payment ? payment.serviceName : '',
        paymentAmount: payment ? payment.amount : 1000,
        paymentUserId: payment ? payment.userId : '',
        paymentEmail: payment ? payment.email : '',
        paymentApplicationReason: payment ? payment.applicationReason : '',
        paymentStatus: payment ? payment.status : '',
        paymentCreatedAt: payment ? payment.createdAt : '',
      })

      return acc
    }, [])

    console.log('Fetched data:', data.value)
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await fetchData()
})
</script>

<template>
  <div class="flex flex-col px-8 py-4">
    <PaymentTable :is-loading="isLoading" :data="data" @refresh="fetchData" />
  </div>
</template>
