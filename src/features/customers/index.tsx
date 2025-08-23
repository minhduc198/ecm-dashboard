import AddIcon from '@mui/icons-material/Add'
import { Box, Button, Grid } from '@mui/material'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import CustomLink from '@/components/CustomLink'
import { path } from '@/routers/path'
import { useNavigate } from 'react-router'
import FilterBarCustomer from './components/FilterBarCustomer'

export default function Customers() {
  const navigate = useNavigate()

  const handleCreateCustomer = () => {
    navigate(path.createCustomer)
  }
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'end', gap: 2 }}>
        <Button onClick={handleCreateCustomer} startIcon={<AddIcon />} variant='text'>
          CREATE
        </Button>
        {/* <SettingColumns columns={}></SettingColumns> */}
        <Button startIcon={<FileDownloadIcon />} variant='text'>
          EXPORT
        </Button>
      </Box>
      <Grid container spacing={2}>
        <Grid size={{ xs: 3 }}>
          <FilterBarCustomer />
        </Grid>
      </Grid>
    </Box>
  )
}
