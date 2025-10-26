import { SelectFilterItem } from '@/types'
import { cleanObject } from '@/utils'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import { Box, FormControl, FormLabel, IconButton, RadioGroup, Typography } from '@mui/material'
import isEqual from 'lodash/isEqual'
import React, { ReactNode } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

interface Props {
  name: string
  defaultValue?: null | string | object
  filterLabel: string
  IconFilter: ReactNode
  options: SelectFilterItem[]
}

export default function SelectFilter({ name, defaultValue = '', filterLabel, IconFilter, options }: Props) {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const handleClear = (e: React.MouseEvent) => {
          e.stopPropagation()
          field.onChange(defaultValue)
        }

        return (
          <FormControl>
            <FormLabel sx={{ display: 'flex', gap: 1, mb: 1 }}>
              {IconFilter}
              <Box sx={{ letterSpacing: 2, fontSize: '12px' }}>{filterLabel}</Box>
            </FormLabel>
            <RadioGroup
              value={field.value ?? ''}
              onChange={(e) => field.onChange((e.target as HTMLInputElement).value)}
            >
              {options.map((opt) => {
                const isSelected =
                  typeof opt.value === 'object'
                    ? isEqual(cleanObject(field.value), cleanObject(opt.value))
                    : field.value === opt.value
                return (
                  <Box
                    key={opt.label}
                    onClick={() => field.onChange(opt.value)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingLeft: '32px',
                      paddingRight: '4px',
                      paddingBlock: '4px',
                      cursor: 'pointer',
                      bgcolor: isSelected ? 'rgba(0,0,0,0.1)' : 'transparent',
                      '&:hover': { bgcolor: isSelected ? 'rgba(0,0,0,0.1)' : 'grey.100' },
                      transition: '0.2s'
                    }}
                  >
                    <Typography sx={{ fontSize: '14px', textTransform: 'capitalize' }}>{opt.label}</Typography>
                    {isSelected && (
                      <IconButton sx={{ width: '24px', height: '24px' }} size='small' onClick={handleClear}>
                        <HighlightOffIcon color='action' />
                      </IconButton>
                    )}
                  </Box>
                )
              })}
            </RadioGroup>
          </FormControl>
        )
      }}
    />
  )
}
