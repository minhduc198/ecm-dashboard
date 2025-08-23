import { DEFAULT_PAGE } from '@/constants'
import { CustomerUrlQuery, TableColumnsCustomer } from '@/features/customers/types'
import { Customer } from '@/services/data-generator'
import { SORT } from '@/types'
import { TableColumns } from '@/types/table'

const customerListParamsLSName = 'customer.listParams'
const customerSettingColumnsLSName = 'customer.settingColumns'

export function saveCustomerListParamsToLS(value: CustomerUrlQuery) {
  localStorage.setItem(customerListParamsLSName, JSON.stringify(value))
}

export function getCustomerListParamsFormLS(): CustomerUrlQuery {
  const dataLs = localStorage.getItem(customerListParamsLSName)

  if (!dataLs)
    return {
      filter: {},
      order: SORT.ASC,
      page: DEFAULT_PAGE,
      perPage: 25,
      sort: 'groups'
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
