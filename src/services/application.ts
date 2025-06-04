import type {
  Application,
  ApplicationCreateRequest,
  ApplicationForm,
  ApplicationResponse,
  DnsForm,
} from '@/types/application'
import { ApplicationType } from '@/types/application'
import * as api from './api/application'

export const createApplication = async (
  applicationForm: ApplicationForm,
  additionForm: DnsForm,
): Promise<ApplicationResponse> => {
  const data: ApplicationCreateRequest = {
    application_type: ApplicationType.dns,
    baseForm: applicationForm,
    additionForm: additionForm,
  }
  const response = await api.createApplication(data)
  return response.data
}

export const getAllApplications = async (): Promise<Application[]> => {
  const response = await api.getAllApplications()
  const applications: Application[] = Object.entries(response.data).map(([id, application]) => ({
    id,
    type: application.type,
    base: application.base,
    extra: application.extra,
  }))

  return applications
}

export const getApplicationById = async (id: string): Promise<Application> => {
  const response = await api.getApplicationById(id)
  const application: Application = {
    id: id,
    type: response.data.type,
    base: response.data.base,
    extra: response.data.extra,
  }

  return application
}

export const getUserApplications = async (userId: string): Promise<Application[]> => {
  const response = await api.getUserApplications(userId)
  const applications: Application[] = Object.entries(response.data).map(
    ([, application]: [string, any]) => ({
      id: application.application_id,
      type: application.type,
      base: application.base,
      extra: application.extra,
    }),
  )

  return applications
}

export const updateApplication = async (
  id: string,
  type: ApplicationType,
  applicationForm: ApplicationForm,
  additionForm: DnsForm,
): Promise<ApplicationResponse> => {
  const data: ApplicationCreateRequest = {
    application_type: type,
    baseForm: applicationForm,
    additionForm: additionForm,
  }
  const response = await api.updateApplication(id, data)

  return response.data
}

export const deleteApplication = async (id: string): Promise<ApplicationResponse> => {
  const response = await api.deleteApplication(id)
  return response.data
}

export const approveApplication = async (id: string): Promise<ApplicationResponse> => {
  const response = await api.approveApplication(id)
  return response.data?.application_id
}

export const rejectApplication = async (id: string): Promise<ApplicationResponse> => {
  const response = await api.rejectApplication(id)
  return response.data?.application_id
}
