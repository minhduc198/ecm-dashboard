import * as yup from 'yup'

export const filterProductSchema = yup.object({
  q: yup.string(),
  sales: yup.string(),
  stock: yup.string(),
  categories: yup.string()
})
