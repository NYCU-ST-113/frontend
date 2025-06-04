import * as api from '@/services/api/mail'
import type { TemplateMailRequest } from '@/types/mail'

export const sendMail = async (data: any) => {
  const response = await api.sendMail(data)
  return response.data
}

export const sendTemplateMail = async (payload: TemplateMailRequest) => {
  const response = await api.sendTemplateMail(payload)
  return response.data
}
