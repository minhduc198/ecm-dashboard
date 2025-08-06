import { useState, useCallback, useMemo } from 'react'
import DashboardIcon from '@mui/icons-material/Dashboard'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import CollectionsIcon from '@mui/icons-material/Collections'
import PeopleIcon from '@mui/icons-material/People'
import CommentIcon from '@mui/icons-material/Comment'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'
import { ReactRouterAppProvider } from '@toolpad/core/react-router'
import { Outlet, useNavigate } from 'react-router'
import { type Navigation, type Session } from '@toolpad/core/AppProvider'
import { SessionContext } from '@/contexts/SessionContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
export const queryClient = new QueryClient()

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Menu items'
  },
  {
    title: 'Dashboard',
    icon: <DashboardIcon />
  },
  {
    segment: '',
    title: 'Sales',
    icon: <AttachMoneyIcon />,
    children: [
      {
        segment: 'orders',
        title: 'Orders',
        icon: <AttachMoneyIcon />
      },
      {
        segment: 'invoices',
        title: 'Invoices',
        icon: <LibraryBooksIcon />
      }
    ]
  },
  {
    segment: 'catalog',
    title: 'Catalog',
    icon: <CollectionsIcon />
  },
  {
    segment: 'customers',
    title: 'Customers',
    icon: <PeopleIcon />
  },
  {
    segment: 'reviews',
    title: 'Reviews',
    icon: <CommentIcon />
  }
]

const BRANDING = {
  title: 'Admin Dashboard'
}

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const navigate = useNavigate()

  const signIn = useCallback(() => {
    navigate('/sign-in')
  }, [navigate])

  const signOut = useCallback(() => {
    setSession(null)
    navigate('/sign-in')
  }, [navigate])

  const sessionContextValue = useMemo(() => ({ session, setSession }), [session, setSession])

  return (
    <SessionContext.Provider value={sessionContextValue}>
      <QueryClientProvider client={queryClient}>
        <ReactRouterAppProvider
          navigation={NAVIGATION}
          branding={BRANDING}
          session={session}
          authentication={{ signIn, signOut }}
        >
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Outlet />
          </LocalizationProvider>
        </ReactRouterAppProvider>
      </QueryClientProvider>
    </SessionContext.Provider>
  )
}
