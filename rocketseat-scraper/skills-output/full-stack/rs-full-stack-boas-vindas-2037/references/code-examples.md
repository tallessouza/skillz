# Code Examples: Boas Vindas — Fundamentos do React

## Contexto

Esta aula e introdutoria e nao contem exemplos de codigo. Os exemplos abaixo ilustram o que o aluno ira construir ao longo do modulo, servindo como preview do que esta por vir.

## Preview: Componente React basico com TypeScript

```tsx
// Um componente funcional tipado — o padrao que sera ensinado
interface WelcomeProps {
  studentName: string
}

function Welcome({ studentName }: WelcomeProps) {
  return <h1>Fala, {studentName}! Bora aprender React!</h1>
}
```

## Preview: Estado e interatividade

```tsx
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>Contagem: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Incrementar
      </button>
    </div>
  )
}
```

## Preview: Consumindo API do backend

```tsx
import { useEffect, useState } from 'react'

interface User {
  id: string
  name: string
  email: string
}

function UserList() {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    fetch('http://localhost:3333/users')
      .then(response => response.json())
      .then(data => setUsers(data))
  }, [])

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

## O que esses exemplos demonstram

| Exemplo | Conceito React | Conceito TypeScript |
|---------|---------------|-------------------|
| Welcome | Componente funcional, props | Interface para props |
| Counter | Estado (useState), eventos | Inferencia de tipo no useState |
| UserList | Efeitos (useEffect), renderizacao de listas | Generics no useState, interface para dados |

Esses padroes serao ensinados progressivamente ao longo do modulo.