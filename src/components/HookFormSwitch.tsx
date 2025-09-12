import { FormControlLabel, Switch, SwitchProps } from '@mui/material'
import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'

interface Props extends SwitchProps {
  name: string
  label: string
}

export default function HookFormSwitch({ name, label, ...rest }: Props) {
  const { control } = useFormContext()
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormControlLabel control={<Switch {...field} {...rest} checked={field.value} />} label={label} />
      )}
    />
  )
}
