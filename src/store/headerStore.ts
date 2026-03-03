import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type IHeaderData = {
  avatar?: string
  title: string
}

type HeaderTitleStore = {
  headerData: IHeaderData
  setHeaderData: (data: IHeaderData) => void
}

export const useHeaderTitleStore = create<HeaderTitleStore>()(
  persist(
    (set) => ({
      headerData: {
        avatar: '',
        title: ''
      },

      setHeaderData: (data) =>
        set({
          headerData: data
        })
    }),
    {
      name: 'HeaderStore'
    }
  )
)
