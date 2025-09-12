export interface UserData {
  id: number
  avatar: string
  review: string
  name: string
  quantity: number
  date: string
  price: number
}

export interface FilterItem<T> {
  label: string
  key: keyof T
  isChecked: boolean
}

export interface FilterQuery {
  field: string
  value: string
}

export interface SelectOptionItem {
  label: string
  value: string | number
}
export interface SelectFilterItem {
  label: string
  value: string | number | Object
}

export interface QuerySaveType {
  name: string
  value: any
  id: number
}

export enum SORT {
  DESC = 'DESC',
  ASC = 'ASC'
}

export interface UrlQuery<T> {
  displayedFilters?: { [key in keyof T]?: boolean }
  filter: { [key in keyof T]?: T[key] }
  order: SORT
  page: number
  perPage: number
  sort: keyof T
}

export interface IPagination {
  page: number
  perPage: number
}

export interface ApiResponseList<T> {
  data: T[]
  total: number
  page: number
  perPage: number
}

export interface ApiResponse<T> {
  data: T
}
