import { DEFAULT_PAGE, DEFAULT_PER_PAGE } from '@/constants'
import { REVIEW_STATUS } from '@/features/reviews/types'
import { IPagination, SORT } from '@/types'
import { TableColumns } from '@/types/table'
import DeleteIcon from '@mui/icons-material/Delete'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import { Button, Collapse, IconButton } from '@mui/material'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import Paper from '@mui/material/Paper'
import { alpha } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { SortDirection } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { visuallyHidden } from '@mui/utils'
import { first, slice } from 'lodash'
import * as React from 'react'

interface TableHeaderProps<DataType> {
  columns: TableColumns<DataType>[]
  numSelected: number
  order: SORT
  orderBy: string
  selectable: boolean
  rowCount: number
  collapsibleTable: boolean
  hasStatusColumnStyle: boolean
  collapseRows: Record<string, boolean>
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void
  onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void
  onCollapseAllRow: (isOpenAll: boolean) => void
}
function TableHeader<DataType>(props: TableHeaderProps<DataType>) {
  const [openCollapseAll, setOpenCollapseAll] = React.useState(false)
  const {
    columns,
    selectable,
    order,
    orderBy,
    numSelected,
    rowCount,
    collapsibleTable,
    collapseRows,
    hasStatusColumnStyle,
    onSelectAllClick,
    onRequestSort,
    onCollapseAllRow
  } = props

  const createSortHandler = (property: string) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property)
  }

  const handleCollapseAll = () => {
    setOpenCollapseAll(!openCollapseAll)
    onCollapseAllRow(!openCollapseAll)
  }

  React.useEffect(() => {
    const openCount = Object.values(collapseRows).some(Boolean)
    setOpenCollapseAll(!!openCount)
  }, [collapseRows, rowCount])

  return (
    <TableHead>
      <TableRow>
        {hasStatusColumnStyle && (
          <TableCell sx={{ border: '0 !important', position: 'absolute' }}>
            <Box sx={{ width: '5px', height: '59px' }}></Box>
          </TableCell>
        )}
        {collapsibleTable && (
          <TableCell>
            <IconButton aria-label='expand row' size='small' onClick={handleCollapseAll}>
              {openCollapseAll ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
            </IconButton>
          </TableCell>
        )}
        {selectable && (
          <TableCell padding='checkbox'>
            <Checkbox
              color='primary'
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell>
        )}
        {columns.map((headCell) => (
          <TableCell
            key={headCell.id.toString()}
            sx={{ minWidth: headCell.minWidth, width: headCell.width }}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.sortBy ? (order.toLowerCase() as SortDirection) : false}
          >
            {headCell.sortable ? (
              <TableSortLabel
                active={orderBy === headCell.sortBy}
                direction={orderBy === headCell.sortBy ? (order.toLowerCase() as 'desc' | 'asc') : 'asc'}
                onClick={createSortHandler(headCell.sortBy || '')}
              >
                {headCell.label}
                {orderBy === headCell.sortBy ? (
                  <Box component='span' sx={visuallyHidden}>
                    {order === SORT.DESC ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : (
              headCell.label
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}
interface TableToolbarProps {
  numSelected: number
  handleAccept?: () => void
  handleReject?: () => void
  handleDelete?: () => void
}
function TableToolbar(props: TableToolbarProps) {
  const { numSelected, handleAccept, handleDelete, handleReject } = props

  return (
    <Toolbar
      sx={[
        {
          height: 0,
          minHeight: '0px !important',
          overflow: 'hidden',
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          transition: 'all 0.2s'
        },
        numSelected > 0 && {
          bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
          minHeight: '64px !important',
          height: 16
        }
      ]}
    >
      <Typography sx={{ flex: '1 1 100%' }} color='inherit' variant='subtitle1' component='div'>
        {numSelected} selected
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}
      >
        {handleAccept && (
          <Button color='primary' startIcon={<ThumbUpIcon />} onClick={handleAccept}>
            Delete
          </Button>
        )}
        {handleReject && (
          <Button color='primary' startIcon={<ThumbDownAltIcon />} onClick={handleReject}>
            Delete
          </Button>
        )}
        {handleDelete && (
          <Button color='error' startIcon={<DeleteIcon />} onClick={handleDelete}>
            Delete
          </Button>
        )}
      </Box>
    </Toolbar>
  )
}

interface CustomTableProps<DataType, IdType> {
  dataSource: DataType[]
  columns: TableColumns<DataType>[]
  rowId: keyof DataType
  pagination?: IPagination
  usePagination?: boolean
  selectable?: boolean
  totalItems?: number
  emptyText?: string
  sortColFromLS?: {
    order: SORT
    field: string
  }
  collapsibleTable?: boolean
  handleSetPage?: (page: number) => void
  handleSetRowsPerPage?: (pageSize: number) => void
  handleAccept?: () => void
  handleReject?: () => void
  handleDelete?: (ids: IdType[]) => void
  onClearAllFilter?: () => void
  onRowClick?: (row: DataType) => void
  handleSort?: (field: string, order: SORT) => void
  collapsibleContent?: (row: DataType) => React.ReactNode
}

export default function CustomTable<DataType, IdType>({
  columns,
  dataSource,
  rowId,
  pagination = { page: DEFAULT_PAGE, perPage: DEFAULT_PER_PAGE },
  usePagination = true,
  totalItems,
  selectable = true,
  sortColFromLS,
  emptyText = 'No Orders Found',
  collapsibleTable = false,
  handleSetPage,
  handleSetRowsPerPage,
  handleAccept,
  handleReject,
  handleDelete,
  onClearAllFilter,
  onRowClick,
  handleSort,
  collapsibleContent
}: CustomTableProps<DataType, IdType>) {
  const [order, setOrder] = React.useState<SORT>(sortColFromLS?.order ?? SORT.ASC)
  const [orderBy, setOrderBy] = React.useState<string>(sortColFromLS?.field ?? '')
  const [selected, setSelected] = React.useState<IdType[]>([])
  const [collapseRows, setCollapseRows] = React.useState<Record<string, boolean>>({})

  const hasStatusColumnStyle = columns[0]?.id === 'status-column'
  const cols = hasStatusColumnStyle ? columns.slice(1) : columns

  const allRowIds = dataSource.map((data) => {
    return String(data[rowId])
  })

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: string) => {
    const isAsc = orderBy === property && order === SORT.ASC
    const sortDir = isAsc ? SORT.DESC : SORT.ASC
    setOrder(sortDir)
    setOrderBy(property)
    handleSort?.(property.toString(), sortDir)
  }

  const toggleRow = (id: IdType) => {
    setCollapseRows((prev) => {
      return {
        ...prev,
        [String(id)]: !prev[String(id)]
      }
    })
  }

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = dataSource.map((n) => n[rowId] as IdType)
      setSelected(newSelected)
      return
    }
    setSelected([])
  }

  const handleClick = (id: IdType) => {
    const selectedIndex = selected.indexOf(id)
    let newSelected: IdType[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1))
    }
    setSelected(newSelected)
  }

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    handleSetPage?.(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleSetRowsPerPage?.(parseInt(event.target.value, 10))
  }

  const onDelete = () => {
    if (handleDelete) {
      handleDelete(selected)
      setSelected([])
    }
  }

  const navigateDetailPage =
    (row: DataType, rowId?: IdType) => (e: React.MouseEvent<HTMLTableCellElement, MouseEvent>) => {
      if ((e.target as HTMLElement).nodeName !== 'TD') {
        return
      }

      if (collapsibleTable && rowId) {
        toggleRow(rowId)
        return
      }

      if (onRowClick) {
        onRowClick(row)
      }
    }

  const calcBorderBottomWidth = (row: DataType) => (collapseRows[String(row[rowId])] ? 0 : 1)

  const onCollapseAllRow = (isOpenAll: boolean) => {
    const reduceCollapseRow: Record<string, boolean> = allRowIds.reduce(
      (prev, curId) => ({
        ...prev,
        [curId]: isOpenAll
      }),
      {}
    )
    setCollapseRows(reduceCollapseRow)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableToolbar
          numSelected={selected.length}
          handleAccept={handleAccept}
          handleDelete={onDelete}
          handleReject={handleReject}
        />
        <TableContainer sx={{ maxHeight: '100%', position: 'relative' }}>
          {dataSource.length ? (
            <Table aria-labelledby='tableTitle' size='medium'>
              <TableHeader<DataType>
                columns={cols}
                selectable={selectable}
                numSelected={selected.length}
                order={order}
                orderBy={orderBy.toString()}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={dataSource.length}
                collapseRows={collapseRows}
                hasStatusColumnStyle={hasStatusColumnStyle}
                collapsibleTable={collapsibleTable}
                onCollapseAllRow={onCollapseAllRow}
              />
              <TableBody>
                {dataSource.map((row) => {
                  const isItemSelected = selected.includes(row[rowId] as IdType)
                  return (
                    <React.Fragment key={`${row[rowId]}`}>
                      <TableRow
                        hover
                        role='checkbox'
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        selected={isItemSelected}
                        sx={{ cursor: 'pointer' }}
                      >
                        {hasStatusColumnStyle && (
                          <TableCell
                            sx={{
                              padding: '0 !important',
                              border: '0px !important',
                              position: 'absolute'
                            }}
                          >
                            {columns[0]?.cell ? columns[0].cell(null, row) : null}
                          </TableCell>
                        )}
                        {collapsibleTable && (
                          <TableCell sx={{ borderBottomWidth: calcBorderBottomWidth(row) }}>
                            <IconButton size='small' onClick={() => toggleRow(row[rowId] as IdType)}>
                              {collapseRows[String(row[rowId])] ? (
                                <KeyboardArrowDownIcon />
                              ) : (
                                <KeyboardArrowRightIcon />
                              )}
                            </IconButton>
                          </TableCell>
                        )}
                        {selectable && (
                          <TableCell
                            sx={{ borderBottomWidth: calcBorderBottomWidth(row) }}
                            onClick={() => handleClick(row[rowId] as IdType)}
                            padding='checkbox'
                          >
                            <Checkbox color='primary' checked={isItemSelected} />
                          </TableCell>
                        )}
                        {cols.map((col: TableColumns<DataType>) => (
                          <TableCell
                            sx={{
                              minWidth: col.minWidth,
                              width: col.width,
                              borderBottomWidth: calcBorderBottomWidth(row)
                            }}
                            onClick={navigateDetailPage(row, row[rowId] as IdType)}
                            key={col.id.toString()}
                            align={col.numeric ? 'right' : 'left'}
                            padding={col.disablePadding ? 'none' : 'normal'}
                          >
                            {col?.cell ? col.cell(row[col.id], row) : (row[col.id] as React.ReactNode)}
                          </TableCell>
                        ))}
                      </TableRow>
                      {collapsibleTable && (
                        <TableRow>
                          <TableCell
                            style={{
                              paddingBottom: 0,
                              paddingTop: 0,
                              borderWidth: 0,
                              borderBottomWidth: 1 - calcBorderBottomWidth(row)
                            }}
                            colSpan={12}
                          >
                            <Collapse in={collapseRows[String(row[rowId])]} timeout='auto' unmountOnExit>
                              {collapsibleContent?.(row)}
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  )
                })}
                {dataSource.length === 0 && (
                  <TableRow
                    style={{
                      height: 53 * pagination.perPage
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          ) : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                ml: '16px',
                pt: '28px',
                pb: `${!totalItems && '28px'}`
              }}
            >
              {!!onClearAllFilter ? (
                <>
                  <Typography>{`${emptyText} using the current filters.`}</Typography>
                  <Button variant='text' size='small' onClick={onClearAllFilter}>
                    CLEAR FILTERS
                  </Button>
                </>
              ) : (
                <Typography>{emptyText}</Typography>
              )}
            </Box>
          )}
        </TableContainer>
        {!!totalItems && usePagination && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component='div'
            count={totalItems}
            rowsPerPage={pagination.perPage}
            page={pagination.page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Paper>
    </Box>
  )
}
