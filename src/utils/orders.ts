import { OrderSettingColumn, OrderUrlQuery } from '@/features/orders/type'
import { OrderStatus } from '@/features/orders/types'
import { ColumnItem, QuerySaveType } from '@/types'

const saveQueryLsName = 'orders_save_query'
const orderListParamsLSName = 'order.listParams'
const settingColumnsLsName = 'orders.settingColumns'

export function setOrderSaveQueryToLS(value: QuerySaveType[]) {
  if (!value.length) {
    localStorage.removeItem(saveQueryLsName)
  } else {
    localStorage.setItem(saveQueryLsName, JSON.stringify(value))
  }
}

export function getOrderSaveQueryFormLS(): QuerySaveType[] {
  const dataLs = localStorage.getItem(saveQueryLsName)
  if (!dataLs) return []
  return JSON.parse(dataLs)
}

export function saveListParamsToLS(value: OrderUrlQuery) {
  localStorage.setItem(orderListParamsLSName, JSON.stringify(value))
}

export function getListParamsFormLS(): OrderUrlQuery {
  const dataLs = localStorage.getItem(orderListParamsLSName)
  if (!dataLs)
    return {
      displayedFilters: {},
      filter: {}
    }
  const obj = JSON.parse(dataLs)
  return {
    displayedFilters: obj.displayedFilters,
    filter: obj.filter
  }
}

export function setSettingColumnsToLS(value: OrderSettingColumn) {
  localStorage.setItem(settingColumnsLsName, JSON.stringify(value))
}

export function getSettingColumnsFromLS(): OrderSettingColumn {
  const dataLs = localStorage.getItem(settingColumnsLsName)
  if (!dataLs)
    return {
      ordered: [],
      delivered: [],
      cancelled: []
    }
  return JSON.parse(dataLs)
}

// export function getDefaultSettingColumns(status: OrderStatus): ColumnItem[] {
//   const columnsLS = getSettingColumnsFromLS()
//   const ids = columnsLS[status].map((i) => i.id)
//   return initialColumns.map((item) => ({ ...item, isVisible: ids.includes(item.id) }))
// }
