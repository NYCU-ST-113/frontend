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

export const approvePayment = async (id: string) => {
  return await http.post(`/${prefix}/${id}/process`)
}

export const rejectPayment = async (id: string) => {
  return await http.post(`/${prefix}/${id}/fail`)
}

export const deletePayment = async (id: string) => {
  return await http.delete(`/${prefix}/${id}`)
}

export const downloadPayment = async (id: string) => {
  return await http.get(`/${prefix}/${id}/download`, {
    responseType: 'blob',
  })
}

export const exportPayments = async () => {
  return await http.get(`/${prefix}/export/payments`, {
    responseType: 'blob',
  })
}
