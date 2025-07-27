export function formatCurrency(value: number, locale: string = 'de-DE', currency: string = 'USD'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    currencyDisplay: 'code'
  })
    .format(value)
    .replace('USD', 'US$')
}
