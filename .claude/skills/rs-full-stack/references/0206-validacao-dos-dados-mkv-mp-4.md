---
name: rs-full-stack-0206-validacao-dos-dados-mkv-mp-4
description: "Enforces Zod validation patterns when building form validation in React/Next.js with Server Actions. Use when user asks to 'validate form data', 'add Zod schema', 'handle form errors', 'validate email and password', or 'show validation errors in UI'. Applies rules: schema with custom messages, trim before min check, try-catch with ZodError instanceof, return errors via action state instead of alerts. Make sure to use this skill whenever implementing form validation with Zod and useActionState. Not for backend-only API validation, database constraints, or Yup/Joi schemas."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [zod, validation, form-errors, react, useActionState]
---

# Validação de Dados com Zod

> Valide dados do formulário com Zod e exiba erros inline na interface via useActionState, nunca com alerts.

## Rules

1. **Importe Zod e ZodError juntos** — `import { z } from "zod"` e `import { ZodError } from "zod"`, porque ZodError é necessário para o instanceof no catch
2. **Defina mensagens customizadas no schema** — `z.string().email("E-mail inválido")`, porque mensagens padrão do Zod são técnicas e ruins para o usuário
3. **Use trim antes de min em strings de senha** — `z.string().trim().min(1, "Informe a senha")`, porque espaços em branco não contam como input válido
4. **Envolva parse em try-catch** — schema.parse() lança exceção em caso de erro, sem try-catch a aplicação quebra
5. **Verifique instanceof ZodError** — diferencie erros de validação de erros genéricos, porque cada tipo tem tratamento diferente
6. **Retorne mensagem no objeto, não use alert** — `return { message: error.issues[0].message }`, porque o retorno da action popula o state do useActionState

## How to write

### Schema de validação

```typescript
import { z } from "zod"

const signInSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().trim().min(1, "Informe a senha"),
})
```

### Server Action com tratamento de erro

```typescript
async function signIn(_: { message: string } | null, formData: FormData) {
  try {
    const data = signInSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    })

    console.log(data)
  } catch (error) {
    if (error instanceof ZodError) {
      return { message: error.issues[0].message }
    }

    return { message: "Não foi possível entrar." }
  }
}
```

### Exibição inline do erro

```tsx
const [state, formAction] = useActionState(signIn, null)

// Entre o último input e o botão:
{state?.message && (
  <p className="text-sm text-red-600 text-center my-4 font-medium">
    {state.message}
  </p>
)}
```

## Example

**Before (alert quebrando UX):**
```typescript
async function signIn(_: any, formData: FormData) {
  const email = formData.get("email")
  const password = formData.get("password")

  if (!email) return alert("Informe o e-mail")
  if (!password) return alert("Informe a senha")
}
```

**After (Zod + erro inline):**
```typescript
const signInSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().trim().min(1, "Informe a senha"),
})

async function signIn(_: { message: string } | null, formData: FormData) {
  try {
    const data = signInSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    })

    // proceed with authenticated request
  } catch (error) {
    if (error instanceof ZodError) {
      return { message: error.issues[0].message }
    }
    return { message: "Não foi possível entrar." }
  }
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Campo de texto com espaços possíveis | Use `.trim()` antes de `.min()` |
| Precisa de formato específico (email, URL) | Use o refinamento do Zod (`.email()`, `.url()`) |
| Múltiplos erros simultâneos | Acesse `error.issues` array completo |
| Apenas primeiro erro importa | Use `error.issues[0].message` |
| Erro não é de validação | Retorne mensagem genérica no catch genérico |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| `alert(error.message)` | `return { message: error.issues[0].message }` |
| `z.string().min(1)` para senha | `z.string().trim().min(1, "Informe a senha")` |
| `schema.parse()` sem try-catch | Envolva em try-catch com instanceof ZodError |
| `if (!email) return alert(...)` | Defina no schema: `z.string().email("E-mail inválido")` |
| Mensagens de erro padrão do Zod | Mensagens customizadas em português para o usuário |

## Troubleshooting

### Problem: Zod validation errors are not displayed in the UI
- **Cause**: The action function does not return the error message object, or the state is not being checked in the JSX
- **Fix**: Ensure the catch block returns `{ message: error.issues[0].message }` and the JSX renders `{state?.message && <p>{state.message}</p>}`

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre trim vs min, instanceof ZodError, e por que alerts são ruins
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações