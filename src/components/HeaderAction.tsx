import React from 'react'
import { Language } from './Language'
import Profile from './Profile'
import { Box } from '@mui/material'

export default function HeaderAction() {
  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Language />
      <Profile />
    </Box>
  )
}
