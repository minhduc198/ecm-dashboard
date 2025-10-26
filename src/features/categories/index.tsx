import { useUndoCategoryStore } from '@/store/undoCategoryStore'
import { Button, Grid, Snackbar } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import CardCategory from './components/CardCategory'
import { fetchCategoriesList } from './services'
import { useEffect } from 'react'

const Categories = () => {
  const {
    action,
    timerId,
    isOpenUndo,
    tmpUndoData,
    dataPending,
    setIsOpenUndo,
    setTimerId,
    setTmpUndoData,
    setDataPending
  } = useUndoCategoryStore()

  const { data: categoriesList } = useQuery({
    queryKey: ['categories_list'],
    queryFn: () => fetchCategoriesList(),
    refetchOnWindowFocus: false,
    keepPreviousData: true
    // onSuccess(data) {
    //   const newList = data?.data ?? []
    //   if (!timerId) {
    //     setTmpUndoData(newList)
    //   }
    // },
  })

  useEffect(() => {
    const newList = categoriesList?.data ?? []
    if (!timerId && !dataPending.id) {
      setTmpUndoData(newList)
    }
  }, [categoriesList?.data])

  const handleUndo = () => {
    setDataPending({
      id: null,
      data: {}
    })
    setIsOpenUndo(false)
    setTimerId(null)
    setTmpUndoData(categoriesList?.data ?? [])
    if (timerId) {
      clearTimeout(timerId)
    }
  }

  return (
    <Grid container spacing={2}>
      {tmpUndoData.map((category) => (
        <Grid key={category.id} size={{ xs: 3 }}>
          <CardCategory category={category} />
        </Grid>
      ))}

      <Snackbar
        open={isOpenUndo}
        autoHideDuration={1000}
        message={action}
        action={
          <Button onClick={handleUndo} size='small'>
            UNDO
          </Button>
        }
      />
    </Grid>
  )
}

export default Categories
