import { Box, Button, Grid, Menu, MenuItem, TablePagination } from '@mui/material'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import AddIcon from '@mui/icons-material/Add'
import FilterBarInvoices from '../invoices/components/FilterBarInvoices'
import FilterBarProduct from './components/FilterBarProduct'
import { useEffect, useMemo, useState } from 'react'
import { getProductListParamsFormLS, saveProductListParamsToLS } from '@/utils/products'
import ProductCard from './components/ProductCard'
import { useQuery } from '@tanstack/react-query'
import { fetchProductsList } from './services'
import { GetProductListRequest, ProductParam, SortByEnum } from './types'
import { DEFAULT_PAGE } from '@/constants'
import { useSearchParam } from '@/hooks/useSearchParam'
import { sortName, sortOrder } from './constant'
import { SORT } from '@/types'
import { utils, writeFileXLSX } from 'xlsx'
import { formatDate } from '@/utils/date'

const getCurrentSortName = (sortBy: string) => {
  const [sort, order] = sortBy.split('_')
  return `${sortName[sort as keyof typeof sortName]} ${sortOrder[order as keyof typeof sortOrder]}`
}

const Products = () => {
  const { filter, order, page, perPage, sort } = getProductListParamsFormLS()

  const productListParamFromLS = getProductListParamsFormLS()
  const { setMany } = useSearchParam()

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
  const productListData = productList?.data ?? []

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
        field: sort,
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
    const exportData = productListData.map((item) => {
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
        <Button startIcon={<AddIcon />} variant='text'>
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
            <ProductCard itemData={productListData} />
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

      {/* <Snackbar
        open={isOpenUndo}
        autoHideDuration={1000}
        message={action}
        action={
          <Button size='small' onClick={handleUndo}>
            UNDO
          </Button>
        }
      /> */}
    </Box>
  )
}

export default Products
