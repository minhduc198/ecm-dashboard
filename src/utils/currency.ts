export function formatCurrency(value: number, currencySymbol: string = 'US$'): string {
  const parts = value.toFixed(2).split('.')
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  const decimalPart = parts[1]
  return `${integerPart},${decimalPart} ${currencySymbol}`
}
