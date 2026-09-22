import type { RequestHandler } from 'express'
import { tasksService } from '../services/tasks.service.js'

export const getTasks: RequestHandler = (_request, response) => {
  response.json(tasksService.getAll())
}

export const createTask: RequestHandler = (request, response) => {
  try {
    const task = tasksService.create(request.body)
    response.status(201).json(task)
  } catch (error) {
    if (error instanceof Error) {
      response.status(400).json({ error: error.message })
      return
    }

    response.status(400).json({ error: 'Unable to create task' })
  }
}

export const updateTask: RequestHandler = (request, response) => {
  try {
    const task = tasksService.update(request.params.id, request.body)
    response.json(task)
  } catch (error) {
    if (error instanceof Error && error.message === 'Task not found') {
      response.status(404).json({ error: error.message })
      return
    }

    response.status(400).json({ error: error instanceof Error ? error.message : 'Unable to update task' })
  }
}

export const deleteTask: RequestHandler = (request, response) => {
  try {
    const task = tasksService.delete(request.params.id)
    response.json(task)
  } catch (error) {
    if (error instanceof Error && error.message === 'Task not found') {
      response.status(404).json({ error: error.message })
      return
    }

    response.status(400).json({ error: error instanceof Error ? error.message : 'Unable to delete task' })
  }
}

export const getDashboardSummary: RequestHandler = (_request, response) => {
  response.json(tasksService.getSummary())
}
