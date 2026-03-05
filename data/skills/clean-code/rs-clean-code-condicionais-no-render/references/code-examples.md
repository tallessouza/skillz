# Code Examples: Condicionais no Render

## Exemplo original da aula

### Contexto
App de to-dos onde queremos mostrar uma mensagem quando a lista esta vazia.

### Codigo problematico (como mostrado na aula)
```tsx
function App() {
  const [todos, setTodos] = useState([])

  return (
    <div>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
      {todos.length === 0 && <p>Nenhum todo cadastrado</p>}
    </div>
  )
}
```

### Codigo corrigido (solucao da aula)
```tsx
function App() {
  const [todos, setTodos] = useState([])

  const isToDoListEmpty = todos.length === 0

  return (
    <div>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
      {isToDoListEmpty && <p>Nenhum todo cadastrado</p>}
    </div>
  )
}
```

## Variacoes e cenarios adicionais

### Multiplas condicoes no mesmo componente
```tsx
function Dashboard({ user, notifications, tasks }) {
  // Toda logica condicional ACIMA do return
  const isAdmin = user.role === 'admin'
  const hasUnreadNotifications = notifications.some(n => !n.read)
  const pendingTaskCount = tasks.filter(t => t.status === 'pending').length
  const hasPendingTasks = pendingTaskCount > 0
  const showWelcomeBanner = user.isFirstLogin && !user.dismissedBanner

  return (
    <div>
      {showWelcomeBanner && <WelcomeBanner />}
      {isAdmin && <AdminPanel />}
      {hasUnreadNotifications && <NotificationBadge />}
      {hasPendingTasks && <p>{pendingTaskCount} tarefas pendentes</p>}
    </div>
  )
}
```

### Ternarios complexos extraidos
```tsx
function UserStatus({ user }) {
  // Extrair ternarios complexos
  const statusLabel = user.isOnline ? 'Online' : user.lastSeen ? 'Visto recentemente' : 'Offline'
  const statusColor = user.isOnline ? 'green' : 'gray'

  return (
    <span style={{ color: statusColor }}>
      {statusLabel}
    </span>
  )
}
```

### Condicional com early return (alternativa valida)
```tsx
function TodoList({ todos }) {
  // Para casos onde o componente inteiro muda, early return e valido
  if (todos.length === 0) {
    return <p>Nenhum todo cadastrado</p>
  }

  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  )
}
```