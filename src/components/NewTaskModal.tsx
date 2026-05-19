import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addTask } from '../store/tasksSlice'
import { AppDispatch } from '../store'

export default function NewTaskModal() {
  const dispatch = useDispatch<AppDispatch>()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [assignee, setAssignee] = useState('')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !assignee.trim()) return
    dispatch(
      addTask({ title: title.trim(), description, assignee: assignee.trim(), priority, tags: [], status: 'todo' })
    )
    setTitle('')
    setDescription('')
    setAssignee('')
    setPriority('medium')
    setOpen(false)
  }

  return (
    <div>
      <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => setOpen(true)}>
        New Task
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <form className="bg-white p-4 rounded w-full max-w-md" onSubmit={submit}>
            <h3 className="text-lg font-medium">Create Task</h3>
            <div className="mt-3 space-y-2">
              <div>
                <label className="block text-sm">Title *</label>
                <input className="w-full border px-2 py-1" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm">Description</label>
                <textarea className="w-full border px-2 py-1" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm">Assignee *</label>
                <input className="w-full border px-2 py-1" value={assignee} onChange={(e) => setAssignee(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm">Priority</label>
                <select className="w-full border px-2 py-1" value={priority} onChange={(e) => setPriority(e.target.value as any)}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" className="px-3 py-1" onClick={() => setOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded">
                Create
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
