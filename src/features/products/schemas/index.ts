import * as yup from 'yup'

export const filterProductSchema = yup.object({
  q: yup.string(),
  sales: yup.object({
    sales_gt: yup.string(),
    sales_lte: yup.string(),
    sales: yup.string()
  }),
  stock: yup.object({
    stock: yup.string(),
    stock_lt: yup.string(),
    stock_gt: yup.string()
  }),
  category_id: yup.string()
})
