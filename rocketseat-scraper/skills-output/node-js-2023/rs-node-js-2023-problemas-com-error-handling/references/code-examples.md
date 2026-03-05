# Code Examples: Problemas com Error Handling

## Exemplo 1: Use case com throw generico (do transcript)

```typescript
// src/domain/forum/application/use-cases/comment-on-question.ts
export class CommentOnQuestionUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private questionCommentsRepository: QuestionCommentsRepository,
  ) {}

  async execute({ questionId, authorId, content }: CommentOnQuestionRequest) {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      // PROBLEMA: throw new Error generico
      // Quem chama esse use case nao sabe se e 400, 404, ou outro
      // Se nao houver try/catch, vira Internal Server Error
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

## Exemplo 2: Dois erros diferentes, mesmo formato

```typescript
// src/domain/forum/application/use-cases/delete-answer-comment.ts
export class DeleteAnswerCommentUseCase {
  constructor(
    private answerCommentsRepository: AnswerCommentsRepository,
  ) {}

  async execute({ commentId, authorId }: DeleteAnswerCommentRequest) {
    const comment = await this.answerCommentsRepository.findById(commentId)

    if (!comment) {
      // PROBLEMA: Este erro deveria ser HTTP 400
      // (informacao nao encontrada no banco)
      throw new Error('Answer comment not found.')
    }

    if (comment.authorId.toString() !== authorId) {
      // PROBLEMA: Este erro deveria ser HTTP 401
      // (usuario nao autorizado a deletar este comentario)
      // Mas ambos sao "throw new Error(string)" — indistinguiveis
      throw new Error('Not allowed.')
    }

    await this.answerCommentsRepository.delete(comment)
  }
}
```

### O que falta aqui:

```typescript
// Na camada de controller/handler, como diferenciar?
try {
  await deleteAnswerComment.execute({ commentId, authorId })
} catch (error) {
  // error.message === 'Answer comment not found.' → 400?
  // error.message === 'Not allowed.' → 401?
  // Teria que fazer if/else com strings — FRAGIL
  if (error.message === 'Not allowed.') {
    return response.status(401).json({ error: error.message })
  }
  return response.status(400).json({ error: error.message })
}
```

## Exemplo 3: Value Object sem estrategia de erro

```typescript
// src/domain/forum/enterprise/entities/value-objects/slug.ts
export class Slug {
  public value: string

  private constructor(value: string) {
    this.value = value
  }

  static createFromText(text: string): Slug {
    // E se text === '   ' (apenas espacos)?
    // Opcao 1: throw new Error('Invalid slug') — mesmo problema dos use cases
    // Opcao 2: return null — perde informacao do erro
    // Opcao 3: ??? — nao ha padrao definido

    const slugText = text
      .normalize('NFKD')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/_/g, '-')
      .replace(/--+/g, '-')
      .replace(/-$/g, '')

    return new Slug(slugText)
  }
}
```

## Exemplo 4: Retorno null (anti-pattern mencionado)

```typescript
// Anti-pattern: retornar null para indicar erro
export class GetQuestionBySlugUseCase {
  async execute({ slug }: Request) {
    const question = await this.questionsRepository.findBySlug(slug)

    if (!question) {
      return null // PROBLEMA: null nao diz NADA
      // Foi um erro de validacao?
      // O slug era invalido?
      // A question foi deletada?
      // O banco estava indisponivel?
    }

    return { question }
  }
}

// Quem consome:
const result = await getQuestionBySlug.execute({ slug })
if (!result) {
  // O que aconteceu? Nao sabemos. Retornamos 404? 400? 500?
  return response.status(???).json({ error: '???' })
}
```

## Resumo visual dos problemas

```
┌─────────────────────────────────────────────────┐
│              CAMADA DE USE CASE                  │
│                                                  │
│  throw new Error('Question not found')  → 400?  │
│  throw new Error('Not allowed')         → 401?  │
│  return null                            → ???   │
│                                                  │
├─────────────────────────────────────────────────┤
│              CAMADA DE ENTITY                    │
│                                                  │
│  throw? return null? return undefined?           │
│  Nao ha padrao definido                          │
│                                                  │
├─────────────────────────────────────────────────┤
│              CAMADA DE VALUE OBJECT              │
│                                                  │
│  Input invalido → como comunicar?                │
│  Mesma inconsistencia                            │
│                                                  │
├─────────────────────────────────────────────────┤
│         ERROR HANDLER GLOBAL (framework)         │
│                                                  │
│  Captura tudo que ninguem tratou                 │
│  Retorna: Internal Server Error 500              │
│  (resposta inesperada para o frontend)           │
└─────────────────────────────────────────────────┘
```