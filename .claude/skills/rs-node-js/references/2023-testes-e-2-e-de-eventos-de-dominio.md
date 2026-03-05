---
name: rs-node-js-2023-testes-e2e-eventos-dominio
description: "Enforces patterns for writing E2E tests of domain events in NestJS with Prisma. Use when user asks to 'test domain events', 'test notifications', 'write e2e tests for events', 'validate event dispatching', or 'test async side effects'. Applies rules: use waitFor for async assertions, verify Prisma repositories dispatch events, test side effects not just HTTP status, keep event tests separate from controller tests. Make sure to use this skill whenever writing integration or E2E tests that involve domain events or async side effects. Not for unit testing domain events, testing controllers, or testing synchronous operations."
---

# Testes E2E de Eventos de Domínio

> Eventos de domínio são assíncronos — testes E2E devem usar `waitFor` para validar efeitos colaterais, nunca assertions síncronas imediatas.

## Rules

1. **Crie testes E2E separados para eventos** — mesmo tendo testes unitários para `OnAnswerCreated`, crie testes E2E porque os unitários não garantem que a camada de infra dispara os eventos corretamente
2. **Use `waitFor` para assertions assíncronas** — eventos de domínio não são síncronos, a notificação demora milissegundos para ser criada no banco, assertions imediatas vão falhar
3. **Teste o efeito colateral, não o HTTP status** — no teste de evento, não valide `status 201`, valide que a notificação foi criada no banco de dados
4. **Garanta que repositórios Prisma disparam eventos** — o `InMemoryRepository` dispara via `DomainEvents.dispatchEventsForAggregate()`, o repositório Prisma também precisa fazer isso
5. **Suporte `Promise<void>` no waitFor** — assertions E2E precisam de `await` (banco de dados), então o callback do `waitFor` deve aceitar funções assíncronas

## How to write

### Teste E2E de evento com waitFor

```typescript
// on-answer-created.e2e-spec.ts
describe('On Answer Created (E2E)', () => {
  // setup: app, prisma, factories...

  it('should send a notification when answer is created', async () => {
    const user = await studentFactory.makePrismaStudent()
    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    // Dispara a criação via rota (camada de infra testando camada de infra)
    await request(app.getHttpServer())
      .post(`/questions/${question.id.toString()}/answers`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ content: 'New answer' })

    // Não valide status 201 aqui — o foco é o evento

    // Use waitFor porque o evento é assíncrono
    await waitFor(async () => {
      const notificationOnDatabase = await prisma.notification.findFirst({
        where: { recipientId: user.id.toString() },
      })

      expect(notificationOnDatabase).not.toBeNull()
    })
  })
})
```

### waitFor com suporte a async

```typescript
export async function waitFor(
  assertions: () => void | Promise<void>,
  maxDuration = 1000,
) {
  return new Promise<void>((resolve, reject) => {
    let elapsedTime = 0
    const interval = setInterval(async () => {
      try {
        await assertions()
        clearInterval(interval)
        resolve()
      } catch (err) {
        elapsedTime += 10
        if (elapsedTime >= maxDuration) {
          clearInterval(interval)
          reject(err)
        }
      }
    }, 10)
  })
}
```

### Repositório Prisma disparando eventos

```typescript
// prisma-answers-repository.ts
async create(answer: Answer): Promise<void> {
  const data = PrismaAnswerMapper.toPrisma(answer)
  await this.prisma.answer.create({ data })

  // Sem isso, eventos de domínio não são disparados na camada de infra
  DomainEvents.dispatchEventsForAggregate(answer.id)
}
```

## Example

**Before (teste que sempre falha):**
```typescript
it('should send notification', async () => {
  await request(app.getHttpServer())
    .post(`/questions/${questionId}/answers`)
    .send({ content: 'Answer' })

  // FALHA: notificação ainda não foi criada (assíncrono)
  const notification = await prisma.notification.findFirst({
    where: { recipientId: userId },
  })
  expect(notification).not.toBeNull()
})
```

**After (com waitFor):**
```typescript
it('should send notification', async () => {
  await request(app.getHttpServer())
    .post(`/questions/${questionId}/answers`)
    .send({ content: 'Answer' })

  await waitFor(async () => {
    const notification = await prisma.notification.findFirst({
      where: { recipientId: userId },
    })
    expect(notification).not.toBeNull()
  })
})
```

## Heuristics

| Situação | Faça |
|----------|------|
| Evento de domínio com efeito colateral | Teste E2E com waitFor, mesmo tendo teste unitário |
| Repositório Prisma criado para um agregado | Adicione `DomainEvents.dispatchEventsForAggregate()` |
| Assertion precisa consultar banco | Use `async` no callback do waitFor |
| Muitos testes E2E no projeto | Rode testes específicos: `--testPathPattern on-answer-created` |
| Teste de evento, não de controller | Não valide HTTP status, valide o efeito colateral |

## Anti-patterns

| Nunca faça | Faça ao invés |
|------------|---------------|
| Assertion síncrona após criar entidade com evento | `await waitFor(async () => { ... })` |
| Validar status 201 em teste de evento | Validar que a notificação existe no banco |
| Repositório Prisma sem dispatch de eventos | Adicionar `DomainEvents.dispatchEventsForAggregate(entity.id)` |
| Rodar todos os testes E2E durante dev | Filtrar: `--testPathPattern nome-do-teste` |
| waitFor que só aceita `() => void` | Aceitar `() => void | Promise<void>` para queries no banco |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-testes-e-2-e-de-eventos-de-dominio/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-testes-e-2-e-de-eventos-de-dominio/references/code-examples.md)
