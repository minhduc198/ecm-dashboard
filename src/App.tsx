import { SessionContext } from '@/contexts/SessionContext'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import CollectionsIcon from '@mui/icons-material/Collections'
import CommentIcon from '@mui/icons-material/Comment'
import DashboardIcon from '@mui/icons-material/Dashboard'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'
import PeopleIcon from '@mui/icons-material/People'
import LabelIcon from '@mui/icons-material/Label'
import { Avatar, Box, createTheme } from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type Navigation, type Session } from '@toolpad/core/AppProvider'
import { ReactRouterAppProvider } from '@toolpad/core/react-router'
import { useCallback, useMemo, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router'
import { useHeaderTitleStore } from './store/headerStore'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import { path as pathConfig } from './routers/path'
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
})

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
    segment: '',
    title: 'Catalog',
    icon: <CollectionsIcon />,
    children: [
      {
        segment: 'products',
        title: 'Posters',
        icon: <CollectionsIcon />
      },

      {
        segment: 'categories',
        title: 'Categories',
        icon: <BookmarkIcon />
      }
    ]
  },
  {
    segment: '',
    title: 'Customers',
    icon: <PeopleIcon />,
    children: [
      { segment: 'customers', title: 'Customers', icon: <PeopleIcon /> },
      { segment: 'segments', title: 'Segments', icon: <LabelIcon /> }
    ]
  },
  {
    segment: 'reviews',
    title: 'Reviews',
    icon: <CommentIcon />
  }
]

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { headerData } = useHeaderTitleStore()

  const signIn = useCallback(() => {
    navigate('/sign-in')
  }, [navigate])

  const signOut = useCallback(() => {
    setSession(null)
    navigate('/sign-in')
  }, [navigate])

  const sessionContextValue = useMemo(() => ({ session, setSession }), [session, setSession])

  const BRANDING = useMemo(() => {
    const paths = location.pathname.split('/').filter(Boolean)

    if (!paths.length) {
      return { title: '' }
    }

    if (paths.length === 1 || paths[0] === 'reviews') {
      const title = paths[0].charAt(0).toUpperCase() + paths[0].slice(1)
      return {
        title
      }
    }

    if (headerData.avatar) {
      return {
        logo: <Avatar sx={{ width: 32, height: 32 }} src={headerData.avatar} />,
        title: headerData.title ?? ''
      }
    }

    return {
      title: headerData.title
    }
  }, [location.pathname, headerData])

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
