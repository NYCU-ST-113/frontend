<script setup lang="ts">
import AdminPaymentTable from '@/components/AdminPaymentTable.vue'
import { getAllApplications } from '@/services/application'
import { getAllPayments } from '@/services/payment'
import type { Payment } from '@/types/payment'
import { onMounted, ref, type Ref } from 'vue'

const data: Ref<any[]> = ref([])
const isLoading: Ref<boolean> = ref(false)

const fetchData = async () => {
  isLoading.value = true
  try {
    const applications = await getAllApplications()
    const payments = await getAllPayments()

    let index = 1
    data.value = payments.reduce((acc: any[], payment: Payment) => {
      const application = applications.find((app) => app.id === payment.id)

      if (!application) {
        return acc
      }

      acc.push({
        index: index++,
        id: application.id,
        type: application.type,

        department: application.base.department,
        applicantAccount: application.base.applicant_account,
        applicantName: application.base.applicant_name,
        applicantPhone: application.base.applicant_phone,
        applicantEmail: application.base.applicant_email,
        techContactName: application.base.tech_contact_name,
        techContactPhone: application.base.tech_contact_phone,
        techContactEmail: application.base.tech_contact_email,
        supervisorName: application.base.supervisor_name,
        supervisorId: application.base.supervisor_id,
        supervisorEmail: application.base.supervisor_email,
        applyDate: application.base.apply_date,
        status: application.base.status,

        applicantUnit: application.extra.applicant_unit,
        domainName: application.extra.domain_name,
        appProject: application.extra.application_project,
        dnsManageAccount: application.extra.dns_manage_account,
        reason: application.extra.reason,

        paymentId: payment.id,
        paymentServiceId: payment.serviceId,
        paymentServiceName: payment.serviceName,
        paymentAmount: payment.amount,
        paymentUserId: payment.userId,
        paymentEmail: payment.email,
        paymentApplicationReason: payment.applicationReason,
        paymentStatus: payment.status,
        paymentCreatedAt: payment.createdAt || new Date().toISOString().substring(0, 10),
      })

      return acc
    }, [])

    console.log('AdminPaymentsPage data:', data.value)
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
    <AdminPaymentTable :is-loading="isLoading" :data="data" />
  </div>
</template>
