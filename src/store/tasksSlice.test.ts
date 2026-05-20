import { describe, expect, it } from 'vitest'
import reducer, { moveTask, redo, undo, updateTask } from './tasksSlice.js'

const getInitialState = () => reducer(undefined, { type: 'init' })

describe('tasksSlice', () => {
  it('moves a task to another status and preserves ordering', () => {
    const initial = getInitialState()
    const id = initial.columns.todo[0]
    const next = reducer(initial, moveTask({ id, to: 'in-progress', index: 0 }))

    expect(next.byId[id].status).toBe('in-progress')
    expect(next.columns.todo.includes(id)).toBe(false)
    expect(next.columns['in-progress'][0]).toBe(id)
  })

  it('supports undo and redo', () => {
    const initial = getInitialState()
    const id = initial.columns.todo[0]

    const moved = reducer(initial, moveTask({ id, to: 'done', index: 0 }))
    const undone = reducer(moved, undo())
    const redone = reducer(undone, redo())

    expect(moved.byId[id].status).toBe('done')
    expect(undone.byId[id].status).toBe(initial.byId[id].status)
    expect(redone.byId[id].status).toBe('done')
  })

  it('caps history at 50 entries', () => {
    let state = getInitialState()
    const id = state.columns.todo[0]

    for (let i = 0; i < 60; i += 1) {
      state = reducer(state, updateTask({ id, patch: { title: `Title ${i}` } }))
    }

    expect(state.history.past).toHaveLength(50)
  })
})
