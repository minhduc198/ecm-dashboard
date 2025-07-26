import { ColumnItem } from '@/types'
import * as React from 'react'
import { OrderFilterItem } from '../type'
import { GetOrdersListRequest, OrderStatus } from '../types'

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
  orderListRq: {},
  setOrderListRq: () => {},
  activeTab: 'ordered',
  filterItems: [],
  columnSetting: {},
  setColumnSetting: () => {},
  setFilterItems: () => {},
  setActiveTab: () => {}
})
