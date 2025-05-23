import type { Payment } from '@/types/payment'
import * as api from './api/payment'

export const createPayment = async (payment: Payment) => {
  const response = await api.createPayment(payment)
  return response.data
}

export const getPaymentById = async (id: string) => {
  const response = await api.getPaymentById(id)
  return response.data
}

export const updatePayment = async (id: string, payment: Payment) => {
  const response = await api.updatePayment(id, payment)
  return response.data
}

export const deletePayment = async (id: string) => {
  const response = await api.deletePayment(id)
  return response.data
}
