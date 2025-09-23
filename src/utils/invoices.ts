import { DEFAULT_PAGE } from '@/constants'
import { DEFAULT_PER_PAGE_INVOICE } from '@/features/invoices/constant'
import { InvoiceUrlQuery, TableColumnsInvoice } from '@/features/invoices/types'
import { QuerySaveType, SORT } from '@/types'

const customerListParamsLSName = 'invoices.listParams'
const customerSettingInvoicesLSName = 'invoices.settingColumns'
const customerSaveQueries = 'invoices.saveQueries'

export function setInvoicesSettingColumnsToLS(value: TableColumnsInvoice) {
  localStorage.setItem(customerSettingInvoicesLSName, JSON.stringify(value))
}

export function getInvoicesSettingColumnsFromLS(): TableColumnsInvoice {
  const dataLs = localStorage.getItem(customerSettingInvoicesLSName)

  if (!dataLs) {
    return []
  }

  return JSON.parse(dataLs)
}

export function saveInvoiceListParamsToLS(value: InvoiceUrlQuery) {
  localStorage.setItem(customerListParamsLSName, JSON.stringify(value))
}

export function getInvoiceListParamsFormLS(): InvoiceUrlQuery {
  const dataLs = localStorage.getItem(customerListParamsLSName)

  if (!dataLs)
    return {
      displayedFilters: {},
      filter: {},
      order: SORT.DESC,
      page: DEFAULT_PAGE,
      perPage: DEFAULT_PER_PAGE_INVOICE,
      sort: 'id'
    }
  const obj = JSON.parse(dataLs)
  return obj
}

export function saveQueriesInvoice(data: QuerySaveType[]) {
  if (!data.length) {
    localStorage.removeItem(customerSaveQueries)
  } else {
    localStorage.setItem(customerSaveQueries, JSON.stringify(data))
  }
}

export function getInvoiceSaveQueries(): QuerySaveType[] {
  const dataLs = localStorage.getItem(customerSaveQueries)
  if (!dataLs) {
    return []
  } else {
    return JSON.parse(dataLs)
  }
}
