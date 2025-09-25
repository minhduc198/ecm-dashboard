import { OrderParams } from '@/features/orders/types'
import { UrlQuery } from '@/types'
import { create } from 'zustand'

type OderStoreType = Pick<UrlQuery<OrderParams>, 'displayedFilters' | 'filter'>

type OrderStore = {
  setOrderStore: (data: OderStoreType) => void
} & OderStoreType

export const useOrderStore = create<OrderStore>()((set) => ({
  displayedFilters: {},
  filter: {},

  setOrderStore: (value: OderStoreType) =>
    set({
      filter: value.filter,
      displayedFilters: value.displayedFilters
    })
}))
