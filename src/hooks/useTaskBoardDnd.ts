import { useRef, useState } from 'react'
import {
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { toast } from 'react-toastify'
import { AppDispatch, RootState } from '../store/index.js'
import { moveTask, setTaskLoading } from '../store/tasksSlice.js'
import { simulateApi } from '../services/apiSimulator.js'

const statusKeys = ['todo', 'in-progress', 'done'] as const
type StatusKey = (typeof statusKeys)[number]

type UseTaskBoardDndParams = {
  byId: RootState['tasks']['byId']
  columns: RootState['tasks']['columns']
  dispatch: AppDispatch
}

const getDropTarget = (
  overId: string,
  byId: RootState['tasks']['byId'],
  columns: RootState['tasks']['columns'],
  activeId: string
) => {
  const overIsStatus = statusKeys.includes(overId as StatusKey)
  const targetStatus = overIsStatus ? (overId as StatusKey) : byId[overId]?.status
  if (!targetStatus) return null

  if (overIsStatus) {
    const lastIndex = columns[targetStatus].length
    const destinationIndex = byId[activeId]?.status === targetStatus ? Math.max(lastIndex - 1, 0) : lastIndex
    return { targetStatus, destinationIndex }
  }

  const destinationIndex = columns[targetStatus].indexOf(overId)
  if (destinationIndex < 0) return null

  return { targetStatus, destinationIndex }
}

export default function useTaskBoardDnd({ byId, columns, dispatch }: UseTaskBoardDndParams) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const dragOrigin = useRef<{ status: StatusKey; index: number } | null>(null)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const handleDragStart = ({ active }: DragStartEvent) => {
    const id = String(active.id)
    const task = byId[id]
    if (!task) return

    const index = columns[task.status]?.indexOf(id)
    if (index === -1 || index === undefined) return

    dragOrigin.current = { status: task.status as StatusKey, index }
    setActiveId(id)
  }

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    setActiveId(null)
    const origin = dragOrigin.current
    dragOrigin.current = null
    if (!over || active.id === over.id) return

    const activeId = String(active.id)
    const overId = String(over.id)
    const task = byId[activeId]
    if (!task || !origin) return

    const target = getDropTarget(overId, byId, columns, activeId)
    if (!target) return

    const { targetStatus, destinationIndex } = target
    const samePosition = task.status === targetStatus && origin.index === destinationIndex
    if (samePosition) return

    dispatch(moveTask({ id: activeId, to: targetStatus, index: destinationIndex }))

    // In-column reorders are local-only; cross-column moves simulate server confirmation.
    if (task.status === targetStatus) return

    dispatch(setTaskLoading({ id: activeId, loading: true }))
    try {
      await simulateApi()
    } catch (error) {
      // Deterministic rollback: restore the captured origin without mutating undo/redo history.
      dispatch(moveTask({ id: activeId, to: origin.status, index: origin.index, recordHistory: false }))
      toast.error('Failed to update task status. Rollback applied.')
    } finally {
      dispatch(setTaskLoading({ id: activeId, loading: false }))
    }
  }

  return {
    activeId,
    sensors,
    handleDragStart,
    handleDragEnd
  }
}