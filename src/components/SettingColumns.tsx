import { TableColumns } from '@/types/table'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import ViewWeekIcon from '@mui/icons-material/ViewWeek'
import { Box, Button, Popover, Switch, Typography } from '@mui/material'
import cloneDeep from 'lodash/cloneDeep'
import React from 'react'
import { DragDropContext, Draggable, Droppable, OnDragEndResponder } from 'react-beautiful-dnd'

type PropsDraggableSettingCol<T> = {
  item: TableColumns<T>
  index: number
  handleChange: (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => void
}

function DraggableSettingCol<T>({ item, index, handleChange }: PropsDraggableSettingCol<T>) {
  return (
    <Draggable draggableId={item.id.toString()} index={index}>
      {(provided, snapshot) => (
        <Box
          key={index}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          sx={[
            { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
            { position: 'relative', zIndex: 1, bgcolor: 'white' },
            snapshot.isDragging && {
              zIndex: 2,
              boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.2)'
            }
          ]}
        >
          <Box sx={{ display: 'flex', paddingInline: '8px', margin: 0 }}>
            <Switch checked={item.isVisible} size='small' onChange={handleChange(index)} />
            <Typography>{item.label}</Typography>
          </Box>
          <Box sx={{ width: '20px', height: '20px' }}>
            <DragIndicatorIcon fontSize='small' color='disabled' sx={{ cursor: 'all-scroll' }}></DragIndicatorIcon>
          </Box>
        </Box>
      )}
    </Draggable>
  )
}

interface Props<T> {
  columns: TableColumns<T>[]
  onDragEnd: OnDragEndResponder
  handleChangeColumn: (columns: TableColumns<T>[]) => void
}

export default function SettingColumns<T>({ columns, onDragEnd, handleChangeColumn }: Props<T>) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)

  const handleChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColumns = cloneDeep(columns)
    newColumns[index].isVisible = e.target.checked
    handleChangeColumn(newColumns)
  }

  return (
    <div>
      <Button startIcon={<ViewWeekIcon />} variant='text' onClick={handleClick}>
        COLUMNS
      </Button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: '10px'
            }
          }
        }}
      >
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId='droppable-columns-setting'>
            {(provided) => (
              <Box
                ref={provided.innerRef}
                {...provided.droppableProps}
                sx={{
                  paddingBlock: '8px',
                  paddingRight: '6px',
                  minWidth: '165px',
                  maxHeight: '250px',
                  minHeight: `${24 * columns.length + 20}px`
                }}
              >
                {columns.map((item, index) => (
                  <DraggableSettingCol<T>
                    key={item.id.toString()}
                    item={item}
                    index={index}
                    handleChange={handleChange}
                  />
                ))}
              </Box>
            )}
          </Droppable>
        </DragDropContext>
      </Popover>
    </div>
  )
}
