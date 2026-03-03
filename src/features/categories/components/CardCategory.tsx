import { path } from '@/routers/path'
import { Category } from '@/services/data-generator'
import { useHeaderTitleStore } from '@/store/headerStore'
import { getProductListParamsFormLS, saveProductListParamsToLS } from '@/utils/products'
import CollectionsIcon from '@mui/icons-material/Collections'
import EditIcon from '@mui/icons-material/Edit'
import { Box, Button } from '@mui/material'
import { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

interface Props {
  t: TFunction<readonly ['common', 'product', 'category'], undefined>
  category: Category
}

export default function CardCategory({ t, category }: Props) {
  const { setHeaderData } = useHeaderTitleStore()

  const navigate = useNavigate()
  const customerParamFromLS = getProductListParamsFormLS()

  const handleFilterCategories = (category_id: string) => {
    saveProductListParamsToLS({
      ...customerParamFromLS,
      filter: {
        ...customerParamFromLS.filter,
        category_id
      }
    })
    navigate(path.products)
  }

  const handleNavigateDetailCategory = (category_id: number) => {
    setHeaderData({ title: `Category ${category.name}` })
    navigate(`${path.categories}/${category_id}`)
  }

  return (
    <Box
      sx={{
        height: '246px',
        border: '1px solid #e0e0e0',
        borderRadius: '10px',
        overflow: 'hidden'
      }}
    >
      <Box sx={{ height: '140px' }}>
        <img src={category.image} />
      </Box>
      <Box sx={{ fontSize: '24px', mt: 2, textAlign: 'center' }}>
        {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
      </Box>
      <Box sx={{ mt: '20px', mb: '12px', ml: '16px', display: 'flex', gap: 2 }}>
        <Button
          sx={{
            fontWeight: 500,
            fontSize: '13px',
            padding: '0 !important',
            '& .MuiButton-startIcon > *:nth-of-type(1)': {
              fontSize: '12px !important'
            }
          }}
          startIcon={<CollectionsIcon />}
          onClick={() => handleFilterCategories(String(category.id))}
        >
          {t('category:product')}
        </Button>

        <Button
          sx={{
            fontWeight: 500,
            fontSize: '13px',
            padding: '0 !important',
            '& .MuiButton-startIcon > *:nth-of-type(1)': {
              fontSize: '14px !important'
            }
          }}
          startIcon={<EditIcon />}
          onClick={() => handleNavigateDetailCategory(category.id)}
        >
          {t('category:edit')}
        </Button>
      </Box>
    </Box>
  )
}
