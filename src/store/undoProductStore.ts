import { Product, UpdateProductRequest } from '@/features/products/types'
import { UndoStore } from '@/types/undoStore'
import { create } from 'zustand'

export type UndoStoreProduct = UndoStore<Product> & {
  dataPending: UpdateProductRequest
  setDataPending: (data: UpdateProductRequest) => void
}

export const useUndoProductStore = create<UndoStoreProduct>((set) => ({
  isOpenUndo: false,
  setIsOpenUndo: (value) => set({ isOpenUndo: value }),
  tmpUndoData: [],
  setTmpUndoData: (data) => set({ tmpUndoData: data }),
  timerId: null,
  setTimerId: (timer) =>
    set({
      timerId: timer
    }),
  action: '',
  setAction: (action) => set({ action }),
  dataPending: {} as UpdateProductRequest,
  setDataPending: (data: UpdateProductRequest) => set({ dataPending: data })
}))
