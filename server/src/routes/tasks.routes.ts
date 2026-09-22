import { Router } from 'express'
import {
  createTask,
  deleteTask,
  getDashboardSummary,
  getTasks,
  updateTask,
} from '../controllers/tasks.controller.js'

export const tasksRoutes = Router()

tasksRoutes.get('/tasks', getTasks)
tasksRoutes.post('/tasks', createTask)
tasksRoutes.patch('/tasks/:id', updateTask)
tasksRoutes.delete('/tasks/:id', deleteTask)
tasksRoutes.get('/dashboard/summary', getDashboardSummary)
