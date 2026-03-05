# Code Examples: Refatorando Testes Unitarios com In-Memory Repositories

## InMemoryQuestionsRepository completo

```typescript
// test/repositories/in-memory-questions-repository.ts
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = []

  async create(question: Question) {
    this.items.push(question)
  }
}
```

**Nota:** O `items` é `public` propositalmente — nos testes, precisamos acessar diretamente para fazer assertions.

## InMemoryAnswersRepository completo

```typescript
// test/repositories/in-memory-answers-repository.ts
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

export class InMemoryAnswersRepository implements AnswersRepository {
  public items: Answer[] = []

  async create(answer: Answer) {
    this.items.push(answer)
  }
}
```

**Padrao:** Mesma estrutura do Questions — troca `Question` por `Answer` e `QuestionsRepository` por `AnswersRepository`.

## Teste CreateQuestion refatorado

```typescript
// src/domain/forum/application/use-cases/create-question.spec.ts
import { CreateQuestionUseCase } from './create-question'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

describe('CreateQuestion', () => {
  let repository: InMemoryQuestionsRepository
  let sut: CreateQuestionUseCase

  beforeEach(() => {
    repository = new InMemoryQuestionsRepository()
    sut = new CreateQuestionUseCase(repository)
  })

  it('should be able to create a question', async () => {
    const { question } = await sut.execute({
      title: 'Nova pergunta',
      content: 'Conteudo da pergunta',
      authorId: '1',
    })

    expect(question.id).toBeTruthy()
    expect(repository.items[0].id).toEqual(question.id)
  })
})
```

## Teste AnswerQuestion refatorado

```typescript
// src/domain/forum/application/use-cases/answer-question.spec.ts
import { AnswerQuestionUseCase } from './answer-question'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

describe('AnswerQuestion', () => {
  let repository: InMemoryAnswersRepository
  let sut: AnswerQuestionUseCase

  beforeEach(() => {
    repository = new InMemoryAnswersRepository()
    sut = new AnswerQuestionUseCase(repository)
  })

  it('should be able to create an answer', async () => {
    const { answer } = await sut.execute({
      questionId: '1',
      instructorId: '1',
      content: 'Conteudo da resposta',
    })

    expect(answer.id).toBeTruthy()
    expect(repository.items[0].id).toEqual(answer.id)
  })
})
```

**Observe:** A estrutura é identica ao teste de CreateQuestion. Só mudaram os tipos e os parametros do `execute()`. O nome `sut` e `repository` permaneceram iguais.

## Variacao: Quando o repositorio precisa de mais metodos

Conforme o projeto evolui, o InMemory ganha mais metodos:

```typescript
export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = []

  async create(question: Question) {
    this.items.push(question)
  }

  async findById(id: string) {
    const question = this.items.find((item) => item.id.toString() === id)
    return question ?? null
  }

  async delete(question: Question) {
    const index = this.items.findIndex((item) => item.id === question.id)
    this.items.splice(index, 1)
  }

  async save(question: Question) {
    const index = this.items.findIndex((item) => item.id === question.id)
    this.items[index] = question
  }
}
```

Cada metodo simula a operacao de banco com operacoes simples de array. `find` para busca, `splice` para delete, substituicao por index para update.