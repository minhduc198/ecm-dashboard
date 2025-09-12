import App from '@/App'
import { createBrowserRouter } from 'react-router'
import Dashboard from '@/features/dashboard'
import Orders from '@/features/orders'
import SignIn from '@/features/signin'
import Layout from '@/layouts'
import { path } from './path'
import Customers from '@/features/customers'
import Review from '@/features/reviews'

import DetailOrder from '@/features/orders/detail'
import Invoices from '@/features/invoices'
import DetailCustomer from '@/features/customers/detail'
import DetailReview from '@/features/reviews/detail'
import CreateCustomerPage from '@/features/customers/pageCreate'
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
            path: path.catalog,
            Component: Orders
          },
          {
            path: path.customers,
            Component: Customers
          },
          {
            path: path.reviews,
            Component: Review
          },
          {
            path: path.detailCustomer,
            Component: DetailCustomer
          },
          {
            path: path.detailReview,
            Component: DetailReview
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
