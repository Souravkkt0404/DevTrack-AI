import type { RequestHandler } from 'express'
import { healthService } from '../services/health.service.js'

export const getHealth: RequestHandler = (_request, response) => {
  response.json(healthService.getStatus())
}