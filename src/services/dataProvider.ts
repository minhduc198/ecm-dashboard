import fakeDataProvider from 'ra-data-fakerest'
import generateData from './data-generator'
export const baseDataProvider = fakeDataProvider(generateData(), true, 300)
