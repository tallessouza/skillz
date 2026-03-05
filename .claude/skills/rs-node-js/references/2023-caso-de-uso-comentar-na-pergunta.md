---
name: rs-node-js-2023-comentar-na-pergunta
description: "Applies the use case pattern for creating comments on entities in DDD with Clean Architecture. Use when user asks to 'create a comment use case', 'add commenting feature', 'implement comment on question', or 'create a new use case in DDD'. Follows: validate parent exists, create child entity, repository per aggregate. Make sure to use this skill whenever implementing comment/reply features in domain-driven Node.js apps. Not for UI components, API controllers, or database migrations."
---

# Caso de Uso: Comentar na Pergunta

> Ao criar um caso de uso de comentario em DDD, valide a existencia da entidade pai, crie a entidade filha com IDs tipados, e persista via repositorio dedicado.

## Rules

1. **Nomeie o caso de uso pela acao exata** — `CommentOnQuestion` nao `CreateComment`, porque o nome deve refletir a intencao de dominio especifica
2. **Valide a existencia da entidade pai antes de criar a filha** — busque a question antes de criar o comment, porque comentar em algo inexistente e uma violacao de dominio
3. **Um repositorio por agregado/entidade** — `QuestionCommentsRepository` separado de `QuestionsRepository`, porque cada entidade tem seu ciclo de vida
4. **Use UniqueEntityID para todos os IDs recebidos como string** — `new UniqueEntityID(authorId)`, porque o dominio trabalha com value objects, nao strings cruas
5. **Retorne a entidade criada no resultado** — o caso de uso devolve o `questionComment` criado, porque o chamador precisa da referencia
6. **Inversao de dependencia nos repositorios** — receba repositorios pelo construtor, porque permite testes com in-memory e troca de implementacao

## How to write

### Caso de uso completo

```typescript
interface CommentOnQuestionUseCaseRequest {
  authorId: string
  questionId: string
  content: string
}

interface CommentOnQuestionUseCaseResponse {
  questionComment: QuestionComment
}

export class CommentOnQuestionUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private questionCommentsRepository: QuestionCommentsRepository,
  ) {}

  async execute({
    authorId,
    questionId,
    content,
  }: CommentOnQuestionUseCaseRequest): Promise<CommentOnQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      throw new Error('Question not found.')
    }

    const questionComment = QuestionComment.create({
      authorId: new UniqueEntityID(authorId),
      questionId: new UniqueEntityID(questionId),
      content,
    })

    await this.questionCommentsRepository.create(questionComment)

    return { questionComment }
  }
}
```

### Repositorio dedicado

```typescript
export interface QuestionCommentsRepository {
  create(questionComment: QuestionComment): Promise<void>
}
```

### In-memory repository para testes

```typescript
export class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  public items: QuestionComment[] = []

  async create(questionComment: QuestionComment) {
    this.items.push(questionComment)
  }
}
```

## Example

**Before (erro comum — sem validacao, sem repositorio dedicado):**

```typescript
class CreateComment {
  constructor(private questionsRepo: QuestionsRepository) {}

  async execute(questionId: string, content: string) {
    // Cria comentario sem verificar se a question existe
    // Salva no mesmo repositorio de questions
    const comment = { questionId, content }
    await this.questionsRepo.saveComment(comment)
    return comment
  }
}
```

**After (com esta skill aplicada):**

```typescript
class CommentOnQuestion {
  constructor(
    private questionsRepository: QuestionsRepository,
    private questionCommentsRepository: QuestionCommentsRepository,
  ) {}

  async execute({ authorId, questionId, content }: CommentOnQuestionRequest) {
    const question = await this.questionsRepository.findById(questionId)
    if (!question) throw new Error('Question not found.')

    const questionComment = QuestionComment.create({
      authorId: new UniqueEntityID(authorId),
      questionId: new UniqueEntityID(questionId),
      content,
    })

    await this.questionCommentsRepository.create(questionComment)
    return { questionComment }
  }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Caso de uso cria entidade filha | Valide existencia da entidade pai primeiro |
| Nova entidade no dominio | Crie repositorio dedicado para ela |
| IDs recebidos como string | Envolva com `new UniqueEntityID(id)` |
| Caso de uso similar ja existe | Copie e adapte (ex: `CommentOnAnswer` a partir de `CommentOnQuestion`) |
| Teste do caso de uso | Crie a entidade pai no repositorio in-memory antes de executar |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `CreateComment` (generico) | `CommentOnQuestion` (acao especifica) |
| Salvar comment no repo de questions | Repositorio dedicado `QuestionCommentsRepository` |
| `questionId: questionId` (string crua) | `questionId: new UniqueEntityID(questionId)` |
| Criar comment sem verificar question | `findById` + throw se nao existir |
| Retornar void do caso de uso | Retornar `{ questionComment }` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-caso-de-uso-comentar-na-pergunta/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-caso-de-uso-comentar-na-pergunta/references/code-examples.md)
