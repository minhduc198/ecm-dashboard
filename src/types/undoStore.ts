export interface UndoStore<T> {
  isOpenUndo: boolean
  setIsOpenUndo: (value: boolean) => void
  tmpUndoData: T[]
  setTmpUndoData: (data: T[]) => void
  timerId: NodeJS.Timeout | null
  setTimerId: (timer: NodeJS.Timeout | null) => void
  action: string
  setAction: (message: string) => void
}
