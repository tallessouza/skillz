---
name: rs-saas-nextjs-rbac-criando-novos-usuarios
description: "Applies Next.js signup form patterns with Zod validation, server actions, and useFormState when building authentication forms. Use when user asks to 'create signup form', 'add registration page', 'validate password confirmation', 'use refine vs superRefine in Zod', or 'build auth forms in Next.js App Router'. Make sure to use this skill whenever implementing user registration flows in Next.js with Zod schema validation. Not for login forms, OAuth flows, or backend API route handlers."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: saa-s-next-js-rbac
  module: geral
  tags: [saas, nextjs, zod, oauth, github, server-actions, react-hooks]
---

# Criando Formularios de Cadastro com Next.js App Router

> Extraia formularios em componentes separados com 'use client', valide com Zod refine/superRefine, e conecte via server actions com useFormState.

## Rules

1. **Extraia formularios em componentes separados** — crie `signup-form.tsx` com `'use client'`, porque apenas o formulario precisa de interatividade client-side, nao a pagina inteira
2. **Use `refine` para validacao do proprio campo, `superRefine` para validacao entre campos** — `refine` recebe apenas o valor do campo; `superRefine` da acesso a todos os campos do schema, necessario para comparar password com password_confirmation
3. **Valide nome completo com `refine` e `split`** — `value.split(' ').length > 1` garante que o usuario digitou pelo menos nome e sobrenome
4. **Importe `useRouter` de `next/navigation`, nao de `next/router`** — `next/router` e para Pages Router, `next/navigation` e para App Router
5. **Redirecione apos cadastro bem-sucedido** — use `router.push('/auth/sign-in')` apos signup, porque o usuario precisa fazer login com as credenciais recem-criadas
6. **Separe actions HTTP de actions de formulario** — funcoes HTTP puras em `http/sign-up.ts` (sem cookies), server actions em `actions.ts` (com redirect/cookies)

## How to write

### Schema Zod com refine e superRefine

```typescript
const signUpSchema = z
  .object({
    name: z.string().refine(
      (value) => value.split(' ').length > 1,
      { message: 'Please enter your full name.' }
    ),
    email: z.string().email({ message: 'Please provide a valid e-mail.' }),
    password: z.string()
      .min(6, { message: 'Password should have at least 6 characters.' }),
    password_confirmation: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.password_confirmation) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Password confirmation does not match.',
        path: ['password_confirmation'],
      })
    }
  })
```

### Funcao HTTP sem retorno

```typescript
interface SignUpRequest {
  name: string
  email: string
  password: string
}

export async function signUp({ name, email, password }: SignUpRequest) {
  await api('users', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  })
}
```

### Componente de formulario com useFormState

```typescript
'use client'

export function SignUpForm() {
  const router = useRouter()
  const [{ success, message, errors }, handleSubmit, isPending] =
    useFormState(signUpAction, () => router.push('/auth/sign-in'))

  return (
    <form onSubmit={handleSubmit}>
      {/* campos com erros inline */}
      {errors?.name && <p>{errors.name[0]}</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? <Loader2 className="animate-spin" /> : 'Create account'}
      </Button>
    </form>
  )
}
```

## Example

**Before (validacao inline sem Zod):**
```typescript
function handleSubmit(e) {
  if (password !== confirmPassword) {
    setError('Passwords dont match')
  }
  if (name.split(' ').length < 2) {
    setError('Enter full name')
  }
}
```

**After (com Zod superRefine):**
```typescript
const schema = z.object({
  name: z.string().refine(
    (val) => val.split(' ').length > 1,
    { message: 'Please enter your full name.' }
  ),
  password: z.string().min(6, { message: 'At least 6 characters.' }),
  password_confirmation: z.string(),
}).superRefine((data, ctx) => {
  if (data.password !== data.password_confirmation) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Password confirmation does not match.',
      path: ['password_confirmation'],
    })
  }
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Validacao usa apenas o valor do proprio campo | Use `.refine()` |
| Validacao compara dois ou mais campos | Use `.superRefine()` no objeto |
| Funcao HTTP nao retorna dados uteis | Nao faca `.json()` na response |
| Erro de "use state" em server component | Extraia formulario para componente `'use client'` separado |
| TurboPack perde cache apos mudar arquivos | Reinicie o dev server |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `useRouter` from `next/router` (App Router) | `useRouter` from `next/navigation` |
| `refine` comparando dois campos do schema | `superRefine` com acesso ao objeto completo |
| Validacao de senha inline no handler | Schema Zod com `min()` e mensagem customizada |
| `'use client'` na pagina inteira | `'use client'` apenas no componente de formulario |
| Logica de cookies dentro da funcao HTTP | Cookies apenas na server action |

## Troubleshooting

### Server action nao executa
**Symptom:** Formulario submete mas nada acontece
**Cause:** A funcao nao tem a diretiva 'use server' ou o componente nao esta usando 'use client'
**Fix:** Adicione 'use server' no topo do arquivo da action e 'use client' no componente do formulario

### Cookie nao persiste entre requisicoes
**Symptom:** Token desaparece apos refresh da pagina
**Cause:** Cookie configurado sem `path: '/'` ou com `httpOnly` incorreto
**Fix:** Configure o cookie com `path: '/'` e verifique que `httpOnly` esta correto para o caso de uso

### Componente server/client mismatch
**Symptom:** Erro de hydration ou hooks nao funcionam
**Cause:** Componente que usa hooks (useState, useEffect) nao tem 'use client'
**Fix:** Adicione 'use client' no topo do arquivo do componente que usa hooks ou event handlers

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
