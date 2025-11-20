import DetailReview from '@/features/reviews/detail'
import { path as pathConfig } from '@/routers/path'
import { useDrawerStore } from '@/store/drawerStore'
import { useHeaderTitleStore } from '@/store/headerStore'
import { Box, Drawer, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { DashboardLayout } from '@toolpad/core/DashboardLayout'
import { PageContainer } from '@toolpad/core/PageContainer'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation, useParams } from 'react-router'
import LanguageIcon from '@mui/icons-material/Language'

function Language() {
  const { i18n } = useTranslation('dashboard')
  const handleChange = (event: SelectChangeEvent) => {
    i18n.changeLanguage(event.target.value)
  }
  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      <LanguageIcon />
      <Select
        variant='standard'
        value={i18n.language || 'en'}
        onChange={handleChange}
        size='small'
        sx={{ minWidth: 120 }}
      >
        <MenuItem value='en'>English</MenuItem>
        <MenuItem value='vi'>Vietnamese</MenuItem>
        <MenuItem value='fr'>French</MenuItem>
      </Select>
    </Box>
  )
}

export default function Layout() {
  // const { session } = useSession()
  // const location = useLocation()

  // if (!session) {
  //   // Add the `callbackUrl` search parameter
  //   const redirectTo = `/sign-in?callbackUrl=${encodeURIComponent(location.pathname)}`

  //   return <Navigate to={redirectTo} replace />
  // }
  const { openDrawer } = useDrawerStore()
  const { headerData } = useHeaderTitleStore()
  const params: { [key: string]: string | undefined } = useParams()
  delete params.tab
  const paramIds = Object.values(params)
  const location = useLocation()
  const pathName = location.pathname

  let breadcrumbStr = pathName
  let headerTitle = ''

  if (pathName.includes(pathConfig.customers) || pathName.includes(pathConfig.reviews)) {
    headerTitle = headerData.title
  } else {
    const [_, ...title] = headerData.title.split(' ')
    headerTitle = [...title].join(' ').replaceAll('"', '')
  }

  if (paramIds.length > 0) {
    paramIds.forEach((i) => (breadcrumbStr = breadcrumbStr.replace(i || '', headerTitle)))
  }

  const pathNameArr = pathName.split('/')
  const breadcrumbArr = breadcrumbStr.split('/')

  const breadcrumbs = ['/', ...pathNameArr].filter(Boolean).map((p, index) => {
    if (p === '/') {
      return { title: 'Home', path: pathConfig.home }
    }

    return {
      title: breadcrumbArr[index].charAt(0).toUpperCase() + breadcrumbArr[index].slice(1),
      path: pathNameArr.slice(0, index + 1).join('/')
    }
  })

  const isOpenDrawer = useMemo(() => {
    if (pathName.includes(`${pathConfig.reviews}/`) && openDrawer) {
      return true
    } else {
      return false
    }
  }, [pathName, openDrawer])

  return (
    <DashboardLayout
      slots={{
        toolbarAccount: Language
      }}
    >
      <PageContainer
        sx={{
          maxWidth: `${isOpenDrawer ? 'calc(100% - 400px) !important' : '100% !important'} `,
          margin: '0px !important'
        }}
        title=''
        breadcrumbs={breadcrumbs}
      >
        <Outlet />
      </PageContainer>
      <Drawer
        sx={{
          width: '400px',
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: '400px'
          }
        }}
        variant='persistent'
        anchor='right'
        open={isOpenDrawer}
      >
        <DetailReview />
      </Drawer>
    </DashboardLayout>
  )
}
