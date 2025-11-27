import { IProfile } from '@/features/auth/types'
import { createContext, Dispatch, SetStateAction, useState, ReactNode, useEffect } from 'react'

type AppContextType = {
  isAuthenticated: boolean
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>
  user: IProfile | null
  setUser: Dispatch<SetStateAction<IProfile | null>>
}

const initialState = {
  isAuthenticated: !!localStorage.getItem('access_token'),
  setIsAuthenticated: () => {},
  user: null,
  setUser: () => {}
}

export const AppContext = createContext<AppContextType>(initialState)

export default function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IProfile | null>(initialState.user)
  const [isAuthenticated, setIsAuthenticated] = useState(initialState.isAuthenticated)

  useEffect(() => {
    window.addEventListener('clearLS', () => {
      setIsAuthenticated(false)
    })
  }, [])

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
