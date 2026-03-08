---
name: rs-full-stack-use-action-state
description: "Enforces React 19 useActionState patterns when building forms with server actions or async submissions. Use when user asks to 'create a form', 'handle form state', 'show loading on submit', 'manage form submission', or 'use useActionState'. Applies rules: destructure [state, formAction, isPending], pass action function + initial state, return new state from action, use isPending for button disabling. Make sure to use this skill whenever building React 19 forms with async actions. Not for React 18 forms, Redux state management, or non-form state."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [react-19, useActionState, forms, async-actions, isPending]
---

# useActionState — Gerenciamento de Estado em Formulários React 19

> Utilize useActionState para gerenciar estado de formulários sem useState manual, obtendo estado anterior, formAction e isPending em uma única chamada.

## Rules

1. **Desestruture os três retornos** — `const [state, formAction, isPending] = useActionState(fn, initialState)`, porque cada valor tem papel específico: estado atual, ação do form, e indicador de processamento
2. **Passe a função de ação como primeiro parâmetro** — a função recebe `(prevState, formData)` automaticamente, porque o useActionState injeta o estado anterior antes do formData
3. **Defina o estado inicial como segundo parâmetro** — use `null` ou um objeto com valores vazios, porque esse valor popula o `state` na primeira renderização
4. **Retorne o novo estado na função de ação** — o retorno da função se torna o próximo `state`, porque é assim que o ciclo de estado se mantém
5. **Use isPending para desabilitar o botão de submit** — enquanto a Promise não resolver, isPending é `true`, porque evita múltiplas requisições simultâneas
6. **Conecte formAction ao atributo action do form** — `<form action={formAction}>`, porque é o formAction que intercepta e repassa prevState + formData para sua função

## How to write

### Setup básico do useActionState

```typescript
import { useActionState } from "react"

function LoginForm() {
  const [state, formAction, isPending] = useActionState(signIn, null)

  async function signIn(prevState: unknown, formData: FormData) {
    const email = formData.get("email")
    const password = formData.get("password")

    const response = await api.post("/sessions", { email, password })
    return { email, password } // retorno vira o próximo state
  }

  return (
    <form action={formAction}>
      <input name="email" defaultValue={state?.email ?? ""} />
      <input name="password" defaultValue={state?.password ?? ""} />
      <button type="submit" disabled={isPending}>
        {isPending ? "Carregando..." : "Entrar"}
      </button>
    </form>
  )
}
```

### Com estado inicial tipado

```typescript
interface FormState {
  email: string
  password: string
  error?: string
}

const initialState: FormState = { email: "", password: "" }

const [state, formAction, isPending] = useActionState(signIn, initialState)
```

## Example

**Before (useState manual para loading):**
```typescript
function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(formData: FormData) {
    setIsLoading(true)
    const email = formData.get("email")
    await api.post("/sessions", { email })
    setIsLoading(false)
  }

  return (
    <form action={onSubmit}>
      <input name="email" />
      <button disabled={isLoading}>
        {isLoading ? "Carregando..." : "Entrar"}
      </button>
    </form>
  )
}
```

**After (useActionState):**
```typescript
function LoginForm() {
  const [state, formAction, isPending] = useActionState(signIn, null)

  async function signIn(prevState: unknown, formData: FormData) {
    const email = formData.get("email")
    await api.post("/sessions", { email })
    return { email }
  }

  return (
    <form action={formAction}>
      <input name="email" defaultValue={state?.email ?? ""} />
      <button disabled={isPending}>
        {isPending ? "Carregando..." : "Entrar"}
      </button>
    </form>
  )
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Formulário com requisição assíncrona | Use useActionState em vez de useState para loading |
| Precisa manter valores após submit | Retorne os campos na função de ação, use state como defaultValue |
| Precisa acessar estado anterior | Use o parâmetro prevState na função de ação |
| Formulário simples sem async | action normal do form é suficiente, useActionState é opcional |
| Precisa mostrar erro do servidor | Retorne `{ error: "mensagem" }` e exiba `state?.error` no JSX |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|---------------------|
| `const [isLoading, setIsLoading] = useState(false)` com form action | `const [state, formAction, isPending] = useActionState(fn, null)` |
| `setIsLoading(true)` dentro da ação | Use `isPending` diretamente do useActionState |
| `<form action={signIn}>` sem useActionState quando precisa de estado | `<form action={formAction}>` com formAction do useActionState |
| `onChange` + `useState` para cada campo do formulário | `formData.get("campo")` dentro da ação + `defaultValue` do state |
| Retornar nada na função de ação | Sempre retorne o próximo estado desejado |

## Troubleshooting

### Problem: useActionState is not exported from "react"
- **Cause**: The project is using React 18 or earlier, which does not include useActionState
- **Fix**: Upgrade to React 19+ (`npm install react@latest react-dom@latest`) or use the polyfill from `react-dom` for older versions

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre prevState, ciclo de vida do estado e comparação com useState
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações