import { Router } from 'express'
import { pool } from './db'

export const tasksRouter = Router()

const SELECT = 'SELECT id, title, done, created_at FROM tasks'

tasksRouter.get('/', async (_req, res) => {
  try {
    const { rows } = await pool.query(`${SELECT} ORDER BY created_at DESC`)
    res.json(rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to load tasks' })
  }
})

tasksRouter.post('/', async (req, res) => {
  const title = typeof req.body?.title === 'string' ? req.body.title.trim() : ''
  if (!title) {
    res.status(400).json({ error: 'title is required' })
    return
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO tasks (title) VALUES ($1) RETURNING id, title, done, created_at`,
      [title],
    )
    res.status(201).json(rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to create task' })
  }
})

tasksRouter.patch('/:id', async (req, res) => {
  const done = req.body?.done
  if (typeof done !== 'boolean') {
    res.status(400).json({ error: 'done must be a boolean' })
    return
  }

  try {
    const { rows } = await pool.query(
      `UPDATE tasks SET done = $2 WHERE id = $1 RETURNING id, title, done, created_at`,
      [req.params.id, done],
    )
    if (rows.length === 0) {
      res.status(404).json({ error: 'Task not found' })
      return
    }
    res.json(rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to update task' })
  }
})

tasksRouter.delete('/:id', async (req, res) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM tasks WHERE id = $1', [req.params.id])
    if (rowCount === 0) {
      res.status(404).json({ error: 'Task not found' })
      return
    }
    res.status(204).end()
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to delete task' })
  }
})
