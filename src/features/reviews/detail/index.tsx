import { queryClient } from '@/App'
import CustomLink from '@/components/CustomLink'
import TextFieldInput from '@/components/TextFieldInput'
import { path } from '@/routers/path'
import { useDrawerStore } from '@/store/drawerStore'
import { useUndoReviewStore } from '@/store/reviewStore'
import { formatDate } from '@/utils/date'
import { yupResolver } from '@hookform/resolvers/yup'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import SaveIcon from '@mui/icons-material/Save'
import StarsIcon from '@mui/icons-material/Stars'
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt'
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt'
import { Avatar, Box, Button, Typography } from '@mui/material'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router'
import ReviewDetailSkeleton from '../components/ReviewDetailSkeleton'
import { reviewDetailSchema } from '../schemas'
import { deleteReviews, fetchReviewDetail, updateReview } from '../services'
import { DeleteReviewsRequest, REVIEW_STATUS, UpdateReviewRequest } from '../types'

export default function DetailReview() {
  const { t } = useTranslation(['common', 'review'])
  const { setOpenDrawer, setGetById } = useDrawerStore()
  const { tmpUndoData, dataPending, timerId, setDataPending, setIsOpenUndo, setTimerId, setAction, setTmpUndoData } =
    useUndoReviewStore()

  const navigate = useNavigate()
  const params = useParams()
  const methods = useForm({
    resolver: yupResolver(reviewDetailSchema),
    defaultValues: {
      comment: ''
    }
  })
  const {
    formState: { isDirty }
  } = methods

  const comment = useWatch({ name: 'comment', control: methods.control })

  const { data: reviewDetailData, isFetching } = useQuery({
    queryKey: ['review_detail', params.id],
    queryFn: () => fetchReviewDetail({ id: Number(params.id) }),
    keepPreviousData: true,
    enabled: !!params.id
  })
  const reviewDetail = reviewDetailData?.data

  const tmpReviewDetail = useMemo(() => {
    const detail = tmpUndoData.find((item) => item.id === Number(reviewDetail?.id))
    return detail || reviewDetail
  }, [tmpUndoData, reviewDetail])

  const { mutateAsync: deleteReviewMutation, isPending: isDeletePending } = useMutation({
    mutationFn: (ids: DeleteReviewsRequest) => deleteReviews(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['review_list'] })
    }
  })

  const { mutateAsync: updateReviewMutation, isPending } = useMutation({
    mutationFn: (params: UpdateReviewRequest) =>
      updateReview({
        id: params.id,
        data: params.data
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['review_list'] })
    }
  })

  const ratingStar = useMemo(() => {
    return Array(5)
      .fill(0)
      .map((_, idx) => {
        if (idx + 1 <= Number(reviewDetail?.rating)) {
          return <StarsIcon sx={{ width: '20px', height: '20px' }} color='action' key={idx} />
        }
        return <Box key={idx}></Box>
      })
  }, [reviewDetail])

  useEffect(() => {
    methods.reset({
      comment: reviewDetail?.comment
    })
  }, [reviewDetail])

  const handleCloseDrawer = () => {
    setOpenDrawer(false)
    navigate(path.reviews)
  }

  const handleUpdateReview = (action: 'accept' | 'rejected' | 'update') => {
    const status =
      action === 'accept'
        ? REVIEW_STATUS.ACCEPTED
        : action === 'rejected'
          ? REVIEW_STATUS.REJECTED
          : (reviewDetail?.status as REVIEW_STATUS)

    const payload = {
      id: Number(reviewDetail?.id),
      data: {
        ...reviewDetail,
        status: status,
        comment: action === 'update' ? comment : reviewDetail?.comment
      }
    }

    if (timerId && dataPending.id) {
      clearTimeout(timerId)
      updateReviewMutation(dataPending)
    }

    const newTmpData = tmpUndoData.map((data) => {
      if (data.id === payload.id) {
        return {
          ...data,
          status,
          comment: action === 'update' ? comment : (reviewDetail?.comment ?? '')
        }
      }

      if (data.id === dataPending.id) {
        return {
          ...data,
          ...dataPending.data
        }
      }

      return data
    })

    setDataPending(payload)
    setTmpUndoData(newTmpData)

    setIsOpenUndo(true)
    if (action === 'accept') {
      setAction('Review approved')
    } else if (action === 'rejected') {
      setAction('Review rejected')
    } else {
      setAction('Review updated')
    }

    const timeOut = setTimeout(async () => {
      setIsOpenUndo(false)
      await updateReviewMutation(payload)
      setTimerId(null)
      setDataPending({
        id: 0,
        data: {}
      })
    }, 3000)

    setTimerId(timeOut)

    setOpenDrawer(false)
    navigate(path.reviews)
  }

  const handleDeleteReview = () => {
    if (timerId && dataPending.id) {
      clearTimeout(timerId)
      updateReviewMutation(dataPending)
    }

    const newTmpData = tmpUndoData.filter((data) => data.id !== Number(params.id))
    setTmpUndoData(newTmpData)

    setIsOpenUndo(true)
    setAction('Review deleted')
    setGetById?.(String(reviewDetail?.id))

    const timeOut = setTimeout(async () => {
      setIsOpenUndo(false)
      await deleteReviewMutation({ ids: [Number(params.id)] })
      setTimerId(null)
    }, 3000)

    setTimerId(timeOut)

    setOpenDrawer(false)
    navigate(path.reviews)
  }

  return (
    <Box>
      {isFetching ? (
        <ReviewDetailSkeleton />
      ) : (
        <FormProvider {...methods}>
          <Box sx={{ height: '100vh', width: '100%', mt: '64px', padding: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography sx={{ fontSize: '20px', fontWeight: 500 }}>{t('review:review_detail')}</Typography>
              <Box
                sx={{
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: '100%',
                  '&:hover': { bgcolor: 'rgb(0,0,0,0.1)' }
                }}
                onClick={handleCloseDrawer}
              >
                <CloseIcon color='action'></CloseIcon>
              </Box>
            </Box>

            <Box
              sx={{
                mt: 2,
                display: 'flex',
                alignItems: 'start',
                gap: 4
              }}
            >
              <Box sx={{ width: '150px' }}>
                <Typography sx={{ fontSize: '13px', opacity: 0.7 }}>{t('review:customer')}</Typography>
                <CustomLink to={`${path.customers}/${reviewDetail?.customer.id}`}>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Avatar sx={{ width: 25, height: 25 }} src={reviewDetail?.customer.avatar} alt={''} />
                    <Box
                      sx={{ fontSize: '14px' }}
                    >{`${reviewDetail?.customer.first_name} ${reviewDetail?.customer.last_name}`}</Box>
                  </Box>
                </CustomLink>
              </Box>

              <Box>
                <Typography sx={{ fontSize: '13px', opacity: 0.7 }}>{t('review:product')}</Typography>
                <CustomLink to={`${path.products}/${reviewDetail?.product.id}`}>
                  <Box sx={{ fontSize: '14px' }}>{reviewDetail?.product.reference}</Box>
                </CustomLink>
              </Box>
            </Box>

            <Box
              sx={{
                mt: 2,
                display: 'flex',
                alignItems: 'start',
                gap: 4
              }}
            >
              <Box sx={{ width: '150px' }}>
                <Typography sx={{ fontSize: '13px', opacity: 0.7 }}>{t('review:date')}</Typography>
                <Typography sx={{ fontSize: '14px' }}>{formatDate(reviewDetail?.date, 'd/M/yyyy')}</Typography>
              </Box>

              <Box>
                <Typography sx={{ fontSize: '13px', opacity: 0.7 }}>{t('review:rating')}</Typography>
                {ratingStar}
              </Box>
            </Box>

            <TextFieldInput
              label='Comment'
              name='comment'
              multiline
              sxTextFieldInput={{
                mt: 2,
                width: '100%',
                '& textarea': {
                  maxHeight: '368px !important',
                  overflow: 'auto !important',
                  resize: 'none'
                }
              }}
            />

            <Box sx={{ mt: '24px', display: 'flex', justifyContent: 'space-between' }}>
              {tmpReviewDetail?.status === 'pending' ? (
                <Button
                  variant='outlined'
                  startIcon={<ThumbUpAltIcon />}
                  sx={{
                    borderRadius: '10px',
                    borderColor: '#2e7d32',
                    color: '#2e7d32',
                    padding: '3px 9px',
                    fontSize: '14px',
                    '&:hover': {
                      borderColor: '#1b5e20',
                      backgroundColor: 'rgba(46, 125, 50, 0.05)'
                    }
                  }}
                  onClick={() => handleUpdateReview('accept')}
                >
                  {t('review:accept')}
                </Button>
              ) : (
                <Button
                  sx={{ borderRadius: '10px' }}
                  type='submit'
                  variant='contained'
                  startIcon={<SaveIcon />}
                  disabled={!isDirty || isPending || isDeletePending}
                  loading={isPending || isDeletePending}
                  onClick={() => handleUpdateReview('update')}
                >
                  {t('common:save')}
                </Button>
              )}

              {tmpReviewDetail?.status === 'pending' ? (
                <Button
                  variant='outlined'
                  startIcon={<ThumbDownAltIcon />}
                  sx={{
                    borderRadius: '10px',
                    borderColor: '#c62828',
                    color: '#c62828',
                    padding: '3px 9px',
                    fontSize: '14px',
                    '&:hover': {
                      borderColor: '#8e0000',
                      backgroundColor: 'rgba(198, 40, 40, 0.05)'
                    }
                  }}
                  onClick={() => handleUpdateReview('rejected')}
                >
                  {t('review:reject').toUpperCase()}
                </Button>
              ) : (
                <Button
                  sx={{ borderRadius: '10px' }}
                  variant='outlined'
                  color='error'
                  startIcon={<DeleteIcon />}
                  disabled={isDeletePending || !!timerId}
                  loading={isDeletePending || !!timerId}
                  onClick={handleDeleteReview}
                >
                  {t('common:delete')}
                </Button>
              )}
            </Box>
          </Box>
        </FormProvider>
      )}
    </Box>
  )
}
