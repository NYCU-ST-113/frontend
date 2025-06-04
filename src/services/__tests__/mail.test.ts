import type { TemplateMailRequest } from '@/types/mail'
import type { AxiosResponse } from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as api from '../api/mail'
import { sendMail, sendTemplateMail } from '../mail'

// Mock the API module
vi.mock('../api/mail')

describe('Mail Service', () => {
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

  const mockMailRequest: TemplateMailRequest = {
    template_id: 'test-template',
    to: ['test@example.com'],
    template_data: {
      name: 'Test User',
      message: 'Hello World'
    },
    subject: 'Test Subject',
    source_service: 'test-service'
  }

  describe('sendMail', () => {
    it('should send email successfully', async () => {
      const mockResponse = { success: true, message: 'Email sent successfully' }
      vi.mocked(api.sendMail).mockResolvedValue(mockAxiosResponse(mockResponse))

      const result = await sendMail(mockMailRequest)

      expect(api.sendMail).toHaveBeenCalledWith(mockMailRequest)
      expect(result).toEqual(mockResponse)
    })

    it('should handle API errors', async () => {
      const error = new Error('API Error')
      vi.mocked(api.sendMail).mockRejectedValue(error)

      await expect(sendMail(mockMailRequest)).rejects.toThrow('API Error')
    })
  })

  describe('sendTemplateMail', () => {
    it('should send template email successfully', async () => {
      const mockResponse = { success: true, message: 'Template email sent successfully' }
      vi.mocked(api.sendTemplateMail).mockResolvedValue(mockAxiosResponse(mockResponse))

      const result = await sendTemplateMail(mockMailRequest)

      expect(api.sendTemplateMail).toHaveBeenCalledWith(mockMailRequest)
      expect(result).toEqual(mockResponse)
    })

    it('should handle API errors for template mail', async () => {
      const error = new Error('Template Mail API Error')
      vi.mocked(api.sendTemplateMail).mockRejectedValue(error)

      await expect(sendTemplateMail(mockMailRequest)).rejects.toThrow('Template Mail API Error')
    })
  })
})