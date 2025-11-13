import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type DrawerStore = {
  openDrawer: boolean
  setOpenDrawer: (isOpen: boolean) => void
  getById?: string
  setGetById?: (id: string) => void
}

export const useDrawerStore = create<DrawerStore>()(
  persist(
    (set) => ({
      openDrawer: false,
      setOpenDrawer: (isOpen) =>
        set({
          openDrawer: isOpen
        }),
      getById: '',
      setGetById: (id) => set({ getById: id })
    }),
    {
      name: 'DrawerStore'
    }
  )
)
