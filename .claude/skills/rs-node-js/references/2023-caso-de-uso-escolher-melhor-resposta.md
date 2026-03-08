---
name: rs-node-js-2023-escolher-melhor-resposta
description: "Applies DDD use case pattern for authorization-gated entity updates when writing Node.js domain logic. Use when user asks to 'create a use case', 'implement best answer', 'add authorization check', 'cross-repository use case', or 'domain layer logic'. Enforces: multi-repo injection, ownership validation before mutation, derive relations instead of redundant IDs. Make sure to use this skill whenever implementing use cases that modify entities owned by another user. Not for HTTP routes, database queries, or infrastructure layer code."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: use-cases
  tags: [best-answer, authorization, multi-repository, ddd, clean-architecture, ownership]
---

# Caso de Uso: Atualização com Verificação de Autoridade

> Use cases que modificam entidades alheias devem validar propriedade antes de mutar, usando apenas repositórios de domínio.

## Rules

1. **Injete múltiplos repositórios quando necessário** — um use case pode depender de 2+ repos sem problema, porque o domínio dita as dependências, não uma regra artificial de "1 repo por use case"
2. **Derive relações em vez de pedir IDs redundantes** — se `answer` já contém `questionId`, não peça `questionId` como input, porque isso evita inconsistência entre o ID passado e o real
3. **Valide existência antes de autorização** — busque a entidade primeiro, retorne "not found" se não existir, só depois verifique permissão, porque revelar "not allowed" para recurso inexistente é vazamento de informação
4. **Valide propriedade comparando authorId** — se `question.authorId !== authorId`, bloqueie com erro, porque apenas o dono pode mutar seus recursos
5. **Mute via setter e persista** — chame `entity.bestAnswerId = x` e depois `repository.save(entity)`, porque mutação sem persistência é bug silencioso
6. **Retorne a entidade modificada** — o chamador precisa do estado atualizado para compor respostas

## How to write

### Use case com verificação de autoridade

```typescript
interface ChooseQuestionBestAnswerRequest {
  answerId: string
  authorId: string
  // NÃO inclua questionId — derive de answer.questionId
}

export class ChooseQuestionBestAnswerUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private answersRepository: AnswersRepository,
  ) {}

  async execute({ answerId, authorId }: ChooseQuestionBestAnswerRequest) {
    const answer = await this.answersRepository.findById(answerId)
    if (!answer) throw new Error('Answer not found.')

    const question = await this.questionsRepository.findById(
      answer.questionId.toString(),
    )
    if (!question) throw new Error('Question not found.')

    if (question.authorId.toString() !== authorId) {
      throw new Error('Not allowed.')
    }

    question.bestAnswerId = answer.id
    await this.questionsRepository.save(question)

    return { question }
  }
}
```

### Teste unitário com factory e in-memory repos

```typescript
let questionsRepository: InMemoryQuestionsRepository
let answersRepository: InMemoryAnswersRepository
let sut: ChooseQuestionBestAnswerUseCase

beforeEach(() => {
  questionsRepository = new InMemoryQuestionsRepository()
  answersRepository = new InMemoryAnswersRepository()
  sut = new ChooseQuestionBestAnswerUseCase(questionsRepository, answersRepository)
})

it('should choose the question best answer', async () => {
  const question = makeQuestion()
  const answer = makeAnswer({ questionId: question.id })

  await questionsRepository.create(question)
  await answersRepository.create(answer)

  await sut.execute({
    answerId: answer.id.toString(),
    authorId: question.authorId.toString(),
  })

  expect(questionsRepository.items[0].bestAnswerId).toEqual(answer.id)
})

it('should not allow choosing best answer for another user question', async () => {
  const question = makeQuestion({ authorId: new UniqueEntityID('author-1') })
  const answer = makeAnswer({ questionId: question.id })

  await questionsRepository.create(question)
  await answersRepository.create(answer)

  await expect(
    sut.execute({ answerId: answer.id.toString(), authorId: 'author-2' }),
  ).rejects.toThrow()
})
```

## Heuristics

| Situação | Faça |
|----------|------|
| Use case precisa de dados de 2 entidades | Injete ambos os repositórios no construtor |
| Entidade B referencia entidade A por ID | Derive A a partir de B, não peça A.id como input |
| Ação só pode ser feita pelo dono | Compare `entity.authorId` com `request.authorId` |
| Entidade não encontrada | Throw antes de qualquer lógica de negócio |
| Teste de permissão negada | Crie entidade com author-1, execute com author-2, expect rejects |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `execute({ answerId, questionId, authorId })` | `execute({ answerId, authorId })` — derive questionId de answer |
| `if (authorId !== question.authorId)` sem buscar answer primeiro | Busque answer → busque question → compare authorId |
| `question.bestAnswerId = answerId` sem persistir | `question.bestAnswerId = id` + `repository.save(question)` |
| Teste apenas o caminho feliz | Teste caminho feliz + teste de permissão negada |
| Um repo gigante que busca tudo | Repos separados por aggregate root |

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

- [deep-explanation.md](mdc:data/skills/node-js-2023/rs-node-js-2023-caso-de-uso-escolher-melhor-resposta/references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](mdc:data/skills/node-js-2023/rs-node-js-2023-caso-de-uso-escolher-melhor-resposta/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
