---
name: 2023-disparando-eventos-de-dominio
description: "Triggers domain events from Prisma repositories and controls their execution in E2E tests using a static shouldRun toggle. Use when user asks to 'dispatch domain events', 'trigger events from repository', 'control events in tests', or 'prevent side effects in E2E tests'. Make sure to use this skill whenever integrating domain events with Prisma repositories or writing E2E tests that need to control event dispatching. Not for in-memory repository events, frontend event handling, or message queue integration."
category: coding-lens
tags: [domain-events, entities, nestjs, prisma, repository, testing]
mind_lenses: [LT_01, LT_02, MF_01, GB_01, TH_04]
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: domain-events
  tags: [domain-events, nestjs, prisma, repository, testing, shouldRun, e2e]
---

# Disparando Eventos de Domínio

> Disparar eventos de domínio a partir dos repositórios Prisma e controlar sua execução nos testes E2E com um toggle estático `shouldRun`.

## Rules

1. **Dispare eventos no `create` e no `save` dos repositórios** — `DomainEvents.dispatchEventsForAggregate(entity.id)` em ambos os métodos, porque qualquer persistência pode ter eventos pendentes
2. **O dispatch é síncrono** — não coloque dentro de `Promise.all`, porque `dispatchEventsForAggregate` não retorna Promise
3. **Use `shouldRun` estático para controlar execução** — propriedade `public static shouldRun = true` na classe `DomainEvents`, porque testes de controller não devem disparar efeitos colaterais
4. **Desative eventos no setup geral E2E** — `DomainEvents.shouldRun = false` no `beforeAll` do setup global, porque controllers devem testar apenas a ação HTTP
5. **Reative eventos apenas nos testes de evento** — `DomainEvents.shouldRun = true` no `beforeAll` do teste específico, porque apenas testes de eventos devem validar o fluxo completo

## How to write

### Repositório Prisma com dispatch de eventos

```typescript
// prisma-answers-repository.ts
async create(answer: Answer) {
  const data = PrismaAnswerMapper.toPrisma(answer)
  await this.prisma.answer.create({ data })

  DomainEvents.dispatchEventsForAggregate(answer.id)
}

async save(answer: Answer) {
  const data = PrismaAnswerMapper.toPrisma(answer)
  await this.prisma.answer.update({
    where: { id: data.id },
    data,
  })

  DomainEvents.dispatchEventsForAggregate(answer.id)
}
```

### Toggle shouldRun na classe DomainEvents

```typescript
export class DomainEvents {
  public static shouldRun = true

  public static dispatch(id: UniqueEntityID) {
    if (!this.shouldRun) return
    // ... lógica de dispatch existente
  }
}
```

### Setup E2E desativando eventos

```typescript
// setup-e2e.ts
beforeAll(async () => {
  DomainEvents.shouldRun = false
  // ... resto do setup
})
```

### Teste E2E de evento reativando

```typescript
// on-answer-created.e2e-spec.ts
beforeAll(async () => {
  DomainEvents.shouldRun = true
  // ... inicialização do app
})
```

## Example

**Before (eventos disparam em todos os testes E2E):**
```typescript
// prisma-answers-repository.ts
async create(answer: Answer) {
  const data = PrismaAnswerMapper.toPrisma(answer)
  await this.prisma.answer.create({ data })
  // sem dispatch — eventos nunca disparam em produção
}

// OU pior: dispatch sem controle
async create(answer: Answer) {
  await this.prisma.answer.create({ data })
  DomainEvents.dispatchEventsForAggregate(answer.id)
  // dispara em TODOS os testes E2E, causando side effects indesejados
}
```

**After (eventos controlados por contexto):**
```typescript
// DomainEvents com toggle
export class DomainEvents {
  public static shouldRun = true

  public static dispatchEventsForAggregate(id: UniqueEntityID) {
    if (!this.shouldRun) return
    // dispatch normal
  }
}

// setup-e2e.ts — desativa globalmente
DomainEvents.shouldRun = false

// on-answer-created.e2e-spec.ts — reativa apenas aqui
DomainEvents.shouldRun = true
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Repositório Prisma com `create` ou `save` | Adicionar `DomainEvents.dispatchEventsForAggregate(entity.id)` |
| Teste E2E de controller | Manter `shouldRun = false` (default do setup) |
| Teste E2E de evento/subscriber | Setar `shouldRun = true` no `beforeAll` |
| Dispatch dentro de `Promise.all` | Remover do `Promise.all` — é síncrono |
| Novo aggregate com eventos | Adicionar dispatch no repositório Prisma correspondente |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `await DomainEvents.dispatchEventsForAggregate(id)` | `DomainEvents.dispatchEventsForAggregate(id)` (síncrono) |
| `Promise.all([..., DomainEvents.dispatch(id)])` | Dispatch fora do `Promise.all` |
| Dispatch apenas no `create` | Dispatch no `create` E no `save` |
| Testar notificação dentro do teste de controller | Criar teste E2E separado para o evento |
| `if (process.env.NODE_ENV !== 'test')` para controlar eventos | `DomainEvents.shouldRun` toggle estático |

## Troubleshooting

### Eventos disparam em todos os testes E2E causando side effects
**Symptom:** Testes de controller falham ou produzem efeitos colaterais inesperados (notificacoes, emails)
**Cause:** `DomainEvents.shouldRun` nao foi desativado no setup global E2E
**Fix:** Adicione `DomainEvents.shouldRun = false` no `beforeAll` do `setup-e2e.ts` e reative apenas nos testes de evento especificos

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
