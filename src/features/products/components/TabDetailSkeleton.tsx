import { Box, Skeleton } from '@mui/material'
import React from 'react'

const TabDetailSkeleton = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '30px', mb: '20px' }}>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <Skeleton variant='rectangular' width={420} height={56} sx={{ borderRadius: '8px' }} />
        <Skeleton variant='rectangular' width={203} height={56} sx={{ borderRadius: '8px' }} />
      </Box>

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <Skeleton variant='rectangular' width={203} height={56} sx={{ borderRadius: '8px' }} />
        <Skeleton variant='rectangular' width={203} height={56} sx={{ borderRadius: '8px' }} />
      </Box>

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <Skeleton variant='rectangular' width={203} height={56} sx={{ borderRadius: '8px' }} />
        <Skeleton variant='rectangular' width={203} height={56} sx={{ borderRadius: '8px' }} />
        <Skeleton variant='rectangular' width={203} height={56} sx={{ borderRadius: '8px' }} />
      </Box>
    </Box>
  )
}

export default TabDetailSkeleton
