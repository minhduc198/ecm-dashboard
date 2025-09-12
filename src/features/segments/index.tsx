import PeopleIcon from '@mui/icons-material/People'
import { Box, Button, styled } from '@mui/material'
import { segmentsOptions } from '../customers/constant'
import { getCustomerListParamsFormLS, saveCustomerListParamsToLS } from '@/utils/customers'
import { useNavigate } from 'react-router'
import { path } from '@/routers/path'

const SegmentBox = styled(Box)({
  border: '1px solid rgba(0,0,0, 0.1)',
  borderRadius: '10px',
  paddingBlock: '6px'
})

const Segments = () => {
  const navigate = useNavigate()
  const customerParamFromLS = getCustomerListParamsFormLS()
  const handleFilterSegments = (nameFilter: string) => {
    saveCustomerListParamsToLS({
      ...customerParamFromLS,
      filter: {
        ...customerParamFromLS.filter,
        groups: nameFilter
      }
    })
    navigate(path.customers)
  }

  return (
    <SegmentBox>
      <Box
        sx={{
          fontWeight: 500,
          fontSize: '14px',
          pb: '6px',
          pl: '16px',
          borderBottom: '1px solid rgba(0,0,0, 0.1)'
        }}
      >
        Name
      </Box>
      {segmentsOptions.map((opt, idx) => (
        <Box
          key={opt.label}
          sx={{
            display: 'flex',
            alignItems: 'center',
            pt: '16px',
            pb: `${idx === segmentsOptions.length - 1 ? '6px' : '16px'}`,
            pl: '16px',
            borderBottom: `${idx === segmentsOptions.length - 1 ? '' : '1px solid rgba(0,0,0, 0.1)'}`
          }}
        >
          <Box
            sx={{
              minWidth: '100px',
              fontSize: '14px'
            }}
          >
            {opt.label}
          </Box>
          <Button
            onClick={() => handleFilterSegments(String(opt.value))}
            variant='text'
            startIcon={<PeopleIcon sx={{ width: 14, height: 14 }} color='primary' />}
            sx={{ marginInline: 'auto', fontSize: 14, fontWeight: 500 }}
          >
            CUSTOMER
          </Button>
        </Box>
      ))}
    </SegmentBox>
  )
}

export default Segments
