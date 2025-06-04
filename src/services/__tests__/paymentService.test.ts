import type { PaymentService } from '@/types/paymentService'
import type { AxiosResponse } from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as api from '../api/paymentService'
import * as paymentService from '../paymentService'

vi.mock('../api/paymentService')

describe('Payment Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mockPaymentService: PaymentService = {
    id: '1',
    name: 'Test Service',
    description: 'Test Description',
    base_price: 100
  }

  const mockResponse: AxiosResponse = {
    data: mockPaymentService,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as any
  }

  describe('createPaymentService', () => {
    it('should create payment service successfully', async () => {
      vi.mocked(api.createPaymentService).mockResolvedValue(mockResponse)

      const result = await paymentService.createPaymentService(mockPaymentService)

      expect(api.createPaymentService).toHaveBeenCalledWith(mockPaymentService)
      expect(result).toEqual(mockPaymentService)
    })

    it('should handle API errors', async () => {
      const error = new Error('API Error')
      vi.mocked(api.createPaymentService).mockRejectedValue(error)

      await expect(paymentService.createPaymentService(mockPaymentService)).rejects.toThrow('API Error')
    })
  })

  describe('getPaymentServiceById', () => {
    it('should get payment service by id successfully', async () => {
      vi.mocked(api.getPaymentServiceById).mockResolvedValue(mockResponse)

      const result = await paymentService.getPaymentServiceById('1')

      expect(api.getPaymentServiceById).toHaveBeenCalledWith('1')
      expect(result).toEqual(mockPaymentService)
    })

    it('should handle API errors', async () => {
      const error = new Error('API Error')
      vi.mocked(api.getPaymentServiceById).mockRejectedValue(error)

      await expect(paymentService.getPaymentServiceById('1')).rejects.toThrow('API Error')
    })
  })

  describe('updatePaymentService', () => {
    it('should update payment service successfully', async () => {
      vi.mocked(api.updatePaymentService).mockResolvedValue(mockResponse)

      const result = await paymentService.updatePaymentService('1', mockPaymentService)

      expect(api.updatePaymentService).toHaveBeenCalledWith('1', mockPaymentService)
      expect(result).toEqual(mockPaymentService)
    })

    it('should handle API errors', async () => {
      const error = new Error('API Error')
      vi.mocked(api.updatePaymentService).mockRejectedValue(error)

      await expect(paymentService.updatePaymentService('1', mockPaymentService)).rejects.toThrow('API Error')
    })
  })

  describe('deletePaymentService', () => {
    it('should delete payment service successfully', async () => {
      vi.mocked(api.deletePaymentService).mockResolvedValue(mockResponse)

      const result = await paymentService.deletePaymentService('1')

      expect(api.deletePaymentService).toHaveBeenCalledWith('1')
      expect(result).toEqual(mockPaymentService)
    })

    it('should handle API errors', async () => {
      const error = new Error('API Error')
      vi.mocked(api.deletePaymentService).mockRejectedValue(error)

      await expect(paymentService.deletePaymentService('1')).rejects.toThrow('API Error')
    })
  })
})