# Code Examples: Introdução a Hooks no React

## useState — Exemplos práticos

### Estado simples (contador)

```typescript
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>Contagem: {count}</p>
      <button onClick={() => setCount(count + 1)}>Incrementar</button>
      <button onClick={() => setCount(0)}>Resetar</button>
    </div>
  )
}
```

### Estado com objeto

```typescript
import { useState } from 'react'

interface User {
  name: string
  email: string
}

function UserForm() {
  const [user, setUser] = useState<User>({ name: '', email: '' })

  function handleNameChange(name: string) {
    setUser(previousUser => ({ ...previousUser, name }))
  }

  function handleEmailChange(email: string) {
    setUser(previousUser => ({ ...previousUser, email }))
  }

  return (
    <form>
      <input
        value={user.name}
        onChange={event => handleNameChange(event.target.value)}
      />
      <input
        value={user.email}
        onChange={event => handleEmailChange(event.target.value)}
      />
    </form>
  )
}
```

### Estado com array

```typescript
import { useState } from 'react'

function TodoList() {
  const [todos, setTodos] = useState<string[]>([])
  const [newTodo, setNewTodo] = useState('')

  function addTodo() {
    if (newTodo.trim() === '') return
    setTodos(previousTodos => [...previousTodos, newTodo])
    setNewTodo('')
  }

  function removeTodo(index: number) {
    setTodos(previousTodos => previousTodos.filter((_, i) => i !== index))
  }

  return (
    <div>
      <input value={newTodo} onChange={e => setNewTodo(e.target.value)} />
      <button onClick={addTodo}>Adicionar</button>
      <ul>
        {todos.map((todo, index) => (
          <li key={index}>
            {todo}
            <button onClick={() => removeTodo(index)}>Remover</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

## useEffect — Exemplos práticos

### Fetch na montagem (array vazio)

```typescript
import { useState, useEffect } from 'react'

interface User {
  id: number
  name: string
}

function UserList() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchUsers() {
      const response = await fetch('/api/users')
      const fetchedUsers = await response.json()
      setUsers(fetchedUsers)
      setIsLoading(false)
    }

    fetchUsers()
  }, [])

  if (isLoading) return <p>Carregando...</p>

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

### Reagir a mudança de dependência

```typescript
import { useState, useEffect } from 'react'

interface Product {
  id: number
  name: string
  price: number
}

function ProductDetail({ productId }: { productId: string }) {
  const [product, setProduct] = useState<Product | null>(null)

  useEffect(() => {
    async function fetchProduct() {
      const response = await fetch(`/api/products/${productId}`)
      const fetchedProduct = await response.json()
      setProduct(fetchedProduct)
    }

    fetchProduct()
  }, [productId]) // Re-executa quando productId muda

  if (!product) return <p>Carregando...</p>

  return (
    <div>
      <h1>{product.name}</h1>
      <p>R$ {product.price}</p>
    </div>
  )
}
```

### Cleanup — event listener

```typescript
import { useState, useEffect } from 'react'

function MouseTracker() {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    function handleMouseMove(event: MouseEvent) {
      setPosition({ x: event.clientX, y: event.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)

    // Cleanup: remove listener quando componente desmonta
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <p>
      Mouse: {position.x}, {position.y}
    </p>
  )
}
```

### Cleanup — timer

```typescript
import { useState, useEffect } from 'react'

function Timer() {
  const [secondsElapsed, setSecondsElapsed] = useState(0)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSecondsElapsed(previous => previous + 1)
    }, 1000)

    return () => clearInterval(intervalId)
  }, [])

  return <p>Tempo: {secondsElapsed}s</p>
}
```

## Custom Hooks — Exemplos práticos

### useLocalStorage — Persistir estado no localStorage

```typescript
import { useState, useEffect } from 'react'

function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : initialValue
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(storedValue))
  }, [key, storedValue])

  return [storedValue, setStoredValue] as const
}

// Uso:
function Settings() {
  const [theme, setTheme] = useLocalStorage('theme', 'light')

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Tema: {theme}
    </button>
  )
}
```

### useFetch — Encapsular fetch com loading e error

```typescript
import { useState, useEffect } from 'react'

interface UseFetchResult<T> {
  data: T | null
  isLoading: boolean
  error: string | null
}

function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(url)
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [url])

  return { data, isLoading, error }
}

// Uso:
function UserProfile({ userId }: { userId: string }) {
  const { data: user, isLoading, error } = useFetch<User>(`/api/users/${userId}`)

  if (isLoading) return <p>Carregando...</p>
  if (error) return <p>Erro: {error}</p>
  if (!user) return null

  return <h1>{user.name}</h1>
}
```

### useWindowSize — Reagir ao tamanho da janela

```typescript
import { useState, useEffect } from 'react'

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowSize
}

// Uso:
function ResponsiveComponent() {
  const { width } = useWindowSize()

  return (
    <div>
      {width < 768 ? <MobileLayout /> : <DesktopLayout />}
    </div>
  )
}
```