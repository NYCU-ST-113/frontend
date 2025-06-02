import * as api from '@/services/api/mail'
import type { TemplateMailRequest } from '@/types/mail'

export const sendMail = async () => {
  const response = await api.sendMail()
  return response.data
}

export const sendTemplateMail = async (payload: TemplateMailRequest) => {
  const response = await api.sendTemplateMail(payload)
  return response.data
}
