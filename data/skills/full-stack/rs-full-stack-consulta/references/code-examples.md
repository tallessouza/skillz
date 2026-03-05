# Code Examples: Consultas com Prisma ORM

## Exemplo 1: Busca basica com igualdade (problema)

```typescript
// O que o instrutor mostrou primeiro - busca por igualdade exata
const questions = await prisma.question.findMany({
  where: {
    title: request.query.title?.toString(),
  },
})
// Problema: "Prisma" encontra, "prisma" nao, "Prisma " nao
```

## Exemplo 2: Busca com contains (melhoria)

```typescript
// Substituir igualdade por contains
const questions = await prisma.question.findMany({
  where: {
    title: {
      contains: request.query.title?.toString().trim(),
    },
  },
})
// Agora: "Prisma" encontra, "Pris" encontra, "rm" encontra
// Ainda falha: "prisma" (minusculo) nao encontra
```

## Exemplo 3: Adicionando mode insensitive (solucao completa)

```typescript
// Adicionar mode insensitive para ignorar casing
const questions = await prisma.question.findMany({
  where: {
    title: {
      contains: request.query.title?.toString().trim(),
      mode: 'insensitive',
    },
  },
})
// Agora: "Prisma", "prisma", "PRISMA", "rm", "RM" - tudo funciona
```

## Exemplo 4: Adicionando orderBy

```typescript
// orderBy como propriedade irma de where
const questions = await prisma.question.findMany({
  where: {
    title: {
      contains: request.query.title?.toString().trim(),
      mode: 'insensitive',
    },
  },
  orderBy: {
    title: 'asc', // Ordem alfabetica ascendente
  },
})
```

## Exemplo 5: Filtro condicional (parametro opcional)

```typescript
// Versao robusta com filtro condicional
const title = request.query.title?.toString().trim()

const questions = await prisma.question.findMany({
  // Se title existe, filtra; senao, retorna tudo
  where: title
    ? {
        title: {
          contains: title,
          mode: 'insensitive',
        },
      }
    : undefined,
  orderBy: {
    title: 'asc',
  },
})
```

## Exemplo 6: Variacao com conditional spread

```typescript
const title = request.query.title?.toString().trim()

const questions = await prisma.question.findMany({
  ...(title && {
    where: {
      title: {
        contains: title,
        mode: 'insensitive',
      },
    },
  }),
  orderBy: {
    title: 'asc',
  },
})
```

## Exemplo 7: Multiplos filtros combinados

```typescript
// Extrapolacao: busca por titulo E categoria
const title = request.query.title?.toString().trim()
const category = request.query.category?.toString().trim()

const questions = await prisma.question.findMany({
  where: {
    ...(title && {
      title: {
        contains: title,
        mode: 'insensitive',
      },
    }),
    ...(category && {
      category: {
        contains: category,
        mode: 'insensitive',
      },
    }),
  },
  orderBy: {
    title: 'asc',
  },
})
```

## Exemplo 8: orderBy descendente

```typescript
// O instrutor mostrou desc vs asc
const questions = await prisma.question.findMany({
  orderBy: {
    title: 'desc', // Z -> A
  },
})
```

## Exemplo 9: Rota completa (contexto Fastify)

```typescript
app.get('/questions', async (request, reply) => {
  const title = (request.query as { title?: string }).title?.toString().trim()

  const questions = await prisma.question.findMany({
    where: title
      ? {
          title: {
            contains: title,
            mode: 'insensitive',
          },
        }
      : undefined,
    orderBy: {
      title: 'asc',
    },
  })

  return { questions }
})
```