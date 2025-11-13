import CustomTable from '@/components/CustomTable'
import TextFieldInput from '@/components/TextFieldInput'
import { initialProductColumns } from '@/features/products/constant'
import { deleteProducts, fetchProductsList } from '@/features/products/services'
import { GetProductListRequest, Product, TableColumnsProduct } from '@/features/products/types'
import { TableColumns } from '@/types/table'
import { formatCurrency } from '@/utils/currency'
import { yupResolver } from '@hookform/resolvers/yup'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import { Box, Button, Snackbar, Typography } from '@mui/material'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router'

import { queryClient } from '@/App'
import CustomLink from '@/components/CustomLink'
import { DEFAULT_PER_PAGE } from '@/constants'
import { path } from '@/routers/path'
import { useUndoCategoryStore } from '@/store/undoCategoryStore'
import { useUndoProductCategoryStore } from '@/store/undoProductCategoryStore'
import { SORT } from '@/types'
import * as yup from 'yup'
import { deleteCategory, fetchCategoryDetail, updateCategory } from '../services'
import { UpdateCategoryRequest } from '../types'
import { getProductListParamsFormLS, saveProductListParamsToLS } from '@/utils/products'

const categoryDetailSchema = yup.object({
  nameCategory: yup.string().required('Required').max(30, 'Maximum length 30 characters').trim()
})

type FormValues = yup.InferType<typeof categoryDetailSchema>

export default function DetailCategory() {
  const param = useParams()
  const navigate = useNavigate()
  const productListParamFromLS = getProductListParamsFormLS()

  const { action, timerId, isOpenUndo, tmpUndoData, setAction, setIsOpenUndo, setTimerId, setTmpUndoData } =
    useUndoProductCategoryStore()

  const {
    tmpUndoData: tmpUndoDataCategory,
    timerId: timerIdCategory,
    setAction: setActionCategory,
    setIsOpenUndo: setIsOpenUndoCategory,
    setTimerId: setTimerIdCategory,
    setTmpUndoData: setTmpUndoDataCategory,
    dataPending,
    setDataPending
  } = useUndoCategoryStore()

  const [productListParams, setProductListParams] = useState<GetProductListRequest>({
    pagination: {
      page: 1,
      perPage: DEFAULT_PER_PAGE
    },
    filter: { category_id: param.id }
  })

  const { data: categoryDetail } = useQuery({
    queryKey: ['category_detail', param.id],
    queryFn: () => fetchCategoryDetail({ id: Number(param.id) }),
    enabled: !!param.id
  })

  const methods = useForm({
    resolver: yupResolver(categoryDetailSchema),
    defaultValues: {
      nameCategory: ''
    }
  })
  const {
    handleSubmit,
    formState: { isDirty }
  } = methods

  const nameCategory = useWatch({ name: 'nameCategory', control: methods.control })

  const { data: listProductsOfCategoryData } = useQuery({
    queryKey: ['list_products_of_category', productListParams],
    queryFn: () => fetchProductsList(productListParams),
    onSuccess: (listProducts) => {
      setTmpUndoData(listProducts.data)
    }
  })
  const listProductsOfCategory = listProductsOfCategoryData?.data ?? []

  const { mutate: deleteProductMutation } = useMutation({
    mutationFn: (ids: number[]) => deleteProducts({ ids }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['list_products_of_category'] })
    }
  })

  const { mutateAsync: updateCategoryMutation, isPending } = useMutation({
    mutationFn: (params: UpdateCategoryRequest) => updateCategory(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories_list'] })
    }
  })

  const { mutateAsync: deleteCategoryMutation } = useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories_list'] })
      const filter = { ...productListParamFromLS.filter }

      delete filter.category_id

      saveProductListParamsToLS({
        ...productListParamFromLS,
        page: productListParamFromLS.page,
        perPage: productListParamFromLS.perPage,
        filter
      })
    }
  })

  const columns: TableColumnsProduct = useMemo(() => {
    return initialProductColumns.map((col) => {
      const tableColumns: TableColumns<Product> = {
        id: col.id,
        label: col.label
      }

      switch (col.id) {
        case 'reference':
          return {
            ...tableColumns,
            cell: (_, value) => (
              <CustomLink to={`${path.products}/${value.id}`}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: '25px', height: '20px' }}>
                    <img src={value.image} alt='' />
                  </Box>
                  <Box>{value.reference}</Box>
                </Box>
              </CustomLink>
            )
          }

        case 'price':
          return {
            ...tableColumns,
            cell: (row) => formatCurrency(Number(row))
          }

        case 'category_id':
          return {
            ...tableColumns,
            cell: (_, value) => (
              <Link to={`${path.products}/${value.id}`}>
                <Button startIcon={<EditIcon />}>Edit</Button>
              </Link>
            )
          }
        default:
          return tableColumns
      }
    })
  }, [initialProductColumns])

  useEffect(() => {
    const category = categoryDetail?.data
    if (category?.name) {
      methods.reset({ nameCategory: category.name })
    }
  }, [categoryDetail?.data])

  const handleDeleteProducts = (ids: number[]) => {
    setAction('Delete Product')
    const softDeleteProduct = listProductsOfCategory.filter((data) => !ids.includes(data.id))
    setTmpUndoData(softDeleteProduct ?? [])
    setIsOpenUndo(true)

    const timeOut = setTimeout(() => {
      setIsOpenUndo(false)
      deleteProductMutation(ids)
      setTimerId(null)
    }, 3000)

    setTimerId(timeOut)
  }

  const handleUndo = () => {
    setIsOpenUndo(false)
    setTimerId(null)
    setTmpUndoData(listProductsOfCategory ?? [])
    if (timerId) {
      clearTimeout(timerId)
    }
  }

  const handleSort = (field: string, order: SORT) => {
    setProductListParams({
      ...productListParams,
      sort: {
        field,
        order
      }
    })
  }

  const handleViewProductDetail = (row: Product) => {
    navigate(`${path.products}/${row.id}`)
  }

  const updateNameCategory = async () => {
    const body = {
      id: Number(param.id),
      data: {
        name: nameCategory?.trim() ?? ''
      }
    }

    if (timerIdCategory && dataPending.id) {
      clearTimeout(timerIdCategory)
      await updateCategoryMutation(dataPending)
    }

    const optimisticCategoriesList = tmpUndoDataCategory.map((item) => {
      if (item.id === Number(param.id)) {
        return {
          ...item,
          name: nameCategory?.trim() ?? ''
        }
      }

      if (item.id === dataPending.id) {
        return {
          ...item,
          ...dataPending.data
        }
      }

      return item
    })

    setDataPending(body)
    setActionCategory('Update Category')
    setIsOpenUndoCategory(true)
    setTmpUndoDataCategory(optimisticCategoriesList)

    const timeOut = setTimeout(async () => {
      setIsOpenUndoCategory(false)
      await updateCategoryMutation(body)
      setTimerIdCategory(null)
      setDataPending({
        id: null,
        data: {}
      })
    }, 3000)

    setTimerIdCategory(timeOut)
    navigate(path.categories)
  }

  const handleRemoveCategory = () => {
    if (timerIdCategory && dataPending.id) {
      clearTimeout(timerIdCategory)
      updateCategoryMutation(dataPending)
    }

    const optimisticCategoriesList = tmpUndoDataCategory.filter((data) => data.id !== Number(param.id))

    setActionCategory('Delete Category')
    setIsOpenUndoCategory(true)
    setTmpUndoDataCategory(optimisticCategoriesList)

    const timeOut = setTimeout(async () => {
      setIsOpenUndoCategory(false)
      await deleteCategoryMutation(Number(param.id))
      setTimerIdCategory(null)
    }, 3000)

    setTimerIdCategory(timeOut)
    navigate(path.categories)
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(updateNameCategory)}>
        <Box
          sx={{
            border: '1px solid #e0e0e0',
            borderTopLeftRadius: '10px',
            borderTopRightRadius: '10px',
            padding: 2
          }}
        >
          <TextFieldInput sxTextFieldInput={{ width: '100%' }} label='Name' name='nameCategory' />
          <Typography sx={{ mt: '20px', fontSize: '12px', color: 'rgb(0,0,0, 0.6)' }}>Products</Typography>
          <CustomTable<Product, number>
            rowId={'id'}
            dataSource={tmpUndoData}
            columns={columns}
            handleDelete={handleDeleteProducts}
            handleSort={handleSort}
            onRowClick={handleViewProductDetail}
          />
        </Box>
        <Box
          sx={[
            {
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '14px 24px',
              borderInline: '1px solid #e0e0e0',
              borderBottom: '1px solid #e0e0e0',
              borderBottomLeftRadius: '10px',
              borderBottomRightRadius: '10px',
              bgcolor: '#e0e0e0'
            },
            (theme) =>
              theme.applyStyles('dark', {
                backgroundColor: '#424242'
              })
          ]}
        >
          <Button
            sx={{ borderRadius: '8px' }}
            type='submit'
            variant='contained'
            disabled={!isDirty || isPending}
            loading={isPending}
            startIcon={<SaveIcon />}
          >
            SAVE
          </Button>

          {true && (
            <Button sx={{ borderRadius: 1 }} color='error' startIcon={<DeleteIcon />} onClick={handleRemoveCategory}>
              DELETE
            </Button>
          )}
        </Box>
      </form>

      <Snackbar
        open={isOpenUndo}
        autoHideDuration={1000}
        message={action}
        action={
          <Button size='small' onClick={handleUndo}>
            UNDO
          </Button>
        }
      />
    </FormProvider>
  )
}
