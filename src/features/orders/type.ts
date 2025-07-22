import { ColumnItem, FilterItem, UrlQuery } from '@/types'
import { Order } from './types'

export interface OrderParams {
  status: string
  customer_id: string
  date_gte: string
  date_lte: string
  total_gte: number
  returned: string
}

export type OrderFilterItem = FilterItem<OrderParams>

export type OrderUrlQuery = UrlQuery<OrderParams>

// export type OrderSettingColumn = {
//   ordered: { index: number; id: keyof Order }[]
//   delivered: { index: number; id: keyof Order }[]
//   cancelled: { index: number; id: keyof Order }[]
// }

export type OrderSettingColumn = {
  ordered: ColumnItem[]
  delivered: ColumnItem[]
  cancelled: ColumnItem[]
}
