import { DEFAULT_PAGE } from '@/constants'
import { OrderSettingColumn, OrderUrlQuery } from '@/features/orders/types'
import { QuerySaveType, SORT } from '@/types'

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
      filter: {},
      order: SORT.ASC,
      page: DEFAULT_PAGE,
      perPage: 10,
      sort: 'customer_id'
    }
  const obj = JSON.parse(dataLs)
  return obj
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
