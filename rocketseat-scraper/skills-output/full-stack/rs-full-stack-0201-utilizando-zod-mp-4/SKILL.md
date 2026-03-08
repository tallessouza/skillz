---
name: rs-full-stack-0201-utilizando-zod-mp-4
description: "Enforces Zod schema validation patterns when building form validation in TypeScript/JavaScript projects. Use when user asks to 'validate a form', 'add Zod validation', 'check password confirmation', 'create signup schema', or 'validate user input'. Applies rules: z.object schemas with custom messages, .refine() for cross-field validation, ZodError instanceof checking, try/catch/finally with loading state. Make sure to use this skill whenever implementing client-side form validation with Zod. Not for server-side API validation, database constraints, or Yup/Joi schemas."
---

# Validação de Formulários com Zod

> Crie schemas de validação com Zod usando mensagens customizadas, validação cross-field com `.refine()`, e tratamento de erros tipado com `ZodError`.

## Rules

1. **Defina schemas com `z.object()`** — cada campo recebe seu tipo e validações encadeadas, porque schemas declarativos são reutilizáveis e testáveis
2. **Use `.trim()` antes de `.min()` em strings** — `z.string().trim().min(1)` evita strings com apenas espaços passando validação
3. **Passe mensagens customizadas em cada validador** — `{ message: "informe o nome" }` porque mensagens padrão do Zod são técnicas e ilegíveis para o usuário
4. **Use `.refine()` para validação cross-field** — comparar password com passwordConfirm requer acesso ao objeto completo, não apenas ao campo individual
5. **Identifique erros Zod com `instanceof ZodError`** — separe erros de validação de erros genéricos no catch, porque cada tipo exige tratamento diferente
6. **Gerencie loading com try/catch/finally** — ative loading no try, desative no finally, porque o finally executa independente de sucesso ou erro

## How to write

### Schema de validação com mensagens customizadas

```typescript
import { z, ZodError } from "zod"

const signUpSchema = z.object({
  name: z.string().trim().min(1, { message: "Informe o nome" }),
  email: z.string().email({ message: "E-mail inválido" }),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 dígitos" }),
  passwordConfirm: z.string().min(1, { message: "Confirme a senha" }),
}).refine((data) => data.password === data.passwordConfirm, {
  message: "As senhas não são iguais",
  path: ["passwordConfirm"],
})
```

### Tratamento de erros no submit

```typescript
async function onSubmit() {
  try {
    setIsLoading(true)

    const validated = signUpSchema.parse({ name, email, password, passwordConfirm })
    // prosseguir com requisição usando validated

  } catch (error) {
    if (error instanceof ZodError) {
      return alert(error.issues[0].message)
    }
    alert("Não foi possível cadastrar")
  } finally {
    setIsLoading(false)
  }
}
```

## Example

**Before (sem validação):**
```typescript
function onSubmit() {
  console.log({ name, email, password, passwordConfirm })
  // envia direto sem validar
}
```

**After (com Zod):**
```typescript
function onSubmit() {
  try {
    setIsLoading(true)
    const data = signUpSchema.parse({ name, email, password, passwordConfirm })
    // dados validados, prosseguir com API call
  } catch (error) {
    if (error instanceof ZodError) {
      return alert(error.issues[0].message)
    }
    alert("Não foi possível cadastrar")
  } finally {
    setIsLoading(false)
  }
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Campo obrigatório de texto | `z.string().trim().min(1, { message: "..." })` |
| Campo de e-mail | `z.string().email({ message: "E-mail inválido" })` |
| Senha com mínimo | `z.string().min(6, { message: "..." })` |
| Confirmação de senha | `.refine()` no objeto comparando os dois campos |
| Exibir erro ao usuário | `error.issues[0].message` dentro do `instanceof ZodError` |
| Botão de submit com loading | `setIsLoading(true)` no try, `setIsLoading(false)` no finally |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `z.string().min(1)` sem trim | `z.string().trim().min(1)` |
| `z.string().email()` sem mensagem | `z.string().email({ message: "E-mail inválido" })` |
| `if (password !== confirm)` manual | `.refine((data) => data.password === data.passwordConfirm, ...)` |
| `catch (error) { alert(error) }` | `catch (error) { if (error instanceof ZodError) ... }` |
| `setIsLoading(false)` no try e no catch | `setIsLoading(false)` apenas no finally |
| `.refine()` sem `path` | `.refine(..., { message: "...", path: ["fieldName"] })` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre validação client-side, fluxo de erros Zod e padrão try/catch/finally
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações