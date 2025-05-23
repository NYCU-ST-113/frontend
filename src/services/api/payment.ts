import type { PaymentCreateRequest, PaymentUpdateRequest } from '@/types/payment'
import http from './http'

const prefix = 'payments'

export const createPayment = async (data: PaymentCreateRequest) => {
  return await http.post(`/${prefix}/create`, data)
}

export const getPaymentById = async (id: string) => {
  return await http.get(`/${prefix}/${id}/info`)
}

export const updatePayment = async (id: string, data: PaymentUpdateRequest) => {
  return await http.put(`/${prefix}/${id}`, data)
}

export const deletePayment = async (id: string) => {
  return await http.delete(`/${prefix}/${id}`)
}
