import type {
  Application,
  ApplicationForm,
  ApplicationResponse,
  DnsForm,
} from '@/types/application'
import { ApplicationStatus, ApplicationType } from '@/types/application'
import type { AxiosResponse } from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as api from '../api/application'
import {
  approveApplication,
  createApplication,
  deleteApplication,
  getApplicationById,
  getUserApplications,
  rejectApplication,
  updateApplication,
} from '../application'

// Mock the API module
vi.mock('../api/application')

describe('Application Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mockAxiosResponse = <T>(data: T): AxiosResponse<T> => ({
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as any,
  })

  const mockApplicationForm: ApplicationForm = {
    department: 'IT Department',
    applicant_account: 'john.doe',
    applicant_name: 'John Doe',
    applicant_phone: '1234567890',
    applicant_email: 'john.doe@example.com',
    tech_contact_name: 'Jane Smith',
    tech_contact_phone: '0987654321',
    tech_contact_email: 'jane.smith@example.com',
    supervisor_name: 'Bob Johnson',
    supervisor_id: 'BJ123',
    supervisor_email: 'bob.johnson@example.com',
    apply_date: '2024-03-19',
    status: ApplicationStatus.pending,
  }

  const mockDnsForm: DnsForm = {
    applicant_unit: 'IT Unit',
    domain_name: 'example.com',
    application_project: 'Website Project',
    dns_manage_account: 'admin',
    reason: 'New website deployment',
  }

  const mockApplication: Application = {
    id: '123',
    type: ApplicationType.dns,
    base: mockApplicationForm,
    extra: mockDnsForm,
  }

  describe('createApplication', () => {
    it('should create an application successfully', async () => {
      const mockResponse: ApplicationResponse = {
        application_id: '123',
        message: 'Application created successfully',
      }

      vi.mocked(api.createApplication).mockResolvedValue(mockAxiosResponse(mockResponse))

      const result = await createApplication(mockApplicationForm, mockDnsForm)

      expect(api.createApplication).toHaveBeenCalledWith({
        application_type: ApplicationType.dns,
        baseForm: mockApplicationForm,
        additionForm: mockDnsForm,
      })
      expect(result).toEqual(mockResponse)
    })

    it('should handle API errors', async () => {
      const error = new Error('API Error')
      vi.mocked(api.createApplication).mockRejectedValue(error)

      await expect(createApplication(mockApplicationForm, mockDnsForm)).rejects.toThrow('API Error')
    })
  })

  describe('getApplicationById', () => {
    it('should return application by ID', async () => {
      vi.mocked(api.getApplicationById).mockResolvedValue(mockAxiosResponse(mockApplication))

      const result = await getApplicationById('123')

      expect(api.getApplicationById).toHaveBeenCalledWith('123')
      expect(result).toEqual(mockApplication)
    })

    it('should handle API errors', async () => {
      const error = new Error('API Error')
      vi.mocked(api.getApplicationById).mockRejectedValue(error)

      await expect(getApplicationById('123')).rejects.toThrow('API Error')
    })
  })

  describe('getUserApplications', () => {
    it('should return user applications', async () => {
      const mockUserApplicationsResponse = {
        app1: {
          application_id: '123',
          type: ApplicationType.dns,
          base: mockApplicationForm,
          extra: mockDnsForm,
        },
      }

      vi.mocked(api.getUserApplications).mockResolvedValue(
        mockAxiosResponse(mockUserApplicationsResponse),
      )

      const result = await getUserApplications('user123')

      expect(api.getUserApplications).toHaveBeenCalledWith('user123')
      expect(result).toEqual([
        {
          id: '123',
          type: ApplicationType.dns,
          base: mockApplicationForm,
          extra: mockDnsForm,
        },
      ])
    })

    it('should handle empty response', async () => {
      vi.mocked(api.getUserApplications).mockResolvedValue(mockAxiosResponse({}))

      const result = await getUserApplications('user123')

      expect(result).toEqual([])
    })
  })

  describe('updateApplication', () => {
    it('should update application successfully', async () => {
      const mockResponse: ApplicationResponse = {
        application_id: '123',
        message: 'Application updated successfully',
      }

      vi.mocked(api.updateApplication).mockResolvedValue(mockAxiosResponse(mockResponse))

      const result = await updateApplication(
        '123',
        ApplicationType.dns,
        mockApplicationForm,
        mockDnsForm,
      )

      expect(api.updateApplication).toHaveBeenCalledWith('123', {
        application_type: ApplicationType.dns,
        baseForm: mockApplicationForm,
        additionForm: mockDnsForm,
      })
      expect(result).toEqual(mockResponse)
    })

    it('should handle API errors', async () => {
      const error = new Error('API Error')
      vi.mocked(api.updateApplication).mockRejectedValue(error)

      await expect(
        updateApplication('123', ApplicationType.dns, mockApplicationForm, mockDnsForm),
      ).rejects.toThrow('API Error')
    })
  })

  describe('deleteApplication', () => {
    it('should delete application successfully', async () => {
      const mockResponse: ApplicationResponse = {
        application_id: '123',
        message: 'Application deleted successfully',
      }

      vi.mocked(api.deleteApplication).mockResolvedValue(mockAxiosResponse(mockResponse))

      const result = await deleteApplication('123')

      expect(api.deleteApplication).toHaveBeenCalledWith('123')
      expect(result).toEqual(mockResponse)
    })

    it('should handle API errors', async () => {
      const error = new Error('API Error')
      vi.mocked(api.deleteApplication).mockRejectedValue(error)

      await expect(deleteApplication('123')).rejects.toThrow('API Error')
    })
  })

  describe('approveApplication', () => {
    it('should approve application successfully', async () => {
      vi.mocked(api.approveApplication).mockResolvedValue({
        data: {
          application_id: '123',
          message: 'Application approved successfully',
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      })

      const result = await approveApplication('123')

      expect(api.approveApplication).toHaveBeenCalledWith('123')
      expect(result).toEqual('123')
    })

    it('should handle API errors', async () => {
      const error = new Error('API Error')
      vi.mocked(api.approveApplication).mockRejectedValue(error)

      await expect(approveApplication('123')).rejects.toThrow('API Error')
    })
  })

  describe('rejectApplication', () => {
    it('should reject application successfully', async () => {
      vi.mocked(api.rejectApplication).mockResolvedValue({
        data: {
          application_id: '123',
          message: 'Application rejected successfully',
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      })

      const result = await rejectApplication('123')

      expect(api.rejectApplication).toHaveBeenCalledWith('123')
      expect(result).toEqual('123')
    })

    it('should handle API errors', async () => {
      const error = new Error('API Error')
      vi.mocked(api.rejectApplication).mockRejectedValue(error)

      await expect(rejectApplication('123')).rejects.toThrow('API Error')
    })
  })
})
