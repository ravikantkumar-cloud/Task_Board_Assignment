import React, { useMemo, useState } from 'react'
import {
  DndContext,
  DragOverlay
} from '@dnd-kit/core'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../store/index.js'
import { updateTask, undo, redo } from '../store/tasksSlice.js'
import Column from './Column.js'
import NewTaskModal from './NewTaskModal.js'
import TaskCard from './TaskCard.js'
import TaskEditModal from './TaskEditModal.js'
import { Task } from '../types.js'
import useTaskBoardDnd from '../hooks/useTaskBoardDnd.js'
import useUndoRedoShortcuts from '../hooks/useUndoRedoShortcuts.js'

const assignees = ['John Doe', 'Jane Smith', 'Alex Lee', 'Maya Patel']

export default function TaskBoard() {
  const dispatch = useDispatch<AppDispatch>()
  const byId = useSelector((state: RootState) => state.tasks.byId)
  const columns = useSelector((state: RootState) => state.tasks.columns)
  const history = useSelector((state: RootState) => state.tasks.history)
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState<Partial<Task>>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all')
  const { activeId, sensors, handleDragStart, handleDragEnd } = useTaskBoardDnd({ byId, columns, dispatch })

  const handleUndo = () => {
    dispatch(undo())
  }

  const handleRedo = () => {
    dispatch(redo())
  }

  useUndoRedoShortcuts({ onUndo: handleUndo, onRedo: handleRedo })

  const handleEditStart = (taskId: string) => {
    const task = byId[taskId]
    if (!task) return
    setEditingTaskId(taskId)
    setEditDraft({})
  }

  const handleEditClose = () => {
    setEditingTaskId(null)
    setEditDraft({})
  }

  const handleEditSave = (patch: Partial<Task>) => {
    if (!editingTaskId) return
    dispatch(updateTask({ id: editingTaskId, patch }))
    handleEditClose()
  }

  const assigneeOptions = useMemo(() => {
    const fromTasks = new Set(Object.values(byId).map((task) => task.assignee))
    const combined = new Set([...assignees, ...fromTasks])
    return Array.from(combined).sort((a, b) => a.localeCompare(b))
  }, [byId])

  const normalizedQuery = searchTerm.trim().toLowerCase()
  const filteredColumns = useMemo(() => {
    // Keep filtering derived and memoized so DnD rendering stays responsive with larger lists.
    const matches = (task: Task) => {
      const assigneeOk = assigneeFilter === 'all' || task.assignee === assigneeFilter
      const priorityOk = priorityFilter === 'all' || task.priority === priorityFilter
      const queryOk =
        normalizedQuery.length === 0 ||
        task.title.toLowerCase().includes(normalizedQuery) ||
        task.description.toLowerCase().includes(normalizedQuery)
      return assigneeOk && priorityOk && queryOk
    }

    return {
      todo: columns.todo.filter((id) => matches(byId[id])),
      'in-progress': columns['in-progress'].filter((id) => matches(byId[id])),
      done: columns.done.filter((id) => matches(byId[id]))
    }
  }, [assigneeFilter, byId, columns, normalizedQuery, priorityFilter])

  const editingTask = editingTaskId ? byId[editingTaskId] : null

  console.log('filer', filteredColumns);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-medium">Board</h2>
            <p className="text-sm text-gray-500">Drag tasks between columns and reorder within a column.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleUndo}
              disabled={history.past.length === 0}
              className="px-3 py-1 rounded border text-sm disabled:opacity-40"
              title="Undo (Ctrl/Cmd+Z)"
            >
              Undo
            </button>
            <button
              type="button"
              onClick={handleRedo}
              disabled={history.future.length === 0}
              className="px-3 py-1 rounded border text-sm disabled:opacity-40"
              title="Redo (Ctrl/Cmd+Shift+Z)"
            >
              Redo
            </button>
            <NewTaskModal />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white p-3 rounded shadow-sm border">
          <label className="text-sm">
            <span className="block mb-1 text-gray-600">Search</span>
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Title or description"
              className="w-full border rounded px-2 py-1"
            />
          </label>
          <label className="text-sm">
            <span className="block mb-1 text-gray-600">Assignee</span>
            <select
              value={assigneeFilter}
              onChange={(event) => setAssigneeFilter(event.target.value)}
              className="w-full border rounded px-2 py-1"
            >
              <option value="all">All assignees</option>
              {assigneeOptions.map((assignee) => (
                <option key={assignee} value={assignee}>
                  {assignee}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="block mb-1 text-gray-600">Priority</span>
            <select
              value={priorityFilter}
              onChange={(event) => setPriorityFilter(event.target.value as typeof priorityFilter)}
              className="w-full border rounded px-2 py-1"
            >
              <option value="all">All priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Column status="todo" title="Todo" onEdit={handleEditStart} taskIds={filteredColumns.todo} />
          <Column
            status="in-progress"
            title="In Progress"
            onEdit={handleEditStart}
            taskIds={filteredColumns['in-progress']}
          />
          <Column status="done" title="Done" onEdit={handleEditStart} taskIds={filteredColumns.done} />
        </div>
      </div>
      <DragOverlay>{activeId ? <TaskCard task={byId[activeId]} /> : null}</DragOverlay>
      <ToastContainer position="bottom-right" autoClose={3000} theme="colored" />
      {editingTask && (
        <TaskEditModal
          task={editingTask}
          onSave={handleEditSave}
          onClose={handleEditClose}
        />
      )}
    </DndContext>
  )
}
