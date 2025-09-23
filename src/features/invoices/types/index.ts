import { Invoice } from '@/services/data-generator'
import { ApiResponse, ApiResponseList, FilterItem, SORT, UrlQuery } from '@/types'
import { TableColumns } from '@/types/table'

export type InvoiceParam = {
  customer_id: string
  order_id: string
  date_gte: string
  date_lte: string
  id?: string
}

export type TableColumnsInvoice = TableColumns<Invoice>[]

export type InvoiceUrlQuery = UrlQuery<InvoiceParam>

export type InvoiceFilterItem = FilterItem<InvoiceParam>

export interface GetInvoicesListRequest {
  pagination: {
    page: number
    perPage: number
  }
  sort?: {
    field: string
    order: SORT
  }
  filter?: {
    date_gte?: string
    date_lte?: string
    customer_id?: string
    order_id?: string
  }
}

export interface GetInvoiceDetailRequest {
  id: number
}

export type DeleteInvoicesRequest = {
  ids: number[]
}

export type DeleteInvoicesResponse = ApiResponse<Invoice>

export type GetInvoicesListResponse = ApiResponseList<Invoice>

export type GetInvoiceDetailResponse = ApiResponse<Invoice>

export type DeleteInvoiceResponse = ApiResponse<Invoice>
