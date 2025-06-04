import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { PaymentServiceCreateDto, PaymentServiceUpdateDto } from '../../../types/paymentService'
import http from '../../api/http'
import * as paymentServiceApi from '../../api/paymentService'

vi.mock('../../api/http')

describe('Payment Service API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mockPaymentServiceDto: PaymentServiceCreateDto = {
    name: 'Test Service',
    description: 'Test Description',
    base_price: 100
  }

  const mockResponse = {
    data: { success: true, message: 'Operation successful' }
  }

  describe('createPaymentService', () => {
    it('should create payment service successfully', async () => {
      vi.mocked(http.post).mockResolvedValue(mockResponse)

      const result = await paymentServiceApi.createPaymentService(mockPaymentServiceDto)

      expect(http.post).toHaveBeenCalledWith('payments/services', mockPaymentServiceDto)
      expect(result).toEqual(mockResponse)
    })

    it('should handle API errors', async () => {
      const error = new Error('API Error')
      vi.mocked(http.post).mockRejectedValue(error)

      await expect(paymentServiceApi.createPaymentService(mockPaymentServiceDto)).rejects.toThrow('API Error')
    })
  })

  describe('getAllPaymentServices', () => {
    it('should get all payment services successfully', async () => {
      vi.mocked(http.get).mockResolvedValue(mockResponse)

      const result = await paymentServiceApi.getAllPaymentServices()

      expect(http.get).toHaveBeenCalledWith('payments/services')
      expect(result).toEqual(mockResponse)
    })

    it('should handle API errors', async () => {
      const error = new Error('API Error')
      vi.mocked(http.get).mockRejectedValue(error)

      await expect(paymentServiceApi.getAllPaymentServices()).rejects.toThrow('API Error')
    })
  })

  describe('getPaymentServiceById', () => {
    it('should get payment service by id successfully', async () => {
      vi.mocked(http.get).mockResolvedValue(mockResponse)

      const result = await paymentServiceApi.getPaymentServiceById('1')

      expect(http.get).toHaveBeenCalledWith('payments/services/1')
      expect(result).toEqual(mockResponse)
    })

    it('should handle API errors', async () => {
      const error = new Error('API Error')
      vi.mocked(http.get).mockRejectedValue(error)

      await expect(paymentServiceApi.getPaymentServiceById('1')).rejects.toThrow('API Error')
    })
  })

  describe('updatePaymentService', () => {
    const updateDto: PaymentServiceUpdateDto = mockPaymentServiceDto

    it('should update payment service successfully', async () => {
      vi.mocked(http.put).mockResolvedValue(mockResponse)

      const result = await paymentServiceApi.updatePaymentService('1', updateDto)

      expect(http.put).toHaveBeenCalledWith('payments/services/1', updateDto)
      expect(result).toEqual(mockResponse)
    })

    it('should handle API errors', async () => {
      const error = new Error('API Error')
      vi.mocked(http.put).mockRejectedValue(error)

      await expect(paymentServiceApi.updatePaymentService('1', updateDto)).rejects.toThrow('API Error')
    })
  })

  describe('deletePaymentService', () => {
    it('should delete payment service successfully', async () => {
      vi.mocked(http.delete).mockResolvedValue(mockResponse)

      const result = await paymentServiceApi.deletePaymentService('1')

      expect(http.delete).toHaveBeenCalledWith('payments/services/1')
      expect(result).toEqual(mockResponse)
    })

    it('should handle API errors', async () => {
      const error = new Error('API Error')
      vi.mocked(http.delete).mockRejectedValue(error)

      await expect(paymentServiceApi.deletePaymentService('1')).rejects.toThrow('API Error')
    })
  })
})