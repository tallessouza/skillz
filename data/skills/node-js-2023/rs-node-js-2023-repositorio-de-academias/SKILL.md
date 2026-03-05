---
name: rs-node-js-2023-repositorio-de-academias
description: "Applies Prisma raw SQL patterns and ORM-to-SQL fallback strategies when implementing geospatial queries or complex database operations. Use when user asks to 'find nearby locations', 'implement geospatial search', 'use Prisma raw query', 'Haversine formula', or 'repository with Prisma'. Enforces typed queryRaw with generics, pagination patterns, and contains-based search. Make sure to use this skill whenever implementing Prisma repositories that need raw SQL or proximity searches. Not for in-memory repositories, unit test mocks, or frontend geolocation."
---

# Repositorio Prisma com Raw SQL

> Quando o ORM nao basta, descer para SQL raw tipado — mas nunca buscar tudo para filtrar em JavaScript.

## Rules

1. **Use `contains` para buscas textuais** — `where: { title: { contains: query } }` nao `where: { title: query }`, porque igualdade exata raramente e o que o usuario quer
2. **Nunca traga tudo para filtrar em JS** — calculos de distancia, filtros complexos devem acontecer no SQL, porque trazer 100k registros para filtrar em memoria e inaceitavel em producao
3. **Use `$queryRaw` com generic tipado** — `prisma.$queryRaw<Gym[]>` nao `prisma.$queryRaw`, porque `unknown` como retorno elimina type safety
4. **Paginacao sempre com take/skip** — `take: 20, skip: (page - 1) * 20`, porque paginacao consistente evita problemas de performance
5. **Template literal colado no `$queryRaw`** — a crase vai direto no metodo sem parenteses, porque e assim que o Prisma interpola parametros com seguranca contra SQL injection

## How to write

### Metodos simples do repositorio (findById, create)

```typescript
async findById(id: string) {
  const gym = await prisma.gym.findUnique({ where: { id } })
  return gym
}

async create(data: Prisma.GymCreateInput) {
  const gym = await prisma.gym.create({ data })
  return gym
}
```

### Busca textual com paginacao

```typescript
async searchMany(query: string, page: number) {
  const gyms = await prisma.gym.findMany({
    where: {
      title: { contains: query },
    },
    take: 20,
    skip: (page - 1) * 20,
  })
  return gyms
}
```

### Raw SQL para busca por proximidade (Haversine)

```typescript
async findManyNearby({ latitude, longitude }: FindManyNearbyParams) {
  const gyms = await prisma.$queryRaw<Gym[]>`
    SELECT * from gyms
    WHERE ( 6371 * acos(
      cos( radians(${latitude}) ) * cos( radians( latitude ) ) *
      cos( radians( longitude ) - radians(${longitude}) ) +
      sin( radians(${latitude}) ) * sin( radians( latitude ) )
    ) ) <= 10
  `
  return gyms
}
```

## Example

**Before (anti-pattern — filtrar em JS):**
```typescript
async findManyNearby({ latitude, longitude }: FindManyNearbyParams) {
  const allGyms = await prisma.gym.findMany()
  return allGyms.filter((gym) => {
    const distance = getDistanceBetweenCoordinates(
      { latitude, longitude },
      { latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() },
    )
    return distance <= 10
  })
}
```

**After (com Haversine no SQL):**
```typescript
async findManyNearby({ latitude, longitude }: FindManyNearbyParams) {
  const gyms = await prisma.$queryRaw<Gym[]>`
    SELECT * from gyms
    WHERE ( 6371 * acos(
      cos( radians(${latitude}) ) * cos( radians( latitude ) ) *
      cos( radians( longitude ) - radians(${longitude}) ) +
      sin( radians(${latitude}) ) * sin( radians( latitude ) )
    ) ) <= 10
  `
  return gyms
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| CRUD simples (find, create, update) | Use metodos do Prisma Client normalmente |
| Busca textual (titulo, nome) | Use `contains` no where |
| Calculo matematico/geoespacial | Use `$queryRaw` com SQL tipado |
| Retorno de `$queryRaw` | Sempre tipar com generic `<Model[]>` |
| Paginacao | `take: 20, skip: (page - 1) * 20` |
| Query complexa que voce nao sabe | Pesquise a formula SQL, nao invente — Haversine e um exemplo classico |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `findMany()` + `.filter()` em JS para dados grandes | `$queryRaw` com WHERE no SQL |
| `$queryRaw` sem generic (retorna `unknown`) | `$queryRaw<Gym[]>` com tipo explicito |
| `where: { title: query }` (igualdade exata) | `where: { title: { contains: query } }` |
| Parenteses no `$queryRaw()` | Template literal colado: `$queryRaw\`...\`` |
| Ignorar SQL porque "uso ORM" | Aprender SQL — 20% dos casos exigem raw |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
