import { Box, Skeleton } from '@mui/material'

const TabImageSkeleton = () => {
  return (
    <Box>
      <Box sx={{ width: '320px', height: '240px', borderRadius: '10px', overflow: 'hidden' }}>
        <Skeleton variant='rectangular' width='100%' height='100%' />
      </Box>

      <Skeleton variant='rectangular' width={640} height={56} sx={{ mt: 1, borderRadius: '8px' }} />
      <Skeleton variant='rectangular' width={640} height={56} sx={{ mt: 3, mb: 2, borderRadius: '8px' }} />
    </Box>
  )
}

export default TabImageSkeleton
