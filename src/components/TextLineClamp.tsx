import { SxProps, Typography, TypographyProps } from '@mui/material'

interface Props extends TypographyProps {
  line?: number
  sxTextLineClamp?: SxProps
}
export default function TextLineClamp({ line = 3, children, sxTextLineClamp, ...res }: Props) {
  return (
    <Typography
      {...res}
      sx={{
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: line,
        WebkitBoxOrient: 'vertical',
        ...sxTextLineClamp
      }}
    >
      {children}
    </Typography>
  )
}
