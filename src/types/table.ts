export interface TableColumns<T> {
  disablePadding?: boolean
  id: keyof T
  label: string
  numeric?: boolean
}
