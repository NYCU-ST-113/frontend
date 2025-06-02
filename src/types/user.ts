export interface Application {
  id: string
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
  status: string
}

export interface CreateApplicationDto {
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
  status: string
}

export interface UpdateApplicationDto {
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
  status: string
}

export interface DeleteApplicationDto {
  id: string
}
