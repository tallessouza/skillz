---
name: rs-node-js-2023-deletar-resposta
description: "Applies DDD delete use case pattern with author authorization when writing Node.js domain logic. Use when user asks to 'delete an entity', 'create a delete use case', 'add authorization check', or 'implement resource ownership validation'. Enforces author-only deletion, repository interface contracts (findById + delete), and factory patterns for testing. Make sure to use this skill whenever implementing delete operations in Clean Architecture projects. Not for HTTP controllers, database implementations, or REST endpoint routing."
---

# Caso de Uso: Deletar Entidade com Autorizacao

> Todo caso de uso de delecao exige validacao de autoria antes de executar, repositorio com findById + delete, e factory dedicado para testes.

## Rules

1. **Valide autoria antes de deletar** — compare `entity.authorId` com o `authorId` recebido, porque qualquer usuario poderia deletar recursos alheios sem essa guarda
2. **Retorne erro tipado para autorizacao** — use `left(new NotAllowedError())` em vez de throw, porque erros funcionais sao fluxo de dominio, nao excecoes
3. **Repositorio expoe findById + delete** — a interface do repositorio precisa desses dois metodos para o caso de uso funcionar, porque delete sem busca previa nao valida existencia
4. **findById retorna `Entity | null`** — trate o caso nulo com `ResourceNotFoundError`, porque a entidade pode ter sido removida por outro processo
5. **Crie factories para testes** — `makeEntity()` com overrides opcionais, porque testes precisam criar entidades validas sem repetir setup
6. **Reuse estrutura entre entidades similares** — ao criar delete para Answer, copie de Question e substitua nomes preservando case, porque a estrutura e identica

## How to write

### Caso de uso de delecao

```typescript
interface DeleteAnswerUseCaseRequest {
  answerId: string
  authorId: string
}

type DeleteAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>

export class DeleteAnswerUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    answerId,
    authorId,
  }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    if (answer.authorId.toString() !== authorId) {
      return left(new NotAllowedError())
    }

    await this.answersRepository.delete(answer)

    return right({})
  }
}
```

### Interface do repositorio

```typescript
export abstract class AnswersRepository {
  abstract findById(id: string): Promise<Answer | null>
  abstract delete(answer: Answer): Promise<void>
  abstract create(answer: Answer): Promise<void>
}
```

### Factory para testes

```typescript
export function makeAnswer(
  override: Partial<AnswerProps> = {},
  id?: UniqueEntityID,
) {
  const answer = Answer.create(
    {
      authorId: new UniqueEntityID(),
      questionId: new UniqueEntityID(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  )

  return answer
}
```

## Example

**Before (sem validacao de autoria):**
```typescript
async execute({ answerId }: DeleteRequest) {
  const answer = await this.repo.findById(answerId)
  await this.repo.delete(answer) // qualquer usuario deleta
  return right({})
}
```

**After (com validacao completa):**
```typescript
async execute({ answerId, authorId }: DeleteRequest) {
  const answer = await this.repo.findById(answerId)

  if (!answer) {
    return left(new ResourceNotFoundError())
  }

  if (answer.authorId.toString() !== authorId) {
    return left(new NotAllowedError())
  }

  await this.repo.delete(answer)
  return right({})
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Novo caso de uso de delecao | Copie um existente e substitua nomes preservando case |
| Entidade sem campo de autoria | Avalie se a delecao precisa de autorizacao ou se e livre |
| InMemoryRepository faltando metodos | Implemente findById e delete espelhando o padrao das outras entidades |
| Factory de teste para entidade | Exporte Props da entidade, crie makeEntity com overrides |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `throw new Error('Not allowed')` | `return left(new NotAllowedError())` |
| `delete(id: string)` no repo | `delete(entity: Answer)` no repo |
| Deletar sem verificar existencia | findById + null check antes de deletar |
| Duplicar setup de entidade nos testes | Usar factory `makeAnswer()` com overrides |
| `if (answer.authorId !== authorId)` | `if (answer.authorId.toString() !== authorId)` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-caso-de-uso-deletar-resposta/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-caso-de-uso-deletar-resposta/references/code-examples.md)
