import { styled } from '@mui/material'
import { ReactNode } from 'react'
import { Link, LinkProps } from 'react-router'

interface Props extends LinkProps {
  children: ReactNode
}

const LinkWrapper = styled(Link)({
  color: '#3783d6',
  display: 'block'
})

export default function CustomLink({ children, ...rest }: Props) {
  return <LinkWrapper {...rest}>{children}</LinkWrapper>
}
