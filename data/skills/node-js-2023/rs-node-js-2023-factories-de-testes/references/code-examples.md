# Code Examples: Factories de Testes

## Exemplo 1: Factory basica (como mostrado na aula)

```typescript
// test/factories/make-question.ts
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Question,
  QuestionProps,
} from '@/domain/forum/enterprise/entities/question'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'

export function makeQuestion(
  override: Partial<QuestionProps> = {},
  id?: UniqueEntityID,
) {
  const question = Question.create(
    {
      authorId: new UniqueEntityID(),
      title: 'Example Question',
      slug: Slug.create('example-question'),
      content: 'Example content',
      ...override,
    },
    id,
  )

  return question
}
```

**Pontos-chave:**
- `QuestionProps` precisa ser exportado da entidade Question
- `override` tem tipo `Partial<QuestionProps>` — todas as props opcionais
- Default e `{}` (objeto vazio) — se nada for passado, usa todos os defaults
- `...override` vem POR ULTIMO no spread para sobrescrever defaults
- `id` como segundo argumento opcional permite forcar um ID especifico

## Exemplo 2: Uso no teste de get-question-by-slug

```typescript
// Antes da factory
it('should be able to get a question by slug', async () => {
  const newQuestion = Question.create({
    authorId: new UniqueEntityID(),
    title: 'Example Question',
    slug: Slug.create('example-question'),
    content: 'Example content',
  })

  await questionsRepository.create(newQuestion)

  const result = await sut.execute({
    slug: 'example-question',
  })

  expect(result.value?.question.id).toBeTruthy()
})

// Depois da factory
it('should be able to get a question by slug', async () => {
  const newQuestion = makeQuestion({
    slug: Slug.create('example-question'),
  })

  await questionsRepository.create(newQuestion)

  const result = await sut.execute({
    slug: 'example-question',
  })

  expect(result.value?.question.id).toBeTruthy()
})
```

**O que mudou:**
- Removeu importacoes de `Question`, `UniqueEntityID`, `Slug` (do contexto de criacao)
- Unico campo explicito e `slug` — porque e o que o teste valida
- `title` e `content` usam defaults da factory — irrelevantes para este teste

## Exemplo 3: Criacao em massa para paginacao

```typescript
it('should return paginated questions', async () => {
  for (let i = 0; i < 22; i++) {
    await questionsRepository.create(makeQuestion())
  }

  const result = await sut.execute({ page: 2 })

  // Pagina 2 com 20 por pagina = 2 resultados
  expect(result.value?.questions).toHaveLength(2)
})
```

**Sem factory, isso seria 22 blocos de `Question.create({...})` copiados.**

## Exemplo 4: Override de multiplos campos

```typescript
const authorId = new UniqueEntityID('author-1')

const question = makeQuestion({
  authorId,
  title: 'Specific Title',
  content: 'Specific content for this test',
})
```

## Exemplo 5: Forcando um ID especifico

```typescript
const questionId = new UniqueEntityID('question-1')
const question = makeQuestion({}, questionId)

expect(question.id.toString()).toBe('question-1')
```

## Exemplo 6: Aplicando o mesmo padrao para Answer

```typescript
// test/factories/make-answer.ts
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Answer, AnswerProps } from '@/domain/forum/enterprise/entities/answer'

export function makeAnswer(
  override: Partial<AnswerProps> = {},
  id?: UniqueEntityID,
) {
  const answer = Answer.create(
    {
      authorId: new UniqueEntityID(),
      questionId: new UniqueEntityID(),
      content: 'Example answer content',
      ...override,
    },
    id,
  )

  return answer
}
```