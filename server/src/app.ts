import express from 'express'
import helmet from 'helmet'
import { errorHandler } from './middleware/error-handler.js'
import { notFoundHandler } from './middleware/not-found.js'
import { healthRoutes } from './routes/health.routes.js'
import { tasksRoutes } from './routes/tasks.routes.js'

const app = express()

app.use(helmet())
app.use(express.json())
app.use('/api', tasksRoutes)
app.use('/api/health', healthRoutes)
app.use(notFoundHandler)
app.use(errorHandler)

export default app