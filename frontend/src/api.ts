export type Task = {
  id: string
  title: string
  done: boolean
  created_at: string
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.error ?? `Request failed (${response.status})`)
  }

  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}

export const listTasks = () => request<Task[]>('/api/tasks')

export const createTask = (title: string) =>
  request<Task>('/api/tasks', { method: 'POST', body: JSON.stringify({ title }) })

export const updateTask = (id: string, done: boolean) =>
  request<Task>(`/api/tasks/${id}`, { method: 'PATCH', body: JSON.stringify({ done }) })

export const deleteTask = (id: string) =>
  request<void>(`/api/tasks/${id}`, { method: 'DELETE' })
