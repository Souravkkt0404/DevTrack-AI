import { randomUUID } from 'node:crypto'
import type { Task, TaskInput, TaskPriority, TaskStatus, TaskUpdateInput } from '../types/task.js'

const tasks: Task[] = [
  {
    id: 'task-1',
    title: 'Refactor auth middleware',
    project: 'API gateway',
    priority: 'high',
    status: 'in-progress',
    dueDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-2',
    title: 'Review pull request #142',
    project: 'DevTrack client',
    priority: 'medium',
    status: 'todo',
    dueDate: new Date(Date.now() + 86400000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-3',
    title: 'Write error handling tests',
    project: 'API gateway',
    priority: 'low',
    status: 'todo',
    dueDate: new Date(Date.now() + 172800000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

const validStatuses: TaskStatus[] = ['todo', 'in-progress', 'done']
const validPriorities: TaskPriority[] = ['low', 'medium', 'high']

const normalizeTitle = (value: string) => value.trim()

const normalizeStatus = (value?: TaskStatus): TaskStatus => {
  if (!value || !validStatuses.includes(value)) {
    return 'todo'
  }

  return value
}

const normalizePriority = (value?: TaskPriority): TaskPriority => {
  if (!value || !validPriorities.includes(value)) {
    return 'medium'
  }

  return value
}

export const tasksService = {
  getAll() {
    return [...tasks]
  },

  create(input: TaskInput) {
    const title = normalizeTitle(input.title)

    if (!title) {
      throw new Error('Task title is required')
    }

    const now = new Date().toISOString()
    const task: Task = {
      id: randomUUID(),
      title,
      project: input.project?.trim() || 'Personal',
      priority: normalizePriority(input.priority),
      status: normalizeStatus(input.status),
      description: input.description?.trim(),
      dueDate: input.dueDate ?? null,
      createdAt: now,
      updatedAt: now,
    }

    tasks.unshift(task)
    return task
  },

  update(taskId: string, updates: TaskUpdateInput) {
    const task = tasks.find((entry) => entry.id === taskId)

    if (!task) {
      throw new Error('Task not found')
    }

    const nextTask = {
      ...task,
      ...updates,
      title: updates.title ? normalizeTitle(updates.title) : task.title,
      project: updates.project ? updates.project.trim() : task.project,
      priority: updates.priority ? normalizePriority(updates.priority) : task.priority,
      status: updates.status ? normalizeStatus(updates.status) : task.status,
      dueDate: updates.dueDate ?? task.dueDate,
      description: updates.description !== undefined ? updates.description.trim() : task.description,
      updatedAt: new Date().toISOString(),
    }

    Object.assign(task, nextTask)
    return { ...task }
  },

  delete(taskId: string) {
    const taskIndex = tasks.findIndex((entry) => entry.id === taskId)

    if (taskIndex === -1) {
      throw new Error('Task not found')
    }

    const [removedTask] = tasks.splice(taskIndex, 1)
    return removedTask
  },

  getSummary() {
    const total = tasks.length
    const completed = tasks.filter((task) => task.status === 'done').length
    const inProgress = tasks.filter((task) => task.status === 'in-progress').length
    const todo = tasks.filter((task) => task.status === 'todo').length

    return {
      total,
      completed,
      inProgress,
      todo,
    }
  },
}
