export interface UndoStore<T> {
  isOpenUndo: boolean
  setIsOpenUndo: (value: boolean) => void
  temporaryData: T[]
  setTemporaryData: (data: T[]) => void
  timerId: NodeJS.Timeout | null
  setTimerId: (timer: NodeJS.Timeout | null) => void
}
