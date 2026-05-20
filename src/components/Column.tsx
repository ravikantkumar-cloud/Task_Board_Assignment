import React, { useMemo } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { List, RowComponentProps } from 'react-window'
import { Status, Task } from '../types.js'
import TaskCard from './TaskCard.js'
import { useSelector } from 'react-redux'
import { RootState } from '../store/index.js'

const ITEM_HEIGHT = 128

type RowData = {
  items: Task[]
  onEdit: (id: string) => void
}

const Row = ({ index, style, items, onEdit }: RowComponentProps<RowData>) => {
  const task = items[index]
  return (
    <div style={style} className="px-0 py-1" data-id={task.id}>
      <TaskCard task={task} onEdit={onEdit} />
    </div>
  )
}

export default function Column({
  status,
  title,
  onEdit,
  taskIds
}: {
  status: Status
  title: string
  onEdit: (id: string) => void
  taskIds?: string[]
}) {
  const ids = useSelector((state: RootState) => state.tasks.columns[status])
  const byId = useSelector((state: RootState) => state.tasks.byId)
  const { setNodeRef, isOver } = useDroppable({ id: status })
  const visibleIds = taskIds ?? ids
  const items = useMemo(() => visibleIds.map((id: string) => byId[id]), [visibleIds, byId])

  return (
    <section
      ref={setNodeRef}
      className={`bg-white p-3 rounded shadow min-h-[200px] ${isOver ? 'ring-2 ring-blue-400 ring-offset-2' : ''}`}
    >
      <h3 className="font-semibold mb-2">{title} ({visibleIds.length})</h3>
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        {visibleIds.length === 0 ? (
          <div className="text-sm text-gray-400">No tasks</div>
        ) : (
          <List
            rowCount={items.length}
            rowHeight={ITEM_HEIGHT}
            rowComponent={Row}
            overscanCount={6}
            rowProps={{ items, onEdit }}
            style={{ height: Math.min(ids.length * ITEM_HEIGHT, 680), width: '100%' }}
          />
        )}
      </SortableContext>
    </section>
  )
}
