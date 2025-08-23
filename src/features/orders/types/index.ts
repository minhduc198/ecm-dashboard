import { Customer } from '@/services/data-generator'
import { ApiResponse, ApiResponseList, FilterItem, SORT, UrlQuery } from '@/types'
import { TableColumns } from '@/types/table'

export type OrderStatus = 'ordered' | 'delivered' | 'cancelled'

export type BasketItem = {
  product_id: number
  quantity: number
}

export type Order = {
  id: number
  reference: string
  date: string
  customer: Customer
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
  pagination: {
    page: number
    perPage: number
  }
  sort?: {
    field: string
    order: SORT
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
export type GetOrdersListResponse = ApiResponseList<Order>

export type GetOrderDetailResponse = ApiResponse<Order>

export type UpdateOrderResponse = ApiResponse<Order>

export type DeleteOrderResponse = ApiResponse<Order>

export interface ExportOrdersResponse {
  url: string
  filename: string
}

export interface OrderError {
  message: string
  code?: string
  details?: any
}

export interface OrderParams {
  status: OrderStatus
  customer_id: number
  date_gte: string
  date_lte: string
  total_gte: number
  returned: string
  q: string
}

export type OrderFilterItem = FilterItem<OrderParams>

export type OrderUrlQuery = UrlQuery<OrderParams>

export type OrderSettingColumn = {
  ordered: TableColumns<Order>[]
  delivered: TableColumns<Order>[]
  cancelled: TableColumns<Order>[]
}

export interface OrderDetailProduct {
  id: number
  reference: string
  price: number
  quantity: number
  total: number
}
