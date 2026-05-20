const sampleTasks = [
  {
    title: 'Implement authentication',
    description: 'Add JWT-based auth',
    status: 'todo',
    priority: 'high',
    assignee: 'John Doe',
    tags: ['backend', 'security']
  },
  {
    title: 'Design new landing page',
    description: 'Create mockups for homepage redesign',
    status: 'in-progress',
    priority: 'medium',
    assignee: 'Jane Smith',
    tags: ['design', 'frontend']
  },
  {
    title: 'Fix payment gateway bug',
    description: 'Users unable to complete checkout',
    status: 'todo',
    priority: 'high',
    assignee: 'John Doe',
    tags: ['backend', 'urgent']
  }
]

const statuses = ['todo', 'in-progress', 'done'] as const
const priorities = ['low', 'medium', 'high'] as const
const assignees = ['John Doe', 'Jane Smith', 'Alex Lee', 'Maya Patel']
const tagSets = [['frontend'], ['backend'], ['urgent'], ['design'], ['backend', 'security'], ['frontend', 'UX']]
const TASKS_PER_COLUMN = 200

const random = <T,>(items: readonly T[]) => items[Math.floor(Math.random() * items.length)]

const makeTask = (index: number) => {
  const sample = sampleTasks[index % sampleTasks.length]
  const status = statuses[Math.floor(index / TASKS_PER_COLUMN)] ?? 'done'
  return {
    id: String(index + 1),
    title: `${sample.title} #${index + 1}`,
    description: sample.description,
    status,
    priority: random(priorities),
    assignee: random(assignees),
    tags: random(tagSets),
    createdAt: new Date(Date.now() - index * 1000 * 60 * 15).toISOString()
  }
}

export const mockTasks = Array.from({ length: TASKS_PER_COLUMN * statuses.length }, (_, index) => makeTask(index))
