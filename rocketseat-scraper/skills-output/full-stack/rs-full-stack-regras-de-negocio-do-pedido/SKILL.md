---
name: rs-full-stack-regras-de-negocio-do-pedido
description: "Enforces sequential validation pattern for API business rules before persisting data. Use when user asks to 'create an endpoint', 'add validation', 'write business rules', 'validate before saving', or 'check if exists before insert'. Applies guard-clause pattern: verify existence, verify state, verify dependencies, then persist. Make sure to use this skill whenever building API routes that modify data with dependencies on other entities. Not for frontend validation, schema validation, or authentication/authorization middleware."
---

# Regras de Negócio — Validação Sequencial antes de Persistir

> Antes de persistir qualquer dado, valide existência e estado de todas as entidades dependentes, uma por uma, com mensagens de erro claras.

## Rules

1. **Valide existência antes de estado** — primeiro verifique se a entidade existe, depois verifique seu estado, porque checar estado de algo que não existe causa erro inesperado
2. **Uma validação por bloco** — cada `if` trata exatamente uma regra de negócio e lança um `AppError` específico, porque facilita debug e retorna mensagens claras ao cliente
3. **Busque a entidade UMA vez e reutilize** — `const session = await knex(...).first()` e depois use `session.closed_at`, porque evita queries duplicadas
4. **Use `.first()` quando espera um único registro** — não use `.select()` e depois `[0]`, porque `.first()` é semântico e retorna `undefined` quando não encontra
5. **Valide dependências para extrair dados necessários** — se precisa do preço do produto, busque o produto e valide existência ANTES de usar `product.price`, porque evita `Cannot read property of undefined`
6. **Mensagens de erro em inglês, descritivas e sem códigos internos** — `"Session table not found"` não `"Error 404"` ou `"Não encontrado"`, porque o consumidor da API precisa entender o problema

## How to write

### Padrão de validação sequencial

```typescript
// 1. Buscar entidade dependente
const session = await knex("table_sessions")
  .where({ id: table_session_id })
  .first()

// 2. Validar existência
if (!session) {
  throw new AppError("Session table not found")
}

// 3. Validar estado (só após confirmar existência)
if (session.closed_at) {
  throw new AppError("This table is closed")
}

// 4. Buscar próxima dependência
const product = await knex("products")
  .where({ id: product_id })
  .first()

// 5. Validar existência da dependência
if (!product) {
  throw new AppError("Product not found")
}

// 6. Agora sim, usar os dados validados
const price = product.price
// ... persistir pedido
```

## Example

**Before (sem validações — bug silencioso):**
```typescript
async function createOrder({ table_session_id, product_id, quantity }) {
  const product = await knex("products").where({ id: product_id }).first()

  await knex("orders").insert({
    table_session_id,
    product_id,
    quantity,
    price: product.price, // TypeError se produto não existe
  })
}
```

**After (com validação sequencial):**
```typescript
async function createOrder({ table_session_id, product_id, quantity }) {
  const session = await knex("table_sessions")
    .where({ id: table_session_id })
    .first()

  if (!session) {
    throw new AppError("Session table not found")
  }

  if (session.closed_at) {
    throw new AppError("This table is closed")
  }

  const product = await knex("products")
    .where({ id: product_id })
    .first()

  if (!product) {
    throw new AppError("Product not found")
  }

  await knex("orders").insert({
    table_session_id,
    product_id,
    quantity,
    price: product.price,
  })
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Entidade pode não existir | Busque com `.first()`, valide `if (!entity)` |
| Entidade tem estado (aberto/fechado) | Valide estado APÓS validar existência |
| Precisa de dado de outra tabela (ex: preço) | Busque e valide antes de usar o campo |
| Múltiplas dependências | Valide na ordem de dependência (sessão → produto → pedido) |
| Coluna de data indica estado | `closed_at` presente = fechado, `null` = aberto |

## Anti-patterns

| Nunca escreva | Escreva instead |
|---------------|-----------------|
| `product.price` sem verificar se product existe | `if (!product) throw new AppError(...)` antes |
| `if (!session \|\| session.closed_at)` junto | Dois `if` separados com mensagens diferentes |
| `await knex("products").select().where(...)` + `[0]` | `await knex("products").where(...).first()` |
| `throw new Error("error")` genérico | `throw new AppError("Product not found")` específico |
| Validar estado antes de existência | Existência primeiro, estado depois |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre ordem de validações e uso de colunas de estado
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código com variações para diferentes entidades