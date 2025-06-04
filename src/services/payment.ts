import type { Payment, PaymentDto } from '@/types/payment'
import * as api from './api/payment'

export const createPayment = async (payment: PaymentDto) => {
  const response = await api.createPayment({ ...payment })
  return response.data
}

export const getAllPayments = async (): Promise<Payment[]> => {
  const response = await api.getAllPayments()

  const data: Payment[] = response.data.payments.map((payment: PaymentDto) => ({
    id: payment.payment_id,
    serviceId: payment.service_id,
    serviceName: payment.service_name,
    amount: payment.amount,
    userId: payment.user_id,
    email: payment.email,
    applicationReason: payment.application_reason,
    status: payment.status,
  }))

  return data || []
}

export const getUserPayments = async (userId: string): Promise<Payment[]> => {
  const response = await api.getUserPayments(userId)

  const data: Payment[] = response.data.payments.map((payment: PaymentDto) => ({
    id: payment.payment_id,
    serviceId: payment.service_id,
    serviceName: payment.service_name,
    amount: payment.amount,
    userId: payment.user_id,
    email: payment.email,
    applicationReason: payment.application_reason,
    status: payment.status,
  }))

  return data || []
}

export const getPaymentById = async (id: string) => {
  const response = await api.getPaymentById(id)
  return response.data
}

export const updatePayment = async (id: string, status: string) => {
  const response = await api.updatePayment(id, { status })
  return response.data
}

export const deletePayment = async (id: string) => {
  const response = await api.deletePayment(id)
  return response.data
}
