import { Customer } from '@/services/data-generator'
import { UndoStore } from '@/types/undoStore'
import React from 'react'
import { create } from 'zustand'

export const useUndoCustomerStore = create<UndoStore<Customer>>((set) => ({
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
