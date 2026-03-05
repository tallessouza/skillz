---
name: rs-redux-zustand-disparando-actions
description: "Applies Redux dispatch patterns when writing React components that modify global state. Use when user asks to 'dispatch an action', 'update Redux state', 'create a reducer action', 'add useDispatch', or 'connect component to Redux store'. Enforces typed selectors, action export patterns, and payload structure from Redux Toolkit. Make sure to use this skill whenever implementing state mutations with Redux Toolkit slices. Not for Zustand, React Context, or local useState patterns."
---

# Disparando Actions no Redux

> Toda alteracao de estado no Redux passa por actions tipadas, exportadas do slice e disparadas via useDispatch nos componentes.

## Rules

1. **Defina actions dentro de `reducers` no slice** — cada action representa uma operacao que a interface pode fazer no estado, porque isso centraliza mutacoes e garante rastreabilidade
2. **Exporte actions desestruturando `slice.actions`** — `export const { add } = todoSlice.actions`, porque permite importacao direta nos componentes
3. **Use `useDispatch` para disparar actions** — nunca mute o estado diretamente, porque o Redux precisa do dispatch para rastrear mudancas
4. **Tipe o selector com `TypedUseSelectorHook`** — crie `useAppSelector` tipado com `RootState`, porque `useSelector` padrao retorna `unknown`
5. **Derive `RootState` com `ReturnType<typeof store.getState>`** — nao defina o tipo manualmente, porque ele se atualiza automaticamente quando o store muda
6. **Cada action recebe `(state, action)` onde `action.payload` contem os dados** — o Redux adiciona automaticamente `type` (slice/action) e `payload` (dados enviados)

## How to write

### Definir action no slice

```typescript
const todoSlice = createSlice({
  name: 'todo',
  initialState: ['Fazer café', 'Estudar Redux'],
  reducers: {
    add: (state, action) => {
      state.push(action.payload.newTodo)
    },
  },
})

export const { add } = todoSlice.actions
```

### Tipar o selector

```typescript
// store.ts
import { useSelector, TypedUseSelectorHook } from 'react-redux'

export type RootState = ReturnType<typeof store.getState>
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
```

### Disparar action no componente

```typescript
import { useDispatch } from 'react-redux'
import { add } from '../store'
import { useAppSelector } from '../store'

function AddTodo() {
  const dispatch = useDispatch()
  const todos = useAppSelector((state) => state.todo)

  function handleAdd() {
    dispatch(add({ newTodo: 'Estudar React' }))
    setNewTodo('')
  }
}
```

## Example

**Before (sem tipagem, useSelector generico):**
```typescript
import { useSelector, useDispatch } from 'react-redux'

const todos = useSelector((state) => state.todo) // state é unknown
dispatch(add('texto')) // payload sem estrutura
```

**After (tipado, payload estruturado):**
```typescript
import { useDispatch } from 'react-redux'
import { useAppSelector } from '../store'
import { add } from '../store'

const todos = useAppSelector((state) => state.todo) // string[] tipado
dispatch(add({ newTodo: 'texto' })) // payload estruturado
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Componente precisa ler estado | Use `useAppSelector` (tipado), nunca `useSelector` direto |
| Componente precisa alterar estado | Importe action do slice + `useDispatch` |
| Nova operacao no estado | Adicione em `reducers` do slice, exporte de `slice.actions` |
| Payload complexo | Envie objeto: `dispatch(action({ key: value }))` |
| Apos dispatch bem-sucedido | Limpe o formulario (ex: `setNewTodo('')`) |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `state = newValue` (reatribuicao) | `state.push(item)` (mutacao via Immer) |
| `useSelector((state) => ...)` sem tipagem | `useAppSelector((state) => ...)` com RootState |
| `type RootState = { todo: string[] }` manual | `ReturnType<typeof store.getState>` derivado |
| Exportar o slice inteiro pro componente | Exportar apenas actions e selector tipado |
| Dispatch sem payload estruturado | `dispatch(action({ campo: valor }))` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/redux-zustand/rs-redux-zustand-disparando-actions-no-redux/references/deep-explanation.md)
- [Code examples](../../../data/skills/redux-zustand/rs-redux-zustand-disparando-actions-no-redux/references/code-examples.md)
