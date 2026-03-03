import { Product } from '@/features/products/types'
import { Customer } from './customers'
import type { Db } from './types'

export const generateInvoices = (db: Db): Invoice[] => {
  let id = 0

  return (
    db.orders
      .filter((order) => order.status !== 'delivered')
      // @ts-ignore
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map((order) => {
        const basketProductIds = order.basket.map((i) => i.product_id)
        const basketProducts = db.products.filter((p) => basketProductIds.includes(p.id))
        const products = basketProducts.map((product) => {
          const basket = order.basket.find((b) => b.product_id === product.id)
          if (basket) {
            return {
              ...product,
              quantity: basket.quantity
            }
          }
          return product
        })

        return {
          id: id++,
          date: order.date,
          products,
          order_id: order.id,
          reference: order.reference,
          customer_id: order.customer_id,
          customer_detail: order.customer,
          total_ex_taxes: order.total_ex_taxes,
          delivery_fees: order.delivery_fees,
          tax_rate: order.tax_rate,
          taxes: order.taxes,
          total: order.total
        }
      })
  )
}

export type Invoice = {
  id: number
  date: string
  order_id: number
  reference: string
  customer_id: number
  products: Product[]
  customer_detail: Customer
  total_ex_taxes: number
  delivery_fees: number
  tax_rate: number
  taxes: number
  total: number
}
