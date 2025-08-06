import { ColumnItem } from '@/types'
import * as React from 'react'
import { GetOrdersListRequest, OrderFilterItem, OrderStatus } from '../types'
import { DEFAULT_PAGE, DEFAULT_PER_PAGE } from '@/constants'

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
