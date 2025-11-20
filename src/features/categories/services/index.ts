import { Category } from '@/services/data-generator'
import { baseDataProvider } from '@/services/dataProvider'
import {
  GetCategoriesListResponse,
  GetCategoryDetailRequest,
  GetCategoryDetailResponse,
  UpdateCategoryRequest
} from '../types'

export class CategoriesService {
  static async getCategoriesList(): Promise<GetCategoriesListResponse> {
    try {
      const response = await baseDataProvider.getList('categories', {
        pagination: { page: 1, perPage: 999 },
        sort: {
          field: 'id',
          order: 'ASC'
        }
      })
      return {
        data: response.data as Category[]
      }
    } catch (error) {
      throw new Error('Lỗi khi get category')
    }
  }

  static async deleteCategory(id: number) {
    try {
      const currentData = await baseDataProvider.getOne('categories', { id })

      const response = await baseDataProvider.delete('categories', {
        id,
        previousData: currentData.data
      })

      return {
        data: response.data as Category
      }
    } catch (error) {
      throw new Error(`Lỗi khi xóa category ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  static async updateCategory(params: UpdateCategoryRequest) {
    try {
      const currentData = await baseDataProvider.getOne('categories', { id: params.id })

      const response = await baseDataProvider.update('categories', {
        id: params.id,
        data: params.data,
        previousData: currentData.data
      })

      return {
        data: response.data as Category
      }
    } catch (error) {
      throw new Error(
        `Lỗi khi cập nhật category ${params.id}: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  static async getCategoryDetail(params: GetCategoryDetailRequest): Promise<GetCategoryDetailResponse> {
    try {
      const response = await baseDataProvider.getOne('categories', { id: params.id })

      return {
        data: response.data as Category
      }
    } catch (error) {
      throw new Error(
        `Lỗi khi lấy chi tiết category ${params.id}: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }
}

export const fetchCategoriesList = () => CategoriesService.getCategoriesList()
export const fetchCategoryDetail = (params: GetCategoryDetailRequest) => CategoriesService.getCategoryDetail(params)
export const deleteCategory = (id: number) => CategoriesService.deleteCategory(id)
export const updateCategory = (params: UpdateCategoryRequest) => CategoriesService.updateCategory(params)
