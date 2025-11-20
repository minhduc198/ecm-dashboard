import { queryClient } from '@/App'
import CustomLink from '@/components/CustomLink'
import CustomTable from '@/components/CustomTable'
import TextFieldAutoComplete from '@/components/TextFieldAutocomplete'
import TextFieldInput from '@/components/TextFieldInput'
import TextFieldNumber from '@/components/TextFieldNumber'
import { DEFAULT_PAGE, DEFAULT_PER_PAGE } from '@/constants'
import { deleteReviews, fetchReviewList } from '@/features/reviews/services'
import { GetReviewListRequest } from '@/features/reviews/types'
import { path } from '@/routers/path'
import { Customer, Review } from '@/services/data-generator'
import { useUndoReviewStore } from '@/store/reviewStore'
import { useUndoProductStore } from '@/store/undoProductStore'
import { SORT } from '@/types'
import { TableColumns } from '@/types/table'
import { formatDate } from '@/utils/date'
import { yupResolver } from '@hookform/resolvers/yup'
import AddIcon from '@mui/icons-material/Add'
import AspectRatioIcon from '@mui/icons-material/AspectRatio'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import CommentIcon from '@mui/icons-material/Comment'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import EditNoteIcon from '@mui/icons-material/EditNote'
import SaveIcon from '@mui/icons-material/Save'
import StarsIcon from '@mui/icons-material/Stars'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { Avatar, Box, Button, CircularProgress, Snackbar, Tab, Tooltip, Typography } from '@mui/material'
import { useMutation, useQuery } from '@tanstack/react-query'
import React, { useEffect, useMemo, useState } from 'react'
import { FormProvider, Resolver, useForm, useWatch } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router'
import { InferType } from 'yup'
import Editor from '../components/editor/Editor'
import TabDetailSkeleton from '../components/TabDetailSkeleton'
import TabImageSkeleton from '../components/TabImageSkeleton'
import { categoryOptions, TabProduct } from '../constant'
import { productDetailSchema } from '../schemas'
import { createProduct, deleteProducts, fetchProductDetail, updateProduct } from '../services'
import { CreateProductRequest, UpdateProductRequest } from '../types'
import { useHeaderTitleStore } from '@/store/headerStore'
import { useTranslation } from 'react-i18next'

type FormValues = InferType<typeof productDetailSchema>

export default function ProductDetail() {
  const { t } = useTranslation(['common', 'product'])
  const { setHeaderData } = useHeaderTitleStore()
  const { timerId, tmpUndoData, dataPending, setTmpUndoData, setIsOpenUndo, setTimerId, setAction, setDataPending } =
    useUndoProductStore()
  const {
    tmpUndoData: tmpUndoDataReview,
    isOpenUndo: isOpenUndoReview,
    action: actionReview,
    setTmpUndoData: setTmpUndoDataReview,
    setIsOpenUndo: setIsOpenUndoReview,
    setTimerId: setTimerIdReview,
    setAction: setActionReview
  } = useUndoReviewStore()
  const navigate = useNavigate()
  const param = useParams()
  const activeTab = param.tab || TabProduct.IMAGE

  const [reviewParamRq, setReviewParamRq] = useState<GetReviewListRequest>({
    filter: { product_id: param.id },
    sort: {
      field: 'id',
      order: SORT.DESC
    },
    pagination: {
      page: DEFAULT_PAGE + 1,
      perPage: DEFAULT_PER_PAGE
    }
  })

  const methods = useForm({
    resolver: yupResolver(productDetailSchema) as Resolver<FormValues>,
    defaultValues: {
      image: '',
      thumbnail: '',
      reference: ''
    }
  })

  const image = useWatch({ name: 'image', control: methods.control })
  const thumbnail = useWatch({ name: 'thumbnail', control: methods.control })
  const reference = useWatch({ name: 'reference', control: methods.control })
  const category_id = useWatch({ name: 'category_id', control: methods.control })
  const richTextDescription = useWatch({ name: 'description', control: methods.control })
  const price = useWatch({ name: 'price', control: methods.control })
  const stock = useWatch({ name: 'stock', control: methods.control })
  const sales = useWatch({ name: 'sales', control: methods.control })
  const width = useWatch({ name: 'width', control: methods.control })
  const height = useWatch({ name: 'height', control: methods.control })

  const { data: productDetailData, isLoading } = useQuery({
    queryKey: ['product_detail', param.id],
    queryFn: () => fetchProductDetail({ id: Number(param.id) }),
    enabled: !!param.id && !timerId,
    refetchOnWindowFocus: false,
    onSuccess: (review) => {
      setHeaderData({ title: `Product "${review.data.reference}"` })
    }
  })
  const productDetail = productDetailData?.data

  const { mutateAsync: deleteProductsMutation } = useMutation({
    mutationFn: (ids: number[]) => deleteProducts({ ids }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['product_list'] })
  })

  const { mutateAsync: updateProductMutation, isPending } = useMutation({
    mutationFn: (body: UpdateProductRequest) => updateProduct(body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['product_list'] })
  })

  const { mutateAsync: createProductMutation, isPending: isCreatePending } = useMutation({
    mutationFn: (param: CreateProductRequest) => createProduct(param)
  })

  const { data: reviewList } = useQuery({
    queryKey: ['review_list', reviewParamRq],
    queryFn: () => fetchReviewList(reviewParamRq),
    enabled: !!param.id,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    onSuccess: (reviews) => {
      setTmpUndoDataReview(reviews.data)
    }
  })
  const reviewListData = reviewList?.data ?? []

  const { mutate: deleteReviewsMutation } = useMutation({
    mutationFn: (ids: number[]) => deleteReviews({ ids }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['review_list'] })
  })

  const initialReviewCol: TableColumns<Review>[] = [
    {
      label: t('product:date'),
      id: 'date',
      cell: (value) => (typeof value === 'string' ? formatDate(value, 'd/M/yyyy') : null)
    },
    {
      label: t('product:customer'),
      id: 'customer',
      cell: (value) => {
        const customer = (value as Customer) || {}
        return (
          <CustomLink to={`${path.customers}/${customer.id}`}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Avatar sx={{ width: 25, height: 25 }} src={customer.avatar} alt={customer.first_name} />
              <Box>{`${customer.first_name} ${customer.last_name}`}</Box>
            </Box>
          </CustomLink>
        )
      }
    },
    {
      label: t('product:rating'),
      id: 'rating',
      cell: (value) => {
        const star = Number(value)
        return Array(5)
          .fill(0)
          .map((_, idx) => {
            if (idx + 1 <= star) {
              return <StarsIcon sx={{ width: '20px', height: '20px' }} color='action' key={idx} />
            }
            return <Box key={idx}></Box>
          })
      }
    },
    {
      label: t('product:comment'),
      id: 'comment',
      cell: (value) => (
        <Tooltip title={String(value)}>
          <Typography
            noWrap
            sx={{
              width: '300px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              cursor: 'pointer'
            }}
          >
            {String(value)}
          </Typography>
        </Tooltip>
      )
    },
    {
      label: t('product:status'),
      id: 'status',
      cell: (value) => <Box>{t(`product:${value}`)}</Box>
    },
    {
      label: '',
      id: 'id',
      cell: (value) => <Button startIcon={<EditIcon />}>{t('product:edit')}</Button>
    }
  ]

  useEffect(() => {
    if (productDetail) {
      methods.reset({
        image: productDetail?.image,
        thumbnail: productDetail?.thumbnail,
        reference: productDetail?.reference,
        width: productDetail?.width,
        height: productDetail?.height,
        price: productDetail?.price,
        stock: productDetail?.stock,
        sales: productDetail?.sales,
        category_id: productDetail?.category_id,
        description: productDetail.description
      })
    }
  }, [productDetail])

  const i18nCategoryOptions = useMemo(() => {
    return categoryOptions.map((item) => {
      return {
        ...item,
        label: t(`product:${item.label.toLowerCase()}`)
      }
    })
  }, [t])

  const handleDelete = () => {
    const deletedId = productDetail?.id
    if (!deletedId) return

    if (timerId && dataPending.id) {
      clearTimeout(timerId)
      updateProductMutation(dataPending)
    }

    const softDeleteProduct = tmpUndoData.filter((data) => data.id !== deletedId)
    setTmpUndoData(softDeleteProduct)
    setIsOpenUndo(true)
    setAction('Product deleted')

    const timerDeleteId = setTimeout(async () => {
      setIsOpenUndo(false)
      await deleteProductsMutation([deletedId])
      setTimerId(null)
    }, 3000)

    setTimerId(timerDeleteId)
    navigate(path.products)
  }

  const handleUpdateAndCreate = async (formData: FormValues) => {
    if (!!param.id) {
      const newDataProduct = {
        category_id,
        image,
        thumbnail,
        reference,
        width,
        height,
        sales,
        stock,
        price,
        description: richTextDescription
      }

      const body = {
        id: Number(param.id),
        data: newDataProduct
      }

      if (timerId && dataPending.id) {
        clearTimeout(timerId)
        await updateProductMutation(dataPending)
      }

      const optimisticUpdate = tmpUndoData.map((product) => {
        if (product.id === Number(param.id)) {
          return {
            ...product,
            ...newDataProduct
          }
        }

        if (product.id === dataPending.id) {
          return {
            ...product,
            ...dataPending.data
          }
        }

        return product
      })

      setDataPending(body)
      setAction('Updated product')
      setIsOpenUndo(true)
      setTmpUndoData(optimisticUpdate)

      const updateTimerId = setTimeout(async () => {
        setIsOpenUndo(false)
        await updateProductMutation(body)
        setTimerId(null)
        setDataPending({
          id: 0,
          data: {}
        })
      }, 3000)

      setTimerId(updateTimerId)
      navigate(path.products)
    } else {
      const newProduct = await createProductMutation({ data: formData })
      navigate(`${path.products}/${newProduct.id}`)
    }
  }

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    if (!!param?.id) {
      if (newValue === TabProduct.IMAGE) {
        return navigate(`${path.products}/${productDetail?.id}`)
      }

      return navigate(`${path.products}/${productDetail?.id}/${newValue}`)
    } else {
      if (newValue === TabProduct.IMAGE) {
        return navigate(`${path.createProduct}`)
      }
      return navigate(`${path.createProduct}/${newValue}`)
    }
  }

  const handleDeleteReviews = (ids: number[]) => {
    const softDeleteOrder = tmpUndoDataReview.filter((data) => !ids.includes(data.id))
    setTmpUndoDataReview(softDeleteOrder)
    setIsOpenUndoReview(true)
    setActionReview('Review deleted')

    const timeOut = setTimeout(() => {
      setIsOpenUndoReview(false)
      deleteReviewsMutation(ids)
      setTimerIdReview(null)
    }, 3000)

    setTimerId(timeOut)
  }

  const handleUndo = () => {
    setIsOpenUndoReview(false)
    setTimerIdReview(null)
    setTmpUndoDataReview(reviewListData)
    if (timerId) {
      clearTimeout(timerId)
    }
  }

  const handleSetRowsPerPage = (rowPerPage: number) => {
    setReviewParamRq({
      ...reviewParamRq,
      pagination: {
        perPage: rowPerPage,
        page: DEFAULT_PER_PAGE
      }
    })
  }

  const handleSetPage = (page: number) => {
    setReviewParamRq({
      ...reviewParamRq,
      pagination: {
        perPage: reviewParamRq.pagination.perPage,
        page: page + 1
      }
    })
  }

  const handleSort = (field: string, order: SORT) => {
    setReviewParamRq({
      ...reviewParamRq,
      sort: {
        field,
        order
      }
    })
  }

  const handleCreateReview = () => {
    navigate(path.createReview, { state: { product_id: productDetail?.id } })
  }

  const {
    handleSubmit,
    formState: { isDirty }
  } = methods

  const labelReview = useMemo(() => {
    return (
      <div>
        {t('product:reviews').toUpperCase()} ({reviewList?.total ?? <CircularProgress size={14} color='primary' />})
      </div>
    )
  }, [reviewList?.total])

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleUpdateAndCreate)} noValidate>
        <Box
          sx={{
            border: '1px solid #e0e0e0',
            borderTopLeftRadius: '10px',
            borderTopRightRadius: '10px'
          }}
        >
          <TabContext value={activeTab}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChangeTab} aria-label='lab API tabs example'>
                <Tab
                  label={t('product:image')}
                  value={TabProduct.IMAGE}
                  icon={<CameraAltIcon />}
                  iconPosition='start'
                />
                <Tab
                  label={t('product:details')}
                  value={TabProduct.DETAILS}
                  icon={<AspectRatioIcon />}
                  iconPosition='start'
                />
                <Tab
                  label={t('product:description')}
                  value={TabProduct.DESCRIPTION}
                  icon={<EditNoteIcon />}
                  iconPosition='start'
                />
                {!!param.id && (
                  <Tab label={labelReview} value={TabProduct.REVIEWS} icon={<CommentIcon />} iconPosition='start' />
                )}
              </TabList>
            </Box>
            <TabPanel value={TabProduct.IMAGE}>
              {isLoading && !!param.id ? (
                <TabImageSkeleton />
              ) : (
                <>
                  {!!param.id && (
                    <Box sx={{ width: '320px', height: '240px', borderRadius: '10px', overflow: 'hidden' }}>
                      <img src={productDetail?.image} />
                    </Box>
                  )}
                  <TextFieldInput
                    sxTextFieldInput={{ width: '640px', mt: 1 }}
                    isRequired
                    name='image'
                    label={t('product:image')}
                  />
                  <TextFieldInput
                    sxTextFieldInput={{ width: '640px', mt: '30px', mb: '20px' }}
                    isRequired
                    name='thumbnail'
                    label={t('product:thumbnail')}
                  />
                </>
              )}
            </TabPanel>
            <TabPanel value={TabProduct.DETAILS}>
              {isLoading && !!param.id ? (
                <TabDetailSkeleton />
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '30px', mb: '20px' }}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'start' }}>
                    <TextFieldInput
                      sxTextFieldInput={{ width: '420px' }}
                      isRequired
                      name='reference'
                      label={t('product:reference')}
                    />
                    <TextFieldAutoComplete
                      sxAutocomplete={{ width: '203px' }}
                      name='category_id'
                      label={`${t('product:category')}*`}
                      options={i18nCategoryOptions}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'start', gap: 2 }}>
                    <TextFieldNumber
                      sxTextFiled={{ width: '203px' }}
                      isRequired
                      name='width'
                      label={t('product:width')}
                    />
                    <TextFieldNumber
                      sxTextFiled={{ width: '203px' }}
                      isRequired
                      name='height'
                      label={t('product:height')}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'start', gap: 2 }}>
                    <TextFieldNumber
                      sxTextFiled={{ width: '203px' }}
                      isRequired
                      name='price'
                      label={t('product:price')}
                    />
                    <TextFieldNumber
                      sxTextFiled={{ width: '203px' }}
                      isRequired
                      name='stock'
                      label={t('product:stock')}
                    />
                    <TextFieldNumber
                      sxTextFiled={{ width: '203px' }}
                      isRequired
                      name='sales'
                      label={t('product:sales')}
                    />
                  </Box>
                </Box>
              )}
            </TabPanel>
            <TabPanel value={TabProduct.DESCRIPTION}>
              <Editor name='description' />
            </TabPanel>
            <TabPanel value={TabProduct.REVIEWS}>
              <CustomTable<Review, number>
                rowId='id'
                columns={initialReviewCol}
                dataSource={tmpUndoDataReview}
                handleDelete={handleDeleteReviews}
                handleSetPage={handleSetPage}
                handleSetRowsPerPage={handleSetRowsPerPage}
                handleSort={handleSort}
                pagination={{
                  page: reviewParamRq.pagination.page - 1,
                  perPage: reviewParamRq.pagination.perPage
                }}
                totalItems={reviewList?.total}
                emptyText={t('product:noReviewFound')}
              />
              <Button onClick={handleCreateReview} startIcon={<AddIcon />}>
                {t('common:create')}
              </Button>
            </TabPanel>
          </TabContext>
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
            disabled={!isDirty || isPending || isCreatePending}
            startIcon={<SaveIcon />}
            loading={isPending || isCreatePending}
          >
            {t('common:save')}
          </Button>

          {true && (
            <Button
              sx={{ borderRadius: 1 }}
              color='error'
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
              loading={!!timerId}
              disabled={!!timerId}
            >
              {t('common:delete')}
            </Button>
          )}
        </Box>
      </form>

      {/* snackbar of Review */}
      <Snackbar
        open={isOpenUndoReview}
        autoHideDuration={1000}
        message={actionReview}
        action={
          <Button size='small' onClick={handleUndo}>
            {t('common:undo')}
          </Button>
        }
      />
    </FormProvider>
  )
}
