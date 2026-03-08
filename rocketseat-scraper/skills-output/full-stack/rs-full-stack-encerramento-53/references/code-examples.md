# Code Examples: Fundamentos do React

## Exemplo integrado — Todos os pilares em um componente

```tsx
// Componente que demonstra todos os pilares fundamentais

import { useState, useEffect } from 'react'

// Props tipadas (pilar: props)
interface UserListProps {
  role: string
  maxVisible?: number
}

// Componente funcional (pilar: componentes)
function UserList({ role, maxVisible = 5 }: UserListProps) {
  // Estado local (pilar: useState)
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Side effect para buscar dados (pilar: useEffect)
  useEffect(() => {
    async function fetchUsers() {
      setIsLoading(true)
      const response = await fetch(`/api/users?role=${role}`)
      const data = await response.json()
      setUsers(data)
      setIsLoading(false)
    }

    fetchUsers()
  }, [role]) // re-executa quando role muda

  // Evento handler (pilar: eventos)
  function handleRemoveUser(userId: string) {
    setUsers(previousUsers =>
      previousUsers.filter(user => user.id !== userId)
    )
  }

  // JSX com renderização condicional e listas (pilar: JSX)
  if (isLoading) {
    return <p>Carregando usuários...</p>
  }

  const visibleUsers = users.slice(0, maxVisible)

  return (
    <ul>
      {visibleUsers.map(user => (
        <li key={user.id}>
          {user.name}
          <button onClick={() => handleRemoveUser(user.id)}>
            Remover
          </button>
        </li>
      ))}
    </ul>
  )
}
```

## Checklist aplicado ao exemplo

| Pilar | Onde aparece no código |
|-------|----------------------|
| JSX | Template declarativo com `<ul>`, `<li>`, interpolação `{user.name}` |
| Componentes | `UserList` — função com responsabilidade única |
| Props | `role` e `maxVisible` com destructuring e valor padrão |
| Estado | `users` e `isLoading` com `useState` |
| Efeitos | `useEffect` com fetch e array de dependências `[role]` |
| Eventos | `handleRemoveUser` com atualização funcional do estado |

## Padrões fundamentais isolados

### Renderização condicional
```tsx
// Ternário para dois estados
{isLoggedIn ? <Dashboard /> : <LoginForm />}

// && para presença/ausência
{errorMessage && <Alert message={errorMessage} />}

// Early return para loading/error
if (isLoading) return <Skeleton />
if (error) return <ErrorMessage error={error} />
return <Content data={data} />
```

### Atualização de estado baseada no anterior
```tsx
// Correto: forma funcional
setCount(previousCount => previousCount + 1)
setItems(previousItems => [...previousItems, newItem])

// Incorreto: leitura direta do estado
setCount(count + 1) // pode causar bugs com batching
```

### Cleanup em useEffect
```tsx
useEffect(() => {
  const intervalId = setInterval(() => {
    setSeconds(previous => previous + 1)
  }, 1000)

  // Cleanup: executa quando componente desmonta ou dependências mudam
  return () => clearInterval(intervalId)
}, [])
```