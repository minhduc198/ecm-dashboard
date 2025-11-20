import App from '@/App'
import Customers from '@/features/customers'
import Dashboard from '@/features/dashboard'
import Orders from '@/features/orders'
import SignIn from '@/features/signin'
import Layout from '@/layouts'
import { createBrowserRouter } from 'react-router'
import { path } from './path'

import Categories from '@/features/categories'
import DetailCategory from '@/features/categories/detail'
import DetailCustomer from '@/features/customers/detail'
import CreateCustomerPage from '@/features/customers/pageCreate'
import Invoices from '@/features/invoices'
import DetailOrder from '@/features/orders/detail'
import Products from '@/features/products'
import ProductDetail from '@/features/products/detail'
import Reviews from '@/features/reviews'
import CreateReview from '@/features/reviews/components/CreateReview'
import DetailReview from '@/features/reviews/detail'
import Segments from '@/features/segments'

export const router = createBrowserRouter([
  {
    Component: App,
    children: [
      {
        path: '/',
        Component: Layout,
        children: [
          {
            path: '/',
            Component: Dashboard
          },
          {
            path: path.orders,
            Component: Orders
          },
          {
            path: path.products,
            Component: Products
          },
          {
            path: path.categories,
            Component: Categories
          },
          {
            path: path.detailCategory,
            Component: DetailCategory
          },
          {
            path: path.customers,
            Component: Customers
          },
          {
            path: path.reviews,
            Component: Reviews
          },
          {
            path: path.detailCustomer,
            Component: DetailCustomer
          },
          {
            path: path.detailReview,
            Component: Reviews
          },
          { path: path.createReview, Component: CreateReview },
          {
            path: path.detailProduct,
            Component: ProductDetail
          },
          {
            path: path.detailTabProduct,
            Component: ProductDetail
          },
          {
            path: path.createTabProduct,
            Component: ProductDetail
          },
          {
            path: path.createProduct,
            Component: ProductDetail
          },

          {
            path: path.detailOrder,
            Component: DetailOrder
          },
          {
            path: path.invoices,
            Component: Invoices
          },
          { path: path.createCustomer, Component: CreateCustomerPage },

          // { path: path., Component: CreateCustomerPage },

          {
            path: path.segments,
            Component: Segments
          }
        ]
      },
      {
        path: '/sign-in',
        Component: SignIn
      }
    ]
  }
])
