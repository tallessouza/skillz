---
name: rs-full-stack-adicionando-regras-de-validacao
description: "Enforces Zod validation rules when writing API input schemas in TypeScript/Node.js. Use when user asks to 'validate input', 'add validation', 'create schema', 'validate request body', or 'use Zod'. Applies rules: chain .trim() before .min(), use .positive() for prices, always customize error messages, prefer Zod chains over manual if/else validation. Make sure to use this skill whenever writing Zod schemas or API input validation. Not for database constraints, frontend form validation libraries, or Joi/Yup schemas."
---

# Regras de Validação com Zod

> Encadeie validações no Zod para garantir que dados cheguem corretos na aplicação — sem if/else manual.

## Rules

1. **Encadeie validações em vez de usar if/else** — `z.string().trim().min(6)` substitui 5+ linhas de if/else, porque o Zod valida e transforma em uma pipeline declarativa
2. **Sempre aplique `.trim()` ANTES de `.min()`** — porque espaços inflam o tamanho real da string e passam validações falsamente
3. **Use `.positive()` para preços** — porque valores negativos não fazem sentido comercial e `.positive()` é mais semântico que `.min(1)`
4. **Sempre personalize mensagens de erro** — passe `{ message: "..." }` como segundo argumento, porque mensagens padrão do Zod são genéricas e ruins para o usuário final
5. **Uma validação por linha** — quebre a chain em linhas separadas para legibilidade, porque facilita entender quais regras estão aplicadas
6. **Explore os métodos disponíveis** — use `.email()`, `.url()`, `.gte()`, `.lte()` conforme o domínio, porque o Zod oferece validações semânticas prontas

## How to write

### String com trim + tamanho mínimo

```typescript
const schema = z.object({
  name: z.string()
    .trim()
    .min(6, { message: "name must be 6 or more characters" }),
})
```

### Número positivo com mensagem customizada

```typescript
const schema = z.object({
  price: z.number()
    .positive({ message: "price must be positive" }),
})
```

### Número com faixa de valor

```typescript
const schema = z.object({
  price: z.number()
    .gte(10, { message: "price must be greater than or equal to 10" }),
})
```

## Example

**Before (validação manual com if/else):**

```typescript
if (!name) {
  throw new Error("Nome do produto é obrigatório")
}
if (name.trim().length < 6) {
  throw new Error("Nome precisa ter pelo menos 6 caracteres")
}
if (price < 0) {
  throw new Error("Preço não pode ser negativo")
}
```

**After (com Zod):**

```typescript
const bodySchema = z.object({
  name: z.string()
    .trim()
    .min(6, { message: "name must be 6 or more characters" }),
  price: z.number()
    .positive({ message: "price must be positive" }),
})

const { name, price } = bodySchema.parse(request.body)
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Campo de texto obrigatório | `z.string().trim().min(N)` — trim sempre antes de min |
| Valor monetário | `.positive()` — rejeita zero e negativos |
| Valor com faixa permitida | `.gte(min).lte(max)` — mais legível que .min/.max para números |
| Email, URL | `.email()`, `.url()` — validações semânticas prontas |
| Mensagem de erro genérica do Zod | Sempre substituir com `{ message: "..." }` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `z.string().min(6).trim()` | `z.string().trim().min(6)` — trim ANTES de min |
| `z.number().min(0)` para preço | `z.number().positive()` — mais semântico |
| `z.string().min(6)` sem mensagem | `z.string().min(6, { message: "..." })` |
| Validação com if/else quando Zod disponível | Schema Zod declarativo com chain |
| Tudo em uma linha longa | Uma validação por linha na chain |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre ordem de trim/min, analogia pipeline, e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações