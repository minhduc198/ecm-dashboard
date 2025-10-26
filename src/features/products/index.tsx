import { DEFAULT_PAGE } from '@/constants'
import { useSearchParam } from '@/hooks/useSearchParam'
import { path } from '@/routers/path'
import { useUndoProductStore } from '@/store/undoProductStore'
import { SORT } from '@/types'
import { formatDate } from '@/utils/date'
import { getProductListParamsFormLS, saveProductListParamsToLS } from '@/utils/products'
import AddIcon from '@mui/icons-material/Add'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import { Box, Button, Grid, Menu, MenuItem, Snackbar, TablePagination } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { utils, writeFileXLSX } from 'xlsx'
import FilterBarProduct from './components/FilterBarProduct'
import ProductCard from './components/ProductCard'
import { SortByEnum, sortName, sortOrder } from './constant'
import { fetchProductsList } from './services'
import { GetProductListRequest, ProductParam } from './types'

const getCurrentSortName = (sortBy: string) => {
  const [sort, order] = sortBy.split('_')
  return `${sortName[sort as keyof typeof sortName]} ${sortOrder[order as keyof typeof sortOrder]}`
}

const Products = () => {
  const { filter, order, page, perPage, sort } = getProductListParamsFormLS()
  const productListParamFromLS = getProductListParamsFormLS()
  const { setMany } = useSearchParam()
  const navigate = useNavigate()
  const {
    action,
    timerId,
    isOpenUndo,
    dataPending,
    tmpUndoData,
    setTmpUndoData,
    setIsOpenUndo,
    setTimerId,
    setDataPending
  } = useUndoProductStore()

  const [productListRq, setProductListRq] = useState<GetProductListRequest>({
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
  const [sortBy, setSortBy] = useState(SortByEnum.REFERENCE_ASC)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const { data: productList } = useQuery({
    queryKey: ['product_list', productListRq],
    queryFn: () => fetchProductsList(productListRq),
    refetchOnWindowFocus: false,
    keepPreviousData: true
  })

  useEffect(() => {
    const newList = productList?.data ?? []
    if (!timerId && !dataPending.id) {
      setTmpUndoData(newList)
    }
  }, [productList?.data, timerId, dataPending.id])

  useEffect(() => {
    const newSortBy = [sort.toUpperCase(), order].join('_')
    setSortBy(newSortBy as SortByEnum)
  }, [])

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
    saveProductListParamsToLS({
      ...productListParamFromLS,
      page,
      perPage: productListRq.pagination.perPage
    })

    setProductListRq({
      ...productListRq,
      pagination: {
        perPage: productListRq.pagination.perPage,
        page: page + 1
      }
    })

    setMany({
      page: JSON.stringify(page)
    })
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const rowPerPage = Number(event.target.value)
    saveProductListParamsToLS({
      ...productListParamFromLS,
      page: DEFAULT_PAGE,
      perPage: rowPerPage
    })

    setProductListRq({
      ...productListRq,
      pagination: {
        perPage: rowPerPage,
        page: DEFAULT_PAGE + 1
      }
    })

    setMany({
      perPage: JSON.stringify(rowPerPage)
    })
  }

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleClickSort = (value: SortByEnum) => {
    setSortBy(value)
    handleClose()

    const [sort, order] = value.split('_')
    setMany({
      order: order,
      sort: sort.toLowerCase()
    })

    saveProductListParamsToLS({
      ...productListParamFromLS,
      order: order as SORT,
      sort: sort.toLowerCase() as keyof ProductParam
    })

    setProductListRq({
      ...productListRq,
      sort: {
        field: sort.toLowerCase(),
        order: order as SORT
      }
    })
  }

  // REFERENCE_DESC, REFERENCE_ASC, SALES_DESC, SALES_ASC, STOCK_DESC, STOCK_ASC
  const sortMenuItems = useMemo(() => {
    const [sort, order] = sortBy.split('_')
    const options = Object.keys(SortByEnum).filter((i) => {
      const [sortNameItem, orderNameItem] = i.split('_')
      return (
        i !== sortBy &&
        ((sortNameItem !== sort && orderNameItem === 'ASC') || (sortNameItem === sort && order !== orderNameItem))
      )
    })
    return options
  }, [sortBy])

  const handleExport = () => {
    const exportData = tmpUndoData.map((item) => {
      return {
        id: item.id,
        category_id: item.category_id,
        reference: item.reference,
        width: item.width,
        height: item.height,
        thumbnail: item.thumbnail,
        image: item.image,
        description: item.description,
        stock: item.stock,
        sales: item.sales
      }
    })

    const ws = utils.json_to_sheet(exportData)
    const wb = utils.book_new()
    utils.book_append_sheet(wb, ws, 'Data')
    writeFileXLSX(wb, `Product_${formatDate(new Date().toISOString(), 'dMyyyy')}.xlsx`)
  }

  const handleUndo = () => {
    setDataPending({
      id: 0,
      data: {}
    })
    setIsOpenUndo(false)
    setTimerId(null)
    setTmpUndoData(productList?.data ?? [])
    if (timerId) {
      clearTimeout(timerId)
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'end', gap: 2 }}>
        <Box>
          <Button
            id='positioned-button'
            aria-controls={open ? 'positioned-menu' : undefined}
            aria-haspopup='true'
            aria-expanded={open ? 'true' : undefined}
            sx={{
              textDecoration: 'Uppercase'
            }}
            onClick={handleClick}
          >
            Sort by {getCurrentSortName(sortBy)}
          </Button>
          <Menu
            id='positioned-menu'
            aria-labelledby='positioned-button'
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left'
            }}
          >
            {sortMenuItems.map((item) => (
              <MenuItem key={item} onClick={() => handleClickSort(item as SortByEnum)}>
                {getCurrentSortName(item)}
              </MenuItem>
            ))}
          </Menu>
        </Box>
        <Button onClick={() => navigate(path.createProduct)} startIcon={<AddIcon />} variant='text'>
          CREATE
        </Button>
        <Button onClick={handleExport} startIcon={<FileDownloadIcon />} variant='text'>
          EXPORT
        </Button>
      </Box>
      <Grid container spacing={2}>
        <Grid size={{ xs: 3 }}>
          <FilterBarProduct productListRq={productListRq} setProductListRq={setProductListRq} />
        </Grid>
        <Grid size={{ xs: 9 }}>
          <Box>
            <ProductCard itemData={tmpUndoData} />
            <TablePagination
              sx={{ mt: 0 }}
              component='div'
              count={100}
              rowsPerPageOptions={[5, 10, 25, 50]}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={perPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
        </Grid>
      </Grid>

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

export default Products
