---
name: rs-node-js-2023-comentar-na-resposta
description: "Applies the DDD pattern of replicating symmetric use cases when creating 'Comment on Answer' from 'Comment on Question' in Clean Architecture. Use when user asks to 'create a similar use case', 'replicate a use case for another entity', 'comment on answer', or 'duplicate domain logic for symmetric entity'. Ensures repository, use case, in-memory test repo, and unit test are all created following the copy-adapt-rename pattern. Make sure to use this skill whenever building symmetric CRUD operations in DDD. Not for creating entirely new use cases from scratch or unrelated domain logic."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: ddd-use-cases
  tags: [ddd, use-case, comment, symmetric-replication, copy-adapt, clean-architecture]
---

# Caso de Uso: Comentar na Resposta (Replicacao Simetrica em DDD)

> Quando dois agregados compartilham a mesma operacao de dominio, replique a estrutura completa (repositorio, caso de uso, teste, in-memory repo) substituindo a entidade sistematicamente.

## Rules

1. **Replique todos os 4 artefatos** — repositorio, caso de uso, teste unitario, in-memory repository, porque omitir qualquer um quebra a simetria e gera bugs silenciosos
2. **Use find-and-replace sistematico** — substitua o nome da entidade origem pela destino em todos os arquivos, porque erros parciais de renomeacao sao a fonte #1 de bugs nesse padrao
3. **Crie o repositorio primeiro** — ele e a dependencia de todos os outros artefatos, porque caso de uso e teste dependem dele
4. **Mantenha a mesma estrutura de diretorio** — se `comment-on-question.ts` esta em `use-cases/`, `comment-on-answer.ts` vai no mesmo lugar, porque consistencia arquitetural e lei em DDD
5. **Teste imediatamente apos replicar** — execute `npm run test` para validar que a substituicao foi completa, porque erros de renomeacao incompleta so aparecem em runtime
6. **Nao invente diferencas** — se a operacao e simetrica, o codigo deve ser identico exceto pelo nome da entidade, porque adicionar logica extra viola o principio de simetria

## How to write

### Repositorio (criar primeiro)

```typescript
// src/domain/forum/application/repositories/answer-comments-repository.ts
export interface AnswerCommentsRepository {
  create(answerComment: AnswerComment): Promise<void>
  // Mesma interface que QuestionCommentsRepository, trocando Question por Answer
}
```

### Caso de uso

```typescript
// src/domain/forum/application/use-cases/comment-on-answer.ts
interface CommentOnAnswerUseCaseRequest {
  authorId: string
  answerId: string
  content: string
}

export class CommentOnAnswerUseCase {
  constructor(
    private answerCommentsRepository: AnswerCommentsRepository,
  ) {}

  async execute({ authorId, answerId, content }: CommentOnAnswerUseCaseRequest) {
    const answerComment = AnswerComment.create({
      authorId: new UniqueEntityID(authorId),
      answerId: new UniqueEntityID(answerId),
      content,
    })

    await this.answerCommentsRepository.create(answerComment)
    return { answerComment }
  }
}
```

### In-memory repository para teste

```typescript
// test/repositories/in-memory-answer-comments-repository.ts
export class InMemoryAnswerCommentsRepository implements AnswerCommentsRepository {
  public items: AnswerComment[] = []

  async create(answerComment: AnswerComment) {
    this.items.push(answerComment)
  }
}
```

## Example

**Entidade origem (Question):**
```
repositories/question-comments-repository.ts
use-cases/comment-on-question.ts
use-cases/comment-on-question.spec.ts
test/repositories/in-memory-question-comments-repository.ts
```

**Entidade destino (Answer) — find-replace sistematico:**
```
repositories/answer-comments-repository.ts
use-cases/comment-on-answer.ts
use-cases/comment-on-answer.spec.ts
test/repositories/in-memory-answer-comments-repository.ts
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Operacao identica em dois agregados | Replicar com find-replace sistematico |
| Operacao tem regras diferentes por agregado | NAO replicar — criar caso de uso proprio |
| Terceiro agregado precisa da mesma operacao | Considerar abstracao generica |
| Duvida se a simetria e completa | Comparar acceptance criteria de ambos antes de replicar |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Copiar e renomear manualmente, arquivo por arquivo | Use find-replace global no editor para consistencia |
| Esquecer de criar o in-memory repository | Sempre crie os 4 artefatos: repo, use case, test, in-memory |
| Adicionar logica extra no caso simetrico | Mantenha identico, diferencie apenas se o dominio exigir |
| Testar so depois de criar todos os arquivos | Teste apos cada replicacao para pegar erros cedo |
| Errar a extensao do arquivo (.ts) | Verifique extensao e nome antes de commitar |

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

- [deep-explanation.md](mdc:data/skills/node-js-2023/rs-node-js-2023-caso-de-uso-comentar-na-resposta/references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](mdc:data/skills/node-js-2023/rs-node-js-2023-caso-de-uso-comentar-na-resposta/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
