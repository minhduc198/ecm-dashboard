import { SessionContext } from '@/contexts/SessionContext'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import CollectionsIcon from '@mui/icons-material/Collections'
import CommentIcon from '@mui/icons-material/Comment'
import DashboardIcon from '@mui/icons-material/Dashboard'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'
import PeopleIcon from '@mui/icons-material/People'
import LabelIcon from '@mui/icons-material/Label'
import { Avatar, Box, createTheme, MenuItem, Select, SelectChangeEvent } from '@mui/material'
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
import { useTranslation } from 'react-i18next'
import { title } from 'process'
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
})

export default function App() {
  const { t } = useTranslation('sidebar')
  const [session, setSession] = useState<Session | null>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { headerData } = useHeaderTitleStore()

  const NAVIGATION: Navigation = [
    {
      kind: 'header',
      title: t('menu_items')
    },
    {
      title: t('dashboard'),
      icon: <DashboardIcon />
    },
    {
      segment: '',
      title: t('sales'),
      icon: <AttachMoneyIcon />,
      children: [
        {
          segment: 'orders',
          title: t('orders'),
          icon: <AttachMoneyIcon />
        },
        {
          segment: 'invoices',
          title: t('invoices'),
          icon: <LibraryBooksIcon />
        }
      ]
    },
    {
      segment: '',
      title: t('catalog'),
      icon: <CollectionsIcon />,
      children: [
        {
          segment: 'products',
          title: t('posters'),
          icon: <CollectionsIcon />
        },

        {
          segment: 'categories',
          title: t('categories'),
          icon: <BookmarkIcon />
        }
      ]
    },
    {
      segment: '',
      title: t('customers'),
      icon: <PeopleIcon />,
      children: [
        { segment: 'customers', title: t('customers'), icon: <PeopleIcon /> },
        { segment: 'segments', title: t('segments'), icon: <LabelIcon /> }
      ]
    },
    {
      segment: 'reviews',
      title: t('reviews'),
      icon: <CommentIcon />
    }
  ]

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
      return {
        title: t(paths[0])
      }
    }

    if (paths.length === 1 && paths[0] === 'products') {
      return {
        title: t('products')
      }
    }

    if (headerData.avatar) {
      return {
        logo: <Avatar sx={{ width: 32, height: 32 }} src={headerData.avatar} />,
        title: headerData.title ?? ''
      }
    }

    const [a, ...b] = headerData.title.split(' ')
    return {
      title: `${t(a.toLowerCase())} ${[...b].join(' ')}`
    }
  }, [location.pathname, headerData, t])

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
