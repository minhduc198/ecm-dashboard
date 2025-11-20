import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded'
import StarsIcon from '@mui/icons-material/Stars'
import { Rating, RatingProps, styled } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'

interface Props extends RatingProps {
  name: string
}

const StyledRating = styled(Rating)(({ theme }) => [
  {
    '& .MuiRating-iconFilled': {
      color: 'black'
    },
    '& .MuiRating-iconHover': {
      color: '#black'
    }
  },
  theme.applyStyles('dark', {
    '& .MuiRating-iconFilled': {
      color: 'white'
    },
    '& .MuiRating-iconHover': {
      color: '#white'
    }
  })
])

const MyComponent = styled('div')(({ theme }) => [
  {
    color: '#fff',
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
      boxShadow: theme.shadows[3],
      backgroundColor: theme.palette.primary.dark
    }
  },
  theme.applyStyles('dark', {
    backgroundColor: theme.palette.secondary.main,
    '&:hover': {
      backgroundColor: theme.palette.secondary.dark
    }
  })
])

export default function CustomRating({
  name,
  icon = <StarsIcon fontSize='inherit' />,
  emptyIcon = <StarBorderRoundedIcon fontSize='inherit' />,
  ...props
}: Props) {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <StyledRating
            {...field}
            value={field.value || 0}
            getLabelText={(value: number) => `${value} Heart${value !== 1 ? 's' : ''}`}
            icon={icon}
            emptyIcon={emptyIcon}
            {...props}
          />
        )
      }}
    />
  )
}
