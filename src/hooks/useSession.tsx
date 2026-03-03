import { SessionContext } from '@/contexts/SessionContext'
import React from 'react'

export function useSession() {
  return React.useContext(SessionContext)
}
