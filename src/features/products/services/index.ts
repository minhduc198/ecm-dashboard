import { baseDataProvider } from '@/services/dataProvider'
import { SORT } from '@/types'
import { DEFAULT_PER_PAGE_PRODUCT } from '../constant'
import { GetProductListRequest, GetProductsListResponse, Product } from '../types'
import { DEFAULT_PER_PAGE_CUSTOMER } from '@/features/customers/constant'
import { DEFAULT_PAGE } from '@/constants'

export class ProductService {
  static async getProductList(params: GetProductListRequest): Promise<GetProductsListResponse> {
    const pagination = params.pagination

    try {
      const response = await baseDataProvider.getList('products', {
        pagination,
        sort: params.sort ?? { field: 'reference', order: SORT.DESC },
        filter: params.filter ?? {}
      })

      return {
        ...(pagination ?? { page: DEFAULT_PAGE, perPage: DEFAULT_PER_PAGE_PRODUCT }),
        data: response.data as Product[],
        total: response.total || 0
      }
    } catch (error) {
      throw new Error(`Lỗi khi lấy danh sách products: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}

export const fetchProductsList = (params: GetProductListRequest) => ProductService.getProductList(params)
