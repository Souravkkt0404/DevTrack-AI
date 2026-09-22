import type { RequestHandler } from 'express'

type ValidationResult = string[]
type Validator = (request: Parameters<RequestHandler>[0]) => ValidationResult

export const validate = (validator: Validator): RequestHandler => {
  return (request, response, next) => {
    const errors = validator(request)

    if (errors.length > 0) {
      response.status(400).json({ error: 'Validation failed', details: errors })
      return
    }

    next()
  }
}