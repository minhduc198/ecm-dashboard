import * as yup from 'yup'

export const filterInvoicesSchema = yup.object().shape(
  {
    date_gte: yup
      .date()
      .nullable()
      .when('date_lte', {
        is: (val: any) => val != null,
        then: (schema) => schema.max(yup.ref('date_lte'), 'Ngày bắt đầu phải trước ngày kết thúc')
      }),
    date_lte: yup
      .date()
      .nullable()
      .when('date_gte', {
        is: (val: any) => val != null,
        then: (schema) => schema.min(yup.ref('date_gte'), 'Ngày kết thúc phải sau ngày bắt đầu')
      }),
    customer_id: yup.string(),
    order_id: yup.string()
  },
  [['date_gte', 'date_lte']]
)
