import { Product } from '@/features/products/types'
import { Review } from '@/services/data-generator'
import { UndoStore } from '@/types/undoStore'
import { create } from 'zustand'

export type IReviewStore = UndoStore<Review> & {
  createMessageSuccess: string
  setCreateMessageSuccess: (message: string) => void
}

export const useUndoReviewStore = create<IReviewStore>((set) => ({
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
  createMessageSuccess: '',
  setCreateMessageSuccess: (message) => set({ createMessageSuccess: message })
}))
