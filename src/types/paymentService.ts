export interface PaymentService {
  id: string
  name: string
  description: string
  base_price: number
}

export interface PaymentServiceCreateDto {
  name: string
  description: string
  base_price: number
}

export interface PaymentServiceUpdateDto {
  name: string
  description: string
  base_price: number
}
