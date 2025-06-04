export interface PaymentService {
  service_id: string
  name: string
  description: string
  base_price: number
}

export enum PaymentStatus {
  pending = 'Pending',
  paid = 'Paid',
  failed = 'Failed',
}

export interface PaymentDto {
  payment_id: string
  service_id: string
  service_name: string
  amount: number
  user_id: string
  email: string
  application_reason: string
  status: string
  created_at: string
}

export interface Payment {
  id: string
  serviceId: string
  serviceName: string
  amount: number
  userId: string
  email: string
  applicationReason: string
  status: string
  createdAt: string
}
