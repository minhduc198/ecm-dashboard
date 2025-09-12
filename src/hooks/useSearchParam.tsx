import { useSearchParams } from 'react-router-dom'

type SearchParamsRecord = Record<string, string>

export const useSearchParam = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const getAll = (): SearchParamsRecord => {
    const entries = Object.fromEntries(searchParams.entries())
    return entries
  }

  const setOne = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.set(key, value)
    setSearchParams(newParams)
  }

  const replaceParams = (params: SearchParamsRecord) => {
    const newParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      newParams.set(key, value)
    })
    setSearchParams(newParams)
  }

  const setMany = (params: SearchParamsRecord) => {
    const newParams = new URLSearchParams(searchParams.toString())
    Object.entries(params).forEach(([key, value]) => {
      newParams.set(key, value)
    })
    setSearchParams(newParams)
  }

  const deleteOne = (key: string) => {
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.delete(key)
    setSearchParams(newParams)
  }

  const deleteMany = (keys: string[]) => {
    const newParams = new URLSearchParams(searchParams.toString())
    keys.forEach((key) => newParams.delete(key))
    setSearchParams(newParams)
  }

  return {
    getAll,
    setOne,
    setMany,
    replaceParams,
    deleteOne,
    deleteMany
  }
}
