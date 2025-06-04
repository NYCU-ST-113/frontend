import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ApplicationCreateRequest, ApplicationsResponse } from '../../../types/application'
import { ApplicationStatus, ApplicationType } from '../../../types/application'
import * as applicationApi from '../../api/application'
import http from '../../api/http'

vi.mock('../../api/http')

describe('Application API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mockApplicationRequest: ApplicationCreateRequest = {
    application_type: ApplicationType.dns,
    baseForm: {
      department: 'Test Department',
      applicant_account: 'test_account',
      applicant_name: 'Test User',
      applicant_phone: '1234567890',
      applicant_email: 'test@example.com',
      tech_contact_name: 'Tech Contact',
      tech_contact_phone: '0987654321',
      tech_contact_email: 'tech@example.com',
      supervisor_name: 'Supervisor',
      supervisor_id: 'supervisor123',
      supervisor_email: 'supervisor@example.com',
      apply_date: '2024-03-19',
      status: ApplicationStatus.pending
    },
    additionForm: {
      applicant_unit: 'Test Unit',
      domain_name: 'test.example.com',
      application_project: 'Test Project',
      dns_manage_account: 'dns_admin',
      reason: 'Test reason'
    }
  }

  const mockResponse = {
    data: { success: true, message: 'Operation successful' }
  }

  describe('createApplication', () => {
    it('should create application successfully', async () => {
      vi.mocked(http.post).mockResolvedValue(mockResponse)

      const result = await applicationApi.createApplication(mockApplicationRequest)

      expect(http.post).toHaveBeenCalledWith('/apply/apply', mockApplicationRequest)
      expect(result).toEqual(mockResponse)
    })

    it('should handle API errors', async () => {
      const error = new Error('API Error')
      vi.mocked(http.post).mockRejectedValue(error)

      await expect(applicationApi.createApplication(mockApplicationRequest)).rejects.toThrow('API Error')
    })
  })

  describe('getAllApplications', () => {
    const mockApplicationsResponse: ApplicationsResponse = {
      'app1': {
        id: 'app1',
        type: ApplicationType.dns,
        base: mockApplicationRequest.baseForm,
        extra: mockApplicationRequest.additionForm
      }
    }

    it('should get all applications successfully', async () => {
      vi.mocked(http.get).mockResolvedValue(mockApplicationsResponse)

      const result = await applicationApi.getAllApplications()

      expect(http.get).toHaveBeenCalledWith('/apply/getAll')
      expect(result).toEqual(mockApplicationsResponse)
    })

    it('should handle API errors', async () => {
      const error = new Error('API Error')
      vi.mocked(http.get).mockRejectedValue(error)

      await expect(applicationApi.getAllApplications()).rejects.toThrow('API Error')
    })
  })

  describe('getApplicationById', () => {
    it('should get application by id successfully', async () => {
      vi.mocked(http.get).mockResolvedValue(mockResponse)

      const result = await applicationApi.getApplicationById('1')

      expect(http.get).toHaveBeenCalledWith('/apply/1')
      expect(result).toEqual(mockResponse)
    })

    it('should handle API errors', async () => {
      const error = new Error('API Error')
      vi.mocked(http.get).mockRejectedValue(error)

      await expect(applicationApi.getApplicationById('1')).rejects.toThrow('API Error')
    })
  })

  describe('getUserApplications', () => {
    it('should get user applications successfully', async () => {
      vi.mocked(http.get).mockResolvedValue(mockResponse)

      const result = await applicationApi.getUserApplications('user123')

      expect(http.get).toHaveBeenCalledWith('/apply/my-applications', {
        headers: { 'X-User-Id': 'user123' }
      })
      expect(result).toEqual(mockResponse)
    })

    it('should handle API errors', async () => {
      const error = new Error('API Error')
      vi.mocked(http.get).mockRejectedValue(error)

      await expect(applicationApi.getUserApplications('user123')).rejects.toThrow('API Error')
    })
  })

  describe('updateApplication', () => {
    it('should update application successfully', async () => {
      vi.mocked(http.put).mockResolvedValue(mockResponse)

      const result = await applicationApi.updateApplication('1', mockApplicationRequest)

      expect(http.put).toHaveBeenCalledWith('/apply/1', mockApplicationRequest)
      expect(result).toEqual(mockResponse)
    })

    it('should handle API errors', async () => {
      const error = new Error('API Error')
      vi.mocked(http.put).mockRejectedValue(error)

      await expect(applicationApi.updateApplication('1', mockApplicationRequest)).rejects.toThrow('API Error')
    })
  })

  describe('deleteApplication', () => {
    it('should delete application successfully', async () => {
      vi.mocked(http.delete).mockResolvedValue(mockResponse)

      const result = await applicationApi.deleteApplication('1')

      expect(http.delete).toHaveBeenCalledWith('/apply/1')
      expect(result).toEqual(mockResponse)
    })

    it('should handle API errors', async () => {
      const error = new Error('API Error')
      vi.mocked(http.delete).mockRejectedValue(error)

      await expect(applicationApi.deleteApplication('1')).rejects.toThrow('API Error')
    })
  })

  describe('approveApplication', () => {
    it('should approve application successfully', async () => {
      vi.mocked(http.put).mockResolvedValue(mockResponse)

      const result = await applicationApi.approveApplication('1')

      expect(http.put).toHaveBeenCalledWith('/apply/approved/1')
      expect(result).toEqual(mockResponse)
    })

    it('should handle API errors', async () => {
      const error = new Error('API Error')
      vi.mocked(http.put).mockRejectedValue(error)

      await expect(applicationApi.approveApplication('1')).rejects.toThrow('API Error')
    })
  })

  describe('rejectApplication', () => {
    it('should reject application successfully', async () => {
      vi.mocked(http.put).mockResolvedValue(mockResponse)

      const result = await applicationApi.rejectApplication('1')

      expect(http.put).toHaveBeenCalledWith('/apply/rejected/1')
      expect(result).toEqual(mockResponse)
    })

    it('should handle API errors', async () => {
      const error = new Error('API Error')
      vi.mocked(http.put).mockRejectedValue(error)

      await expect(applicationApi.rejectApplication('1')).rejects.toThrow('API Error')
    })
  })
})