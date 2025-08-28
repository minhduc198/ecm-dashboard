import { Order } from '@/services/data-generator'
import { UndoStore } from '@/types/undoStore'
import { create } from 'zustand'

export const useUndoOrderStore = create<UndoStore<Order>>((set) => ({
  isOpenUndo: false,
  setIsOpenUndo: (value) => set({ isOpenUndo: value }),
  temporaryData: [],
  setTemporaryData: (data) => set({ temporaryData: data }),
  timerId: null,
  setTimerId: (timer) =>
    set({
      timerId: timer
    })
}))
