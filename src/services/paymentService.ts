import type { PaymentService } from '@/types/paymentService'
import * as api from './api/paymentService'

export const createPaymentService = async (paymentService: PaymentService) => {
  const response = await api.createPaymentService(paymentService)
  return response.data
}

export const getPaymentServiceById = async (id: string) => {
  const response = await api.getPaymentServiceById(id)
  return response.data
}

export const updatePaymentService = async (id: string, paymentService: PaymentService) => {
  const response = await api.updatePaymentService(id, paymentService)
  return response.data
}

export const deletePaymentService = async (id: string) => {
  const response = await api.deletePaymentService(id)
  return response.data
}
