import * as yup from 'yup'

export const filterInvoicesSchema = yup.object().shape(
  {
    date_gte: yup
      .date()
      .nullable()
      .when('date_lte', {
        is: (val: any) => val != null,
        then: (schema) => schema.max(yup.ref('date_lte'), 'start_date_before_end_date')
      }),
    date_lte: yup
      .date()
      .nullable()
      .when('date_gte', {
        is: (val: any) => val != null,
        then: (schema) => schema.min(yup.ref('date_gte'), 'end_date_after_start_date')
      }),
    customer_id: yup.string(),
    order_id: yup.string()
  },
  [['date_gte', 'date_lte']]
)
