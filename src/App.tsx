import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import CollectionsIcon from '@mui/icons-material/Collections'
import CommentIcon from '@mui/icons-material/Comment'
import DashboardIcon from '@mui/icons-material/Dashboard'
import LabelIcon from '@mui/icons-material/Label'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'
import PeopleIcon from '@mui/icons-material/People'
import { Avatar } from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type Navigation } from '@toolpad/core/AppProvider'
import { ReactRouterAppProvider } from '@toolpad/core/react-router'
import { SnackbarProvider } from 'notistack'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation } from 'react-router'
import AppProvider from './contexts/AppContext'
import { useHeaderTitleStore } from './store/headerStore'
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
})

export default function App() {
  const { t } = useTranslation('sidebar')
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

    const [title, ...content] = headerData.title.split(' ')
    return {
      title: `${t(title.toLowerCase())} ${[...content].join(' ')}`
    }
  }, [location.pathname, headerData, t])

  return (
    <AppProvider>
      <QueryClientProvider client={queryClient}>
        <ReactRouterAppProvider navigation={NAVIGATION} branding={BRANDING}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <SnackbarProvider maxSnack={1}>
              <Outlet />
            </SnackbarProvider>
          </LocalizationProvider>
        </ReactRouterAppProvider>
      </QueryClientProvider>
    </AppProvider>
  )
}
