import { Product } from '@/features/products/types'
import { Category } from '@/services/data-generator'
import { ApiResponse, ApiResponseList } from '@/types'
import { TableColumns } from '@/types/table'

export type GetCategoriesListResponse = ApiResponse<Category[]>

export interface UpdateCategoryRequest {
  id: number | null
  data: Partial<Omit<Category, 'id'>>
}

export type GetCategoryDetailRequest = {
  id: number
}

export type GetCategoryDetailResponse = ApiResponse<Category>
