# Code Examples: Disparando Actions no Redux

## Exemplo completo do slice com action

```typescript
// store.ts
import { configureStore, createSlice } from '@reduxjs/toolkit'
import { useSelector, TypedUseSelectorHook } from 'react-redux'

const todoSlice = createSlice({
  name: 'todo',
  initialState: ['Fazer café', 'Estudar Redux', 'Estudar Zustand'],
  reducers: {
    add: (state, action) => {
      state.push(action.payload.newTodo)
    },
  },
})

export const { add } = todoSlice.actions

const store = configureStore({
  reducer: {
    todo: todoSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default store
```

## Componente AddTodo (disparando action)

```typescript
// components/AddTodo.tsx
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { add } from '../store'

export function AddTodo() {
  const [newTodo, setNewTodo] = useState('')
  const dispatch = useDispatch()

  function handleAdd() {
    dispatch(add({ newTodo }))
    setNewTodo('') // limpa o formulario apos adicionar
  }

  return (
    <div>
      <input
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
      />
      <button onClick={handleAdd}>Adicionar</button>
    </div>
  )
}
```

## Componente TodoList (lendo estado tipado)

```typescript
// components/TodoList.tsx
import { useAppSelector } from '../store'

export function TodoList() {
  const todos = useAppSelector((state) => state.todo)
  // todos é string[] — tipado automaticamente

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo}>{todo}</li>
      ))}
    </ul>
  )
}
```

## Evolucao do console.log no reducer

O instrutor demonstra ao vivo o que acontece ao logar state e action:

```typescript
reducers: {
  add: (state, action) => {
    console.log(state, action)
    // state: Proxy do array ['Fazer café', 'Estudar Redux', 'Estudar Zustand']
    // action: { type: 'todo/add', payload: { newTodo: 'Estudar React' } }
  },
}
```

## Erro comum: typeof vs ReturnType

```typescript
// ERRADO — retorna o tipo da funcao, nao do retorno
export type RootState = typeof store.getState
// Tipo: () => { todo: string[] }

// CORRETO — retorna o tipo do retorno da funcao
export type RootState = ReturnType<typeof store.getState>
// Tipo: { todo: string[] }
```

## Variacao: payload simples vs estruturado

```typescript
// Payload simples (string direto)
dispatch(add('Estudar React'))
// action.payload === 'Estudar React'

// Payload estruturado (objeto) — preferido pelo instrutor
dispatch(add({ newTodo: 'Estudar React' }))
// action.payload.newTodo === 'Estudar React'
```