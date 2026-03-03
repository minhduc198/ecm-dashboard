import { Box, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { useTranslation } from 'react-i18next'
import LanguageIcon from '@mui/icons-material/Language'

export function Language() {
  const { i18n } = useTranslation('dashboard')
  const handleChange = (event: SelectChangeEvent) => {
    i18n.changeLanguage(event.target.value)
  }
  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      <LanguageIcon />
      <Select
        variant='standard'
        value={i18n.language || 'en'}
        onChange={handleChange}
        size='small'
        sx={{ minWidth: 120 }}
      >
        <MenuItem value='en'>English</MenuItem>
        <MenuItem value='vi'>Vietnamese</MenuItem>
        <MenuItem value='fr'>French</MenuItem>
      </Select>
    </Box>
  )
}
