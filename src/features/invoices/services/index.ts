import { DEFAULT_PAGE } from '@/constants'
import { Invoice } from '@/services/data-generator'
import { baseDataProvider } from '@/services/dataProvider'
import { SORT } from '@/types'
import { DEFAULT_PER_PAGE_INVOICE } from '../constant'
import {
  DeleteInvoicesRequest,
  GetInvoiceDetailRequest,
  GetInvoiceDetailResponse,
  GetInvoicesListRequest,
  GetInvoicesListResponse
} from '../types'

export class InvoicesService {
  static async getInvoicesList(params: GetInvoicesListRequest): Promise<GetInvoicesListResponse> {
    const pagination = params.pagination
    try {
      const response = await baseDataProvider.getList('invoices', {
        pagination,
        sort: params.sort ?? { field: 'id', order: SORT.DESC },
        filter: params.filter ?? {}
      })

      return {
        ...(pagination ?? { page: DEFAULT_PAGE, perPage: DEFAULT_PER_PAGE_INVOICE }),
        data: response.data as Invoice[],
        total: response.total || 0
      }
    } catch (error) {
      throw new Error(`Lỗi khi lấy danh sách invoices: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  static async getInvoiceDetail(params: GetInvoiceDetailRequest): Promise<GetInvoiceDetailResponse> {
    try {
      const response = await baseDataProvider.getOne('orders', { id: params.id })

      return {
        data: response.data as Invoice
      }
    } catch (error) {
      throw new Error(
        `Lỗi khi lấy chi tiết invoice ${params.id}: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  static async deleteInvoices(params: DeleteInvoicesRequest): Promise<null> {
    try {
      const response = await baseDataProvider.deleteMany('invoices', {
        ids: params.ids
      })

      return null
    } catch (error) {
      throw new Error(`Lỗi khi xóa customer ${params.ids}: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}

export const fetchInvoicesList = (params: GetInvoicesListRequest) => InvoicesService.getInvoicesList(params)

export const fetchInvoiceDetail = (params: GetInvoiceDetailRequest) => InvoicesService.getInvoiceDetail(params)

export const deleteInvoices = (ids: DeleteInvoicesRequest) => InvoicesService.deleteInvoices(ids)
