import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Task, TasksById, Status } from '../types.js'
import { mockTasks } from '../data/mockTasks.js'

type State = {
  byId: TasksById
  columns: {
    todo: string[]
    'in-progress': string[]
    done: string[]
  }
  history: {
    past: Array<Pick<State, 'byId' | 'columns'>>
    future: Array<Pick<State, 'byId' | 'columns'>>
  }
}

const MAX_HISTORY = 50

const normalize = (tasks: Task[]): Omit<State, 'history'> => {
  const byId: TasksById = {}
  const columns = { todo: [] as string[], 'in-progress': [] as string[], done: [] as string[] }
  tasks.forEach((t) => {
    byId[t.id] = t
    if (t.status === 'todo') columns.todo.push(t.id)
    else if (t.status === 'in-progress') columns['in-progress'].push(t.id)
    else columns.done.push(t.id)
  })
  return { byId, columns }
}

const initialState: State = {
  ...normalize(mockTasks as Task[]),
  history: { past: [], future: [] }
}

const insertAt = (list: string[], index: number, id: string) => {
  const next = [...list]
  next.splice(index, 0, id)
  return next
}

const snapshot = (state: State) => ({
  byId: { ...state.byId },
  columns: {
    todo: [...state.columns.todo],
    'in-progress': [...state.columns['in-progress']],
    done: [...state.columns.done]
  }
})

const pushPast = (state: State) => {
  state.history.past.push(snapshot(state))
  if (state.history.past.length > MAX_HISTORY) {
    state.history.past.shift()
  }
  state.history.future = []
}

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask(state, action: PayloadAction<Omit<Task, 'id' | 'createdAt'>>) {
      pushPast(state)
      const id = String(Date.now())
      const createdAt = new Date().toISOString()
      const t: Task = { id, createdAt, ...action.payload }
      state.byId[t.id] = t
      state.columns[t.status].unshift(t.id)
    },
    updateTask(state, action: PayloadAction<{ id: string; patch: Partial<Task>; recordHistory?: boolean }>) {
      const { id, patch, recordHistory = true } = action.payload
      if (recordHistory) pushPast(state)
      const existing = state.byId[id]
      if (!existing) return
      state.byId[id] = { ...existing, ...patch }
    },
    undo(state) {
      if (state.history.past.length === 0) return
      const previousState = state.history.past.pop()!
      state.history.future.push(snapshot(state))
      state.byId = previousState.byId
      state.columns = previousState.columns
    },
    redo(state) {
      if (state.history.future.length === 0) return
      const nextState = state.history.future.pop()!
      state.history.past.push(snapshot(state))
      state.byId = nextState.byId
      state.columns = nextState.columns
    },
    moveTask(state, action: PayloadAction<{ id: string; to: Status; index?: number; recordHistory?: boolean }>) {
      const { id, to, index, recordHistory = true } = action.payload
      if (recordHistory) pushPast(state)
      const existing = state.byId[id]
      if (!existing) return
      const from = existing.status
      state.columns[from] = state.columns[from].filter((taskId) => taskId !== id)
      state.columns[to] = insertAt(state.columns[to], index ?? 0, id)
      state.byId[id] = { ...existing, status: to }
    },
    setTaskLoading(state, action: PayloadAction<{ id: string; loading: boolean }>) {
      const task = state.byId[action.payload.id]
      if (!task) return
      state.byId[action.payload.id] = { ...task, loading: action.payload.loading }
    }
  }
})

export const { addTask, updateTask, undo, redo, moveTask, setTaskLoading } = tasksSlice.actions
export default tasksSlice.reducer
