# Code Examples: Comunicacao entre Camadas

## 1. Transformando interface em abstract class

**Antes (interface — nao funciona com DI do Nest):**
```typescript
export interface QuestionsRepository {
  create(question: Question): Promise<void>
  findBySlug(slug: string): Promise<Question | null>
}
```

**Depois (abstract class — funciona com DI do Nest):**
```typescript
export abstract class QuestionsRepository {
  abstract create(question: Question): Promise<void>
  abstract findBySlug(slug: string): Promise<Question | null>
}
```

A mudanca e minima: `interface` → `abstract class`, e cada metodo ganha `abstract` na frente.

## 2. Use case com @Injectable

```typescript
import { Injectable } from '@nestjs/common'
import { QuestionsRepository } from '../repositories/questions-repository'
import { Question } from '../../enterprise/entities/question'

@Injectable()
export class CreateQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({ title, content, authorId, attachmentsIds }: CreateQuestionRequest) {
    const question = Question.create({
      title,
      content,
      authorId: new UniqueEntityID(authorId),
      attachments: new QuestionAttachmentList([]),
    })

    await this.questionsRepository.create(question)

    return { question }
  }
}
```

## 3. Controller usando use case ao inves de Prisma

**Antes (acoplado ao Prisma):**
```typescript
@Controller('/questions')
export class CreateQuestionController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  async handle(@Body(bodyValidationPipe) body: CreateQuestionBody, @CurrentUser() user: UserPayload) {
    const { title, content } = body
    const userId = user.sub
    const slug = this.convertToSlug(title)

    await this.prisma.question.create({
      data: { title, content, slug, authorId: userId },
    })
  }

  private convertToSlug(title: string): string {
    // ...
  }
}
```

**Depois (desacoplado, usando use case):**
```typescript
@Controller('/questions')
export class CreateQuestionController {
  constructor(private createQuestion: CreateQuestionUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(@Body(bodyValidationPipe) body: CreateQuestionBody, @CurrentUser() user: UserPayload) {
    const { title, content } = body
    const userId = user.sub

    await this.createQuestion.execute({
      title,
      content,
      authorId: userId,
      attachmentsIds: [],
    })
  }
}
```

Note que o metodo `convertToSlug` e a dependencia do Prisma desaparecem — o use case cuida de tudo.

## 4. Database module com provide/useClass

```typescript
@Module({
  providers: [
    PrismaService,
    {
      provide: QuestionsRepository,
      useClass: PrismaQuestionsRepository,
    },
  ],
  exports: [QuestionsRepository],
})
export class DatabaseModule {}
```

**Detalhe critico:** No `exports`, exporte `QuestionsRepository` (a classe abstrata), NAO `PrismaQuestionsRepository`. Quando voce muda para o formato `provide/useClass`, o export tambem precisa mudar.

## 5. HTTP module registrando o use case

```typescript
@Module({
  imports: [DatabaseModule],
  controllers: [CreateQuestionController],
  providers: [CreateQuestionUseCase],
})
export class HttpModule {}
```

O use case PRECISA estar nos providers para que o Nest saiba que pode injeta-lo no controller.

## 6. Alternativa wrapper (NAO RECOMENDADA — apenas referencia)

```typescript
import { Injectable } from '@nestjs/common'
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'

@Injectable()
export class NestCreateQuestionUseCase extends CreateQuestionUseCase {
  constructor(questionsRepository: QuestionsRepository) {
    super(questionsRepository)
  }
}
```

**Problema:** Nao use `private` no parametro do construtor (causa erro "incorrectly they have separate declarations of a private property"). E voce precisaria de um arquivo desse para CADA use case.

## 7. Erros comuns e solucoes

**Erro: "Nest can't resolve dependencies of CreateQuestionUseCase"**
- Causa: O repositorio que o use case depende nao esta disponivel no modulo
- Solucao: Verificar que o DatabaseModule esta importado e usa `provide/useClass`

**Erro: Interface desaparece no runtime**
- Causa: Interfaces TypeScript nao existem em JavaScript
- Solucao: Trocar `interface` por `abstract class`

**Erro: Provider nao encontrado apos mudar para provide/useClass**
- Causa: O `exports` ainda referencia a classe concreta
- Solucao: Mudar exports para a classe abstrata (`QuestionsRepository`)