import { useEffect, useState } from 'react'
import { createTodo, deleteTodo, getTodos, updateTodo } from './api/todos'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL

function App() {
  const [todos, setTodos] = useState([])
  const [title, setTitle] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const loadTodos = async () => {
    try {
      setError('')
      const data = await getTodos()
      setTodos(data)
    } catch (err) {
      setTodos([])
      setError(err.message || `백엔드 연결에 실패했습니다. ${API_URL}을 확인해주세요.`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTodos()
  }, [])

  const resetForm = () => {
    setTitle('')
    setEditingId(null)
  }

  const startEdit = (todo) => {
    setEditingId(todo._id)
    setTitle(todo.title)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const trimmed = title.trim()
    if (!trimmed || saving) return

    setSaving(true)
    setError('')

    try {
      if (editingId) {
        await updateTodo(editingId, trimmed)
        resetForm()
      } else {
        await createTodo(trimmed)
        setTitle('')
      }
      await loadTodos()
    } catch (err) {
      setError(err.message || '저장에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    setError('')
    try {
      if (editingId === id) resetForm()
      await deleteTodo(id)
      await loadTodos()
    } catch (err) {
      setError(err.message || '삭제에 실패했습니다.')
    }
  }

  return (
    <div className="app">
      <main className="panel">
        <header className="header">
          <p className="eyebrow">Todo React</p>
          <h1>할일</h1>
          <p className="subtitle">추가하고, 고치고, 지우세요.</p>
        </header>

        <form className={`todo-form${editingId ? ' is-editing' : ''}`} onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder={editingId ? '할일을 수정하세요' : '새 할일을 입력하세요'}
            aria-label="할일 내용"
            disabled={saving}
          />
          <div className="form-actions">
            {editingId && (
              <button type="button" className="btn ghost" onClick={resetForm} disabled={saving}>
                취소
              </button>
            )}
            <button type="submit" className="btn primary" disabled={saving || !title.trim()}>
              {saving ? '저장 중…' : editingId ? '저장' : '추가'}
            </button>
          </div>
        </form>

        {error && <p className="message error">{error}</p>}

        <section className="list-section">
          <div className="list-meta">
            <h2>목록</h2>
            <span>{todos.length}개</span>
          </div>

          {loading ? (
            <p className="message">불러오는 중…</p>
          ) : todos.length === 0 ? (
            <p className="message empty">아직 할일이 없습니다.</p>
          ) : (
            <ul className="todo-list">
              {todos.map((todo) => (
                <li key={todo._id} className={`todo-item${editingId === todo._id ? ' editing' : ''}`}>
                  <p className="todo-text">{todo.title}</p>
                  <div className="actions">
                    <button type="button" className="btn soft" onClick={() => startEdit(todo)}>
                      수정
                    </button>
                    <button type="button" className="btn danger" onClick={() => handleDelete(todo._id)}>
                      삭제
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
