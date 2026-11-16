const API_URL = import.meta.env.VITE_API_URL

async function request(path = '', options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || '요청에 실패했습니다.')
  }

  return data
}

export function getTodos() {
  return request()
}

export function createTodo(title) {
  return request('', {
    method: 'POST',
    body: JSON.stringify({ title }),
  })
}

export function updateTodo(id, title) {
  return request(`/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ title }),
  })
}

export function deleteTodo(id) {
  return request(`/${id}`, { method: 'DELETE' })
}
