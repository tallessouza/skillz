# Code Examples: Gerando Dados Fictícios

## Instalação

```bash
npm i -D @faker-js/faker
```

## Factory completa de Question

```typescript
import { faker } from '@faker-js/faker'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Question,
  QuestionProps,
} from '@/domain/forum/enterprise/entities/question'

export function makeQuestion(
  override: Partial<QuestionProps> = {},
  id?: UniqueEntityId,
) {
  const question = Question.create(
    {
      title: faker.lorem.sentence(),
      content: faker.lorem.text(),
      authorId: new UniqueEntityId(),
      ...override,
    },
    id,
  )

  return question
}
```

## Uso no teste — com override de slug

```typescript
it('should create a question', async () => {
  const question = makeQuestion({
    slug: Slug.create('pergunta-teste'),
  })

  // title e content são aleatórios via faker
  // slug é controlada pelo teste
  console.log(question)
})
```

## Uso no teste — com id específico

```typescript
it('should find question by id', async () => {
  const questionId = new UniqueEntityId('question-1')
  const question = makeQuestion({}, questionId)

  await repository.create(question)

  const found = await sut.execute({ questionId: 'question-1' })
  expect(found.question.id).toEqual(questionId)
})
```

## Saída do console.log (exemplo do instrutor)

```
{
  title: 'Voluptatem quia rerum assumenda',  // sentença lorem aleatória
  content: 'Dolor sit amet consectetur...\nAdipisicing elit sed do...',  // texto maior com quebras
  slug: 'pergunta-teste',  // fixo via override
  authorId: UniqueEntityId { value: '...' }
}
```

## Padrão aplicado a outras entidades

### Factory de Answer

```typescript
import { faker } from '@faker-js/faker'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Answer, AnswerProps } from '@/domain/forum/enterprise/entities/answer'

export function makeAnswer(
  override: Partial<AnswerProps> = {},
  id?: UniqueEntityId,
) {
  const answer = Answer.create(
    {
      content: faker.lorem.text(),
      authorId: new UniqueEntityId(),
      questionId: new UniqueEntityId(),
      ...override,
    },
    id,
  )

  return answer
}
```

## Geradores faker úteis para domínios comuns

```typescript
// Pessoas
faker.person.fullName()      // 'John Smith'
faker.person.firstName()     // 'John'

// Internet
faker.internet.email()       // 'john@example.com'
faker.internet.url()         // 'https://example.com'
faker.internet.userName()    // 'john_smith42'

// Textos
faker.lorem.sentence()       // ~10 palavras
faker.lorem.paragraph()      // ~3 sentenças
faker.lorem.text()           // texto longo

// Números
faker.number.int({ min: 1, max: 100 })

// Datas
faker.date.recent()
faker.date.past()
```