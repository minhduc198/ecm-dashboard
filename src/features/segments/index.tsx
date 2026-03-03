import PeopleIcon from '@mui/icons-material/People'
import { Box, Button, styled } from '@mui/material'
import { segmentsOptions } from '../customers/constant'
import { getCustomerListParamsFormLS, saveCustomerListParamsToLS } from '@/utils/customers'
import { useNavigate } from 'react-router'
import { path } from '@/routers/path'
import { useTranslation } from 'react-i18next'

const SegmentBox = styled(Box)({
  border: '1px solid #e0e0e0',
  borderRadius: '10px',
  paddingBlock: '6px'
})

const Segments = () => {
  const { t } = useTranslation('customer')
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
          borderBottom: '1px solid #e0e0e0'
        }}
      >
        {t('name')}
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
            borderBottom: `${idx === segmentsOptions.length - 1 ? '' : '1px solid #e0e0e0'}`
          }}
        >
          <Box
            sx={{
              minWidth: '140px',
              fontSize: '14px'
            }}
          >
            {t(opt.label)}
          </Box>
          <Button
            onClick={() => handleFilterSegments(String(opt.value))}
            variant='text'
            startIcon={<PeopleIcon sx={{ width: 14, height: 14 }} color='primary' />}
            sx={{ marginInline: 'auto', fontSize: 14, fontWeight: 500 }}
          >
            {t('customer').toUpperCase()}
          </Button>
        </Box>
      ))}
    </SegmentBox>
  )
}

export default Segments
