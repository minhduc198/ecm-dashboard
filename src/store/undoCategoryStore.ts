import { UpdateCategoryRequest } from '@/features/categories/types'
import { Category } from '@/services/data-generator'
import { UndoStore } from '@/types/undoStore'
import { create } from 'zustand'

export type UndoStoreCategory = UndoStore<Category> & {
  dataPending: UpdateCategoryRequest
  setDataPending: (data: UpdateCategoryRequest) => void
}

export const useUndoCategoryStore = create<UndoStoreCategory>((set) => ({
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
  dataPending: {} as UpdateCategoryRequest,
  setDataPending: (data: UpdateCategoryRequest) => set({ dataPending: data })
}))
