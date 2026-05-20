# Real-Time Collaborative Task Board

Task board built with React, TypeScript, Redux Toolkit, dnd-kit, and react-window.

## Run Locally

```bash
npm install
npm run dev
```

## Scripts

```bash
npm run dev
npm run build
npm run test
```

## Implemented Features

- Three task columns: Todo, In Progress, Done
- Draggable tasks across columns and reordering inside a column
- Task card fields: title, description, status, priority, assignee, created date
- Task creation modal with required fields (title, description, assignee)
- Basic filtering:
	- Search by title/description
	- Filter by assignee
	- Filter by priority
- Optimistic status updates with 2s simulated API delay
- 10% simulated failure rollback and loading state indicator
- Virtualized column rendering for large lists (1200 seed tasks)
- Undo/redo actions with keyboard shortcuts:
	- Undo: Ctrl/Cmd+Z
	- Redo: Ctrl/Cmd+Y or Ctrl/Cmd+Shift+Z
- History stack capped at 50 states

## Assumptions and Tradeoffs

- Filtering is applied to visible rows per column; drag-and-drop still acts on full column order.
- Undo/redo tracks store state transitions; optimistic rollback currently appears as additional history events.

## Known Gaps vs Full Prompt

- Advanced expert options are partial (complex query builder and CRDT-level merge not implemented).
- Undo/redo labels do not yet display the exact next action name.
