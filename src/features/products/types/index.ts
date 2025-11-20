import { ApiResponse, ApiResponseList, SORT } from '@/types'

export type Product = {
  id: number
  category_id: number
  reference: string
  width: number
  height: number
  price: number
  thumbnail: string
  image: string
  description: string
  stock: number
  sales: number
  quantity?: number
}

// export interface GetProductListReq {
//   filter: ProductFilters
//   order: 'ASC' | 'DESC'
//   page: number
//   perPage: number
//   sort: string
// }

// export interface ProductFilters {
//   category_id?: ProductCategory | ProductCategory[]
//   stock_gt?: number // stock greater than
//   stock_gte?: number // stock greater than or equal
//   stock_lt?: number // stock less than
//   stock_lte?: number // stock less than or equal
//   sales_gt?: number // sales greater than
//   sales_gte?: number // sales greater than or equal
//   sales_lt?: number // sales less than
//   sales_lte?: number // sales less than or equal
//   price_gt?: number // price greater than
//   price_gte?: number // price greater than or equal
//   price_lt?: number // price less than
//   price_lte?: number // price less than or equal
//   q?: string // search query
//   id?: number[]
// }

export interface ProductSort {
  field: 'id' | 'reference' | 'category_id' | 'price' | 'stock' | 'sales' | 'created_at' | 'updated_at'
  order: 'ASC' | 'DESC'
}

export type ProductListResponse = ApiResponseList<Product>

// export interface Category {
//   id: ProductCategory
//   name: string
// }

// export const CATEGORY_NAMES: Record<ProductCategory, string> = {
//   [ProductCategory.ANIMALS]: 'Animals',
//   [ProductCategory.MUSIC]: 'Music',
//   [ProductCategory.NATURE]: 'Nature',
//   [ProductCategory.SPORTS]: 'Sports',
//   [ProductCategory.ART]: 'Art',
//   [ProductCategory.TRAVEL]: 'Travel',
//   [ProductCategory.PEOPLE]: 'People',
//   [ProductCategory.VINTAGE]: 'Vintage',
//   [ProductCategory.ABSTRACT]: 'Abstract',
//   [ProductCategory.TECHNOLOGY]: 'Technology'
// }

// export const getSalesLevel = (sales: number): SalesLevel => {
//   if (sales <= 10) return SalesLevel.NEVER_SOLD
//   if (sales <= 25) return SalesLevel.LOW
//   if (sales <= 50) return SalesLevel.AVERAGE
//   return SalesLevel.BEST_SELLERS
// }

// export const getStockLevel = (stock: number): StockLevel => {
//   if (stock === 0) return StockLevel.OUT_OF_STOCK
//   if (stock <= 10) return StockLevel.LOW_STOCK
//   if (stock <= 50) return StockLevel.MEDIUM_STOCK
//   return StockLevel.HIGH_STOCK
// }

import { UrlQuery } from '@/types'
import { TableColumns } from '@/types/table'

export interface ProductParam {
  id: number[]
  reference?: string
  q: string
  sales_gt: string
  sales_lte: string
  sales: string
  stock: string
  stock_lt: string
  stock_gt: string
  category_id: string
}

export type ProductUrlQuery = UrlQuery<ProductParam>

export interface GetProductListRequest {
  pagination: {
    page: number
    perPage: number
  }
  sort?: {
    field: string
    order: SORT
  }
  filter?: {
    sale?: string
    stock?: string
    category_id?: string
    q?: string
    id?: number[]
  }
}

export type GetProductsListResponse = ApiResponseList<Product>

export type GetProductDetailRequest = {
  id: number
}

export type GetProductDetailResponse = ApiResponse<Product>

export type DeleteProductsRequest = {
  ids: number[]
}

export interface UpdateProductRequest {
  id: number
  data: Partial<Omit<Product, 'id'>>
}

export type UpdateProductResponse = ApiResponse<Product>

export interface CreateProductRequest {
  data: Partial<Omit<Product, 'id'>>
}

export type TableColumnsProduct = TableColumns<Product>[]
