import { faker } from '@faker-js/faker'

export const weightedArrayElement = <T>(values: T[], weights: number[]): T =>
  faker.helpers.arrayElement(
    values.reduce((acc, value, index) => acc.concat(new Array(weights[index]).fill(value)), [] as T[])
  )

export const weightedBoolean = (likelihood: number): boolean => faker.number.int({ min: 0, max: 99 }) < likelihood

export const randomDate = (minDate?: Date | string, maxDate?: Date | string): Date => {
  const minTs =
    minDate instanceof Date
      ? minDate.getTime()
      : typeof minDate === 'string'
        ? new Date(minDate).getTime()
        : Date.now() - 5 * 365 * 24 * 60 * 60 * 1000 // 5 years
  const maxTs =
    maxDate instanceof Date ? maxDate.getTime() : typeof maxDate === 'string' ? new Date(maxDate).getTime() : Date.now()

  const range = maxTs - minTs
  const randomRange = faker.number.int({ min: 0, max: range })
  // move it more towards today to account for traffic increase
  const ts = Math.sqrt(randomRange / range) * range
  return new Date(minTs + ts)
}

export const randomFloat = (min: number, max: number): number =>
  parseFloat(faker.number.float({ min, max, fractionDigits: 2 }).toFixed(2))
