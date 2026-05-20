import React from 'react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Task } from '../types.js'

interface TaskEditModalProps {
  task: Task
  onSave: (patch: Partial<Task>) => void
  onClose: () => void
}

type TaskEditFormValues = {
  title: string
  description: string
  assignee: string
  priority: 'low' | 'medium' | 'high'
  tags: string
}

export default function TaskEditModal({ task, onSave, onClose }: TaskEditModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<TaskEditFormValues>({
    defaultValues: {
      title: task.title,
      description: task.description,
      assignee: task.assignee,
      priority: task.priority ?? 'medium',
      tags: (task.tags ?? []).join(', ')
    }
  })

  useEffect(() => {
    reset({
      title: task.title,
      description: task.description,
      assignee: task.assignee,
      priority: task.priority ?? 'medium',
      tags: (task.tags ?? []).join(', ')
    })
  }, [reset, task])

  const submit = (values: TaskEditFormValues) => {
    onSave({
      title: values.title.trim(),
      description: values.description.trim(),
      assignee: values.assignee.trim(),
      priority: values.priority,
      tags: values.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
    })
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <form className="bg-white rounded-lg w-full max-w-lg shadow-xl p-6" onSubmit={handleSubmit(submit)} noValidate>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Edit Task</h3>
          <button type="button" onClick={onClose} className="text-sm text-gray-500 hover:text-gray-900">
            Close
          </button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Title *</label>
            <input
              className="mt-1 w-full border rounded px-3 py-2"
              {...register('title', { required: 'Title is required.' })}
            />
            {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Description *</label>
            <textarea
              className="mt-1 w-full border rounded px-3 py-2 min-h-[100px]"
              {...register('description', { required: 'Description is required.' })}
            />
            {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium">Assignee *</label>
              <input
                className="mt-1 w-full border rounded px-3 py-2"
                {...register('assignee', { required: 'Assignee is required.' })}
              />
              {errors.assignee && <p className="mt-1 text-xs text-red-600">{errors.assignee.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">Priority</label>
              <select className="mt-1 w-full border rounded px-3 py-2" {...register('priority')}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Tags (comma separated)</label>
            <input
              className="mt-1 w-full border rounded px-3 py-2"
              {...register('tags')}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded border text-sm">
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white text-sm"
            >
              Save changes
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
