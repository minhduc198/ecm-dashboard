import { ColumnItem, FilterItem, UrlQuery } from '@/types'
import { OrderStatus } from './types'

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
  ordered: ColumnItem[]
  delivered: ColumnItem[]
  cancelled: ColumnItem[]
}
