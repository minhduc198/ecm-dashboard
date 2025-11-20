import { DEFAULT_PAGE } from '@/constants'
import { baseDataProvider } from '@/services/dataProvider'
import { SORT } from '@/types'
import { DEFAULT_PER_PAGE_PRODUCT } from '../constant'
import {
  CreateProductRequest,
  DeleteProductsRequest,
  GetProductDetailRequest,
  GetProductDetailResponse,
  GetProductListRequest,
  GetProductsListResponse,
  Product,
  UpdateProductRequest,
  UpdateProductResponse
} from '../types'

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

  static async getProductDetail(params: GetProductDetailRequest): Promise<GetProductDetailResponse> {
    try {
      const response = await baseDataProvider.getOne('products', { id: params.id })

      return {
        data: response.data as Product
      }
    } catch (error) {
      throw new Error(
        `Lỗi khi lấy chi tiết product ${params.id}: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  static async deleteProducts(params: DeleteProductsRequest): Promise<null> {
    try {
      const response = await baseDataProvider.deleteMany('products', {
        ids: params.ids
      })

      return null
    } catch (error) {
      throw new Error(`Lỗi khi xóa products ${params.ids}: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  static async updateProduct(params: UpdateProductRequest): Promise<UpdateProductResponse> {
    try {
      const currentData = await baseDataProvider.getOne('products', { id: params.id })

      const response = await baseDataProvider.update('products', {
        id: params.id,
        data: params.data,
        previousData: currentData.data
      })

      return {
        data: response.data as Product
      }
    } catch (error) {
      throw new Error(
        `Lỗi khi cập nhật product ${params.id}: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  static async createProduct(params: CreateProductRequest): Promise<Product> {
    try {
      const response = await baseDataProvider.create('products', {
        data: params.data
      })

      return response.data as Product
    } catch (error) {
      throw new Error(`Lỗi khi tạo product: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}

export const fetchProductsList = (params: GetProductListRequest) => ProductService.getProductList(params)
export const fetchProductDetail = (params: GetProductDetailRequest) => ProductService.getProductDetail(params)
export const deleteProducts = (params: DeleteProductsRequest) => ProductService.deleteProducts(params)
export const updateProduct = (params: UpdateProductRequest) => ProductService.updateProduct(params)
export const createProduct = (params: CreateProductRequest) => ProductService.createProduct(params)
