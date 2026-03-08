---
name: rs-full-stack-0405-entenda-paginacao-mkv-mp-4
description: "Enforces database pagination patterns when querying large datasets, building list endpoints, or implementing paginated UIs. Use when user asks to 'list records', 'paginate results', 'add pagination', 'fetch page of data', or 'limit query results'. Applies perPage/page variables, take/skip calculation formula, and total pages computation. Make sure to use this skill whenever returning multiple records from a database query. Not for infinite scroll, cursor-based pagination, or caching strategies."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [pagination, take, skip, database, query, perPage]
---

# Paginação em Banco de Dados

> Sempre divida resultados de consultas em páginas usando take/skip, nunca retorne todos os registros de uma vez.

## Key concepts

Paginação divide grandes conjuntos de registros em porções menores, porque retornar milhares de registros numa única consulta torna a resposta lenta e o usuário não consegue consumir tudo de uma vez — assim como um livro divide conteúdo em páginas.

## Variáveis fundamentais

| Variável | Propósito | Exemplo |
|----------|-----------|---------|
| `perPage` | Quantos itens exibir por página | `10`, `20`, `30` |
| `page` | Qual página o usuário está visualizando | `1`, `2`, `3` |
| `totalRecords` | Total de registros retornados pela consulta | `100`, `4352` |
| `totalPages` | Número total de páginas | `Math.ceil(totalRecords / perPage)` |
| `take` | Quantos registros pegar (igual a `perPage`) | `10` |
| `skip` | Quantos registros ignorar antes de buscar | `(page - 1) * perPage` |

## Fórmulas

```typescript
// Total de páginas (arredonda pra cima porque última página pode ter menos itens)
const totalPages = Math.ceil(totalRecords / perPage)

// Skip: quantos registros pular
const skip = (page - 1) * perPage

// Take: sempre igual ao perPage
const take = perPage
```

## How to write

### Endpoint paginado básico

```typescript
const perPage = 10
const page = Number(request.query.page) || 1

const skip = (page - 1) * perPage

const records = await db.query({
  take: perPage,
  skip: skip,
})

const totalRecords = await db.count()
const totalPages = Math.ceil(totalRecords / perPage)
```

### Resposta paginada

```typescript
return response.json({
  data: records,
  pagination: {
    page,
    perPage,
    totalRecords,
    totalPages,
  },
})
```

## Example

**Before (sem paginação — lento e pesado):**
```typescript
const refunds = await db.select().from("refunds")
return response.json(refunds) // retorna TODOS os registros
```

**After (com paginação):**
```typescript
const perPage = 10
const page = Number(request.query.page) || 1
const skip = (page - 1) * perPage

const refunds = await db.select().from("refunds").limit(perPage).offset(skip)
const totalRecords = await db.count().from("refunds")
const totalPages = Math.ceil(totalRecords / perPage)

return response.json({
  data: refunds,
  pagination: { page, perPage, totalRecords, totalPages },
})
```

## Heuristics

| Situação | Faça |
|----------|------|
| Tabela pode ter mais de 50 registros | Sempre paginar |
| Endpoint de listagem (GET /resources) | Incluir `page` e `perPage` como query params |
| Última página tem menos itens que `perPage` | Comportamento normal, não precisa tratar |
| `page` não informado na request | Default para `1` |
| `perPage` não informado | Definir valor padrão (ex: `10` ou `20`) |
| Frontend precisa exibir "página X de Y" | Retornar `totalPages` na resposta |

## Anti-patterns

| Nunca faça | Faça ao invés |
|------------|---------------|
| Retornar todos os registros sem limite | Usar `take`/`limit` com `perPage` |
| Calcular skip manualmente sem fórmula | Usar `(page - 1) * perPage` |
| Esquecer de arredondar totalPages pra cima | Usar `Math.ceil(total / perPage)` |
| Paginar apenas no frontend (carregar tudo e fatiar) | Paginar na query do banco de dados |
| Ignorar page=0 ou valores negativos | Validar e usar `Math.max(1, page)` |

## Troubleshooting

| Problema | Causa provável | Solução |
|----------|---------------|---------|
| Página retorna registros duplicados | Fórmula de `skip` incorreta | Use `(page - 1) * perPage` — página 1 deve ter skip 0 |
| `totalPages` retorna 0 | `totalRecords` é 0 ou divisão inteira | Use `Math.ceil` e verifique se há registros no banco |
| Última página retorna vazia | `skip` maior que o total de registros | Valide que `page <= totalPages` antes da query |
| `page` vem como string da URL | Query params são sempre strings | Use `Number(request.query.page)` ou Zod coerce |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo com analogia do livro, cálculos detalhados e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações