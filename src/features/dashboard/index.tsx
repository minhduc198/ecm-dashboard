import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import CodeIcon from '@mui/icons-material/Code'
import CommentIcon from '@mui/icons-material/Comment'
import HomeIcon from '@mui/icons-material/Home'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { Box, Button, Grid, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useQuery } from '@tanstack/react-query'
import DashboardCard from './components/DashboardCard'
import LineChartDashboard from './components/LineChartDashboard'
import RevenueHistory from './components/RevenueHistory'
import { userData } from '@/data/dashboard/mockUserData'

const BannerDashBoard = styled('div')({
  marginBlock: 16,
  height: 187,
  border: '1px solid white',
  borderRadius: 10,
  padding: 20,
  color: 'white',
  background: 'linear-gradient(45deg, rgb(0, 16, 100) 0%, rgb(95, 95, 196) 50%, rgb(55, 42, 140) 100%)'
})

const Dashboard = () => {
  return (
    <Box>
      <BannerDashBoard sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography sx={{ fontSize: 24, mb: 1 }}>Welcome to the react-admin e-commerce demo</Typography>
          <Typography sx={{ maxWidth: 640, mb: 2 }}>
            This is the admin of an imaginary poster shop. Feel free to explore and modify the data - it's local to your
            computer, and will reset each time you reload.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 2, fontWeight: 500, fontSize: 14 }}>
            <Button
              startIcon={<HomeIcon />}
              variant='contained'
              sx={{
                color: 'white',
                borderRadius: '10px',
                backgroundColor: '#4f3cc9'
              }}
            >
              REACT-ADMIN SITE
            </Button>
            <Button
              startIcon={<CodeIcon />}
              variant='contained'
              sx={{
                color: 'white',
                borderRadius: '10px',
                backgroundColor: '#4f3cc9'
              }}
            >
              SOURCE FOR THIS DEMO
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            width: 256,
            height: 144,
            background: 'url(https://marmelab.com/react-admin-demo/assets/welcome_illustration-BRGwFvXW.svg)',
            backgroundSize: 'cover'
          }}
        ></Box>
      </BannerDashBoard>

      <Grid container spacing={2}>
        <Grid container size={{ xs: 6 }}>
          <Grid size={{ xs: 6 }}>
            <DashboardCard
              icon={
                <AttachMoneyIcon
                  sx={{
                    width: '35px',
                    height: '35px',
                    color: 'rgb(40, 53, 147)'
                  }}
                />
              }
              title='Monthly Revenue'
              value='5.474US$'
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <DashboardCard
              icon={<ShoppingCartIcon sx={{ width: '35px', height: '35px', color: 'rgb(40, 53, 147)' }} />}
              title='New Orders'
              value='25'
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <LineChartDashboard />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <RevenueHistory />
            <RevenueHistory />
          </Grid>
        </Grid>
        <Grid size={{ xs: 3 }}>
          <DashboardCard
            isReview
            icon={<CommentIcon sx={{ width: '35px', height: '35px', color: 'rgb(40, 53, 147)' }} />}
            title='Pending Reviews'
            value='54'
            data={userData}
          />
        </Grid>
        <Grid size={{ xs: 3 }}>
          <DashboardCard
            icon={<PersonAddIcon sx={{ width: '35px', height: '35px', color: 'rgb(40, 53, 147)' }} />}
            title='New Customers'
            value='12'
            data={userData}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard
