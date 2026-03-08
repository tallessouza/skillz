---
name: rs-full-stack-0401-validacao-dos-dados
description: "Enforces Zod form validation patterns when building React form submissions with schema parsing, error handling, and loading states. Use when user asks to 'validate a form', 'add Zod validation', 'handle form errors', 'create a refund form', or 'add loading to submit button'. Applies Zod schema with parse, try-catch with ZodError instanceof check, and finally-based loading reset. Make sure to use this skill whenever implementing client-side form validation with Zod in React. Not for server-side API validation, database constraints, or React Hook Form integration."
---

# Validação de Dados com Zod em Formulários React

> Valide dados do formulário com Zod schema antes de qualquer operação, trate erros de validação com mensagens específicas e gerencie estados de loading no submit.

## Rules

1. **Defina o schema antes do componente** — `z.object({...})` no topo do arquivo, porque centraliza as regras de validação em um único lugar auditável
2. **Use `parse` no submit, não `safeParse`** — deixe o Zod lançar exceção e capture no try-catch, porque simplifica o fluxo e permite tratar outros erros no mesmo bloco
3. **Verifique `instanceof ZodError`** — diferencie erros de validação de erros genéricos no catch, porque cada tipo exige uma mensagem diferente para o usuário
4. **Use `finally` para resetar loading** — `setIsLoading(false)` no finally garante reset independente de sucesso ou erro, porque evita botão travado em estado de loading
5. **Normalize entrada antes do parse** — substitua vírgula por ponto em valores monetários (`amount.replace(",", ".")`) antes de passar ao Zod, porque o formato brasileiro usa vírgula para decimais
6. **Use `z.coerce.number()` para campos numéricos** — converta string para número automaticamente, porque inputs HTML sempre retornam strings

## How to write

### Schema de validação

```typescript
import { z } from "zod"

const refundSchema = z.object({
  name: z.string().min(3, { message: "Informe um nome claro para sua solicitação" }),
  category: z.string().min(1, { message: "Informe a categoria" }),
  amount: z.coerce
    .number({ message: "Informe um valor válido" })
    .positive({ message: "Informe um valor válido e superior a zero" }),
})
```

### Submit com validação e loading

```typescript
async function onSubmit(e: React.FormEvent) {
  e.preventDefault()

  try {
    setIsLoading(true)

    const data = refundSchema.parse({
      name,
      category,
      amount: amount.replace(",", "."),
    })

    // Prosseguir com a solicitação usando `data` validado
    navigate("/confirm")
  } catch (error) {
    if (error instanceof z.ZodError) {
      alert(error.issues[0].message)
    } else {
      alert("Não foi possível realizar a solicitação")
    }
  } finally {
    setIsLoading(false)
  }
}
```

## Example

**Before (sem validação):**
```typescript
function onSubmit(e) {
  e.preventDefault()
  // Envia direto sem validar
  fetch("/api/refunds", {
    method: "POST",
    body: JSON.stringify({ name, category, amount }),
  })
}
```

**After (com Zod + loading + error handling):**
```typescript
function onSubmit(e) {
  e.preventDefault()

  try {
    setIsLoading(true)

    const data = refundSchema.parse({
      name,
      category,
      amount: amount.replace(",", "."),
    })

    await fetch("/api/refunds", {
      method: "POST",
      body: JSON.stringify(data),
    })

    navigate("/confirm")
  } catch (error) {
    if (error instanceof z.ZodError) {
      alert(error.issues[0].message)
    } else {
      alert("Não foi possível realizar a solicitação")
    }
  } finally {
    setIsLoading(false)
  }
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Campo de texto com tamanho mínimo | `z.string().min(n, { message })` |
| Select/dropdown obrigatório | `z.string().min(1, { message })` para garantir seleção |
| Campo monetário (BRL) | `amount.replace(",", ".")` + `z.coerce.number().positive()` |
| Botão de submit durante request | Desabilite com `isLoading` e mostre indicador visual |
| Primeiro erro de validação | `error.issues[0].message` — exiba apenas o primeiro |
| Reset de loading | Sempre no `finally`, nunca no `try` ou `catch` isolados |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| `if (!name) alert("preencha")` (validação manual) | `refundSchema.parse({ name })` |
| `setIsLoading(false)` dentro do try e do catch | `setIsLoading(false)` no `finally` |
| `parseFloat(amount)` direto sem tratar vírgula | `amount.replace(",", ".")` antes do parse |
| `catch (e) { alert("erro") }` genérico | `instanceof z.ZodError` para diferenciar |
| Schema inline dentro do submit | Schema como constante no topo do arquivo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre fluxo try-catch-finally, ZodError e normalização de moeda
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações