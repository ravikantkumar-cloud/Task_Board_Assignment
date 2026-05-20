import React from 'react'
import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'
import { Task } from '../types'

function TaskCard({ task, onEdit }: { task: Task; onEdit?: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <article
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`border p-3 rounded shadow-sm bg-white cursor-grab hover:shadow-md ${isDragging ? 'opacity-70' : ''}`}
    >
      <div className="flex justify-between items-start gap-2">
        <div>
          <h4 className="font-medium">{task.title}</h4>
          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
        </div>
        <span className="text-xs px-2 py-1 rounded bg-gray-100">{task.priority ?? 'medium'}</span>
      </div>
      <div className="mt-2 text-xs text-gray-500 flex justify-between items-center gap-2">
        <span>{task.assignee}</span>
        <span>{new Date(task.createdAt).toLocaleDateString()}</span>
      </div>
      {task.loading && <div className="mt-2 text-xs text-blue-600">Updating status...</div>}
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation()
          onEdit?.(task.id)
        }}
        className="mt-3 text-sm text-blue-600 hover:underline"
      >
        Edit task
      </button>
    </article>
  )
}

export default React.memo(TaskCard)
