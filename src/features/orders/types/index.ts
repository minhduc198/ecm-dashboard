// Order Types
export type OrderStatus = 'ordered' | 'delivered' | 'cancelled'

export type BasketItem = {
  product_id: number
  quantity: number
}

export type Order = {
  id: number
  reference: string
  date: string
  customer_id: number
  basket: BasketItem[]
  total_ex_taxes: number
  delivery_fees: number
  tax_rate: number
  taxes: number
  total: number
  status: OrderStatus
  returned: boolean
  address?: string
  nb_items?: string
}

export interface GetOrdersListRequest {
  pagination?: {
    page: number
    perPage: number
  }
  sort?: {
    field: string
    order: 'ASC' | 'DESC'
  }
  filter?: {
    status?: OrderStatus
    customer_id?: number
    date_gte?: string
    date_lte?: string
    total_gte?: number
    total_lte?: number
    q?: string
  }
}

export interface GetOrderDetailRequest {
  id: number
}

export interface UpdateOrderRequest {
  id: number
  data: Partial<Omit<Order, 'id'>>
}

export interface DeleteOrderRequest {
  id: number
}

export interface ExportOrdersRequest {
  filter?: GetOrdersListRequest['filter']
  format?: 'xlsx' | 'csv'
}

// Response Types
export interface GetOrdersListResponse {
  data: Order[]
  total: number
  page: number
  perPage: number
}

export interface GetOrderDetailResponse {
  data: Order
}

export interface UpdateOrderResponse {
  data: Order
}

export interface DeleteOrderResponse {
  data: Order
}

export interface ExportOrdersResponse {
  url: string
  filename: string
}

// Error Types
export interface OrderError {
  message: string
  code?: string
  details?: any
}
