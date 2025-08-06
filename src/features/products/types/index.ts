import { ApiResponseList } from '@/types'

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
}

export interface GetProductListReq {
  filter: ProductFilters
  order: 'ASC' | 'DESC'
  page: number
  perPage: number
  sort: string
}

export enum ProductCategory {
  ANIMALS,
  MUSIC,
  NATURE,
  SPORTS,
  ART,
  TRAVEL,
  PEOPLE,
  VINTAGE,
  ABSTRACT,
  TECHNOLOGY
}

export enum SalesLevel {
  NEVER_SOLD = 'NEVER_SOLD', // 0-10
  LOW = 'LOW', // 11-25
  AVERAGE = 'AVERAGE', // 26-50
  BEST_SELLERS = 'BEST_SELLERS' // 50+
}

export enum StockLevel {
  OUT_OF_STOCK = 'OUT_OF_STOCK', // 0
  LOW_STOCK = 'LOW_STOCK', // 1-10
  MEDIUM_STOCK = 'MEDIUM_STOCK', // 11-50
  HIGH_STOCK = 'HIGH_STOCK' // 50+
}

export interface ProductFilters {
  category_id?: ProductCategory | ProductCategory[]
  stock_gt?: number // stock greater than
  stock_gte?: number // stock greater than or equal
  stock_lt?: number // stock less than
  stock_lte?: number // stock less than or equal
  sales_gt?: number // sales greater than
  sales_gte?: number // sales greater than or equal
  sales_lt?: number // sales less than
  sales_lte?: number // sales less than or equal
  price_gt?: number // price greater than
  price_gte?: number // price greater than or equal
  price_lt?: number // price less than
  price_lte?: number // price less than or equal
  q?: string // search query
  id?: number[]
}

export interface ProductSort {
  field: 'id' | 'reference' | 'category_id' | 'price' | 'stock' | 'sales' | 'created_at' | 'updated_at'
  order: 'ASC' | 'DESC'
}

export type ProductListResponse = ApiResponseList<Product>

export interface Category {
  id: ProductCategory
  name: string
}

export const CATEGORY_NAMES: Record<ProductCategory, string> = {
  [ProductCategory.ANIMALS]: 'Animals',
  [ProductCategory.MUSIC]: 'Music',
  [ProductCategory.NATURE]: 'Nature',
  [ProductCategory.SPORTS]: 'Sports',
  [ProductCategory.ART]: 'Art',
  [ProductCategory.TRAVEL]: 'Travel',
  [ProductCategory.PEOPLE]: 'People',
  [ProductCategory.VINTAGE]: 'Vintage',
  [ProductCategory.ABSTRACT]: 'Abstract',
  [ProductCategory.TECHNOLOGY]: 'Technology'
}

export const getSalesLevel = (sales: number): SalesLevel => {
  if (sales <= 10) return SalesLevel.NEVER_SOLD
  if (sales <= 25) return SalesLevel.LOW
  if (sales <= 50) return SalesLevel.AVERAGE
  return SalesLevel.BEST_SELLERS
}

export const getStockLevel = (stock: number): StockLevel => {
  if (stock === 0) return StockLevel.OUT_OF_STOCK
  if (stock <= 10) return StockLevel.LOW_STOCK
  if (stock <= 50) return StockLevel.MEDIUM_STOCK
  return StockLevel.HIGH_STOCK
}
