# Code Examples: Caso de Uso — Escolher Melhor Resposta

## Estrutura completa do use case

```typescript
// src/domain/forum/application/use-cases/choose-question-best-answer.ts

interface ChooseQuestionBestAnswerUseCaseRequest {
  answerId: string
  authorId: string
}

interface ChooseQuestionBestAnswerUseCaseResponse {
  question: Question
}

export class ChooseQuestionBestAnswerUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private answersRepository: AnswersRepository,
  ) {}

  async execute({
    answerId,
    authorId,
  }: ChooseQuestionBestAnswerUseCaseRequest): Promise<ChooseQuestionBestAnswerUseCaseResponse> {
    // 1. Buscar a answer pelo ID
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      throw new Error('Answer not found.')
    }

    // 2. Derivar a question a partir da answer (sem pedir questionId)
    const question = await this.questionsRepository.findById(
      answer.questionId.toString(),
    )

    if (!question) {
      throw new Error('Question not found.')
    }

    // 3. Verificar autoridade: só o autor da pergunta pode escolher melhor resposta
    if (question.authorId.toString() !== authorId) {
      throw new Error('Not allowed.')
    }

    // 4. Mutar e persistir
    question.bestAnswerId = answer.id
    await this.questionsRepository.save(question)

    // 5. Retornar entidade modificada
    return { question }
  }
}
```

## Teste completo

```typescript
// src/domain/forum/application/use-cases/choose-question-best-answer.spec.ts

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer'
import { makeQuestion } from 'test/factories/make-question'
import { makeAnswer } from 'test/factories/make-answer'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: ChooseQuestionBestAnswerUseCase

describe('Choose Question Best Answer', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new ChooseQuestionBestAnswerUseCase(
      inMemoryQuestionsRepository,
      inMemoryAnswersRepository,
    )
  })

  it('should be able to choose the question best answer', async () => {
    // Criar question e answer associada
    const question = makeQuestion()
    const answer = makeAnswer({ questionId: question.id })

    // Persistir nos repos in-memory
    await inMemoryQuestionsRepository.create(question)
    await inMemoryAnswersRepository.create(answer)

    // Executar use case com o author correto
    await sut.execute({
      answerId: answer.id.toString(),
      authorId: question.authorId.toString(),
    })

    // Verificar que bestAnswerId foi setado
    expect(inMemoryQuestionsRepository.items[0].bestAnswerId).toEqual(answer.id)
  })

  it('should not be able to choose another user question best answer', async () => {
    // Criar question com author específico
    const question = makeQuestion({
      authorId: new UniqueEntityID('author-1'),
    })
    const answer = makeAnswer({ questionId: question.id })

    await inMemoryQuestionsRepository.create(question)
    await inMemoryAnswersRepository.create(answer)

    // Tentar executar com author diferente → deve falhar
    await expect(
      sut.execute({
        answerId: answer.id.toString(),
        authorId: 'author-2',
      }),
    ).rejects.toThrowError('Not allowed.')
  })
})
```

## Padrão: factory com override de propriedade

```typescript
// A factory makeAnswer aceita overrides parciais
const answer = makeAnswer({ questionId: question.id })
// Isso associa a answer à question específica

// A factory makeQuestion aceita overrides parciais
const question = makeQuestion({ authorId: new UniqueEntityID('author-1') })
// Isso fixa o authorId para testes de permissão
```

## Padrão: verificação no in-memory repo

```typescript
// Acessar diretamente o array interno do repo para assertions
expect(inMemoryQuestionsRepository.items[0].bestAnswerId).toEqual(answer.id)
// Isso verifica que save() foi chamado corretamente
```

## Variação: o mesmo padrão aplicado a outros domínios

```typescript
// Exemplo: marcar pedido como entregue (só o entregador pode)
class MarkOrderAsDeliveredUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private deliveriesRepository: DeliveriesRepository,
  ) {}

  async execute({ deliveryId, courierId }) {
    const delivery = await this.deliveriesRepository.findById(deliveryId)
    if (!delivery) throw new Error('Delivery not found.')

    const order = await this.ordersRepository.findById(
      delivery.orderId.toString(),
    )
    if (!order) throw new Error('Order not found.')

    if (delivery.courierId.toString() !== courierId) {
      throw new Error('Not allowed.')
    }

    order.status = 'delivered'
    order.deliveredAt = new Date()
    await this.ordersRepository.save(order)

    return { order }
  }
}
```