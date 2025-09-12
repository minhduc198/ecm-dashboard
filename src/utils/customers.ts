import { DEFAULT_PAGE } from '@/constants'
import { DEFAULT_PER_PAGE_CUSTOMER } from '@/features/customers/constant'
import { CustomerUrlQuery, TableColumnsCustomer } from '@/features/customers/types'
import { QuerySaveType, SORT } from '@/types'

const customerListParamsLSName = 'customer.listParams'
const customerSettingColumnsLSName = 'customer.settingColumns'
const customerSaveQueries = 'customer.saveQueries'

export function saveCustomerListParamsToLS(value: CustomerUrlQuery) {
  localStorage.setItem(customerListParamsLSName, JSON.stringify(value))
}

export function getCustomerListParamsFormLS(): CustomerUrlQuery {
  const dataLs = localStorage.getItem(customerListParamsLSName)

  if (!dataLs)
    return {
      filter: {},
      order: SORT.DESC,
      page: DEFAULT_PAGE,
      perPage: DEFAULT_PER_PAGE_CUSTOMER,
      sort: 'id'
    }
  const obj = JSON.parse(dataLs)
  return obj
}

export function setCustomerSettingColumnsToLS(value: TableColumnsCustomer) {
  localStorage.setItem(customerSettingColumnsLSName, JSON.stringify(value))
}

export function getCustomerSettingColumnsFromLS(): TableColumnsCustomer {
  const dataLs = localStorage.getItem(customerSettingColumnsLSName)

  if (!dataLs) {
    return []
  }

  return JSON.parse(dataLs)
}

export function saveQueriesCustomer(data: QuerySaveType[]) {
  if (!data.length) {
    localStorage.removeItem(customerSaveQueries)
  } else {
    localStorage.setItem(customerSaveQueries, JSON.stringify(data))
  }
}

export function getCustomerSaveQueries(): QuerySaveType[] {
  const dataLs = localStorage.getItem(customerSaveQueries)
  if (!dataLs) {
    return []
  } else {
    return JSON.parse(dataLs)
  }
}
