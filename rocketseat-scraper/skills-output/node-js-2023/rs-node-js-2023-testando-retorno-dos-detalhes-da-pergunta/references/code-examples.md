# Code Examples: Testando Retorno dos Detalhes da Pergunta

## Exemplo completo: Setup do teste com dependências

```typescript
// get-question-by-slug.spec.ts
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { makeStudent } from 'test/factories/make-student'
import { makeQuestion } from 'test/factories/make-question'
import { makeAttachment } from 'test/factories/make-attachment'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: GetQuestionBySlugUseCase

beforeEach(() => {
  inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
  inMemoryStudentsRepository = new InMemoryStudentsRepository()
  inMemoryQuestionAttachmentsRepository =
    new InMemoryQuestionAttachmentsRepository()
  inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
    inMemoryAttachmentsRepository,
    inMemoryStudentsRepository,
  )

  sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository)
})
```

## Exemplo: Teste verificando autor e anexos

```typescript
it('should be able to get a question by slug', async () => {
  // 1. Criar e persistir o autor
  const student = makeStudent({ name: 'John Doe' })
  inMemoryStudentsRepository.items.push(student)

  // 2. Criar a pergunta com referência ao autor
  const question = makeQuestion({
    authorId: student.id,
    slug: Slug.create('example-question'),
  })
  inMemoryQuestionsRepository.items.push(question)

  // 3. Criar e persistir o anexo
  const attachment = makeAttachment({ title: 'Some attachment' })
  inMemoryAttachmentsRepository.items.push(attachment)

  // 4. Criar a relação pergunta-anexo
  inMemoryQuestionAttachmentsRepository.items.push(
    makeQuestionAttachment({
      attachmentId: attachment.id,
      questionId: question.id,
    }),
  )

  // 5. Executar o use case
  const result = await sut.execute({
    slug: 'example-question',
  })

  // 6. Verificar campos primitivos E relações
  expect(result.value).toMatchObject({
    question: expect.objectContaining({
      title: question.title,
      author: 'John Doe',
      attachments: [
        expect.objectContaining({
          title: 'Some attachment',
        }),
      ],
    }),
  })
})
```

## Lista de arquivos que precisaram de atualização

Todos estes testes instanciam `InMemoryQuestionsRepository` e precisaram receber as novas dependências:

1. `get-question-by-slug.spec.ts`
2. `choose-question-best-answer.spec.ts`
3. `comment-on-answer.spec.ts` (via `AnswerCommentsRepository` que depende de `StudentsRepository`)
4. `comment-on-question.spec.ts`
5. `create-question.spec.ts`
6. `delete-answer.spec.ts`
7. `delete-question.spec.ts`
8. `edit-answer.spec.ts`
9. `edit-question.spec.ts`
10. `fetch-answer-comments.spec.ts`
11. `fetch-question-answers.spec.ts`
12. `fetch-question-comments.spec.ts`
13. `fetch-recent-questions.spec.ts`
14. `register-student.spec.ts`
15. `upload-and-create-attachment.spec.ts`

## Padrão de cola rápida para cada teste

As duas linhas que o instrutor copiava de teste em teste:

```typescript
// Adicionar estas declarações no topo do describe
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository

// Adicionar no beforeEach
inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
inMemoryStudentsRepository = new InMemoryStudentsRepository()

// Passar no constructor do QuestionsRepository
inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
  inMemoryAttachmentsRepository,
  inMemoryStudentsRepository,
)
```

## Dica VSCode: Autocomplete por iniciais

```
// Ao invés de digitar "InMemoryStudentsRepository" inteiro:
// Digite: inmstudent
// O VSCode oferece: InMemoryStudentsRepository ✓

// Funciona porque o fuzzy match reconhece:
// I-n-M-emory-S-t-u-d-e-n-t-s
// i-n-m-      -s-t-u-d-e-n-t
```