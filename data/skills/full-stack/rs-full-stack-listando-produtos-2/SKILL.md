---
name: rs-full-stack-listando-produtos-2
description: "Applies Knex.js query patterns for listing resources with optional search filters. Use when user asks to 'list items', 'search products', 'filter by name', 'query with like', 'add search parameter', or build GET endpoints that return filtered/sorted data. Enforces orderBy for consistent sorting, whereLike with nullish coalescing for optional filters, and typed select queries. Make sure to use this skill whenever building list/index endpoints with Knex. Not for create/update/delete operations, raw SQL, or ORM-based queries."
---

# Listando Produtos com Knex.js

> Endpoints de listagem retornam dados ordenados e aceitam filtros opcionais via query parameters, usando whereLike com nullish coalescing para busca flexivel.

## Rules

1. **Tipar o select com o repositorio** — `knex<ProductRepository>("products")` nao `knex("products")`, porque sem tipagem o TypeScript nao oferece autocomplete nos resultados
2. **Ordenar sempre por padrao** — adicione `orderBy("name")` em toda listagem, porque sem ordenacao explicita o banco retorna por ordem de insercao (imprevisivel)
3. **Filtros opcionais usam nullish coalescing** — `name ?? ""` nao `name || ""`, porque nullish coalescing so trata `null`/`undefined`, preservando strings vazias legitimas
4. **whereLike com percentuais** — `%${name}%` para buscar em qualquer parte do texto, porque sem `%` o like exige match exato
5. **Query parameters sao sempre opcionais** — nunca exija filtro de busca em listagem, porque o usuario pode querer ver todos os registros

## How to write

### Index endpoint com filtro opcional

```typescript
async index(request: Request, response: Response) {
  const { name } = request.query

  const products = await knex<ProductRepository>("products")
    .select()
    .whereLike("name", `%${name ?? ""}%`)
    .orderBy("name")

  return response.json(products)
}
```

### Select tipado (autocomplete funciona)

```typescript
// Com tipagem — autocomplete disponivel
const products = await knex<ProductRepository>("products").select()
products[0].name // ✓ TypeScript reconhece

// Sem tipagem — sem autocomplete
const products = await knex("products").select()
products[0].name // ✗ TypeScript nao sabe o que tem
```

## Example

**Before (sem ordenacao, sem filtro):**
```typescript
async index(request: Request, response: Response) {
  const products = await knex("products").select()
  return response.json(products)
}
```

**After (com tipagem, ordenacao e filtro opcional):**
```typescript
async index(request: Request, response: Response) {
  const { name } = request.query

  const products = await knex<ProductRepository>("products")
    .select()
    .whereLike("name", `%${name ?? ""}%`)
    .orderBy("name")

  return response.json(products)
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Listagem sem filtro solicitado | Adicione `orderBy` mesmo assim, para consistencia |
| Filtro de texto parcial | Use `whereLike` com `%valor%` |
| Parametro opcional via query string | Use nullish coalescing (`??`), nunca `\|\|` |
| Multiplos filtros opcionais | Encadeie `.whereLike()` para cada campo |
| Precisa de autocomplete nos resultados | Passe o tipo generico no `knex<Type>("table")` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `knex("products").select()` sem tipo | `knex<ProductRepository>("products").select()` |
| `.where("name", name)` para busca parcial | `.whereLike("name", \`%${name}%\`)` |
| `name \|\| ""` para valor opcional | `name ?? ""` |
| Retornar sem ordenacao | Sempre incluir `.orderBy("name")` |
| Exigir parametro de busca obrigatorio | Tornar filtro opcional com fallback para string vazia |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre whereLike, nullish coalescing e tipagem Knex
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes