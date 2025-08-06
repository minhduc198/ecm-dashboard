import { Order } from '@/services/data-generator'
import { create } from 'zustand'

interface UndoStore {
  isOpenUndo: boolean
  setIsOpenUndo: (value: boolean) => void
  temporaryData: Order[]
  setTemporaryData: (data: Order[]) => void
  timerId: NodeJS.Timeout | null
  setTimerId: (timer: NodeJS.Timeout | null) => void
}

export const useUndoStore = create<UndoStore>((set) => ({
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
