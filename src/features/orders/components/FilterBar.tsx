import AddFilter from '@/components/AddFilter'
import CustomDatePicker from '@/components/CustomDatePicker'
import SettingColumns from '@/components/SettingColumns'
import TextFieldAutocompleteVirtualized from '@/components/TextFieldAutocompleteVirtualized'
import TextFieldInput from '@/components/TextFieldInput'
import TextFieldNumber from '@/components/TextFieldNumber'
import TextFieldSelect from '@/components/TextFieldSelect'
import { RETURNED } from '@/constants'
import { FilterContext } from '@/features/orders/context/FilterContext'
import { useInfiniteCustomers } from '@/hooks/useInfiniteCustomers'
import { useSearchParam } from '@/hooks/useSearchParam'
import { QuerySaveType, SelectOptionItem } from '@/types'
import { TableColumns } from '@/types/table'
import { cleanObject, isoStringToDate, reorderDnd } from '@/utils'
import {
  getListParamsFormLS,
  getOrderSaveQueryFormLS,
  saveListParamsToLS,
  setOrderSaveQueryToLS,
  setSettingColumnsToLS
} from '@/utils/orders'
import { yupResolver } from '@hookform/resolvers/yup'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import SearchIcon from '@mui/icons-material/Search'
import { Box, Button, InputAdornment, styled } from '@mui/material'
import { debounce } from 'lodash'
import cloneDeep from 'lodash/cloneDeep'
import isEqual from 'lodash/isEqual'
import { useContext, useEffect, useMemo, useState } from 'react'
import { DropResult } from 'react-beautiful-dnd'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { schema } from '../schemas'
import { Order, OrderFilterItem, OrderParams, OrderSettingColumn, OrderUrlQuery } from '../types'
import { useTranslation } from 'react-i18next'

const optionReturned: SelectOptionItem[] = [
  {
    label: 'Yes',
    value: RETURNED.Y
  },
  {
    label: 'No',
    value: RETURNED.N
  }
]

const FilterBarWrapper = styled('div')({
  display: 'flex',
  alignItems: 'end',
  justifyContent: 'space-between'
})

const FilterBar = ({ handleExport }: { handleExport: () => void }) => {
  const { t } = useTranslation(['common', 'order'])
  const { filterItems, columnSetting, activeTab, orderListRq, setFilterItems, setColumnSetting, setOrderListRq } =
    useContext(FilterContext)
  const { setMany } = useSearchParam()
  const [isFirstRender, setIsFirstRender] = useState(true)
  const currentListParamsLS = getListParamsFormLS()
  const currentSaveQueriesLS = getOrderSaveQueryFormLS()
  const [currentSaveQueries, setCurrentSaveQueries] = useState<QuerySaveType[]>(currentSaveQueriesLS)

  const [debouncedQ, setDebouncedQ] = useState(currentListParamsLS.filter.q)

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      returned: '',
      q: ''
    }
  })

  const customerId = useWatch({ name: 'customer_id', control: methods.control })
  const returned = useWatch({ name: 'returned', control: methods.control })
  const minAmount = useWatch({ name: 'total_gte', control: methods.control })
  const passedBefore = useWatch({ name: 'date_lte', control: methods.control })
  const passedSince = useWatch({ name: 'date_gte', control: methods.control })
  const q = useWatch({ name: 'q', control: methods.control })

  const debouncedSetQ = useMemo(() => debounce((value: string) => setDebouncedQ(value), 500), [])

  useEffect(() => {
    debouncedSetQ(q ?? '')
    return () => {
      debouncedSetQ.cancel()
    }
  }, [q, debouncedSetQ])

  const tableParamsFromLS = {
    order: currentListParamsLS.order,
    page: currentListParamsLS.page.toString(),
    perPage: currentListParamsLS.perPage.toString(),
    sort: currentListParamsLS.sort
  }

  const [customerSearchTerm, setCustomerSearchTerm] = useState('')

  const {
    customerOptions,
    hasNextPage,
    loadMore,
    isLoading: isLoadingCustomers
  } = useInfiniteCustomers({
    searchTerm: customerSearchTerm,
    enabled: filterItems[0]?.isChecked || false
  })

  const handleCustomerSearch = (searchTerm: string) => {
    setCustomerSearchTerm(searchTerm)
  }

  useEffect(() => {
    methods.reset({
      ...currentListParamsLS.filter,
      date_gte: isoStringToDate(currentListParamsLS.filter.date_gte),
      date_lte: isoStringToDate(currentListParamsLS.filter.date_lte)
    })
  }, [JSON.stringify(currentListParamsLS)])

  useEffect(() => {
    setOrderSaveQueryToLS(currentSaveQueries)
  }, [JSON.stringify(currentSaveQueries)])

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false)
      return
    }

    const newFilter = cleanObject({
      q: debouncedQ,
      returned: returned,
      total_gte: minAmount ?? 0,
      date_lte: passedBefore ? passedBefore.toISOString() : '',
      date_gte: passedSince ? passedSince.toISOString() : '',
      status: activeTab,
      customerId: customerId ?? ''
    })

    saveListParamsToLS({
      ...currentListParamsLS,
      displayedFilters: currentListParamsLS.displayedFilters,
      filter: newFilter
    })

    setOrderListRq({
      ...orderListRq,
      filter: newFilter
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
  }, [debouncedQ, customerId, returned, minAmount, passedBefore, passedSince, activeTab])

  const handleAddSaveQuery = (value: QuerySaveType[]) => {
    setCurrentSaveQueries(value)
  }

  const handleRemoveCurrentSaveQuery = (id: number) => {
    const newUseQuery = currentSaveQueries.filter((query) => query.id != id)
    setCurrentSaveQueries(newUseQuery)
  }

  const handleChangeColumn = (columns: TableColumns<Order>[]) => {
    const value = {
      ...columnSetting,
      [activeTab]: columns
    }
    setColumnSetting(value)

    setSettingColumnsToLS(value as OrderSettingColumn)
  }

  const handleSetFilterItemsToUrlAndLS = (filterItem: OrderFilterItem[]) => {
    const newDisplayedFilters = cleanObject(
      filterItem.reduce((acc, curr) => {
        if (!curr.isChecked) {
          delete currentListParamsLS.filter[curr.key]
        }
        return { ...acc, [curr.key]: curr.isChecked }
      }, {})
    )

    saveListParamsToLS({
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

  const handleAddFilterItem = (newFilterItems: OrderFilterItem[]) => {
    setFilterItems(newFilterItems)
    const newDisplayedFilters = newFilterItems
      .filter((item) => item.isChecked)
      .reduce((acc, curr) => {
        return { ...acc, [curr.key]: curr.isChecked }
      }, {})

    saveListParamsToLS({
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

  const handleRemoveFilterItem = (key: 'returned' | 'q' | 'customer_id' | 'total_gte' | 'date_gte' | 'date_lte') => {
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

  const handleRemoveAllFilterItem = (newFilterItems: OrderFilterItem[]) => {
    setFilterItems(newFilterItems)

    handleSetFilterItemsToUrlAndLS(newFilterItems)
  }

  const handleUseQueryFromLS = (param: OrderUrlQuery) => {
    const newFilterItems = filterItems.map((item) => ({
      ...item,
      isChecked: !!param.displayedFilters?.[item.key as keyof OrderParams]
    }))
    setFilterItems(newFilterItems)

    saveListParamsToLS({
      ...currentListParamsLS,
      displayedFilters: param.displayedFilters,
      filter: param.filter
    })
  }

  const onDragEnd = ({ destination, source }: DropResult) => {
    if (!destination) return
    const newItems = reorderDnd<TableColumns<Order>>(columnSetting[activeTab], source.index, destination.index)
    const newColSetting = { ...columnSetting, [activeTab]: newItems }
    setColumnSetting(newColSetting)
    setSettingColumnsToLS(newColSetting as OrderSettingColumn)
  }

  return (
    <FilterBarWrapper>
      <FormProvider {...methods}>
        <Box sx={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'start' }}>
          <TextFieldInput
            name='q'
            label={t('order:search')}
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

          {filterItems[0].isChecked && (
            <TextFieldAutocompleteVirtualized
              label={t('order:customer')}
              name='customer_id'
              options={customerOptions}
              handleClose={handleRemoveFilterItem('customer_id')}
              sxAutocomplete={{ width: '203px' }}
              onSearch={handleCustomerSearch}
              hasNextPage={hasNextPage}
              loadMore={loadMore}
              isLoading={isLoadingCustomers}
            />
          )}
          {filterItems[1].isChecked && (
            <CustomDatePicker
              name='date_gte'
              triggerFiled='date_lte'
              datePickerLabel={t('order:date_gte')}
              sxDatePicker={{ width: '169px' }}
              handleClose={handleRemoveFilterItem('date_gte')}
            />
          )}
          {filterItems[2].isChecked && (
            <CustomDatePicker
              name='date_lte'
              triggerFiled='date_gte'
              datePickerLabel={t('order:date_lte')}
              sxDatePicker={{ width: '169px' }}
              handleClose={handleRemoveFilterItem('date_lte')}
            />
          )}
          {filterItems[3].isChecked && (
            <TextFieldNumber
              label={t('order:total_gte')}
              name='total_gte'
              sxTextFiled={{ width: '194px' }}
              handleClose={handleRemoveFilterItem('total_gte')}
            />
          )}
          {filterItems[4].isChecked && (
            <TextFieldSelect
              options={optionReturned}
              name='returned'
              textFieldLabel={t('order:returned')}
              handleClose={handleRemoveFilterItem('returned')}
              sxTextFiled={{ width: '164px' }}
            />
          )}
        </Box>
      </FormProvider>

      <Box sx={{ display: 'flex', alignContent: 'center', gap: '8px', color: '#4F3CC9', flexShrink: 0 }}>
        <AddFilter<OrderParams>
          queryObject={currentListParamsLS}
          filterItems={filterItems}
          currentSaveQueries={currentSaveQueries}
          handleUseQueryFromLS={handleUseQueryFromLS}
          handleAddFilterItem={handleAddFilterItem}
          handleRemoveAllFilterItem={handleRemoveAllFilterItem}
          handleAddSaveQuery={handleAddSaveQuery}
          handleRemoveSaveQuery={handleRemoveCurrentSaveQuery}
        />
        <SettingColumns<Order>
          columns={columnSetting[activeTab]}
          handleChangeColumn={handleChangeColumn}
          onDragEnd={onDragEnd}
        />
        <Button startIcon={<FileDownloadIcon />} variant='text' onClick={handleExport}>
          {t('common:export')}
        </Button>
      </Box>
    </FilterBarWrapper>
  )
}

export default FilterBar
