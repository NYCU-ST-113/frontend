import type { ApplicationCreateRequest, ApplicationForm } from '@/types/application'
import type { AxiosResponse } from 'axios'
import http from './http'

const prefix = '/apply'

export const createApplication = async (data: ApplicationCreateRequest): Promise<AxiosResponse> => {
  return await http.post(`/${prefix}`, data)
}

export const getAllApplications = async (): Promise<AxiosResponse> => {
  return await http.get(`/${prefix}`)
}

export const getApplicationById = async (id: string): Promise<AxiosResponse> => {
  return await http.get(`/${prefix}/${id}`)
}

export const updateApplication = async (
  id: string,
  data: ApplicationForm,
): Promise<AxiosResponse> => {
  return await http.put(`/${prefix}/${id}`, data)
}

export const deleteApplication = async (id: string): Promise<AxiosResponse> => {
  return await http.delete(`/${prefix}/${id}`)
}

export const approveApplication = async (id: string): Promise<AxiosResponse> => {
  return await http.put(`/${prefix}/${id}/approve`)
}
