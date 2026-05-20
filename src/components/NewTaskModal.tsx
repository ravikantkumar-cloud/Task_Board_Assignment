import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { addTask } from '../store/tasksSlice.js'
import { AppDispatch } from '../store/index.js'

type NewTaskFormValues = {
  title: string
  description: string
  assignee: string
  priority: 'low' | 'medium' | 'high'
  tags: string
}

export default function NewTaskModal() {
  const dispatch = useDispatch<AppDispatch>()
  const [open, setOpen] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<NewTaskFormValues>({
    defaultValues: {
      title: '',
      description: '',
      assignee: '',
      priority: 'medium',
      tags: ''
    }
  })

  const submit = (values: NewTaskFormValues) => {
    const normalizedTags = values.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)

    dispatch(
      addTask({
        title: values.title.trim(),
        description: values.description.trim(),
        assignee: values.assignee.trim(),
        priority: values.priority,
        tags: normalizedTags,
        status: 'todo'
      })
    )
    reset()
    setOpen(false)
  }

  const handleClose = () => {
    reset()
    setOpen(false)
  }

  return (
    <div>
      <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => setOpen(true)}>
        New Task
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <form className="bg-white p-4 rounded w-full max-w-md" onSubmit={handleSubmit(submit)} noValidate>
            <h3 className="text-lg font-medium">Create Task</h3>
            <div className="mt-3 space-y-2">
              <div>
                <label className="block text-sm">Title *</label>
                <input
                  className="w-full border px-2 py-1"
                  {...register('title', { required: 'Title is required.' })}
                />
                {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
              </div>
              <div>
                <label className="block text-sm">Description *</label>
                <textarea
                  className="w-full border px-2 py-1"
                  {...register('description', { required: 'Description is required.' })}
                />
                {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>}
              </div>
              <div>
                <label className="block text-sm">Assignee *</label>
                <input
                  className="w-full border px-2 py-1"
                  {...register('assignee', { required: 'Assignee is required.' })}
                />
                {errors.assignee && <p className="mt-1 text-xs text-red-600">{errors.assignee.message}</p>}
              </div>
              <div>
                <label className="block text-sm">Priority</label>
                <select className="w-full border px-2 py-1" {...register('priority')}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm">Tags (optional)</label>
                <input
                  className="w-full border px-2 py-1"
                  {...register('tags')}
                  placeholder="frontend, urgent"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" className="px-3 py-1" onClick={handleClose}>
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
