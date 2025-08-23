import { SelectOptionItem } from '@/types'
import { Box, FormControl, FormLabel, IconButton, RadioGroup, Typography } from '@mui/material'
import React, { JSX, ReactNode } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'

interface Props {
  name: string
  filterLabel: string
  IconFilter: ReactNode
  options: SelectOptionItem[]
}

export default function SelectFilter({ name, filterLabel, IconFilter, options }: Props) {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const handleClear = (e: React.MouseEvent, v: string) => {
          e.stopPropagation()
          if (field.value === v) {
            field.onChange(null)
          }
        }
        return (
          <FormControl>
            <FormLabel sx={{ display: 'flex', gap: 1, mb: 1 }}>
              {IconFilter}
              <Box sx={{ letterSpacing: 2, fontSize: '12px' }}>{filterLabel}</Box>
            </FormLabel>
            <RadioGroup
              value={String(field.value)}
              onChange={(e) => field.onChange((e.target as HTMLInputElement).value)}
            >
              {options.map((opt) => (
                <Box
                  key={opt.value}
                  onClick={() => field.onChange(opt.value)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingLeft: '32px',
                    paddingRight: '4px',
                    paddingBlock: '4px',
                    cursor: 'pointer',
                    bgcolor: String(field.value) === opt.value ? 'rgba(0,0,0,0.3)' : 'transparent',
                    '&:hover': { bgcolor: String(field.value) === opt.value ? 'rgba(0,0,0,0.3)' : 'grey.100' },
                    transition: '0.2s'
                  }}
                >
                  <Typography sx={{ fontSize: '14px' }}>{opt.label}</Typography>
                  {String(field.value) === opt.value && (
                    <IconButton
                      sx={{ width: '24px', height: '24px' }}
                      size='small'
                      onClick={(e) => handleClear(e, opt.value)}
                    >
                      <HighlightOffIcon color='action' />
                    </IconButton>
                  )}
                </Box>
              ))}
            </RadioGroup>
          </FormControl>
        )
      }}
    />
  )
}
