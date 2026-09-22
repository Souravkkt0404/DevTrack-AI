import type { RequestHandler } from 'express'

export const authenticate: RequestHandler = (request, response, next) => {
  const configuredToken = process.env.API_TOKEN
  const authorization = request.headers.authorization

  if (!configuredToken) {
    response.status(503).json({ error: 'Authentication is not configured' })
    return
  }

  if (authorization !== `Bearer ${configuredToken}`) {
    response.status(401).json({ error: 'Authentication required' })
    return
  }

  next()
}