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
  apply_date: Date

  status: ApplicationStatus
}

export interface Application {
  id: string
  type: ApplicationType
  form: ApplicationForm
}

export interface ApplicationCreateRequest {
  application_type: ApplicationType
  baseForm: ApplicationForm
}

export interface ApplicationUpdateRequest {
  form: ApplicationForm
}

export interface ApplicationResponse {
  id: string
  message: string
}
