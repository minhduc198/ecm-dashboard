import { Customer } from '@/services/data-generator'
import { baseDataProvider } from '@/services/dataProvider'
import { SORT } from '@/types'
import {
  CustomerListResponse,
  DeleteCustomersRequest,
  DeleteCustomersResponse,
  GetCustomerDetailRequest,
  GetCustomerDetailResponse,
  GetCustomersListRequest
} from '../types'

export class CustomerService {
  static async getCustomerList(params: GetCustomersListRequest): Promise<CustomerListResponse> {
    const pagination = params.pagination
    try {
      const response = await baseDataProvider.getList('customers', {
        pagination,
        sort: params.sort ?? { field: 'id', order: SORT.DESC },
        filter: params.filter ?? {}
      })

      return {
        ...(pagination ?? { page: 1, perPage: 25 }),
        data: response.data as Customer[],
        total: response.total || 0
      }
    } catch (error) {
      throw new Error(`Lỗi khi lấy danh sách customers: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  static async getCustomerDetail(params: GetCustomerDetailRequest): Promise<GetCustomerDetailResponse> {
    try {
      const response = await baseDataProvider.getOne('customers', { id: params.id })

      return {
        data: response.data as Customer
      }
    } catch (error) {
      throw new Error(
        `Lỗi khi lấy chi tiết customer ${params.id}: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  static async deleteCustomers(params: DeleteCustomersRequest): Promise<DeleteCustomersResponse> {
    try {
      const currentData = await baseDataProvider.getOne('customers', { id: params.ids })

      const response = await baseDataProvider.delete('customers', {
        id: params.ids,
        previousData: currentData.data
      })

      return {
        data: response.data as Customer
      }
    } catch (error) {
      throw new Error(`Lỗi khi xóa customer ${params.ids}: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}

export const fetchCustomersList = (params: GetCustomersListRequest) => CustomerService.getCustomerList(params)
export const fetchCustomerDetail = (params: GetCustomerDetailRequest) => CustomerService.getCustomerDetail(params)
export const deleteCustomers = (params: DeleteCustomersRequest) => CustomerService.deleteCustomers(params)
