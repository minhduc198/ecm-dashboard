import { DEFAULT_PAGE, DEFAULT_PER_PAGE } from '@/constants'
import { Customer } from '@/services/data-generator'
import { baseDataProvider } from '@/services/dataProvider'
import { CustomerListResponse, GetCustomerDetailRequest, GetCustomerDetailResponse, GetCustomerListReq } from '../types'

export class CustomerService {
  static async getCustomersList(params: Partial<GetCustomerListReq>): Promise<CustomerListResponse> {
    const pagination = {
      page: params.page || DEFAULT_PAGE + 1,
      perPage: params.perPage || 25
    }

    try {
      const response = await baseDataProvider.getList('customers', {
        pagination,
        sort: {
          field: params.sort || 'id',
          order: params.order || 'ASC'
        },
        filter: params.filter ?? {}
      })

      console.log('response', response)

      return {
        ...pagination,
        data: response.data,
        total: response.total || 0
      }
    } catch (error) {
      throw new Error(`Lỗi khi lấy danh sách customer: ${error instanceof Error ? error.message : 'Unknown error'}`)
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
}

export const fetchCustomersList = (params: Partial<GetCustomerListReq>) => CustomerService.getCustomersList(params)
export const fetchCustomerDetail = (params: GetCustomerDetailRequest) => CustomerService.getCustomerDetail(params)
