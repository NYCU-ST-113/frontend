export enum ApplicationStatus {
  pending = 'Pending',
  under_review = 'Under Review',
  approved = 'Approved',
  rejected = 'Rejected',
  completed = 'Completed',
  canceled = 'Canceled',
}

export enum ApplicationType {
  dns = 'DNS',
  office = 'Office',
}

export interface ApplicationForm {
  department: string
  applicant_account: string
  applicant_name: string
  applicant_phone: string
  applicant_email: string
  tech_contact_name: string
  tech_contact_phone: string
  tech_contact_email: string
  supervisor_name: string
  supervisor_id: string
  supervisor_email: string
  apply_date: string

  status: ApplicationStatus
}

export interface DnsForm {
  applicant_unit: string
  domain_name: string
  application_project: string
  dns_manage_account: string
  reason: string
}

export interface Application {
  id: string
  type: ApplicationType
  base: ApplicationForm
  extra: DnsForm
}

export interface ApplicationCreateRequest {
  application_type: ApplicationType
  baseForm: ApplicationForm
  additionForm: DnsForm
}

export interface ApplicationUpdateRequest {
  form: ApplicationForm
}

export interface ApplicationsResponse {
  [key: string]: Application
}

export interface ApplicationResponse {
  application_id: string
  message: string
}
