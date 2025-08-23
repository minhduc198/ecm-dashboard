import { Customer } from '@/services/data-generator'
import { ApiResponse, ApiResponseList, UrlQuery } from '@/types'
import { TableColumns } from '@/types/table'

export type GetCustomerListReq = {
  filter: Customer
  order: 'ASC' | 'DESC'
  page: number
  perPage: number
  sort: string
}

export type CustomerListResponse = ApiResponseList<Customer>

export type GetCustomerDetailRequest = {
  id: number
}

export type GetCustomerDetailResponse = ApiResponse<Customer>

export type Groups = 'compulsive' | 'collector' | 'ordered_once' | 'regular' | 'returns' | 'reviewer'
interface CustomerParam {
  last_seen_gte: string
  groups: Groups
  has_newsletter: string
  nb_orders_gte: string
  q: string
}

export type CustomerUrlQuery = UrlQuery<CustomerParam>

export type TableColumnsCustomer = TableColumns<Customer>[]
