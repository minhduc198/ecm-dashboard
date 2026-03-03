import TextFieldInput from '@/components/TextFieldInput'
import AttachMoneySharpIcon from '@mui/icons-material/AttachMoneySharp'
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import SearchIcon from '@mui/icons-material/Search'
import SellOutlinedIcon from '@mui/icons-material/SellOutlined'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  TextField,
  Typography
} from '@mui/material'

import SelectFilter from '@/features/customers/components/SelectFilter'
import { yupResolver } from '@hookform/resolvers/yup'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import { debounce, isEqual } from 'lodash'
import { FormProvider, Resolver, useForm, useWatch } from 'react-hook-form'
import { InferType } from 'yup'
import { DEFAULT_PER_PAGE_PRODUCT, salesOptions, stockOptions } from '../constant'
import { filterProductSchema } from '../schemas'

import { DEFAULT_PAGE } from '@/constants'
import { fetchCategoriesList } from '@/features/categories/services'
import { useSearchParam } from '@/hooks/useSearchParam'
import { QuerySaveType, SelectOptionItem } from '@/types'
import { cleanObject } from '@/utils'
import {
  getProductListParamsFormLS,
  getProductSaveQueries,
  saveProductListParamsToLS,
  saveQueriesProduct
} from '@/utils/products'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { GetProductListRequest, ProductUrlQuery } from '../types'
import { useTranslation } from 'react-i18next'
import { Category } from '@/services/data-generator'

type FormValues = InferType<typeof filterProductSchema>

interface Props {
  productListRq: GetProductListRequest
  setProductListRq: React.Dispatch<React.SetStateAction<GetProductListRequest>>
}

export default function FilterBarProduct({ productListRq, setProductListRq }: Props) {
  const { t } = useTranslation(['product', 'common'])
  const [openDialog, setOpenDialog] = useState(false)
  const [openRemoveDialog, setOpenRemoveDialog] = useState(false)
  const [saveQueryName, setSaveQueryName] = useState('')

  const productParamFromLS = getProductListParamsFormLS()
  const { getAll, deleteMany, replaceParams, setMany } = useSearchParam()
  const [searchName, setSearchName] = useState(productParamFromLS.filter.q)

  const saveQueriesProductFromLS = getProductSaveQueries()
  const [saveQueries, setSaveQueries] = useState(saveQueriesProductFromLS ?? ([] as QuerySaveType[]))

  const [idQuery, setIdQuery] = useState(0)

  const method = useForm<FormValues>({
    resolver: yupResolver(filterProductSchema) as Resolver<FormValues>,
    defaultValues: {
      q: '',
      sales: {},
      category_id: '',
      stock: {}
    }
  })

  const {
    formState: { isDirty }
  } = method
  const q = useWatch({ name: 'q', control: method.control })
  const salesValue = useWatch({ name: 'sales', control: method.control })
  const category_id = useWatch({ name: 'category_id', control: method.control })
  const stockValue = useWatch({ name: 'stock', control: method.control })

  const { data: categoriesList } = useQuery({
    queryKey: ['categories_list'],
    queryFn: () => fetchCategoriesList()
  })
  const categoriesListData = categoriesList?.data || []

  const i18nStockOptions = useMemo<SelectOptionItem[]>(() => {
    return stockOptions.map((item) => {
      return {
        ...item,
        label: t(`product:${item.label}`)
      }
    }) as SelectOptionItem[]
  }, [t])

  const i18nSalesOptions = useMemo<SelectOptionItem[]>(() => {
    return salesOptions.map((item) => {
      return {
        ...item,
        label: t(`product:${item.label}`)
      }
    }) as SelectOptionItem[]
  }, [t])

  const categoryOptions = useMemo<SelectOptionItem[]>(() => {
    return categoriesListData.map((category) => {
      return {
        label: category.name,
        value: category.id.toString()
      }
    })
  }, [categoriesListData, t])

  const hasParams = useMemo(() => {
    return (
      !!q ||
      !!Object.keys(cleanObject(salesValue)).length ||
      !!category_id ||
      !!Object.keys(cleanObject(stockValue)).length
    )
  }, [q, category_id, stockValue, salesValue])

  const onDebounceSearch = useMemo(() => debounce((value?: string) => setSearchName(value), 300), [])

  const currentQuery = saveQueries.find((query) => isEqual(query.value, productListRq)) ?? ({} as QuerySaveType)

  useEffect(() => {
    const queryId = saveQueries.find((query) => isEqual(query.value, productListRq)) ?? ({} as QuerySaveType)
    setIdQuery(queryId.id)
  }, [productListRq])

  useEffect(() => {
    onDebounceSearch(q)
    return () => {
      onDebounceSearch.cancel()
    }
  }, [q, onDebounceSearch])

  useEffect(() => {
    const productFilterParamsFromLS = productParamFromLS.filter

    if (productFilterParamsFromLS) {
      const { sales, sales_gt, sales_lte } = productFilterParamsFromLS
      const { stock, stock_gt, stock_lt } = productFilterParamsFromLS

      method.reset({
        ...productFilterParamsFromLS,
        sales: {
          sales,
          sales_gt,
          sales_lte
        },
        stock: {
          stock,
          stock_gt,
          stock_lt
        }
      })
    }
  }, [JSON.stringify(productParamFromLS)])

  useEffect(() => {
    saveQueriesProduct(saveQueries)
  }, [saveQueries])

  useEffect(() => {
    if (!isDirty) {
      return
    }

    const { sales, sales_gt, sales_lte } = salesValue
    const { stock, stock_gt, stock_lt } = stockValue

    const newSales = {
      sales,
      sales_gt,
      sales_lte
    }

    const newStock = {
      stock,
      stock_lt,
      stock_gt
    }

    const filterParam = cleanObject({ q: searchName, category_id })
    const cleanSales = cleanObject(newSales)
    const cleanStock = cleanObject(newStock)
    const newFilter = {
      ...filterParam,
      ...cleanSales,
      ...cleanStock
    }

    setMany({
      filter: JSON.stringify(newFilter),
      page: DEFAULT_PAGE.toString(),
      perPage: DEFAULT_PER_PAGE_PRODUCT.toString(),
      order: productParamFromLS.order,
      sort: productParamFromLS.sort
    })

    saveProductListParamsToLS({
      ...productParamFromLS,
      filter: newFilter,

      page: DEFAULT_PAGE,
      perPage: DEFAULT_PER_PAGE_PRODUCT
    })

    setProductListRq({
      filter: newFilter,
      sort: {
        field: productParamFromLS.sort,
        order: productParamFromLS.order
      },
      pagination: {
        page: DEFAULT_PAGE + 1,
        perPage: DEFAULT_PER_PAGE_PRODUCT
      }
    })
  }, [searchName, stockValue, category_id, salesValue])

  const removeSaveQuery = () => {
    setOpenRemoveDialog(true)
  }

  const handleClickOpen = () => {
    setOpenDialog(true)
  }

  const handleSelectQuery = (id: number) => {
    setIdQuery(id)
    const newQuery = saveQueries.find((query) => query.id === id)

    const querySaveToLS: ProductUrlQuery = {
      filter: { ...newQuery?.value.filter },
      page: newQuery?.value.pagination.page - 1,
      perPage: newQuery?.value.pagination.perPage,
      order: newQuery?.value.sort.order,
      sort: newQuery?.value.sort.field
    }

    setProductListRq(newQuery?.value)
    saveProductListParamsToLS(querySaveToLS)
  }

  const handleRemoveAllParams = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation()

    saveProductListParamsToLS({
      ...productParamFromLS,
      filter: {}
    })

    setProductListRq({
      ...productListRq,
      filter: {}
    })

    const searchParamKeys = Object.keys(getAll())
    deleteMany(searchParamKeys)
    replaceParams({
      filter: '{}'
    })
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  const handleSetSaveQueryName = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value
    setSaveQueryName(value)
  }

  const handleSaveQueries = () => {
    setSaveQueries((prev) => [...prev, { name: saveQueryName, value: productListRq, id: new Date().getTime() }])
    setOpenDialog(false)
    setSaveQueryName('')
  }

  const handleCloseRemoveDialog = () => {
    setOpenRemoveDialog(false)
  }

  const handleConfirmRemoveDialog = () => {
    setOpenRemoveDialog(false)
    const newQuery = saveQueries.filter((query) => query.id !== idQuery)
    setSaveQueries(newQuery)
  }

  return (
    <FormProvider {...method}>
      <Box
        sx={[
          {
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: 2
          },
          (theme) => ({
            backgroundColor: 'transparent'
          }),
          (theme) =>
            theme.applyStyles('dark', {
              backgroundColor: '#1e1e1e'
            })
        ]}
      >
        <TextFieldInput
          sxTextFieldInput={{ width: '100%' }}
          name='q'
          label={t('product:search')}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position='end'>
                  <SearchIcon sx={{ width: '24px', height: '24px' }} />
                </InputAdornment>
              )
            }
          }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BookmarkBorderIcon sx={{ width: '24px', height: '24px' }} />
            <Typography sx={{ fontSize: '12px', letterSpacing: 2 }}>
              {t('product:save_queries').toUpperCase()}
            </Typography>
          </Box>
          {hasParams ? (
            isEqual(currentQuery?.value, productListRq) ? (
              <IconButton onClick={removeSaveQuery}>{<RemoveCircleOutlineIcon color='action' />}</IconButton>
            ) : (
              <IconButton onClick={handleClickOpen}>{<AddCircleOutlineIcon color='action' />}</IconButton>
            )
          ) : (
            <IconButton>{<HelpOutlineIcon color='action' />}</IconButton>
          )}
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', mt: -2 }}>
          {saveQueries.map((data) => (
            <Box
              onClick={() => handleSelectQuery(data.id)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingLeft: '32px',
                paddingRight: '4px',
                paddingBlock: '4px',
                cursor: 'pointer',
                bgcolor: currentQuery?.id === data.id ? 'rgba(0,0,0,0.1)' : 'transparent',
                '&:hover': {
                  bgcolor: currentQuery?.id === data.id ? 'rgba(0,0,0,0.1)' : 'grey.100'
                },
                transition: '0.2s'
              }}
              key={data.id}
            >
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontSize: '14px' }}>{data.name}</Typography>
                {data.id === currentQuery.id && (
                  <IconButton sx={{ width: '24px', height: '24px' }} size='small' onClick={handleRemoveAllParams}>
                    <HighlightOffIcon color='action' />
                  </IconButton>
                )}
              </Box>
            </Box>
          ))}
        </Box>
        <SelectFilter
          name='sales'
          filterLabel={t('product:sales').toUpperCase()}
          IconFilter={<AttachMoneySharpIcon color='action' />}
          options={i18nSalesOptions}
        />

        <SelectFilter
          name='stock'
          filterLabel={t('product:stock').toUpperCase()}
          IconFilter={<BarChartOutlinedIcon color='action' />}
          options={i18nStockOptions}
        />

        <SelectFilter
          name='category_id'
          filterLabel={t('product:categories').toUpperCase()}
          IconFilter={<SellOutlinedIcon color='action' />}
          options={categoryOptions}
        />
      </Box>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{t('common:saveQueryAs')}</DialogTitle>

        <DialogContent>
          <TextField
            sx={{ width: '100%' }}
            value={saveQueryName}
            onChange={handleSetSaveQueryName}
            label={t('common:queryName')}
            type='search'
            variant='filled'
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{t('common:cancel')}</Button>
          <Button onClick={handleSaveQueries} autoFocus>
            {t('common:save')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openRemoveDialog} onClose={handleCloseRemoveDialog}>
        <DialogTitle>{t('common:removeSavedQuery')}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>{t('common:removeQueryConfirm')}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRemoveDialog}>{t('common:cancel')}</Button>
          <Button onClick={handleConfirmRemoveDialog}>{t('common:confirm')}</Button>
        </DialogActions>
      </Dialog>
    </FormProvider>
  )
}
