import { queryClient } from '@/App'
import AddFilter from '@/components/AddFilter'
import CustomDatePicker from '@/components/CustomDatePicker'
import CustomTable from '@/components/CustomTable'
import SettingColumns from '@/components/SettingColumns'
import TextFieldAutocompleteVirtualized from '@/components/TextFieldAutocompleteVirtualized'
import TextFieldInput from '@/components/TextFieldInput'
import TextFieldSelect from '@/components/TextFieldSelect'
import { DEFAULT_PAGE } from '@/constants'
import { useInfiniteCustomers } from '@/hooks/useInfiniteCustomers'
import { useInfiniteProducts } from '@/hooks/useInfiniteProducts'
import { useSearchParam } from '@/hooks/useSearchParam'
import { path } from '@/routers/path'
import { Customer, Review } from '@/services/data-generator'
import { useUndoReviewStore } from '@/store/reviewStore'
import { QuerySaveType, SORT } from '@/types'
import { TableColumns } from '@/types/table'
import { cleanObject, isoStringToDate, reorderDnd } from '@/utils'
import { formatDate } from '@/utils/date'
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
import StarsIcon from '@mui/icons-material/Stars'
import { Avatar, Box, Button, InputAdornment, Snackbar, SnackbarCloseReason, Tooltip, Typography } from '@mui/material'
import { useMutation, useQuery } from '@tanstack/react-query'
import { cloneDeep, debounce, isEqual, sortBy } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { DropResult } from 'react-beautiful-dnd'
import { FormProvider, Resolver, useForm, useWatch } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { utils, writeFileXLSX } from 'xlsx'
import { InferType } from 'yup'
import { initFilterReviewItems, initialReviewColumns, optionStatus } from './constants'
import { filterReviewSchema } from './schemas'
import { deleteReviews, fetchReviewList } from './services'
import {
  GetReviewListRequest,
  REVIEW_STATUS,
  ReviewFilterItem,
  ReviewParam,
  ReviewUrlQuery,
  TableColumnsReview
} from './types'
import { useDrawerStore } from '@/store/drawerStore'
import TextLineClamp from '@/components/TextLineClamp'
import { useHeaderTitleStore } from '@/store/headerStore'

type FormValues = InferType<typeof filterReviewSchema>

export default function Reviews() {
  const { setMany } = useSearchParam()
  const { setHeaderData } = useHeaderTitleStore()
  const navigate = useNavigate()
  const {
    action,
    tmpUndoData,
    isOpenUndo,
    timerId,
    createMessageSuccess,
    dataPending,
    setDataPending,
    setTmpUndoData,
    setIsOpenUndo,
    setTimerId,
    setAction,
    setCreateMessageSuccess
  } = useUndoReviewStore()
  const { openDrawer, setOpenDrawer, setGetById } = useDrawerStore()

  const reviewSettingColFromLS = getReviewSettingColumnsFromLS()
  const currentListReviewParamsLS = getReviewListParamsFormLS()
  const currentSaveQueriesLS = getReviewSaveQueries()
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

  const [customerSearchTerm, setCustomerSearchTerm] = useState('')
  const [productSearchTerm, setProductSearchTerm] = useState('')
  const [currentSaveQueries, setCurrentSaveQueries] = useState<QuerySaveType[]>(currentSaveQueriesLS)
  const [filterItems, setFilterItems] = useState<ReviewFilterItem[]>(
    initFilterReviewItems.map((item) => {
      return {
        ...item,
        isChecked: !!currentListReviewParamsLS.displayedFilters?.[item.key]
      }
    })
  )

  const { data: reviewList } = useQuery({
    queryKey: ['review_list', reviewListRq],
    queryFn: () => fetchReviewList(reviewListRq),
    refetchOnWindowFocus: false,
    keepPreviousData: true
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

  const tableParamsFromLS = {
    order: currentListReviewParamsLS.order,
    page: currentListReviewParamsLS.page.toString(),
    perPage: currentListReviewParamsLS.perPage.toString(),
    sort: currentListReviewParamsLS.sort
  }

  const columns: TableColumns<Review>[] = useMemo(() => {
    return [
      {
        label: '',
        id: 'status-column' as keyof Review,
        isVisible: true
      },
      ...reviewSettingCol
    ]
      .filter((col) => col.isVisible)
      .map((col) => {
        const tableColumn = {
          id: col.id,
          label: col.label,
          sortable: true,
          sortBy: col.id
        }

        switch (col.id) {
          case 'status-column' as keyof Review:
            return {
              ...tableColumn,
              sortable: false,
              cell: (_, row) => {
                const backgroundColor =
                  row.status === REVIEW_STATUS.ACCEPTED
                    ? 'green'
                    : row.status === REVIEW_STATUS.PENDING
                      ? 'orange'
                      : 'red'

                return <Box sx={{ backgroundColor, width: '5px', height: '59px' }}></Box>
              }
            }

          case 'date':
            return {
              ...tableColumn,
              cell: (value) => (typeof value === 'string' ? formatDate(value, 'd/M/yyyy') : null)
            }

          case 'customer_id':
            return {
              ...tableColumn,
              forceClickRow: true,
              cell: (_, row) => {
                const customer = (row.customer as Customer) || {}
                return (
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Avatar sx={{ width: 25, height: 25 }} src={customer.avatar} alt={customer.first_name} />
                    {openDrawer ? (
                      <Tooltip title={`${customer.first_name} ${customer.last_name}`}>
                        <Typography
                          noWrap
                          sx={{
                            width: '80px',
                            fontSize: '14px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            cursor: 'pointer'
                          }}
                        >
                          {`${customer.first_name} ${customer.last_name}`}
                        </Typography>
                      </Tooltip>
                    ) : (
                      `${customer.first_name} ${customer.last_name}`
                    )}
                  </Box>
                )
              }
            }

          case 'product_id':
            return {
              forceClickRow: true,
              ...tableColumn,
              cell: (_, row) => <Box sx={{ display: 'flex', width: '130px' }}>{row.product.reference}</Box>
            }
          case 'rating':
            return {
              forceClickRow: true,
              ...tableColumn,
              cell: (value) => {
                const star = Number(value)
                return (
                  <Box sx={{ display: 'flex' }}>
                    {Array(5)
                      .fill(0)
                      .map((_, idx) => {
                        if (idx + 1 <= star) {
                          return <StarsIcon sx={{ width: '20px', height: '20px' }} color='action' key={idx} />
                        }
                        return <Box key={idx}></Box>
                      })}
                  </Box>
                )
              }
            }

          case 'comment':
            return {
              ...tableColumn,
              cell: (value) =>
                String(value).length >= 30 ? (
                  <Tooltip title={String(value)}>
                    <Typography
                      noWrap
                      sx={{
                        width: '300px',
                        fontSize: '14px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        cursor: 'pointer'
                      }}
                    >
                      {String(value)}
                    </Typography>
                  </Tooltip>
                ) : (
                  String(value)
                )
            }

          case 'status':
            return {
              ...tableColumn
            }

          default:
            return col
        }
      })
  }, [reviewSettingCol, openDrawer])

  const methods = useForm<FormValues>({
    mode: 'onChange',
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

  const {
    customerOptions,
    hasNextPage,
    loadMore,
    isLoading: isLoadingCustomers
  } = useInfiniteCustomers({
    searchTerm: customerSearchTerm,
    customerId: reviewListRq?.filter?.customer_id
  })

  const {
    productOptions,
    hasNextPage: hasNextPageProduct,
    loadMore: loadMoreProduct,
    isLoading: isLoadingProduct
  } = useInfiniteProducts({
    id: Number(reviewListRq?.filter?.product_id),
    searchTerm: productSearchTerm
  })

  const reviewSettingNameCols = useMemo(
    () => reviewSettingCol.filter((col) => col.isVisible).map((i) => i.id),
    [reviewSettingCol]
  )

  useEffect(() => {
    const newList = reviewList?.data ?? []
    if (!timerId && !dataPending.id) {
      setTmpUndoData(newList)
    }
  }, [reviewList?.data])

  useEffect(() => {
    debouncedSetQ(q ?? '')
    return () => {
      debouncedSetQ.cancel()
    }
  }, [q, debouncedSetQ])

  useEffect(() => {
    methods.reset({
      ...currentListReviewParamsLS.filter,
      date_gte: isoStringToDate(currentListReviewParamsLS.filter.date_gte),
      date_lte: isoStringToDate(currentListReviewParamsLS.filter.date_lte)
    })
  }, [JSON.stringify(currentListReviewParamsLS)])

  useEffect(() => {
    saveQueriesReview(currentSaveQueries)
  }, [JSON.stringify(currentSaveQueries)])

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

    saveReviewListParamsToLS({
      ...currentListReviewParamsLS,
      displayedFilters: currentListReviewParamsLS.displayedFilters,
      filter: newFilter
    })

    setReviewListRq({
      ...reviewListRq,
      filter: newFilter
    })

    const currentFilterForm = cloneDeep(newFilter)
    const currentFilterLS = cloneDeep(currentListReviewParamsLS.filter)
    if (!isEqual(currentFilterLS, currentFilterForm)) {
      setMany({
        ...tableParamsFromLS,
        displayedFilters: JSON.stringify(currentListReviewParamsLS.displayedFilters),
        filter: JSON.stringify(newFilter)
      })
    }
  }, [debouncedQ, customer_id, product_id, status, postedBefore, postedSince])

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
    setDataPending({
      id: 0,
      data: {}
    })
    setGetById?.('')
    setIsOpenUndo(false)
    setTimerId(null)
    setTmpUndoData(reviewListData)
    if (timerId) {
      clearTimeout(timerId)
    }
  }

  const handleSetFilterItemsToUrlAndLS = (filterItem: ReviewFilterItem[]) => {
    const newDisplayedFilters = cleanObject(
      filterItem.reduce((acc, curr) => {
        if (!curr.isChecked) {
          delete currentListReviewParamsLS.filter[curr.key]
        }
        return { ...acc, [curr.key]: curr.isChecked }
      }, {})
    )

    saveReviewListParamsToLS({
      ...currentListReviewParamsLS,
      displayedFilters: newDisplayedFilters,
      filter: currentListReviewParamsLS.filter
    })

    setMany({
      ...tableParamsFromLS,
      displayedFilters: JSON.stringify(newDisplayedFilters),
      filter: JSON.stringify({ ...currentListReviewParamsLS.filter })
    })
  }

  const handleUseQueryFromLS = (param: ReviewUrlQuery) => {
    const newFilterItems = filterItems.map((item) => ({
      ...item,
      isChecked: !!param.displayedFilters?.[item.key as keyof ReviewParam]
    }))
    setFilterItems(newFilterItems)

    saveReviewListParamsToLS({
      ...currentListReviewParamsLS,
      displayedFilters: param.displayedFilters,
      filter: {
        ...param.filter
      }
    })
  }

  const handleAddFilterItem = (newFilterItems: ReviewFilterItem[]) => {
    setFilterItems(newFilterItems)
    handleSetFilterItemsToUrlAndLS(newFilterItems)
  }

  const handleRemoveAllFilterItem = (newFilterItems: ReviewFilterItem[]) => {
    setFilterItems(newFilterItems)

    const newDisplayedFilters = cleanObject(
      newFilterItems.reduce((acc, curr) => {
        if (!curr.isChecked) {
          delete currentListReviewParamsLS.filter[curr.key]
        }
        return { ...acc, [curr.key]: curr.isChecked }
      }, {})
    )

    saveReviewListParamsToLS({
      ...currentListReviewParamsLS,
      displayedFilters: newDisplayedFilters,
      filter: currentListReviewParamsLS.filter
    })

    setMany({
      ...tableParamsFromLS,
      displayedFilters: JSON.stringify(newDisplayedFilters),
      filter: JSON.stringify({ ...currentListReviewParamsLS.filter })
    })
  }

  const handleAddSaveQuery = (value: QuerySaveType[]) => {
    setCurrentSaveQueries(value)
  }

  const handleRemoveCurrentSaveQuery = (id: number) => {
    const newUseQuery = currentSaveQueries.filter((query) => query.id != id)
    setCurrentSaveQueries(newUseQuery)
  }

  const handleRemoveFilterItem = (key: 'customer_id' | 'q' | 'product_id' | 'date_gte' | 'date_lte' | 'status') => {
    return () => {
      const newFilterItem = filterItems.map((item) => {
        if (item.key === key) {
          return {
            ...item,
            isChecked: false
          }
        }
        return item
      })
      methods.setValue(key, '')
      methods.clearErrors(key)
      setFilterItems(newFilterItem)
      handleSetFilterItemsToUrlAndLS(newFilterItem)
    }
  }

  const handleCustomerSearch = (searchTerm: string) => {
    setCustomerSearchTerm(searchTerm)
  }

  const handleProductSearch = (searchTerm: string) => {
    setProductSearchTerm(searchTerm)
  }

  const handleCreateReview = () => {
    navigate(path.createReview)
  }

  const handleClose = (event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return
    }

    setCreateMessageSuccess('')
  }

  const handleExport = () => {
    const exportData = tmpUndoData.map((data) => {
      const obj = {
        ['Date']: reviewSettingNameCols.includes('date') ? formatDate(data.date, 'HH:mm:ss d/M/yyyy') : '',
        ['Customer']: reviewSettingNameCols.includes('customer_id')
          ? `${data.customer.first_name} ${data.customer.last_name}`
          : '',
        ['Rating']: reviewSettingNameCols.includes('rating') ? data.rating : '',
        ['Product']: reviewSettingNameCols.includes('product_id') ? data.product.reference : '',
        ['Comment']: reviewSettingNameCols.includes('comment') ? data.comment : '',
        ['Status']: reviewSettingNameCols.includes('status') ? data.status : ''
      }

      return cleanObject(obj)
    })

    const ws = utils.json_to_sheet(exportData)
    const wb = utils.book_new()
    utils.book_append_sheet(wb, ws, 'Data')
    writeFileXLSX(wb, `Review_list_${formatDate(new Date().toISOString(), 'dMyyyy')}.xlsx`)
  }

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

  const handleViewDetail = (row: Review) => {
    setHeaderData({
      title: `${row.customer.first_name} ${row.customer.last_name}`
    })
    setOpenDrawer(true)
    navigate(`${path.reviews}/${row.id}`)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <FormProvider {...methods}>
        <Box sx={{ display: 'flex', alignItems: 'end', flexDirection: 'column', gap: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'start',
              gap: 2,
              flexWrap: 'wrap',
              width: '100%'
            }}
          >
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
            {currentListReviewParamsLS.displayedFilters?.status && (
              <TextFieldSelect
                textFieldLabel='Status'
                name='status'
                sxTextFiled={{ width: '164px' }}
                options={optionStatus}
                handleClose={handleRemoveFilterItem('status')}
              />
            )}
            {currentListReviewParamsLS.displayedFilters?.customer_id && (
              <TextFieldAutocompleteVirtualized
                name='customer_id'
                label='Customer'
                sxAutocomplete={{ width: '205px' }}
                options={customerOptions}
                onSearch={handleCustomerSearch}
                loadMore={loadMore}
                hasNextPage={hasNextPage}
                isLoading={isLoadingCustomers}
                handleClose={handleRemoveFilterItem('customer_id')}
              />
            )}
            {currentListReviewParamsLS.displayedFilters?.product_id && (
              <TextFieldAutocompleteVirtualized
                name='product_id'
                label='Product'
                sxAutocomplete={{ width: '164px' }}
                options={productOptions}
                hasNextPage={hasNextPageProduct}
                isLoading={isLoadingProduct}
                onSearch={handleProductSearch}
                loadMore={loadMoreProduct}
                handleClose={handleRemoveFilterItem('product_id')}
              />
            )}
            {currentListReviewParamsLS.displayedFilters?.date_gte && (
              <CustomDatePicker
                name='date_gte'
                triggerFiled='date_lte'
                datePickerLabel='Posted since'
                sxDatePicker={{ width: '170px' }}
                handleClose={handleRemoveFilterItem('date_gte')}
              />
            )}
            {currentListReviewParamsLS.displayedFilters?.date_lte && (
              <CustomDatePicker
                name='date_lte'
                triggerFiled='date_gte'
                datePickerLabel='Posted before'
                sxDatePicker={{ width: '170px' }}
                handleClose={handleRemoveFilterItem('date_lte')}
              />
            )}
          </Box>

          <Box sx={{ display: 'flex', alignContent: 'center', gap: '8px', color: '#4F3CC9', flexShrink: 0 }}>
            <AddFilter<ReviewParam>
              queryObject={currentListReviewParamsLS}
              filterItems={filterItems}
              currentSaveQueries={currentSaveQueries}
              handleUseQueryFromLS={handleUseQueryFromLS}
              handleAddFilterItem={handleAddFilterItem}
              handleRemoveAllFilterItem={handleRemoveAllFilterItem}
              handleAddSaveQuery={handleAddSaveQuery}
              handleRemoveSaveQuery={handleRemoveCurrentSaveQuery}
            />
            <Button startIcon={<AddIcon />} variant='text' onClick={handleCreateReview}>
              CREATE
            </Button>
            <SettingColumns<Review>
              columns={reviewSettingCol}
              handleChangeColumn={handleChangeColumn}
              onDragEnd={onDragEnd}
            />
            <Button startIcon={<FileDownloadIcon />} variant='text' onClick={handleExport}>
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
        onRowClick={handleViewDetail}
        // onClearAllFilter={handleDeleteAllFilter()}
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

      <Snackbar
        open={!!createMessageSuccess}
        onClose={handleClose}
        autoHideDuration={3000}
        message={createMessageSuccess}
      />
    </Box>
  )
}
