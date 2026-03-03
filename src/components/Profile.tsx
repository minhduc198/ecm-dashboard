import { AppContext } from '@/contexts/AppContext'
import { authLogout, getProfile } from '@/features/auth/services'
import LogoutIcon from '@mui/icons-material/Logout'
import { Avatar, Box, Button, Popover, Typography } from '@mui/material'
import { useMutation, useQuery } from '@tanstack/react-query'
import React, { useContext } from 'react'

export default function Profile() {
  const { setIsAuthenticated } = useContext(AppContext)
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  const { data: profileData } = useQuery({
    queryKey: ['profile'],
    queryFn: () => getProfile()
  })

  const { mutate: logoutMutation } = useMutation({
    mutationFn: () => authLogout(),
    onSuccess: () => {
      localStorage.removeItem('access_token')
      setIsAuthenticated(false)
    }
  })

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    logoutMutation()
  }

  return (
    <>
      <Box
        component='button'
        sx={{ display: 'flex', gap: 1, alignItems: 'center', cursor: 'pointer', border: 0, background: 'transparent' }}
        onClick={handleClick}
      >
        <Avatar sx={{ width: 28, height: 28, fontSize: 14 }}>{profileData?.fullname.charAt(0).toUpperCase()}</Avatar>
        <Typography sx={{ fontSize: 14 }}>{profileData?.fullname}</Typography>
      </Box>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        sx={{ top: 10 }}
      >
        <Box sx={{ paddingBlock: 1, paddingInline: 3 }}>
          <Typography sx={{ fontSize: 14, color: 'rgba(0, 0, 0, 0.54)', marginBottom: 1 }}>
            {profileData?.email}
          </Typography>
          <Button sx={{ width: '100%', textTransform: 'capitalize' }} startIcon={<LogoutIcon />} onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Popover>
    </>
  )
}
