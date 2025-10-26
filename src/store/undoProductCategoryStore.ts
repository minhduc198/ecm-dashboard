import { Product } from '@/features/products/types'
import { UndoStore } from '@/types/undoStore'
import { create } from 'zustand'

export const useUndoProductCategoryStore = create<UndoStore<Product>>((set) => ({
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
  setAction: (action) => set({ action })
}))
