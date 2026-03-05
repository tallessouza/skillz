---
name: rs-redux-zustand-criando-store-redux
description: "Applies Redux Toolkit store setup pattern when creating or configuring global state in React applications. Use when user asks to 'setup Redux', 'create a store', 'configure Redux Toolkit', 'add global state', or 'share state between components'. Covers configureStore, createSlice, Provider setup, and useSelector usage. Make sure to use this skill whenever scaffolding Redux in a React project. Not for Zustand, Context API alone, or server-side state management."
---

# Criando Store do Redux com Redux Toolkit

> Configurar estado global com Redux Toolkit usando configureStore, createSlice, Provider e useSelector.

## Rules

1. **Use Redux Toolkit, nunca Redux puro** — `@reduxjs/toolkit` substitui o antigo `react-redux` standalone, porque simplifica drasticamente boilerplate e é a recomendacao oficial
2. **Organize estado em Slices** — cada dominio (cart, auth, todos) vira um slice separado via `createSlice`, porque evita um reducer monolitico impossivel de manter
3. **Store fica em `src/store/index.ts`** — ponto unico de configuracao com `configureStore`, porque centraliza todos os reducers
4. **Provider no main.tsx** — envolva `<App />` com o Provider do `react-redux` passando a store, porque sem isso nenhum componente acessa o estado
5. **useSelector para leitura** — selecione apenas o slice necessario (`state.todo`), nunca retorne o store inteiro, porque causa re-renders desnecessarios
6. **Instale ambos os pacotes** — `@reduxjs/toolkit` + `react-redux`, porque o Toolkit e agnostico de UI e precisa do binding React separado

## How to write

### Store com configureStore

```typescript
// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit'
import { todoSlice } from './slices/todo'

export const store = configureStore({
  reducer: {
    todo: todoSlice.reducer,
  },
})
```

### Slice com createSlice

```typescript
// src/store/slices/todo.ts
import { createSlice } from '@reduxjs/toolkit'

export const todoSlice = createSlice({
  name: 'todo',
  initialState: ['Fazer cafe', 'Estudar Redux'],
  reducers: {
    // actions serao definidas aqui
  },
})
```

### Provider no main.tsx

```typescript
import { Provider as ReduxProvider } from 'react-redux'
import { store } from './store'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ReduxProvider store={store}>
    <App />
  </ReduxProvider>
)
```

### useSelector no componente

```typescript
import { useSelector } from 'react-redux'

export function TodoList() {
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

## Example

**Before (sem Redux, componentes isolados):**
```typescript
// TodoList.tsx — dados hardcoded, sem compartilhamento
export function TodoList() {
  return <ul><li>Fazer cafe</li></ul>
}

// AddTodo.tsx — formulario que nao se comunica com a lista
export function AddTodo() {
  const [value, setValue] = useState('')
  return <form><input value={value} onChange={e => setValue(e.target.value)} /></form>
}
```

**After (com Redux Toolkit, estado compartilhado):**
```typescript
// store/index.ts
export const store = configureStore({
  reducer: { todo: todoSlice.reducer },
})

// TodoList.tsx — le do estado global
export function TodoList() {
  const todos = useSelector((store: any) => store.todo)
  return <ul>{todos.map(t => <li key={t}>{t}</li>)}</ul>
}

// AddTodo.tsx — pode despachar actions para o mesmo estado
export function AddTodo() { /* dispatch para adicionar */ }
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Dois+ componentes precisam do mesmo estado | Crie um slice no Redux |
| Estado e local a um componente | Use useState, nao Redux |
| Projeto novo com estado global | `npm i @reduxjs/toolkit react-redux` |
| Multiplos dominios (cart, auth, favorites) | Um slice por dominio, todos no configureStore |
| Provider nao configurado | Componentes nao conseguem useSelector — envolva App com Provider |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `import { createStore } from 'redux'` | `import { configureStore } from '@reduxjs/toolkit'` |
| Retornar store inteiro no useSelector | Selecionar apenas o slice: `state.todo` |
| Colocar tudo num reducer gigante | Separar em slices com createSlice |
| Esquecer de instalar react-redux | Instalar ambos: `@reduxjs/toolkit` e `react-redux` |
| Provider sem prop store | `<ReduxProvider store={store}>` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
