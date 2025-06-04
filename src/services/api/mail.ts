import type { TemplateMailRequest } from '@/types/mail'
import http from './http'

const prefix = 'mailer'

export const sendMail = async (data: any) => {
  const response = await http.post(`${prefix}/send`, data)
  return response.data
}

export const sendTemplateMail = async (payload: TemplateMailRequest) => {
  const response = await http.post(`${prefix}/send-template`, { params: payload })
  return response.data
}
