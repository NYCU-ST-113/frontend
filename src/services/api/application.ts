import type { ApplicationCreateRequest, ApplicationsResponse } from '@/types/application'
import type { AxiosResponse } from 'axios'
import http from './http'

const prefix = 'apply'

export const createApplication = async (data: ApplicationCreateRequest): Promise<AxiosResponse> => {
  return await http.post(`/${prefix}/apply`, data)
}

export const getAllApplications = async (): Promise<ApplicationsResponse> => {
  return await http.get(`/${prefix}/getAll`)
}

export const getApplicationById = async (id: string): Promise<AxiosResponse> => {
  return await http.get(`/${prefix}/${id}`)
}

export const getUserApplications = async (userId: string): Promise<AxiosResponse> => {
  return await http.get(`/${prefix}/my-applications`, { headers: { 'X-User-Id': userId } })
}

export const updateApplication = async (
  id: string,
  data: ApplicationCreateRequest,
): Promise<AxiosResponse> => {
  return await http.put(`/${prefix}/${id}`, data)
}

export const deleteApplication = async (id: string): Promise<AxiosResponse> => {
  return await http.delete(`/${prefix}/${id}`)
}

export const approveApplication = async (id: string): Promise<AxiosResponse> => {
  return await http.put(`/${prefix}/approved/${id}`)
}

export const rejectApplication = async (id: string): Promise<AxiosResponse> => {
  return await http.put(`/${prefix}/rejected/${id}`)
}
