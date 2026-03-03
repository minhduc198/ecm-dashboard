import { DEFAULT_PAGE } from '@/constants'
import { DEFAULT_PER_PAGE_PRODUCT } from '@/features/products/constant'
import { ProductUrlQuery } from '@/features/products/types'
import { QuerySaveType, SORT } from '@/types'

const productListParamsLSName = 'product.listParams'
const productSaveQueries = 'product.saveQueries'

export function saveProductListParamsToLS(value: ProductUrlQuery) {
  localStorage.setItem(productListParamsLSName, JSON.stringify(value))
}

export function getProductListParamsFormLS(): ProductUrlQuery {
  const dataLs = localStorage.getItem(productListParamsLSName)

  if (!dataLs)
    return {
      filter: {},
      order: SORT.DESC,
      page: DEFAULT_PAGE,
      perPage: DEFAULT_PER_PAGE_PRODUCT,
      sort: 'reference'
    }
  const obj = JSON.parse(dataLs)
  return obj
}

export function saveQueriesProduct(data: QuerySaveType[]) {
  if (!data.length) {
    localStorage.removeItem(productSaveQueries)
  } else {
    localStorage.setItem(productSaveQueries, JSON.stringify(data))
  }
}

export function getProductSaveQueries(): QuerySaveType[] {
  const dataLs = localStorage.getItem(productSaveQueries)
  if (!dataLs) {
    return []
  } else {
    return JSON.parse(dataLs)
  }
}
