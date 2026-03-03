import { DEFAULT_PAGE, DEFAULT_PER_PAGE } from '@/constants'
import { TableColumns } from '@/types/table'
import * as React from 'react'
import { GetOrdersListRequest, Order, OrderFilterItem, OrderStatus } from '../types'

type ColumnItem = TableColumns<Order>

export interface FilterContextValue {
  orderListRq: GetOrdersListRequest
  setOrderListRq: (params: GetOrdersListRequest) => void
  activeTab: OrderStatus
  filterItems: OrderFilterItem[]
  columnSetting: {
    [key: string]: ColumnItem[]
  }
  setColumnSetting: (columnSetting: { [key: string]: ColumnItem[] }) => void
  setFilterItems: (filterItems: OrderFilterItem[]) => void
  setActiveTab: (activeTab: OrderStatus) => void
}

export const FilterContext = React.createContext<FilterContextValue>({
  orderListRq: {
    pagination: {
      page: DEFAULT_PAGE,
      perPage: DEFAULT_PER_PAGE
    }
  },
  setOrderListRq: () => {},
  activeTab: 'ordered',
  filterItems: [],
  columnSetting: {},
  setColumnSetting: () => {},
  setFilterItems: () => {},
  setActiveTab: () => {}
})
