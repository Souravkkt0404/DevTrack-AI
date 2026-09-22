export type TaskStatus = 'todo' | 'in-progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface Task {
  id: string
  title: string
  project: string
  priority: TaskPriority
  status: TaskStatus
  description?: string
  dueDate?: string | null
  createdAt: string
  updatedAt: string
}

export type TaskInput = {
  title: string
  project?: string
  priority?: TaskPriority
  status?: TaskStatus
  description?: string
  dueDate?: string | null
}

export type TaskUpdateInput = Partial<TaskInput>
