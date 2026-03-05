# Code Examples: Criando Store do Redux

## 1. Instalacao dos pacotes

```bash
# Criar projeto com Vite
npm create vite@latest react-redux-zustand -- --template react-ts
cd react-redux-zustand
npm install

# Instalar Redux Toolkit + React Redux
npm install @reduxjs/toolkit react-redux
```

## 2. Criando o Store

```typescript
// src/store/index.ts
import { configureStore, createSlice } from '@reduxjs/toolkit'

const todoSlice = createSlice({
  name: 'todo',
  initialState: ['Fazer cafe', 'Estudar Redux'],
  reducers: {
    // por enquanto vazio — actions vem na proxima aula
  },
})

export const store = configureStore({
  reducer: {
    todo: todoSlice.reducer,
  },
})
```

### O que configureStore aceita

```typescript
configureStore({
  reducer: {}, // OBRIGATORIO — objeto com os slices
  // middleware, devTools, preloadedState, enhancers — opcionais
})
```

### O que createSlice aceita

```typescript
createSlice({
  name: 'todo',           // nome unico do slice
  initialState: [],        // valor inicial
  reducers: {},            // acoes que modificam o estado
})
```

## 3. Provider no main.tsx

```typescript
// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider as ReduxProvider } from 'react-redux'
import { store } from './store'
import { App } from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <App />
    </ReduxProvider>
  </React.StrictMode>
)
```

## 4. Componente TodoList com useSelector

```typescript
// src/components/TodoList.tsx
import { useSelector } from 'react-redux'

export function TodoList() {
  // Seleciona apenas o slice 'todo' do store
  const todos = useSelector((store: any) => store.todo)

  return (
    <ul>
      {todos.map((todo: string) => (
        <li key={todo}>{todo}</li>
      ))}
    </ul>
  )
}
```

### Variacao: retornando o store inteiro (nao recomendado)

```typescript
// Retorna { todo: ['Fazer cafe', 'Estudar Redux'] }
const store = useSelector((state: any) => state)
console.log(store) // objeto com todos os slices
```

## 5. Componente AddTodo (formulario basico)

```typescript
// src/components/AddTodo.tsx
import { FormEvent, useState } from 'react'

export function AddTodo() {
  const [value, setValue] = useState('')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    console.log('new Todo', value)
    // dispatch virá na próxima aula
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="submit">Adicionar</button>
    </form>
  )
}
```

## 6. App reunindo os componentes

```typescript
// src/App.tsx
import { TodoList } from './components/TodoList'
import { AddTodo } from './components/AddTodo'

export function App() {
  return (
    <div>
      <TodoList />
      <AddTodo />
    </div>
  )
}
```

## 7. Multiplos slices (exemplo expandido)

```typescript
// Como ficaria com mais slices
export const store = configureStore({
  reducer: {
    todo: todoSlice.reducer,
    auth: authSlice.reducer,
    cart: cartSlice.reducer,
    favorites: favoritesSlice.reducer,
  },
})

// Cada um acessado separadamente:
const todos = useSelector((state: any) => state.todo)
const user = useSelector((state: any) => state.auth)
const cartItems = useSelector((state: any) => state.cart)
```