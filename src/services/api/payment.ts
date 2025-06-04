import type { PaymentDto } from '@/types/payment'
import http from './http'

const prefix = 'payments/payments'

export const createPayment = async (data: PaymentDto) => {
  return await http.post(`/${prefix}/apply`, data)
}

export const getAllPayments = async () => {
  return await http.get(`/${prefix}`)
}

export const getPaymentById = async (id: string) => {
  return await http.get(`/${prefix}/${id}/info`)
}

export const getUserPayments = async (userId: string) => {
  return await http.get(`/${prefix}/user/${userId}`)
}

export const updatePayment = async (id: string, data: { status: string }) => {
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
