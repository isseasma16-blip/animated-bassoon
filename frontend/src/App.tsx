import { useEffect, useState } from 'react'
import { createTask, deleteTask, listTasks, updateTask, type Task } from './api'

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    listTasks()
      .then(setTasks)
      .catch((cause: unknown) => setError((cause as Error).message))
      .finally(() => setLoading(false))
  }, [])

  async function handleAdd(event: React.FormEvent) {
    event.preventDefault()
    const value = title.trim()
    if (!value) return

    try {
      const task = await createTask(value)
      setTasks((current) => [task, ...current])
      setTitle('')
      setError(null)
    } catch (cause) {
      setError((cause as Error).message)
    }
  }

  async function handleToggle(task: Task) {
    try {
      const updated = await updateTask(task.id, !task.done)
      setTasks((current) => current.map((item) => (item.id === updated.id ? updated : item)))
      setError(null)
    } catch (cause) {
      setError((cause as Error).message)
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteTask(id)
      setTasks((current) => current.filter((item) => item.id !== id))
      setError(null)
    } catch (cause) {
      setError((cause as Error).message)
    }
  }

  const remaining = tasks.filter((task) => !task.done).length

  return (
    <main className="page">
      <section className="card">
        <header className="header">
          <h1>Tasks</h1>
          <p className="subtitle">
            {loading
              ? 'Loading…'
              : `${remaining} open · ${tasks.length - remaining} done`}
          </p>
        </header>

        <form className="composer" onSubmit={handleAdd}>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="What needs doing?"
            aria-label="New task title"
          />
          <button type="submit" disabled={!title.trim()}>
            Add
          </button>
        </form>

        {error && <p className="error">{error}</p>}

        {!loading && tasks.length === 0 && (
          <p className="empty">Nothing here yet — add your first task above.</p>
        )}

        <ul className="list">
          {tasks.map((task) => (
            <li key={task.id} className={task.done ? 'item done' : 'item'}>
              <label>
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => handleToggle(task)}
                />
                <span>{task.title}</span>
              </label>
              <button
                type="button"
                className="remove"
                onClick={() => handleDelete(task.id)}
                aria-label={`Delete ${task.title}`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
