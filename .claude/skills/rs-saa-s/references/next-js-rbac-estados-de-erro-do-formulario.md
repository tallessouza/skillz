---
name: rs-saas-nextjs-rbac-form-error-states
description: "Enforces standardized form error handling patterns in Next.js Server Actions with Zod validation. Use when user asks to 'handle form errors', 'validate form', 'show validation messages', 'server action errors', or 'create sign-in form'. Applies: unified return shape {success, message, errors}, Zod safeParse for validation, HTTP error extraction from API responses, ShadCN Alert for error display. Make sure to use this skill whenever implementing form submission with Server Actions. Not for client-side-only validation, React Hook Form, or API route handlers."
---

# Estados de Erro do Formulário

> Toda Server Action retorna um objeto padronizado `{success, message, errors}` — validação via Zod safeParse, erros de API via HTTP response, e fallback genérico para erros inesperados.

## Rules

1. **Retorno padronizado em toda Server Action** — sempre retorne `{success: boolean, message: string | null, errors: Record<string, string[]> | null}`, porque permite ao formulário tratar qualquer cenário com a mesma estrutura
2. **Use safeParse, nunca parse** — `schema.safeParse(data)` não faz throw, permitindo tratamento manual do erro e retorno estruturado
3. **Erros de validação vão em `errors`** — use `result.error.flatten().fieldErrors` para mapear erros por campo
4. **Erros de API vão em `message`** — extraia a mensagem do response JSON da API, porque o backend padroniza erros em `{message: string}`
5. **Erros inesperados recebem mensagem genérica** — nunca exponha stack traces ao usuário, retorne "Unexpected error, try again in a few minutes"
6. **Inicialize useActionState com a estrutura padrão** — `{success: false, message: null, errors: null}` para que o state sempre tenha shape consistente

## How to write

### Schema de validação com mensagens customizadas

```typescript
import { z } from 'zod'

const signInSchema = z.object({
  email: z.string().email('Please provide a valid e-mail address.'),
  password: z.string().min(1, 'Please provide your password.'),
})
```

### Server Action com os 3 cenários de erro

```typescript
'use server'

import { HTTPError } from 'ky'

export async function signInAction(previousState: unknown, data: FormData) {
  const result = signInSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    return {
      success: false,
      message: null,
      errors: result.error.flatten().fieldErrors,
    }
  }

  const { email, password } = result.data

  try {
    // chamada à API
    const { token } = await api.post('sessions', { json: { email, password } }).json()
    // salvar token, redirect, etc.
  } catch (error) {
    if (error instanceof HTTPError) {
      const { message } = await error.response.json()
      return { success: false, message, errors: null }
    }

    console.error(error)
    return {
      success: false,
      message: 'Unexpected error, try again in a few minutes.',
      errors: null,
    }
  }

  return { success: true, message: null, errors: null }
}
```

### Exibição de erros no formulário

```tsx
const [{ success, message, errors }, formAction] = useActionState(
  signInAction,
  { success: false, message: null, errors: null }
)

return (
  <form action={formAction}>
    {success === false && message && (
      <Alert variant="destructive">
        <AlertTriangle className="size-4" />
        <AlertTitle>Sign in failed!</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    )}

    <Input name="email" type="email" />
    {errors?.email && (
      <p className="text-xs font-medium text-red-500 dark:text-red-400">
        {errors.email[0]}
      </p>
    )}

    <Input name="password" type="password" />
    {errors?.password && (
      <p className="text-xs font-medium text-red-500 dark:text-red-400">
        {errors.password[0]}
      </p>
    )}

    <Button type="submit">Sign in</Button>
  </form>
)
```

## Example

**Before (sem tratamento de erro):**
```typescript
export async function signInAction(prev: unknown, data: FormData) {
  const email = data.get('email')
  const password = data.get('password')
  const { token } = await api.post('sessions', { json: { email, password } }).json()
  // sem validação, sem try/catch, sem retorno padronizado
}
```

**After (com esta skill aplicada):**
```typescript
export async function signInAction(prev: unknown, data: FormData) {
  const result = signInSchema.safeParse(Object.fromEntries(data))
  if (!result.success) {
    return { success: false, message: null, errors: result.error.flatten().fieldErrors }
  }
  try {
    const { token } = await api.post('sessions', { json: result.data }).json()
  } catch (error) {
    if (error instanceof HTTPError) {
      const { message } = await error.response.json()
      return { success: false, message, errors: null }
    }
    console.error(error)
    return { success: false, message: 'Unexpected error, try again in a few minutes.', errors: null }
  }
  return { success: true, message: null, errors: null }
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Campo com validação Zod | Mostre `errors.campo[0]` abaixo do input |
| Erro vindo da API (HTTPError) | Extraia `message` do response JSON, mostre no Alert |
| Erro inesperado (não HTTPError) | `console.error` + mensagem genérica ao usuário |
| Estado inicial do formulário | `{success: false, message: null, errors: null}` |
| Múltiplos erros no mesmo campo | Mostre apenas `[0]` — primeiro erro é suficiente |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| `schema.parse(data)` com try/catch para validação | `schema.safeParse(data)` com check em `result.success` |
| Retornar shapes diferentes por cenário | Sempre `{success, message, errors}` |
| `throw new Error()` dentro de Server Action | `return {success: false, message: '...', errors: null}` |
| Mostrar `error.message` do JS direto pro usuário | Extrair `message` do response JSON da API |
| Iniciar useActionState com `null` | Iniciar com `{success: false, message: null, errors: null}` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/saa-s/rs-saa-s-next-js-rbac-estados-de-erro-do-formulario/references/deep-explanation.md)
- [Code examples](../../../data/skills/saa-s/rs-saa-s-next-js-rbac-estados-de-erro-do-formulario/references/code-examples.md)
