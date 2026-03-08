---
name: rs-full-stack-implementando-paginacao
description: "Enforces offset-based pagination pattern when building list endpoints with Prisma. Use when user asks to 'paginate results', 'add pagination', 'list with pages', 'implement paging', or 'return paginated data'. Applies skip/take calculation, total records count with same filters, and pagination metadata in response. Make sure to use this skill whenever building any list/index endpoint that returns multiple records. Not for cursor-based pagination, infinite scroll, or frontend pagination components."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [pagination, prisma, skip, take, offset, count]
---

# Paginação Offset com Prisma

> Toda listagem que retorna múltiplos registros deve ser paginada com skip/take, contagem total usando os mesmos filtros, e metadados de paginação no response.

## Rules

1. **Receba page e perPage como query params opcionais com defaults** — `page = 1`, `perPage = 10`, porque a API deve funcionar mesmo sem parâmetros explícitos
2. **Converta query params para número** — params de URL chegam como string, use `Number()` ou coerce do Zod, porque skip/take exigem números
3. **Calcule skip como `(page - 1) * perPage`** — fórmula padrão de offset pagination, porque pular os registros das páginas anteriores é o que define a página atual
4. **Use os mesmos filtros no count e no findMany** — filtros divergentes geram totalRecords inconsistente com os dados retornados, porque a paginação deve refletir o resultado filtrado
5. **Calcule totalPages com `Math.ceil(totalRecords / perPage)`** — arredonde para cima, porque página parcial ainda é uma página
6. **Retorne metadados de paginação junto com os dados** — `{ data, pagination: { page, perPage, totalRecords, totalPages } }`, porque o frontend precisa saber o total para renderizar controles

## How to write

### Query params com validação e defaults

```typescript
const page = Number(request.query.page) || 1
const perPage = Number(request.query.perPage) || 10
```

### Cálculo do skip

```typescript
const skip = (page - 1) * perPage
```

### Consulta paginada com contagem

```typescript
const [records, totalRecords] = await Promise.all([
  prisma.refund.findMany({
    where: filters,
    skip,
    take: perPage,
  }),
  prisma.refund.count({
    where: filters,
  }),
])

const totalPages = Math.ceil(totalRecords / perPage)

return {
  data: records,
  pagination: {
    page,
    perPage,
    totalRecords,
    totalPages: totalPages > 0 ? totalPages : 1,
  },
}
```

## Example

**Before (sem paginação):**
```typescript
async function listRefunds(name?: string) {
  const refunds = await prisma.refund.findMany({
    where: { name: { contains: name } },
  })

  return refunds
}
```

**After (com paginação):**
```typescript
async function listRefunds(name?: string, page = 1, perPage = 10) {
  const where = {
    ...(name && { name: { contains: name } }),
  }

  const skip = (page - 1) * perPage

  const [refunds, totalRecords] = await Promise.all([
    prisma.refund.findMany({ where, skip, take: perPage }),
    prisma.refund.count({ where }),
  ])

  const totalPages = Math.ceil(totalRecords / perPage)

  return {
    refunds,
    pagination: {
      page,
      perPage,
      totalRecords,
      totalPages: totalPages > 0 ? totalPages : 1,
    },
  }
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Endpoint retorna lista de registros | Sempre paginar, mesmo que hoje tenha poucos dados |
| Filtros aplicados na listagem | Usar mesmos filtros no `count` e no `findMany` |
| `totalPages` calculado como 0 | Retornar 1 (página mínima) |
| Frontend não envia page/perPage | Usar defaults (page=1, perPage=10) |
| Precisa de ordenação + paginação | Adicionar `orderBy` no `findMany`, manter skip/take |

## Anti-patterns

| Nunca faça | Faça ao invés |
|------------|---------------|
| Buscar todos os registros e fatiar no código | Usar `skip` e `take` no Prisma |
| Contar registros sem filtros quando a query tem filtro | Usar o mesmo `where` no `count` |
| Retornar só os dados sem metadados de paginação | Incluir `pagination` object no response |
| Calcular totalPages sem `Math.ceil` | Usar `Math.ceil` para incluir página parcial |
| Deixar page=0 como válido | Mínimo é page=1, calcular skip com `page - 1` |

## Troubleshooting

| Problema | Causa provável | Solução |
|----------|---------------|---------|
| `totalRecords` não bate com dados retornados | Filtros diferentes no `count` e no `findMany` | Use o mesmo objeto `where` em ambas as queries |
| Paginação retorna resultados errados com filtro | `count` sem filtro conta todos os registros | Passe o mesmo `where` para `prisma.model.count()` |
| Performance lenta em tabelas grandes | Offset pagination escala mal com muitos registros | Considere cursor-based pagination para datasets grandes |
| `totalPages` retorna 0 quando há registros | Divisão inteira sem arredondamento | Use `Math.ceil(totalRecords / perPage)` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre offset pagination, filtros compartilhados e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações