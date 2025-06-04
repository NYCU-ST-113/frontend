import type { Payment, PaymentDto } from '@/types/payment'
import type { AxiosResponse } from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as api from '../api/payment'
import { createPayment, deletePayment, getAllPayments, getPaymentById, getUserPayments, updatePayment } from '../payment'

// Mock the API module
vi.mock('../api/payment')

describe('Payment Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mockAxiosResponse = <T>(data: T): AxiosResponse<T> => ({
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as any
  })

  const mockPaymentDto: PaymentDto = {
    payment_id: '1',
    service_id: '123',
    service_name: 'Test Service',
    amount: 100,
    user_id: 'user123',
    email: 'test@example.com',
    application_reason: 'Test reason',
    status: 'pending',
    created_at: '2024-03-19T12:00:00Z'
  }

  const expectedPayment: Payment = {
    id: mockPaymentDto.payment_id,
    serviceId: mockPaymentDto.service_id,
    serviceName: mockPaymentDto.service_name,
    amount: mockPaymentDto.amount,
    userId: mockPaymentDto.user_id,
    email: mockPaymentDto.email,
    applicationReason: mockPaymentDto.application_reason,
    status: mockPaymentDto.status,
    createdAt: mockPaymentDto.created_at
  }

  describe('createPayment', () => {
    it('should create a payment successfully', async () => {
      vi.mocked(api.createPayment).mockResolvedValue(mockAxiosResponse(expectedPayment))

      const result = await createPayment(mockPaymentDto)

      expect(api.createPayment).toHaveBeenCalledWith(mockPaymentDto)
      expect(result).toEqual(expectedPayment)
    })

    it('should handle API errors', async () => {
      const error = new Error('API Error')
      vi.mocked(api.createPayment).mockRejectedValue(error)

      await expect(createPayment(mockPaymentDto)).rejects.toThrow('API Error')
    })
  })

  describe('getAllPayments', () => {
    it('should return all payments', async () => {
      vi.mocked(api.getAllPayments).mockResolvedValue(
        mockAxiosResponse({
          payments: [mockPaymentDto]
        })
      )

      const result = await getAllPayments()

      expect(api.getAllPayments).toHaveBeenCalled()
      expect(result).toEqual([expectedPayment])
    })

    it('should return empty array when no payments exist', async () => {
      vi.mocked(api.getAllPayments).mockResolvedValue(
        mockAxiosResponse({
          payments: []
        })
      )

      const result = await getAllPayments()

      expect(result).toEqual([])
    })
  })

  describe('getUserPayments', () => {
    const userId = 'user123'

    it('should return payments for a specific user', async () => {
      vi.mocked(api.getUserPayments).mockResolvedValue(
        mockAxiosResponse({
          payments: [mockPaymentDto]
        })
      )

      const result = await getUserPayments(userId)

      expect(api.getUserPayments).toHaveBeenCalledWith(userId)
      expect(result).toEqual([expectedPayment])
    })

    it('should return empty array when user has no payments', async () => {
      vi.mocked(api.getUserPayments).mockResolvedValue(
        mockAxiosResponse({
          payments: []
        })
      )

      const result = await getUserPayments(userId)

      expect(result).toEqual([])
    })
  })

  describe('getPaymentById', () => {
    const paymentId = '1'

    it('should return payment by id', async () => {
      const mockResponse = { payment: mockPaymentDto }
      vi.mocked(api.getPaymentById).mockResolvedValue(mockAxiosResponse(mockResponse))

      const result = await getPaymentById(paymentId)

      expect(api.getPaymentById).toHaveBeenCalledWith(paymentId)
      expect(result).toEqual(mockResponse)
    })

    it('should handle API errors', async () => {
      const error = new Error('API Error')
      vi.mocked(api.getPaymentById).mockRejectedValue(error)

      await expect(getPaymentById(paymentId)).rejects.toThrow('API Error')
    })
  })

  describe('updatePayment', () => {
    const paymentId = '1'
    const newStatus = 'approved'

    it('should update payment status', async () => {
      const mockResponse = { success: true, message: 'Payment updated successfully' }
      vi.mocked(api.updatePayment).mockResolvedValue(mockAxiosResponse(mockResponse))

      const result = await updatePayment(paymentId, newStatus)

      expect(api.updatePayment).toHaveBeenCalledWith(paymentId, { status: newStatus })
      expect(result).toEqual(mockResponse)
    })

    it('should handle API errors', async () => {
      const error = new Error('API Error')
      vi.mocked(api.updatePayment).mockRejectedValue(error)

      await expect(updatePayment(paymentId, newStatus)).rejects.toThrow('API Error')
    })
  })

  describe('deletePayment', () => {
    const paymentId = '1'

    it('should delete payment', async () => {
      const mockResponse = { success: true, message: 'Payment deleted successfully' }
      vi.mocked(api.deletePayment).mockResolvedValue(mockAxiosResponse(mockResponse))

      const result = await deletePayment(paymentId)

      expect(api.deletePayment).toHaveBeenCalledWith(paymentId)
      expect(result).toEqual(mockResponse)
    })

    it('should handle API errors', async () => {
      const error = new Error('API Error')
      vi.mocked(api.deletePayment).mockRejectedValue(error)

      await expect(deletePayment(paymentId)).rejects.toThrow('API Error')
    })
  })
})