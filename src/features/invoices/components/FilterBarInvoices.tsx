import AddFilter from '@/components/AddFilter'
import CustomDatePicker from '@/components/CustomDatePicker'
import SettingColumns from '@/components/SettingColumns'
import TextFieldAutocompleteVirtualized from '@/components/TextFieldAutocompleteVirtualized'
import { useInfiniteCustomers } from '@/hooks/useInfiniteCustomers'
import { useInfiniteOrders } from '@/hooks/useInfiniteOrders'
import { useSearchParam } from '@/hooks/useSearchParam'
import { Invoice } from '@/services/data-generator'
import { QuerySaveType } from '@/types'
import { TableColumns } from '@/types/table'
import { cleanObject, isoStringToDate, reorderDnd } from '@/utils'
import {
  getInvoiceListParamsFormLS,
  getInvoiceSaveQueries,
  saveInvoiceListParamsToLS,
  saveQueriesInvoice,
  setInvoicesSettingColumnsToLS
} from '@/utils/invoices'
import { yupResolver } from '@hookform/resolvers/yup'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import { Box, Button } from '@mui/material'
import { cloneDeep, isEqual } from 'lodash'
import { useEffect, useState } from 'react'
import { DropResult } from 'react-beautiful-dnd'
import { FormProvider, Resolver, useForm, useWatch } from 'react-hook-form'
import { InferType } from 'yup'
import { initFilterInvoiceItems } from '../constant'
import { filterInvoicesSchema } from '../schemas'
import { GetInvoicesListRequest, InvoiceFilterItem, InvoiceParam, InvoiceUrlQuery, TableColumnsInvoice } from '../types'
import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'

type FormValues = InferType<typeof filterInvoicesSchema>

interface Props {
  invoiceListRq: GetInvoicesListRequest
  setInvoiceListRq: React.Dispatch<React.SetStateAction<GetInvoicesListRequest>>
  invoiceSettingCol: TableColumnsInvoice
  setInvoiceSettingCol: React.Dispatch<React.SetStateAction<TableColumnsInvoice>>
  handleExport: () => void
}

export default function FilterBarInvoices({
  invoiceListRq,
  invoiceSettingCol,
  setInvoiceListRq,
  setInvoiceSettingCol,
  handleExport
}: Props) {
  const { t } = useTranslation(['invoice', 'common'])
  const { setMany } = useSearchParam()
  const [isFirstRender, setIsFirstRender] = useState(true)

  const currentListParamsLS = getInvoiceListParamsFormLS()
  const currentSaveQueriesLS = getInvoiceSaveQueries()
  const [currentSaveQueries, setCurrentSaveQueries] = useState<QuerySaveType[]>(currentSaveQueriesLS)
  const [filterItems, setFilterItems] = useState<InvoiceFilterItem[]>(
    initFilterInvoiceItems.map((item) => {
      return {
        ...item,
        isChecked: !!currentListParamsLS.displayedFilters?.[item.key]
      }
    })
  )

  const [customerSearchTerm, setCustomerSearchTerm] = useState('')
  const [orderSearchTerm, setOrderSearchTerm] = useState('')

  const tableParamsFromLS = {
    order: currentListParamsLS.order,
    page: currentListParamsLS.page.toString(),
    perPage: currentListParamsLS.perPage.toString(),
    sort: currentListParamsLS.sort
  }

  const method = useForm<FormValues>({
    mode: 'onChange',
    resolver: yupResolver(filterInvoicesSchema) as Resolver<FormValues>,
    defaultValues: {
      customer_id: '',
      order_id: '',
      date_gte: null,
      date_lte: null
    }
  })
  const date_lte = useWatch({ name: 'date_lte', control: method.control })
  const date_gte = useWatch({ name: 'date_gte', control: method.control })
  const customer_id = useWatch({ name: 'customer_id', control: method.control })
  const order_id = useWatch({ name: 'order_id', control: method.control })

  const {
    customerOptions,
    hasNextPage,
    loadMore,
    isLoading: isLoadingCustomers
  } = useInfiniteCustomers({
    searchTerm: customerSearchTerm,
    enabled: !!filterItems[0]?.isChecked
  })

  const {
    orderOptions,
    hasNextPage: hasNextPageOrder,
    loadMore: loadMoreOrder,
    isLoading: isLoadingOrder
  } = useInfiniteOrders({
    searchTerm: orderSearchTerm,
    enabled: !!filterItems[1]?.isChecked
  })

  useEffect(() => {
    setFilterItems(
      initFilterInvoiceItems.map((item) => {
        return {
          ...item,
          isChecked: !!currentListParamsLS.displayedFilters?.[item.key],
          label: t(`invoice:${item.key}`)
        }
      })
    )
  }, [t])

  useEffect(() => {
    saveQueriesInvoice(currentSaveQueries)
  }, [JSON.stringify(currentSaveQueries)])

  useEffect(() => {
    if (currentListParamsLS.filter) {
      method.reset({
        ...currentListParamsLS.filter,
        date_gte: isoStringToDate(currentListParamsLS.filter.date_gte),
        date_lte: isoStringToDate(currentListParamsLS.filter.date_lte)
      })
    }
    return
  }, [JSON.stringify(currentListParamsLS.filter)])

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false)
      return
    }

    const newFilter = cleanObject({
      date_gte: date_gte ? date_gte.toISOString() : '',
      date_lte: date_lte ? date_lte.toISOString() : '',
      customer_id: customer_id ? customer_id : '',
      order_id: order_id ? order_id : ''
    })

    saveInvoiceListParamsToLS({
      ...currentListParamsLS,
      filter: newFilter
    })

    setInvoiceListRq({
      ...invoiceListRq,
      filter: newFilter as GetInvoicesListRequest['filter']
    })

    const currentFilterForm = cloneDeep(newFilter)
    const currentFilterLS = cloneDeep(currentListParamsLS.filter)
    if (!isEqual(currentFilterLS, currentFilterForm)) {
      setMany({
        ...tableParamsFromLS,
        displayedFilters: JSON.stringify(currentListParamsLS.displayedFilters),
        filter: JSON.stringify(newFilter)
      })
    }
  }, [date_gte, date_lte, customer_id, order_id])

  const handleCustomerSearch = (searchTerm: string) => {
    setCustomerSearchTerm(searchTerm)
  }

  const handleOrderSearch = (searchTerm: string) => {
    setOrderSearchTerm(searchTerm)
  }

  const onDragEnd = ({ destination, source }: DropResult) => {
    if (!destination) return
    const newItems = reorderDnd<TableColumns<Invoice>>(invoiceSettingCol, source.index, destination.index)
    const newColSetting = newItems
    setInvoiceSettingCol(newColSetting)
    setInvoicesSettingColumnsToLS(newColSetting)
  }

  const handleChangeColumn = (columns: TableColumnsInvoice) => {
    setInvoiceSettingCol(columns)
    setInvoicesSettingColumnsToLS(columns)
  }

  const handleSetFilterItemsToUrlAndLS = (filterItem: InvoiceFilterItem[]) => {
    const newDisplayedFilters = cleanObject(
      filterItem.reduce((acc, curr) => {
        if (!curr.isChecked) {
          delete currentListParamsLS.filter[curr.key]
        }
        return { ...acc, [curr.key]: curr.isChecked }
      }, {})
    )

    saveInvoiceListParamsToLS({
      ...currentListParamsLS,
      displayedFilters: newDisplayedFilters,
      filter: currentListParamsLS.filter
    })

    setMany({
      ...tableParamsFromLS,
      displayedFilters: JSON.stringify(newDisplayedFilters),
      filter: JSON.stringify({ ...currentListParamsLS.filter })
    })
  }

  const handleAddSaveQuery = (value: QuerySaveType[]) => {
    setCurrentSaveQueries(value)
  }

  const handleRemoveCurrentSaveQuery = (id: number) => {
    const newUseQuery = currentSaveQueries.filter((query) => query.id != id)
    setCurrentSaveQueries(newUseQuery)
  }

  const handleUseQueryFromLS = (param: InvoiceUrlQuery) => {
    const newFilterItems = filterItems.map((item) => ({
      ...item,
      isChecked: !!param.displayedFilters?.[item.key as keyof InvoiceParam]
    }))
    setFilterItems(newFilterItems)

    saveInvoiceListParamsToLS({
      ...currentListParamsLS,
      displayedFilters: param.displayedFilters,
      filter: param.filter
    })
  }

  const handleAddFilterItem = (newFilterItems: InvoiceFilterItem[]) => {
    setFilterItems(newFilterItems)
    handleSetFilterItemsToUrlAndLS(newFilterItems)
  }

  const handleRemoveAllFilterItem = (newFilterItems: InvoiceFilterItem[]) => {
    setFilterItems(newFilterItems)

    const newDisplayedFilters = cleanObject(
      newFilterItems.reduce((acc, curr) => {
        if (!curr.isChecked) {
          delete currentListParamsLS.filter[curr.key]
        }
        return { ...acc, [curr.key]: curr.isChecked }
      }, {})
    )

    saveInvoiceListParamsToLS({
      ...currentListParamsLS,
      displayedFilters: newDisplayedFilters,
      filter: currentListParamsLS.filter
    })

    setMany({
      ...tableParamsFromLS,
      displayedFilters: JSON.stringify(newDisplayedFilters),
      filter: JSON.stringify({ ...currentListParamsLS.filter })
    })
  }

  const handleRemoveFilterItem = (key: string) => () => {
    const newFilterItems = filterItems.map((item) => {
      if (item.key === key) {
        return {
          ...item,
          isChecked: false
        }
      }
      return item
    })
    setFilterItems(newFilterItems)
    handleSetFilterItemsToUrlAndLS(newFilterItems)
  }

  return (
    <FormProvider {...method}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'start' }}>
          <CustomDatePicker name='date_gte' datePickerLabel={t('invoice:date_gte')} sxDatePicker={{ width: '166px' }} />
          <CustomDatePicker name='date_lte' datePickerLabel={t('invoice:date_lte')} sxDatePicker={{ width: '166px' }} />
          {currentListParamsLS.displayedFilters?.customer_id && (
            <TextFieldAutocompleteVirtualized
              name='customer_id'
              label={t('invoice:customer_id')}
              sxAutocomplete={{ width: '164px' }}
              options={customerOptions}
              onSearch={handleCustomerSearch}
              loadMore={loadMore}
              hasNextPage={hasNextPage}
              isLoading={isLoadingCustomers}
              handleClose={handleRemoveFilterItem('customer_id')}
            />
          )}
          {currentListParamsLS.displayedFilters?.order_id && (
            <TextFieldAutocompleteVirtualized
              name='order_id'
              label={t('invoice:order_id')}
              sxAutocomplete={{ width: '164px' }}
              options={orderOptions}
              onSearch={handleOrderSearch}
              loadMore={loadMoreOrder}
              hasNextPage={hasNextPageOrder}
              isLoading={isLoadingOrder}
              handleClose={handleRemoveFilterItem('order_id')}
            />
          )}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'end', gap: 2, flexShrink: 0 }}>
          <AddFilter<InvoiceParam>
            queryObject={currentListParamsLS}
            filterItems={filterItems}
            currentSaveQueries={currentSaveQueries}
            handleUseQueryFromLS={handleUseQueryFromLS}
            handleAddFilterItem={handleAddFilterItem}
            handleRemoveAllFilterItem={handleRemoveAllFilterItem}
            handleAddSaveQuery={handleAddSaveQuery}
            handleRemoveSaveQuery={handleRemoveCurrentSaveQuery}
          />
          <SettingColumns columns={invoiceSettingCol} onDragEnd={onDragEnd} handleChangeColumn={handleChangeColumn} />
          <Button startIcon={<FileDownloadIcon />} onClick={handleExport} variant='text'>
            {t('common:export')}
          </Button>
        </Box>
      </Box>
    </FormProvider>
  )
}
