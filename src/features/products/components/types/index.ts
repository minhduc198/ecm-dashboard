import { UrlQuery } from '@/types'

export interface ProductParam {
  id: string
  q: string
  sales: string
  stock: string
  categories: string
}

export type ProductUrlQuery = UrlQuery<ProductParam>
