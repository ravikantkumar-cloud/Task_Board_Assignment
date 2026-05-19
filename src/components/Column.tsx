import React from 'react'
import { Status } from '../types'
import TaskCard from './TaskCard'
import { useSelector } from 'react-redux'
import { RootState } from '../store'

export default function Column({ status, title }: { status: Status; title: string }) {
  const ids = useSelector((s: RootState) => s.tasks.columns[status])
  const byId = useSelector((s: RootState) => s.tasks.byId)

  return (
    <section className="bg-white p-3 rounded shadow min-h-[200px]">
      <h3 className="font-semibold mb-2">{title} ({ids.length})</h3>
      <div className="space-y-2">
        {ids.length === 0 && <div className="text-sm text-gray-400">No tasks</div>}
        {ids.map((id) => {
          const task = byId[id]
          return <TaskCard key={id} task={task} />
        })}
      </div>
    </section>
  )
}
