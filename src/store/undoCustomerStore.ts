import { UpdateCustomerRequest } from '@/features/customers/types'
import { Customer } from '@/services/data-generator'
import { UndoStore } from '@/types/undoStore'
import { create } from 'zustand'

type UndoStoreCustomer = UndoStore<Customer> & {
  dataPending: UpdateCustomerRequest
  setDataPending: (data: UpdateCustomerRequest) => void
}

export const useUndoCustomerStore = create<UndoStoreCustomer>((set) => ({
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
  setAction: (message: string) => set({ action: message }),
  dataPending: {} as UpdateCustomerRequest,
  setDataPending: (data) => set({ dataPending: data })
}))
