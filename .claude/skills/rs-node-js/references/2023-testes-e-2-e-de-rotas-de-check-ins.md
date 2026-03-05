---
name: rs-node-js-2023-testes-e2e-check-ins
description: "Applies E2E testing patterns for REST API routes using Vitest and Supertest. Use when user asks to 'write e2e tests', 'test API routes', 'test endpoints', 'create integration tests', or 'test check-in routes'. Covers direct database seeding with Prisma, createMany for bulk inserts, findUniqueOrThrow for type-safe queries, and post-mutation database assertions. Make sure to use this skill whenever writing end-to-end tests for Node.js API routes. Not for unit tests, repository tests, or use-case tests."
---

# Testes E2E de Rotas de Check-ins

> Testes end-to-end validam o fluxo completo da requisicao HTTP ate o banco de dados, incluindo verificacao de estado pos-mutacao.

## Rules

1. **Seed dados dependentes direto no Prisma quando necessario** — se o recurso depende de outro (check-in depende de gym), crie via `prisma.gym.create()` no teste, porque nem sempre existe rota disponivel para criar a dependencia
2. **Use `createMany` para bulk seeding** — quando precisa de multiplos registros para testar listagem ou contagem, `prisma.checkIn.createMany({ data: [...] })` e mais limpo que multiplos creates
3. **Use `findFirst` ou `findUniqueOrThrow` para recuperar usuario autenticado** — quando o token nao retorna o user completo, busque `prisma.user.findFirstOrThrow()` porque so existe um usuario no banco de teste
4. **Use `findUniqueOrThrow` em vez de `findUnique`** — porque garante na tipagem TypeScript que o registro existe, eliminando `null` do tipo de retorno
5. **Valide estado do banco apos mutacao** — apos chamar rota de validacao/update, busque o registro no banco e verifique que o campo mudou (ex: `validated_at` preenchido), porque isso prova que a mutacao persistiu
6. **Reutilize a funcao utilitaria de autenticacao** — use `createAndAuthenticateUser(app)` em todos os testes e2e para evitar duplicacao do fluxo de login

## How to write

### Teste de criacao com dependencia

```typescript
it('should be able to create a check-in', async () => {
  const { token } = await createAndAuthenticateUser(app)

  const gym = await prisma.gym.create({
    data: {
      title: 'JavaScript Gym',
      latitude: -27.2092052,
      longitude: -49.6401091,
    },
  })

  const response = await request(app.server)
    .post(`/gyms/${gym.id}/check-ins`)
    .set('Authorization', `Bearer ${token}`)
    .send({ latitude: -27.2092052, longitude: -49.6401091 })

  expect(response.statusCode).toEqual(201)
})
```

### Teste de listagem com createMany

```typescript
it('should be able to list history of check-ins', async () => {
  const { token } = await createAndAuthenticateUser(app)

  const user = await prisma.user.findFirstOrThrow()
  const gym = await prisma.gym.create({ data: { title: 'JS Gym', latitude: -27.2092052, longitude: -49.6401091 } })

  await prisma.checkIn.createMany({
    data: [
      { gym_id: gym.id, user_id: user.id },
      { gym_id: gym.id, user_id: user.id },
    ],
  })

  const response = await request(app.server)
    .get('/check-ins/history')
    .set('Authorization', `Bearer ${token}`)

  expect(response.statusCode).toEqual(200)
  expect(response.body.checkIns).toEqual([
    expect.objectContaining({ gym_id: gym.id, user_id: user.id }),
    expect.objectContaining({ gym_id: gym.id, user_id: user.id }),
  ])
})
```

### Teste de mutacao com verificacao no banco

```typescript
it('should be able to validate a check-in', async () => {
  const { token } = await createAndAuthenticateUser(app, true)

  const user = await prisma.user.findFirstOrThrow()
  const gym = await prisma.gym.create({ data: { title: 'JS Gym', latitude: -27.2092052, longitude: -49.6401091 } })

  let checkIn = await prisma.checkIn.create({
    data: { gym_id: gym.id, user_id: user.id },
  })

  const response = await request(app.server)
    .patch(`/check-ins/${checkIn.id}/validate`)
    .set('Authorization', `Bearer ${token}`)

  expect(response.statusCode).toEqual(204)

  checkIn = await prisma.checkIn.findUniqueOrThrow({
    where: { id: checkIn.id },
  })

  expect(checkIn.validated_at).toEqual(expect.any(Date))
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Recurso depende de outro recurso | Seed via Prisma direto no teste |
| Precisa de multiplos registros | Use `createMany` com array no `data` |
| Precisa do ID do usuario autenticado | `prisma.user.findFirstOrThrow()` |
| Quer garantir que campo foi atualizado | Busque registro no banco apos chamada HTTP |
| Metodo HTTP para update parcial | Use `patch`, nao `put` |
| Rota retorna lista | Valide com array de `expect.objectContaining` |
| Rota retorna contagem | Valide o campo numerico diretamente |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `prisma.user.findUnique(...)` sem verificar null | `prisma.user.findUniqueOrThrow(...)` |
| Criar dependencias uma a uma quando precisa de multiplas | `prisma.checkIn.createMany({ data: [...] })` |
| Ignorar estado do banco apos mutacao | Buscar registro e verificar campo atualizado |
| Duplicar logica de autenticacao em cada teste | `createAndAuthenticateUser(app)` |
| `expect(response.body).toEqual(...)` sem objectContaining | `expect.objectContaining({})` para campos parciais |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-testes-e-2-e-de-rotas-de-check-ins/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-testes-e-2-e-de-rotas-de-check-ins/references/code-examples.md)
