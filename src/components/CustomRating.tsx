import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded'
import StarsIcon from '@mui/icons-material/Stars'
import { Rating, RatingProps, styled } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'

interface Props extends RatingProps {
  name: string
}

const StyledRating = styled(Rating)({
  '& .MuiRating-iconFilled': {
    color: 'black'
  },
  '& .MuiRating-iconHover': {
    color: '#black'
  }
})

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
