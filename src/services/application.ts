import type {
  ApplicationCreateRequest,
  ApplicationForm,
  ApplicationResponse,
} from '@/types/application'
import { ApplicationType } from '@/types/application'
import * as api from './api/application'

export const createApplication = async (
  applicationForm: ApplicationForm,
): Promise<ApplicationResponse> => {
  const data: ApplicationCreateRequest = {
    application_type: ApplicationType.dns,
    baseForm: applicationForm,
  }
  const response = await api.createApplication(data)
  return response.data
}

export const getAllApplications = async (): Promise<ApplicationForm[]> => {
  const response = await api.getAllApplications()
  return response.data
}

export const getApplicationById = async (id: string): Promise<ApplicationForm> => {
  const response = await api.getApplicationById(id)
  return response.data
}

export const updateApplication = async (
  id: string,
  applicationForm: ApplicationForm,
): Promise<ApplicationResponse> => {
  const response = await api.updateApplication(id, applicationForm)
  return response.data
}

export const deleteApplication = async (id: string): Promise<ApplicationResponse> => {
  const response = await api.deleteApplication(id)
  return response.data
}

// TODO: approve application?

export const rejectApplication = async (id: string): Promise<ApplicationResponse> => {
  const response = await api.rejectApplication(id)
  return response.data?.application_id
}
