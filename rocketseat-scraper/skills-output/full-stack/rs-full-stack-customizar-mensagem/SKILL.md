---
name: rs-full-stack-customizar-mensagem
description: "Applies Zod custom validation error messages when writing schema validation in TypeScript/Node.js. Use when user asks to 'validate input', 'add validation', 'customize error message', 'zod schema', or 'required field message'. Enforces readable, user-friendly error messages instead of Zod defaults. Make sure to use this skill whenever creating Zod schemas with required fields. Not for general error handling, try/catch blocks, or HTTP error responses."
---

# Customizar Mensagens de Validação com Zod

> Sempre defina mensagens de erro customizadas em schemas Zod para que o usuario final receba orientacao clara sobre o que corrigir.

## Rules

1. **Nunca use mensagens padrao do Zod para campos obrigatorios** — passe `{ required_error: "campo is required" }` porque mensagens padrao sao genericas e nao orientam o usuario
2. **Nomeie o campo na mensagem** — `"price is required"` nao `"field is required"`, porque o usuario precisa saber QUAL campo corrigir
3. **Use ingles ou portugues consistente** — siga o idioma do projeto, nunca misture idiomas nas mensagens de erro

## How to write

### Schema com mensagens customizadas

```typescript
const createProductSchema = z.object({
  name: z.string({ required_error: "name is required" }),
  price: z.number({ required_error: "price is required" }),
})
```

### Multiplas validacoes com mensagens

```typescript
const createUserSchema = z.object({
  email: z.string({ required_error: "email is required" }).email("email must be valid"),
  age: z.number({ required_error: "age is required" }).min(18, "must be at least 18"),
})
```

## Example

**Before (mensagem padrao do Zod):**
```typescript
const schema = z.object({
  name: z.string(),
  price: z.number(),
})
// Erro: "Required" (generico, sem contexto)
```

**After (com mensagem customizada):**
```typescript
const schema = z.object({
  name: z.string({ required_error: "name is required" }),
  price: z.number({ required_error: "price is required" }),
})
// Erro: "price is required" (claro, orientativo)
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Campo obrigatorio em schema | Sempre passar `required_error` |
| Validacao de formato (email, url) | Passar mensagem no metodo `.email()`, `.url()` |
| Validacao de range (min, max) | Passar mensagem como segundo argumento |
| Campo opcional | Nao precisa de `required_error` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `z.string()` sem mensagem em campo obrigatorio | `z.string({ required_error: "name is required" })` |
| `{ required_error: "Required" }` | `{ required_error: "price is required" }` (nome do campo) |
| `{ required_error: "Erro" }` | `{ required_error: "email is required" }` (descritivo) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre customizacao de mensagens Zod
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes