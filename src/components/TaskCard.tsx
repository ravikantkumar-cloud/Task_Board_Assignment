import React from 'react'
import { Task } from '../types'

export default function TaskCard({ task }: { task: Task }) {
  return (
    <article className="border p-3 rounded hover:shadow-sm bg-white">
      <div className="flex justify-between items-start">
        <h4 className="font-medium">{task.title}</h4>
        <span className="text-xs px-2 py-1 rounded bg-gray-100">{task.priority ?? 'medium'}</span>
      </div>
      <p className="text-sm text-gray-600 mt-1">{task.description}</p>
      <div className="mt-2 text-xs text-gray-500 flex justify-between">
        <span>{task.assignee}</span>
        <span>{new Date(task.createdAt).toLocaleDateString()}</span>
      </div>
    </article>
  )
}
