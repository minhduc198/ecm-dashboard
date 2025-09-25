import { Box, Button, Grid } from '@mui/material'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import AddIcon from '@mui/icons-material/Add'
import FilterBarInvoices from '../invoices/components/FilterBarInvoices'
import FilterBarProduct from './components/FilterBarProduct'
import { useState } from 'react'
import { GetProductListRequest } from './constant'
import { getProductListParamsFormLS } from '@/utils/products'

const Products = () => {
  const { filter, order, page, perPage, sort } = getProductListParamsFormLS()

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

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'end', gap: 2 }}>
        {/*  */}
        <Button startIcon={<AddIcon />} variant='text'>
          CREATE
        </Button>
        <Button startIcon={<FileDownloadIcon />} variant='text'>
          EXPORT
        </Button>
      </Box>
      <Grid container spacing={2}>
        <Grid size={{ xs: 3 }}>
          <FilterBarProduct />
        </Grid>
        <Grid size={{ xs: 9 }}>
          {/* <CustomTable<Customer, number>
            rowId='id'
            columns={columns}
            dataSource={tmpUndoData}
            handleDelete={handleDeleteCustomers}
            handleSetPage={handleSetPage}
            handleSetRowsPerPage={handleSetRowsPerPage}
            handleSort={handleSort}
            sortColFromLS={sortFromLs}
            onRowClick={handleViewCustomerDetail}
            pagination={{
              page,
              perPage
            }}
            totalItems={customerListData?.total}
          /> */}
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
