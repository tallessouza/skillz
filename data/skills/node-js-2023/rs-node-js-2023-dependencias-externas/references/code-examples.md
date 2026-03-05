# Code Examples: Dependencias Externas no DDD

## 1. Interface do Repositorio

```typescript
// src/domain/forum/application/repositories/answers-repository.ts
export interface AnswersRepository {
  create(answer: Answer): Promise<void>
}
```

Pontos-chave:
- E uma `interface`, nao uma `class`
- Recebe a entidade do dominio (`Answer`), nao um DTO ou objeto generico
- Retorna `Promise<void>` — operacao assincrona sem retorno

## 2. Use Case com Dependencia Injetada

```typescript
export class AnswerQuestionUseCase {
  private answersRepository: AnswersRepository

  constructor(answersRepository: AnswersRepository) {
    this.answersRepository = answersRepository
  }

  async execute({ instructorId, questionId, content }: AnswerQuestionRequest) {
    const answer = new Answer({
      content,
      authorId: new UniqueEntityID(instructorId),
      questionId: new UniqueEntityID(questionId),
    })

    await this.answersRepository.create(answer)

    return answer
  }
}
```

O `await` e essencial — sem ele, erros de persistencia nao seriam capturados.

## 3. Fake Repository para Testes

### Versao minima (objeto literal)

```typescript
const fakeAnswersRepository: AnswersRepository = {
  create: async () => {},
}
```

### Versao com armazenamento em memoria (evolucao natural)

```typescript
class InMemoryAnswersRepository implements AnswersRepository {
  public items: Answer[] = []

  async create(answer: Answer): Promise<void> {
    this.items.push(answer)
  }
}
```

Esta versao permite verificar nos testes se a answer foi realmente salva:

```typescript
const repository = new InMemoryAnswersRepository()
const sut = new AnswerQuestionUseCase(repository)

await sut.execute({
  instructorId: '1',
  questionId: '1',
  content: 'Nova resposta',
})

expect(repository.items).toHaveLength(1)
expect(repository.items[0].content).toBe('Nova resposta')
```

## 4. Configuracao de Scripts de Teste

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

- `npm test` — executa todos os testes uma vez
- `npm run test:watch` — modo watch, re-executa ao detectar mudancas

## 5. Exemplo de Evolucao: Outros Repositorios

Conforme novos use cases surgem, novos repositorios emergem:

```typescript
export interface QuestionsRepository {
  findById(id: string): Promise<Question | null>
  save(question: Question): Promise<void>
  delete(question: Question): Promise<void>
}
```

```typescript
export interface StudentsRepository {
  findByEmail(email: string): Promise<Student | null>
  create(student: Student): Promise<void>
}
```

Cada repositorio define apenas os metodos que os use cases precisam — nao um CRUD generico.