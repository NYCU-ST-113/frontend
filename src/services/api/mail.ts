import type { TemplateMailRequest } from '@/types/mail'
import http from './http'

const prefix = 'mail'

export const sendMail = async () => {
  const response = await http.get(`${prefix}/send`)
  return response.data
}

export const sendTemplateMail = async (payload: TemplateMailRequest) => {
  const response = await http.get(`${prefix}/send-template`, { params: payload })
  return response.data
}
