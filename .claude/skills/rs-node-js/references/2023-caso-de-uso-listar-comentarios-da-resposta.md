---
name: rs-node-js-2023-fetch-answer-comments
description: "Applies the pattern of creating paginated list use cases in DDD/Clean Architecture when user asks to 'list comments', 'fetch answer comments', 'create a paginated use case', or 'duplicate a use case for another entity'. Follows repository interface, in-memory implementation, use case, and test creation. Make sure to use this skill whenever creating CRUD list operations with pagination in Clean Architecture. Not for creating entities, value objects, or aggregates."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: use-cases
  tags: [fetch, list, pagination, answer-comments, ddd, clean-architecture, in-memory]
---

# Caso de Uso: Listar Comentarios com Paginacao (DDD)

> Ao criar um caso de uso de listagem paginada, replique o padrao existente trocando a entidade-alvo, mantendo repository interface, in-memory, use case e teste.

## Rules

1. **Comece pelo contrato do repository** — adicione o metodo `findManyBy{Entity}Id` na interface do repository, porque o contrato guia toda a implementacao
2. **Receba PaginationParams** — todo metodo de listagem recebe `{ page: number }`, porque paginacao e obrigatoria em listagens
3. **Implemente o in-memory primeiro** — o repository in-memory e o teste de integracao mais rapido, porque valida o contrato sem infraestrutura
4. **Use case recebe repository via construtor** — injecao de dependencia no construtor, porque desacopla do storage concreto
5. **Teste cria multiplos registros** — insira pelo menos 22+ items para validar paginacao real, porque testar com 1-2 items nao prova que a paginacao funciona
6. **Reaproveitamento por substituicao** — quando o padrao ja existe para outra entidade, copie e substitua o nome da entidade, porque a estrutura e identica

## How to write

### Interface do Repository

```typescript
// domain/forum/application/repositories/answer-comments-repository.ts
import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerComment } from '../../enterprise/entities/answer-comment'

export interface AnswerCommentsRepository {
  findManyByAnswerId(answerId: string, params: PaginationParams): Promise<AnswerComment[]>
}
```

### In-Memory Repository

```typescript
// test/repositories/in-memory-answer-comments-repository.ts
async findManyByAnswerId(answerId: string, { page }: PaginationParams) {
  const answerComments = this.items
    .filter((item) => item.answerId.toString() === answerId)
    .slice((page - 1) * 20, page * 20)

  return answerComments
}
```

### Use Case

```typescript
// domain/forum/application/use-cases/fetch-answer-comments.ts
interface FetchAnswerCommentsRequest {
  answerId: string
  page: number
}

interface FetchAnswerCommentsResponse {
  answerComments: AnswerComment[]
}

export class FetchAnswerCommentsUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({ answerId, page }: FetchAnswerCommentsRequest): Promise<FetchAnswerCommentsResponse> {
    const answerComments = await this.answerCommentsRepository.findManyByAnswerId(answerId, { page })
    return { answerComments }
  }
}
```

## Example

**Before (sem o caso de uso):**
```typescript
// Apenas FetchQuestionComments existe
// Nenhuma forma de listar comentarios de uma resposta
```

**After (com reaproveitamento do padrao):**
```typescript
// 1. Interface: AnswerCommentsRepository.findManyByAnswerId()
// 2. InMemory: filtra por answerId + slice para paginacao
// 3. UseCase: FetchAnswerCommentsUseCase.execute({ answerId, page })
// 4. Test: cria 22 comments, verifica page 1 (20) e page 2 (2)
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Ja existe listagem para entidade similar | Copie e substitua o nome da entidade |
| Precisa listar por FK (answerId, questionId) | Use `findManyBy{FK}Id` como nome do metodo |
| Paginacao | Sempre 20 items por pagina, slice com `(page-1)*20, page*20` |
| Teste de paginacao | Crie items suficientes para cobrir 2+ paginas |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Listagem sem paginacao | Sempre receba `PaginationParams` |
| Testar paginacao com 3 items | Crie 22+ items para validar overflow |
| Repository method sem tipagem de retorno | `Promise<AnswerComment[]>` explicito |
| Use case acessando banco direto | Injete repository interface no construtor |

## Troubleshooting

### Use case lanca erro inesperado
**Symptom:** Teste falha com erro nao tratado no use case
**Cause:** Entidade dependente nao foi criada no repositorio in-memory antes de executar
**Fix:** Pre-seed o repositorio com todas as entidades necessarias usando factories antes de chamar `sut.execute()`

### Comparacao de ID falha silenciosamente
**Symptom:** `authorId !== entity.authorId` sempre retorna true mesmo com IDs corretos
**Cause:** `entity.authorId` e um UniqueEntityID, nao uma string
**Fix:** Use `.toString()` na comparacao: `entity.authorId.toString() !== authorId`

## Deep reference library

- [deep-explanation.md](mdc:data/skills/node-js-2023/rs-node-js-2023-caso-de-uso-listar-comentarios-da-resposta/references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](mdc:data/skills/node-js-2023/rs-node-js-2023-caso-de-uso-listar-comentarios-da-resposta/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
