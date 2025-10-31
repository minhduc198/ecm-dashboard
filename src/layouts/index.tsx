import * as React from 'react'
import { Outlet, Navigate, useLocation } from 'react-router'
import { DashboardLayout } from '@toolpad/core/DashboardLayout'
import { PageContainer } from '@toolpad/core/PageContainer'
import { useSession } from '@/hooks/useSession'
import { Box } from '@mui/material'
import DetailReview from '@/features/reviews/detail'

export default function Layout() {
  // const { session } = useSession()
  // const location = useLocation()

  // if (!session) {
  //   // Add the `callbackUrl` search parameter
  //   const redirectTo = `/sign-in?callbackUrl=${encodeURIComponent(location.pathname)}`

  //   return <Navigate to={redirectTo} replace />
  // }

  return (
    <DashboardLayout>
      <PageContainer sx={{ maxWidth: '100% !important', position: 'relative' }}>
        <Box sx={{ display: 'flex' }}>
          <Box sx={{ flexGrow: 1 }}>
            <Outlet />
          </Box>
          {/* <Box sx={{}}>
            <DetailReview />
          </Box> */}
        </Box>
      </PageContainer>
    </DashboardLayout>
  )
}
