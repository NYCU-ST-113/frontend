export interface MailRequest {
  to: string[]
  subject: string
  body: string
  html_body?: string
  cc?: string[]
  bcc?: string[]
  sender?: string
  source_service: string
  attachments?: Record<string, any>[]
}

export interface TemplateMailRequest {
  to: string[]
  template_id: string
  template_data: Record<string, any>
  subject?: string
  cc?: string[]
  bcc?: string[]
  sender?: string
  source_service: string
}
