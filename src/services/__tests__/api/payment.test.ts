import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { PaymentDto } from '../../../types/payment'
import http from '../../api/http'
import * as paymentApi from '../../api/payment'

vi.mock('../../api/http')

describe('Payment API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
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

  const mockResponse = {
    data: { success: true, message: 'Operation successful' }
  }

  describe('createPayment', () => {
    it('should create payment successfully', async () => {
      vi.mocked(http.post).mockResolvedValue(mockResponse)

      const result = await paymentApi.createPayment(mockPaymentDto)

      expect(http.post).toHaveBeenCalledWith('/payments/payments/apply', mockPaymentDto)
      expect(result).toEqual(mockResponse)
    })

    it('should handle API errors', async () => {
      const error = new Error('API Error')
      vi.mocked(http.post).mockRejectedValue(error)

      await expect(paymentApi.createPayment(mockPaymentDto)).rejects.toThrow('API Error')
    })
  })

  describe('getAllPayments', () => {
    it('should get all payments successfully', async () => {
      vi.mocked(http.get).mockResolvedValue(mockResponse)

      const result = await paymentApi.getAllPayments()

      expect(http.get).toHaveBeenCalledWith('/payments/payments')
      expect(result).toEqual(mockResponse)
    })

    it('should handle API errors', async () => {
      const error = new Error('API Error')
      vi.mocked(http.get).mockRejectedValue(error)

      await expect(paymentApi.getAllPayments()).rejects.toThrow('API Error')
    })
  })

  describe('getPaymentById', () => {
    it('should get payment by id successfully', async () => {
      vi.mocked(http.get).mockResolvedValue(mockResponse)

      const result = await paymentApi.getPaymentById('1')

      expect(http.get).toHaveBeenCalledWith('/payments/payments/1/info')
      expect(result).toEqual(mockResponse)
    })

    it('should handle API errors', async () => {
      const error = new Error('API Error')
      vi.mocked(http.get).mockRejectedValue(error)

      await expect(paymentApi.getPaymentById('1')).rejects.toThrow('API Error')
    })
  })

  describe('getUserPayments', () => {
    it('should get user payments successfully', async () => {
      vi.mocked(http.get).mockResolvedValue(mockResponse)

      const result = await paymentApi.getUserPayments('user123')

      expect(http.get).toHaveBeenCalledWith('/payments/payments/user/user123')
      expect(result).toEqual(mockResponse)
    })

    it('should handle API errors', async () => {
      const error = new Error('API Error')
      vi.mocked(http.get).mockRejectedValue(error)

      await expect(paymentApi.getUserPayments('user123')).rejects.toThrow('API Error')
    })
  })

  describe('updatePayment', () => {
    it('should update payment successfully', async () => {
      vi.mocked(http.put).mockResolvedValue(mockResponse)

      const result = await paymentApi.updatePayment('1', { status: 'approved' })

      expect(http.put).toHaveBeenCalledWith('/payments/payments/1', { status: 'approved' })
      expect(result).toEqual(mockResponse)
    })

    it('should handle API errors', async () => {
      const error = new Error('API Error')
      vi.mocked(http.put).mockRejectedValue(error)

      await expect(paymentApi.updatePayment('1', { status: 'approved' })).rejects.toThrow('API Error')
    })
  })

  describe('approvePayment', () => {
    it('should approve payment successfully', async () => {
      vi.mocked(http.post).mockResolvedValue(mockResponse)

      const result = await paymentApi.approvePayment('1')

      expect(http.post).toHaveBeenCalledWith('/payments/payments/1/process')
      expect(result).toEqual(mockResponse)
    })

    it('should handle API errors', async () => {
      const error = new Error('API Error')
      vi.mocked(http.post).mockRejectedValue(error)

      await expect(paymentApi.approvePayment('1')).rejects.toThrow('API Error')
    })
  })

  describe('rejectPayment', () => {
    it('should reject payment successfully', async () => {
      vi.mocked(http.post).mockResolvedValue(mockResponse)

      const result = await paymentApi.rejectPayment('1')

      expect(http.post).toHaveBeenCalledWith('/payments/payments/1/fail')
      expect(result).toEqual(mockResponse)
    })

    it('should handle API errors', async () => {
      const error = new Error('API Error')
      vi.mocked(http.post).mockRejectedValue(error)

      await expect(paymentApi.rejectPayment('1')).rejects.toThrow('API Error')
    })
  })

  describe('deletePayment', () => {
    it('should delete payment successfully', async () => {
      vi.mocked(http.delete).mockResolvedValue(mockResponse)

      const result = await paymentApi.deletePayment('1')

      expect(http.delete).toHaveBeenCalledWith('/payments/payments/1')
      expect(result).toEqual(mockResponse)
    })

    it('should handle API errors', async () => {
      const error = new Error('API Error')
      vi.mocked(http.delete).mockRejectedValue(error)

      await expect(paymentApi.deletePayment('1')).rejects.toThrow('API Error')
    })
  })

  describe('downloadPayment', () => {
    it('should download payment successfully', async () => {
      const mockBlob = new Blob(['test'], { type: 'application/pdf' })
      vi.mocked(http.get).mockResolvedValue({ ...mockResponse, data: mockBlob })

      const result = await paymentApi.downloadPayment('1')

      expect(http.get).toHaveBeenCalledWith('/payments/payments/1/download', { responseType: 'blob' })
      expect(result).toEqual({ ...mockResponse, data: mockBlob })
    })

    it('should handle API errors', async () => {
      const error = new Error('API Error')
      vi.mocked(http.get).mockRejectedValue(error)

      await expect(paymentApi.downloadPayment('1')).rejects.toThrow('API Error')
    })
  })

  describe('exportPayments', () => {
    it('should export payments successfully', async () => {
      const mockBlob = new Blob(['test'], { type: 'application/csv' })
      vi.mocked(http.get).mockResolvedValue({ ...mockResponse, data: mockBlob })

      const result = await paymentApi.exportPayments()

      expect(http.get).toHaveBeenCalledWith('/payments/payments/export/payments', { responseType: 'blob' })
      expect(result).toEqual({ ...mockResponse, data: mockBlob })
    })

    it('should handle API errors', async () => {
      const error = new Error('API Error')
      vi.mocked(http.get).mockRejectedValue(error)

      await expect(paymentApi.exportPayments()).rejects.toThrow('API Error')
    })
  })
})