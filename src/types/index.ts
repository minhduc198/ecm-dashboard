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

export interface ColumnItem {
  id: string
  label: string
  value: string
  isVisible: boolean
  numeric: boolean
  disablePadding: boolean
}

export interface SelectOptionItem {
  label: string
  value: string
}

export interface QuerySaveType {
  name: string
  value: any
  id: number
}

export interface UrlQuery<T> {
  displayedFilters: { [key in keyof T]?: boolean }
  filter: { [key in keyof T]?: T[key] }
}
