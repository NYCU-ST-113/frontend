import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { TemplateMailRequest } from '../../../types/mail'
import http from '../../api/http'
import * as mailApi from '../../api/mail'

vi.mock('../../api/http')

describe('Mail API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mockResponse = {
    data: { success: true, message: 'Email sent successfully' }
  }

  describe('sendMail', () => {
    const mockMailData = {
      to: ['test@example.com'],
      subject: 'Test Subject',
      text: 'Test Content'
    }

    it('should send email successfully', async () => {
      vi.mocked(http.post).mockResolvedValue(mockResponse)

      const result = await mailApi.sendMail(mockMailData)

      expect(http.post).toHaveBeenCalledWith('mailer/send', mockMailData)
      expect(result).toEqual(mockResponse.data)
    })

    it('should handle API errors', async () => {
      const error = new Error('API Error')
      vi.mocked(http.post).mockRejectedValue(error)

      await expect(mailApi.sendMail(mockMailData)).rejects.toThrow('API Error')
    })
  })

  describe('sendTemplateMail', () => {
    const mockTemplateMailRequest: TemplateMailRequest = {
      template_id: 'test-template',
      to: ['test@example.com'],
      template_data: {
        name: 'Test User',
        message: 'Hello World'
      },
      subject: 'Test Subject',
      source_service: 'test-service'
    }

    it('should send template email successfully', async () => {
      vi.mocked(http.post).mockResolvedValue(mockResponse)

      const result = await mailApi.sendTemplateMail(mockTemplateMailRequest)

      expect(http.post).toHaveBeenCalledWith('mailer/send-template', { params: mockTemplateMailRequest })
      expect(result).toEqual(mockResponse.data)
    })

    it('should handle API errors', async () => {
      const error = new Error('API Error')
      vi.mocked(http.post).mockRejectedValue(error)

      await expect(mailApi.sendTemplateMail(mockTemplateMailRequest)).rejects.toThrow('API Error')
    })
  })
})