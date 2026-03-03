import type { Customer } from './customers'
import type { Category } from './categories'
import type { Order } from './orders'
import type { Invoice } from './invoices'
import type { Review } from './reviews'
import { Settings } from './finalize'
import { Product } from '@/features/products/types'

export interface Db extends Record<string, any> {
  customers: Customer[]
  categories: Category[]
  products: Product[]
  orders: Order[]
  invoices: Invoice[]
  reviews: Review[]
  settings: Settings
}
