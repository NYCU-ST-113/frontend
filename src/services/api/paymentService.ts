import type { PaymentServiceCreateDto, PaymentServiceUpdateDto } from '@/types/paymentService'
import http from './http'

const prefix = '/payments/services'

export const createPaymentService = async (data: PaymentServiceCreateDto) => {
  return await http.post(`/${prefix}`, data)
}

export const getAllPaymentServices = async () => {
  return await http.get(`/${prefix}`)
}

export const getPaymentServiceById = async (id: string) => {
  return await http.get(`/${prefix}/${id}`)
}

export const updatePaymentService = async (id: string, data: PaymentServiceUpdateDto) => {
  return await http.put(`/${prefix}/${id}`, data)
}

export const deletePaymentService = async (id: string) => {
  return await http.delete(`/${prefix}/${id}`)
}
