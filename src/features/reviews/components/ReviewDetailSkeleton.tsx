import { Box, Skeleton } from '@mui/material'

export default function ReviewDetailSkeleton() {
  return (
    <Box sx={{ height: '100vh', width: '100%', mt: '64px', padding: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Skeleton variant='text' width={160} height={32} />
        <Skeleton variant='circular' width={32} height={32} />
      </Box>

      <Box sx={{ mt: 2, display: 'flex', alignItems: 'start', gap: 4 }}>
        <Box sx={{ width: '150px' }}>
          <Skeleton variant='text' width={80} height={18} />
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1 }}>
            <Skeleton variant='circular' width={25} height={25} />
            <Skeleton variant='text' width={100} height={20} />
          </Box>
        </Box>

        <Box>
          <Skeleton variant='text' width={60} height={18} />
          <Skeleton variant='text' width={120} height={20} />
        </Box>
      </Box>

      <Box sx={{ mt: 2, display: 'flex', alignItems: 'start', gap: 4 }}>
        <Box sx={{ width: '150px' }}>
          <Skeleton variant='text' width={60} height={18} />
          <Skeleton variant='text' width={80} height={20} />
        </Box>

        <Box>
          <Skeleton variant='text' width={60} height={18} />
          <Skeleton variant='rectangular' width={100} height={24} />
        </Box>
      </Box>

      <Skeleton variant='rectangular' width='100%' height={368} sx={{ mt: 2, borderRadius: '6px' }} />

      <Box sx={{ mt: '24px', display: 'flex', justifyContent: 'space-between' }}>
        <Skeleton variant='rectangular' width={120} height={40} sx={{ borderRadius: '10px' }} />
        <Skeleton variant='rectangular' width={120} height={40} sx={{ borderRadius: '10px' }} />
      </Box>
    </Box>
  )
}
