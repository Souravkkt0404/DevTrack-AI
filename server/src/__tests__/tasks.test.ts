import test from 'node:test'
import assert from 'node:assert/strict'
import type { AddressInfo } from 'node:net'
import app from '../app.js'

test('GET /api/tasks returns task list', async () => {
  const server = app.listen(0)

  await new Promise<void>((resolve) => {
    server.once('listening', () => resolve())
  })

  const { port } = server.address() as AddressInfo

  try {
    const response = await fetch(`http://localhost:${port}/api/tasks`)
    const body = await response.json()

    assert.equal(response.status, 200)
    assert.ok(Array.isArray(body))
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => {
        if (error) reject(error)
        else resolve()
      })
    })
  }
})

test('POST /api/tasks creates a new task', async () => {
  const server = app.listen(0)

  await new Promise<void>((resolve) => {
    server.once('listening', () => resolve())
  })

  const { port } = server.address() as AddressInfo

  try {
    const response = await fetch(`http://localhost:${port}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Build task API',
        project: 'DevTrack',
        priority: 'High',
        status: 'todo',
      }),
    })

    const body = await response.json()

    assert.equal(response.status, 201)
    assert.equal(body.title, 'Build task API')
    assert.equal(body.status, 'todo')
    assert.ok(body.id)
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => {
        if (error) reject(error)
        else resolve()
      })
    })
  }
})
