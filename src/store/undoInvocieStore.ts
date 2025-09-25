import { Invoice, Order } from '@/services/data-generator'
import { UndoStore } from '@/types/undoStore'
import { create } from 'zustand'

export const useUndoInvoiceStore = create<UndoStore<Invoice>>((set) => ({
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
