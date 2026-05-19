import React from 'react'
import Column from './Column'
import NewTaskModal from './NewTaskModal'

export default function TaskBoard() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-medium">Board</h2>
          <p className="text-sm text-gray-500">Drag tasks between columns (coming soon)</p>
        </div>
        <NewTaskModal />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Column status="todo" title="Todo" />
        <Column status="in-progress" title="In Progress" />
        <Column status="done" title="Done" />
      </div>
    </div>
  )
}
