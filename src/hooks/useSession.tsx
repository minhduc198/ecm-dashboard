import { SessionContext } from '@toolpad/core/AppProvider'
import React from 'react'

export function useSession() {
  return React.useContext(SessionContext)
}
