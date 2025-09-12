import { baseDataProvider } from '@/services/dataProvider'
import { GetProductListReq, ProductListResponse } from '../types'
import { DEFAULT_PAGE, DEFAULT_PER_PAGE } from '@/constants'

export class ProductService {
  static async getProductList(params: Partial<GetProductListReq>): Promise<ProductListResponse> {
    const pagination = {
      page: params.page || DEFAULT_PAGE,
      perPage: params.perPage || DEFAULT_PER_PAGE
    }

    try {
      const response = await baseDataProvider.getList('products', {
        pagination,
        sort: {
          field: params.sort || 'id',
          order: params.order || 'ASC'
        },
        filter: params.filter ?? {}
      })

      return {
        ...pagination,
        data: response.data,
        total: response.total || 0
      }
    } catch (error) {
      throw new Error(`Lỗi khi lấy danh sách products: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}

export const fetchProductsList = (params: Partial<GetProductListReq>) => ProductService.getProductList(params)
