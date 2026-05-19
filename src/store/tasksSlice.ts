import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Task, TasksById, Status } from '../types'
import { mockTasks } from '../data/mockTasks'

type State = {
  byId: TasksById
  columns: {
    todo: string[]
    'in-progress': string[]
    done: string[]
  }
}

const normalize = (tasks: Task[]): State => {
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

const initialState: State = normalize(mockTasks as Task[])

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask(state, action: PayloadAction<Omit<Task, 'id' | 'createdAt'>>) {
      const id = String(Date.now())
      const createdAt = new Date().toISOString()
      const t: Task = { id, createdAt, ...action.payload }
      state.byId[t.id] = t
      state.columns[t.status].unshift(t.id)
    },
    updateTask(state, action: PayloadAction<{ id: string; patch: Partial<Task> }>) {
      const { id, patch } = action.payload
      const existing = state.byId[id]
      if (!existing) return
      state.byId[id] = { ...existing, ...patch }
    },
    moveTask(state, action: PayloadAction<{ id: string; to: Status }>) {
      const { id, to } = action.payload
      const existing = state.byId[id]
      if (!existing) return
      const from = existing.status
      if (from === to) return
      // remove from old
      state.columns[from] = state.columns[from].filter((x) => x !== id)
      state.columns[to].unshift(id)
      state.byId[id].status = to
    }
  }
})

export const { addTask, updateTask, moveTask } = tasksSlice.actions
export default tasksSlice.reducer
