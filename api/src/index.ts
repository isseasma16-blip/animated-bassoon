import express from 'express'
import { tasksRouter } from './tasks'

const app = express()
const port = Number(process.env.PORT ?? 8000)

app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/tasks', tasksRouter)

app.listen(port, '0.0.0.0', () => {
  console.log(`api listening on http://0.0.0.0:${port}`)
})
