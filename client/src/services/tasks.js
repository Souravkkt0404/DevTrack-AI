const API_BASE = '/api'

export async function fetchTasks() {
  const response = await fetch(`${API_BASE}/tasks`)

  if (!response.ok) {
    throw new Error('Failed to fetch tasks')
  }

  return response.json()
}

export async function createTask(taskInput) {
  const response = await fetch(`${API_BASE}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskInput),
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    throw new Error(errorBody.error || 'Failed to create task')
  }

  return response.json()
}

export async function updateTask(taskId, updates) {
  const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    throw new Error(errorBody.error || 'Failed to update task')
  }

  return response.json()
}

export async function deleteTask(taskId) {
  const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    throw new Error(errorBody.error || 'Failed to delete task')
  }

  return response.json()
}

export async function fetchDashboardSummary() {
  const response = await fetch(`${API_BASE}/dashboard/summary`)

  if (!response.ok) {
    throw new Error('Failed to fetch dashboard summary')
  }

  return response.json()
}
