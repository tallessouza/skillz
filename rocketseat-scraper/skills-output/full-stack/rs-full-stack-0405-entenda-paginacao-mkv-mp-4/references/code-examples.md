# Code Examples: Paginação em Banco de Dados

## Exemplo 1 — Variáveis base de paginação

```typescript
// Definir quantos itens por página
const perPage = 10

// Qual página o usuário quer ver (vem da request)
const page = 1

// Calcular quantos registros pular
const skip = (page - 1) * perPage // (1 - 1) * 10 = 0

// Take é sempre igual ao perPage
const take = perPage // 10
```

## Exemplo 2 — Cálculo de total de páginas

```typescript
// Cenário 1: Divisão exata
const totalRecords = 100
const perPage = 10
const totalPages = Math.ceil(totalRecords / perPage) // 10

// Cenário 2: Divisão com resto (última página incompleta)
const totalRecords2 = 253
const totalPages2 = Math.ceil(totalRecords2 / perPage) // 26
// Página 26 terá apenas 3 registros

// Cenário 3: Muitos registros
const totalRecords3 = 4352
const totalPages3 = Math.ceil(totalRecords3 / perPage) // 436
```

## Exemplo 3 — Skip em ação para cada página

```typescript
const perPage = 10

// Página 1: skip = 0, pega registros 1-10
const skipPage1 = (1 - 1) * perPage // 0

// Página 2: skip = 10, pega registros 11-20
const skipPage2 = (2 - 1) * perPage // 10

// Página 3: skip = 20, pega registros 21-30
const skipPage3 = (3 - 1) * perPage // 20

// Página 10: skip = 90, pega registros 91-100
const skipPage10 = (10 - 1) * perPage // 90
```

## Exemplo 4 — Endpoint completo com Express

```typescript
app.get("/refunds", async (request, response) => {
  const perPage = 10
  const page = Number(request.query.page) || 1

  const skip = (page - 1) * perPage

  const refunds = await knex("refunds")
    .select("*")
    .limit(perPage)   // take
    .offset(skip)     // skip

  const [{ count }] = await knex("refunds").count("* as count")
  const totalRecords = Number(count)
  const totalPages = Math.ceil(totalRecords / perPage)

  return response.json({
    data: refunds,
    pagination: {
      page,
      perPage,
      totalRecords,
      totalPages,
    },
  })
})
```

## Exemplo 5 — Com Prisma ORM

```typescript
app.get("/refunds", async (request, response) => {
  const perPage = 10
  const page = Number(request.query.page) || 1

  const skip = (page - 1) * perPage

  const [refunds, totalRecords] = await Promise.all([
    prisma.refund.findMany({
      take: perPage,
      skip: skip,
      orderBy: { createdAt: "desc" },
    }),
    prisma.refund.count(),
  ])

  const totalPages = Math.ceil(totalRecords / perPage)

  return response.json({
    data: refunds,
    pagination: {
      page,
      perPage,
      totalRecords,
      totalPages,
    },
  })
})
```

## Exemplo 6 — Com SQL puro

```sql
-- Página 1: pega os primeiros 10
SELECT * FROM refunds
ORDER BY created_at DESC
LIMIT 10 OFFSET 0;

-- Página 2: pula 10, pega os próximos 10
SELECT * FROM refunds
ORDER BY created_at DESC
LIMIT 10 OFFSET 10;

-- Página 3: pula 20, pega os próximos 10
SELECT * FROM refunds
ORDER BY created_at DESC
LIMIT 10 OFFSET 20;

-- Contar total para calcular totalPages
SELECT COUNT(*) as total FROM refunds;
```

## Exemplo 7 — perPage configurável pelo usuário

```typescript
app.get("/refunds", async (request, response) => {
  const allowedPerPage = [5, 10, 20, 50]
  const requestedPerPage = Number(request.query.perPage) || 10
  const perPage = allowedPerPage.includes(requestedPerPage)
    ? requestedPerPage
    : 10

  const page = Math.max(1, Number(request.query.page) || 1)
  const skip = (page - 1) * perPage

  // ... resto da consulta
})
```

## Exemplo 8 — Resposta para o frontend (UI "1 de 3")

```typescript
// O frontend recebe:
{
  "data": [/* 10 registros */],
  "pagination": {
    "page": 1,        // página atual
    "perPage": 10,    // itens por página
    "totalRecords": 23,
    "totalPages": 3   // Math.ceil(23 / 10)
  }
}

// O frontend exibe: "1 de 3"
// Botão "próximo" → refaz request com ?page=2
// Botão "anterior" → refaz request com ?page=0 (desabilitado na página 1)
```

## Mapeamento take/skip por ORM

| ORM/Query Builder | take | skip |
|-------------------|------|------|
| Prisma | `take: perPage` | `skip: (page - 1) * perPage` |
| Knex | `.limit(perPage)` | `.offset((page - 1) * perPage)` |
| SQL puro | `LIMIT perPage` | `OFFSET (page - 1) * perPage` |
| TypeORM | `take: perPage` | `skip: (page - 1) * perPage` |
| Drizzle | `.limit(perPage)` | `.offset((page - 1) * perPage)` |