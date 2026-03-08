# Code Examples: UseEffect na Prática

## Exemplo 1: Importação e uso básico (da aula)

```jsx
import { useState, useEffect } from 'react'

function App() {
  const [count, setCount] = useState(0)

  // useEffect posicionado perto do return
  useEffect(() => {
    console.log('Oi')
  }, []) // array vazio = só no mount

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  )
}
```

**O que acontece:** "Oi" aparece no console quando o componente monta. Clicar no botão NÃO re-executa o useEffect (array vazio).

## Exemplo 2: Com dependência

```jsx
function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState([])

  useEffect(() => {
    if (searchTerm.length > 2) {
      console.log('Buscando:', searchTerm)
      // fetch(`/api/search?q=${searchTerm}`)
      //   .then(res => res.json())
      //   .then(data => setResults(data))
    }
  }, [searchTerm]) // re-executa quando searchTerm muda

  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul>
        {results.map(item => <li key={item.id}>{item.name}</li>)}
      </ul>
    </div>
  )
}
```

**O que acontece:** Toda vez que `searchTerm` muda (usuário digita), o useEffect re-executa. O `if` garante que só busca com 3+ caracteres.

## Exemplo 3: Sem array de dependências (anti-pattern)

```jsx
// ❌ ERRADO — executa em TODA re-renderização
function BadComponent() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    console.log('Executou') // aparece em CADA render
  }) // sem array = sem controle

  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

**O que acontece:** Cada clique no botão muda o estado → re-render → useEffect executa novamente. Com fetch dentro, seria dezenas de requests.

## Exemplo 4: Comparação dos três modos

```jsx
function ComparisonComponent() {
  const [value, setValue] = useState('')

  // Modo 1: Só no mount
  useEffect(() => {
    console.log('MOUNT: componente apareceu na tela')
  }, [])

  // Modo 2: Quando value muda
  useEffect(() => {
    console.log('DEPENDENCY: value mudou para', value)
  }, [value])

  // Modo 3: Toda renderização (evitar)
  // useEffect(() => {
  //   console.log('EVERY RENDER: aconteceu um render')
  // })

  return (
    <input value={value} onChange={(e) => setValue(e.target.value)} />
  )
}
```

**Resultado no console ao digitar "abc":**
```
MOUNT: componente apareceu na tela
DEPENDENCY: value mudou para
DEPENDENCY: value mudou para a
DEPENDENCY: value mudou para ab
DEPENDENCY: value mudou para abc
```

## Exemplo 5: Posicionamento correto no componente

```jsx
function CorrectOrder() {
  // 1. Estados primeiro
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  // 2. Variáveis derivadas
  const activeUsers = users.filter(u => u.isActive)
  const userCount = activeUsers.length

  // 3. useEffect perto do return (após lógica, antes do JSX)
  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data)
        setLoading(false)
      })
  }, [])

  // 4. Return com JSX
  return (
    <div>
      {loading ? <p>Carregando...</p> : <p>{userCount} usuários ativos</p>}
    </div>
  )
}
```

## Exemplo 6: Múltiplos useEffects (separação de responsabilidades)

```jsx
function Dashboard() {
  const [user, setUser] = useState(null)
  const [notifications, setNotifications] = useState([])

  // Efeito 1: Buscar usuário (mount)
  useEffect(() => {
    fetch('/api/me')
      .then(res => res.json())
      .then(setUser)
  }, [])

  // Efeito 2: Buscar notificações quando usuário carrega
  useEffect(() => {
    if (user) {
      fetch(`/api/notifications/${user.id}`)
        .then(res => res.json())
        .then(setNotifications)
    }
  }, [user]) // depende de user

  return (
    <div>
      <h1>Olá, {user?.name}</h1>
      <p>{notifications.length} notificações</p>
    </div>
  )
}
```

**O que acontece:**
1. Componente monta → Efeito 1 busca usuário
2. `setUser` atualiza estado → re-render → Efeito 2 detecta que `user` mudou → busca notificações
3. Efeito 1 NÃO re-executa (array vazio)