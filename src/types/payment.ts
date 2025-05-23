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

export interface Payment {
  id: string
  service_id: string
  amount: number
  user_id: string
  status: string
  created_at: Date
  email: string
}

export interface PaymentCreateRequest {
  serviceId: string
  amount: number
  userId: string
  status: string
  email: string
}

export interface PaymentUpdateRequest {
  id: string
  status: string
}
