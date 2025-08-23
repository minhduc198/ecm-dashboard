import { DEFAULT_PAGE } from '@/constants'
import { CustomerUrlQuery } from '@/features/customers/types'
import { SORT } from '@/types'

const customerListParamsLSName = 'customer.listParams'

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
