# Code Examples: Validação de Dados com Zod

## Exemplo 1: Schema completo de sign-in

```typescript
import { z } from "zod"
import { ZodError } from "zod"

const signInSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().trim().min(1, "Informe a senha"),
})
```

### Comportamento do schema:

| Input | Resultado |
|-------|-----------|
| `{ email: "user@test.com", password: "123" }` | Sucesso — retorna dados tipados |
| `{ email: "usertest", password: "123" }` | Erro — "E-mail inválido" |
| `{ email: "user@test.com", password: "   " }` | Erro — "Informe a senha" (trim remove espaços) |
| `{ email: "", password: "" }` | Erro — primeiro issue é sobre email |

## Exemplo 2: Server Action completa

```typescript
"use server"

import { z } from "zod"
import { ZodError } from "zod"

const signInSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().trim().min(1, "Informe a senha"),
})

export async function signIn(
  _: { message: string } | null,
  formData: FormData
) {
  try {
    const data = signInSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    })

    console.log(data)
    // Aqui faria a chamada de autenticação
  } catch (error) {
    if (error instanceof ZodError) {
      return { message: error.issues[0].message }
    }

    return { message: "Não foi possível entrar." }
  }
}
```

## Exemplo 3: Componente com exibição de erro inline

```tsx
"use client"

import { useActionState } from "react"
import { signIn } from "./actions"

export function SignInForm() {
  const [state, formAction] = useActionState(signIn, null)

  return (
    <form action={formAction}>
      <input
        type="email"
        name="email"
        placeholder="E-mail"
      />

      <input
        type="password"
        name="password"
        placeholder="Senha"
      />

      {state?.message && (
        <p className="text-sm text-red-600 text-center my-4 font-medium">
          {state.message}
        </p>
      )}

      <button type="submit">Entrar</button>
    </form>
  )
}
```

## Exemplo 4: Sem tratamento (o que NÃO fazer)

O instrutor mostrou propositalmente o que acontece quando não se usa try-catch:

```typescript
// SEM try-catch — a aplicação QUEBRA quando a validação falha
export async function signIn(_: any, formData: FormData) {
  const data = signInSchema.parse({
    email: formData.get("email"),
    password: formData.get("password"),
  })
  // Se o parse falhar, ZodError propaga e crash no browser
}
```

Resultado: erro não tratado aparece no console, a aplicação exibe tela de erro genérica.

## Exemplo 5: Progressão do alert para inline

### Versão 1 — Alert (ruim):
```typescript
catch (error) {
  if (error instanceof ZodError) {
    return alert(error.issues[0].message)
  }
  return alert("Não foi possível entrar.")
}
```

### Versão 2 — Retorno no state (correto):
```typescript
catch (error) {
  if (error instanceof ZodError) {
    return { message: error.issues[0].message }
  }
  return { message: "Não foi possível entrar." }
}
```

## Exemplo 6: Variação — múltiplos erros

Se precisar exibir todos os erros de uma vez (não mostrado na aula, mas extensão natural):

```typescript
catch (error) {
  if (error instanceof ZodError) {
    const messages = error.issues.map(issue => issue.message)
    return { message: messages.join(". ") }
  }
  return { message: "Não foi possível entrar." }
}
```

## Exemplo 7: Variação — schema com mais campos

```typescript
const signUpSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome"),
  email: z.string().email("E-mail inválido"),
  password: z.string().trim().min(6, "A senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string().trim().min(1, "Confirme a senha"),
}).refine(data => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
})
```

## Exemplo 8: Inicialização do useActionState

```typescript
// null como estado inicial — nenhuma mensagem exibida no carregamento
const [state, formAction] = useActionState(signIn, null)

// O underscore no parâmetro da action indica que o estado anterior não é usado
async function signIn(_: { message: string } | null, formData: FormData) {
```