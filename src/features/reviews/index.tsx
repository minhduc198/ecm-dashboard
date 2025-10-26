import SettingColumns from '@/components/SettingColumns'
import TextFieldInput from '@/components/TextFieldInput'
import { TableColumns } from '@/types/table'
import { cleanObject, isoStringToDate, reorderDnd } from '@/utils'
import {
  getReviewListParamsFormLS,
  getReviewSaveQueries,
  getReviewSettingColumnsFromLS,
  saveQueriesReview,
  saveReviewListParamsToLS,
  setReviewSettingColumnsToLS
} from '@/utils/reviews'
import { yupResolver } from '@hookform/resolvers/yup'
import AddIcon from '@mui/icons-material/Add'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import SearchIcon from '@mui/icons-material/Search'
import { Avatar, Box, Button, InputAdornment, Snackbar, Tooltip, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { DropResult } from 'react-beautiful-dnd'
import { FormProvider, Resolver, useForm, useWatch } from 'react-hook-form'
import { initialReviewColumns } from './constants'
import { filterReviewSchema } from './schemas'
import { GetReviewListRequest, REVIEW_STATUS, ReviewParam, TableColumnsReview } from './types'
import { Customer, Review } from '@/services/data-generator'
import CustomTable from '@/components/CustomTable'
import { formatDate } from '@/utils/date'
import CustomLink from '@/components/CustomLink'
import { path } from '@/routers/path'
import StarsIcon from '@mui/icons-material/Stars'
import { SORT } from '@/types'
import { DEFAULT_PAGE, DEFAULT_PER_PAGE } from '@/constants'
import { useMutation, useQuery } from '@tanstack/react-query'
import { deleteReviews, fetchReviewList } from './services'
import { useSearchParam } from '@/hooks/useSearchParam'
import { DEFAULT_PAGE_CUSTOMER } from '../customers/constant'
import { queryClient } from '@/App'
import { useUndoReviewStore } from '@/store/undoReviewStore'
import { debounce } from 'lodash'
import { InferType } from 'yup'

type FormValues = InferType<typeof filterReviewSchema>

export default function Reviews() {
  const { setMany } = useSearchParam()
  const { action, tmpUndoData, isOpenUndo, timerId, setTmpUndoData, setIsOpenUndo, setTimerId, setAction } =
    useUndoReviewStore()
  const currentSaveQueriesLS = getReviewSaveQueries()
  const reviewSettingColFromLS = getReviewSettingColumnsFromLS()
  const currentListReviewParamsLS = getReviewListParamsFormLS()
  const { filter, order, page, perPage, sort } = getReviewListParamsFormLS()
  const [isFirstRender, setIsFirstRender] = useState(true)
  const [reviewSettingCol, setReviewSettingCol] = useState<TableColumnsReview>(
    reviewSettingColFromLS.length ? reviewSettingColFromLS : initialReviewColumns
  )
  const [debouncedQ, setDebouncedQ] = useState(currentListReviewParamsLS.filter.q)

  const [reviewListRq, setReviewListRq] = useState<GetReviewListRequest>({
    filter,
    sort: {
      field: sort,
      order
    },
    pagination: {
      page: page + 1,
      perPage
    }
  })

  const { data: reviewList } = useQuery({
    queryKey: ['review_list', reviewListRq],
    queryFn: () => fetchReviewList(reviewListRq),
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    onSuccess: (reviewList) => {
      if (!timerId) {
        setTmpUndoData(reviewList.data)
      }
    }
  })
  const reviewListData = reviewList?.data ?? []

  const { mutate: deleteReviewsMutation } = useMutation({
    mutationFn: (ids: number[]) => deleteReviews({ ids }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['review_list'] })
  })

  const sortFromLs = {
    field: currentListReviewParamsLS.sort,
    order: currentListReviewParamsLS.order
  }
  const columns: TableColumns<Review>[] = useMemo(() => {
    return reviewSettingCol
      .filter((col) => col.isVisible)
      .map((col) => {
        const tableColumn = {
          id: col.id,
          label: col.label,
          numeric: col.numeric,
          sortable: true,
          sortBy: col.id
        }

        switch (col.id) {
          case 'date':
            return {
              ...tableColumn,
              cell: (value) => (typeof value === 'string' ? formatDate(value, 'd/M/yyyy') : null)
            }
          case 'customer_id':
            return {
              ...tableColumn,
              cell: (_, row) => {
                const customer = (row.customer as Customer) || {}
                return (
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Avatar sx={{ width: 25, height: 25 }} src={customer.avatar} alt={customer.first_name} />
                    <Box>{`${customer.first_name} ${customer.last_name}`}</Box>
                  </Box>
                )
              }
            }
          case 'rating':
            return {
              ...tableColumn,
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
            }

          case 'comment':
            return {
              ...tableColumn,
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
            }

          default:
            return col
        }
      })
  }, [reviewSettingCol])

  const methods = useForm<FormValues>({
    resolver: yupResolver(filterReviewSchema) as Resolver<FormValues>,
    defaultValues: {
      q: ''
    }
  })

  const q = useWatch({ name: 'q', control: methods.control })
  const customer_id = useWatch({ name: 'customer_id', control: methods.control })
  const product_id = useWatch({ name: 'product_id', control: methods.control })
  const status = useWatch({ name: 'status', control: methods.control })
  const postedBefore = useWatch({ name: 'date_lte', control: methods.control })
  const postedSince = useWatch({ name: 'date_gte', control: methods.control })

  const debouncedSetQ = useMemo(() => debounce((value: string) => setDebouncedQ(value), 500), [])

  useEffect(() => {
    debouncedSetQ(q ?? '')
    return () => {
      debouncedSetQ.cancel()
    }
  }, [q, debouncedSetQ])

  // useEffect(() => {
  //   methods.reset({
  //     ...currentListReviewParamsLS.filter,
  //     date_gte: isoStringToDate(currentListParamsLS.filter.date_gte),
  //     date_lte: isoStringToDate(currentListParamsLS.filter.date_lte)
  //   })
  // }, [])

  useEffect(() => {
    saveQueriesReview(currentSaveQueriesLS)
  }, [JSON.stringify(currentSaveQueriesLS)])

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false)
      return
    }

    const newFilter = cleanObject({
      q: debouncedQ,
      date_lte: postedBefore ? postedBefore.toISOString() : '',
      date_gte: postedSince ? postedSince.toISOString() : '',
      status: status as REVIEW_STATUS,
      customer_id,
      product_id
    })

    // saveReviewListParamsToLS({
    //   ...currentListReviewParamsLS,
    //   displayedFilters: currentListReviewParamsLS.displayedFilters,
    //   filter: newFilter
    // })

    // setReviewListRq({
    //   ...reviewListRq,
    //   filter: newFilter
    // })

    // const currentFilterForm = cloneDeep(newFilter)
    // const currentFilterLS = cloneDeep(currentListReviewParamsLS.filter)
    // if (!isEqual(currentFilterLS, currentFilterForm)) {
    //   setMany({
    //     ...tableParamsFromLS,
    //     displayedFilters: JSON.stringify(currentListReviewParamsLS.displayedFilters),
    //     filter: JSON.stringify(newFilter)
    //   })
    // }
  }, [debouncedQ, customer_id, product_id, status, postedBefore, postedSince])

  const handleChangeColumn = (columns: TableColumnsReview) => {
    const value = [...columns]
    setReviewSettingCol(value)

    setReviewSettingColumnsToLS(value as TableColumnsReview)
  }

  const onDragEnd = ({ destination, source }: DropResult) => {
    if (!destination) return
    const newItems = reorderDnd<TableColumns<Review>>(reviewSettingCol, source.index, destination.index)
    const newColSetting = newItems
    setReviewSettingCol(newColSetting)
    setReviewSettingColumnsToLS(newColSetting as TableColumnsReview)
  }

  const handleSetPage = (page: number) => {
    saveReviewListParamsToLS({
      ...currentListReviewParamsLS,
      page,
      perPage: reviewListRq.pagination.perPage
    })

    setReviewListRq({
      ...reviewListRq,
      pagination: {
        perPage: reviewListRq.pagination.perPage,
        page: page + 1
      }
    })

    setMany({
      page: JSON.stringify(page)
    })
  }

  const handleSetRowsPerPage = (rowPerPage: number) => {
    saveReviewListParamsToLS({
      ...currentListReviewParamsLS,
      page: DEFAULT_PAGE,
      perPage: rowPerPage
    })

    setReviewListRq({
      ...reviewListRq,
      pagination: {
        perPage: rowPerPage,
        page: DEFAULT_PAGE + 1
      }
    })

    setMany({
      perPage: JSON.stringify(rowPerPage)
    })
  }

  const handleSort = (field: string, order: SORT) => {
    const sort = {
      field,
      order
    }

    setMany({ sort: JSON.stringify(sort) })

    setReviewListRq({
      ...reviewListRq,
      sort: {
        field,
        order
      }
    })

    saveReviewListParamsToLS({
      ...currentListReviewParamsLS,
      order,
      sort: field as keyof ReviewParam
    })
  }

  const handleDelete = (ids: number[]) => {
    const optimisticData = tmpUndoData.filter((data) => !ids.includes(data.id))
    setTmpUndoData(optimisticData)
    setIsOpenUndo(true)
    setAction('Delete Review')

    const timeOut = setTimeout(() => {
      setIsOpenUndo(false)
      deleteReviewsMutation(ids)
      setTimerId(null)
    }, 3000)

    setTimerId(timeOut)
  }

  const handleUndo = () => {
    setIsOpenUndo(false)
    setTimerId(null)
    setTmpUndoData(reviewListData)
    if (timerId) {
      clearTimeout(timerId)
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <FormProvider {...methods}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextFieldInput
              label='Search'
              name='q'
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position='end'>
                      <SearchIcon />
                    </InputAdornment>
                  )
                }
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', alignContent: 'center', gap: '8px', color: '#4F3CC9', flexShrink: 0 }}>
            {/* <AddFilter<ReviewParams>
            queryObject={currentListReviewParamsLS}
            filterItems={filterItems}
            currentSaveQueries={currentSaveQueries}
            handleUseQueryFromLS={handleUseQueryFromLS}
            handleAddFilterItem={handleAddFilterItem}
            handleRemoveAllFilterItem={handleRemoveAllFilterItem}
            handleAddSaveQuery={handleAddSaveQuery}
            handleRemoveSaveQuery={handleRemoveCurrentSaveQuery}
          /> */}
            <Button startIcon={<AddIcon />} variant='text'>
              CREATE
            </Button>
            <SettingColumns<Review>
              columns={reviewSettingCol}
              handleChangeColumn={handleChangeColumn}
              onDragEnd={onDragEnd}
            />
            <Button startIcon={<FileDownloadIcon />} variant='text'>
              EXPORT
            </Button>
          </Box>
        </Box>
      </FormProvider>

      <CustomTable<Review, number>
        rowId='id'
        columns={columns}
        dataSource={tmpUndoData}
        totalItems={reviewList?.total}
        pagination={{ page, perPage }}
        sortColFromLS={sortFromLs}
        handleSetPage={handleSetPage}
        handleSetRowsPerPage={handleSetRowsPerPage}
        handleDelete={handleDelete}
        handleSort={handleSort}
        // onClearAllFilter={handleDeleteAllFilter()}
        // onRowClick={handleViewDetail}
      />

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
    </Box>
  )
}
