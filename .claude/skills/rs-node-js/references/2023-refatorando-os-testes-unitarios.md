---
name: rs-node-js-2023-refatorando-testes-unitarios
description: "Enforces in-memory repository pattern and test structure conventions when writing unit tests in Node.js/TypeScript. Use when user asks to 'write tests', 'create unit tests', 'refactor tests', 'test a use case', or 'implement repository for testing'. Applies rules: extract fake repos into InMemory classes, use describe/it/beforeEach structure, name main instance as SUT (System Under Test), assert against repository state. Make sure to use this skill whenever creating or refactoring unit tests for use cases with repository dependencies. Not for integration tests, E2E tests, or database testing."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: in-memory-repository-tests
  tags: [in-memory-repository, unit-test, sut, describe, beforeEach, vitest, test-structure]
---

# Refatorando Testes Unitarios com In-Memory Repositories

> Testes unitarios usam repositorios in-memory como classes dedicadas, estruturados com describe/beforeEach/SUT para maxima reusabilidade e clareza.

## Rules

1. **Extraia fake repositories para classes InMemory** — `InMemoryQuestionsRepository` nao uma variavel inline, porque classes sao reutilizaveis entre multiplos testes e implementam a interface real do repositorio
2. **Implemente a interface do repositorio** — `implements QuestionsRepository`, porque garante que o fake respeita o contrato e quebra se a interface mudar
3. **Use array interno como storage** — `public items: Question[] = []` e `this.items.push()` no create, porque simula uma tabela de banco de dados de forma deterministica
4. **Organize com describe/it/beforeEach** — categorize testes por use case, inicialize dependencias no beforeEach, porque isola estado entre testes
5. **Nomeie a instancia principal como SUT** — `const sut = new CreateQuestionUseCase(repository)`, porque facilita copiar/colar entre arquivos de teste sem renomear variaveis
6. **Valide o estado do repositorio** — alem de checar o retorno, verifique `repository.items[0].id`, porque confirma que o dado foi realmente persistido

## How to write

### InMemory Repository

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

### Estrutura do teste com SUT

```typescript
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

## Example

**Before (inline fake, sem estrutura):**
```typescript
test('create question', async () => {
  const questions: Question[] = []
  const fakeRepo = { create: async (q: Question) => { questions.push(q) } }
  const useCase = new CreateQuestionUseCase(fakeRepo)

  const result = await useCase.execute({ title: 'Test', content: 'Content', authorId: '1' })
  expect(result.question).toBeTruthy()
})
```

**After (InMemory class, describe/SUT/beforeEach):**
```typescript
describe('CreateQuestion', () => {
  let repository: InMemoryQuestionsRepository
  let sut: CreateQuestionUseCase

  beforeEach(() => {
    repository = new InMemoryQuestionsRepository()
    sut = new CreateQuestionUseCase(repository)
  })

  it('should be able to create a question', async () => {
    const { question } = await sut.execute({
      title: 'Test',
      content: 'Content',
      authorId: '1',
    })

    expect(question.id).toBeTruthy()
    expect(repository.items[0].id).toEqual(question.id)
  })
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Use case depende de repositorio | Crie classe InMemory que implementa a interface |
| Multiplos testes no mesmo arquivo | Use beforeEach para instanciar repository + SUT |
| Copiar teste para outro use case | Troque apenas o tipo do SUT e do repository — nome `sut` nao muda |
| Precisa validar persistencia | Acesse `repository.items[0]` alem de checar o retorno |
| Novo metodo no repositorio | Adicione na interface primeiro, depois implemente no InMemory |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `const questions: Question[] = []` inline no teste | `class InMemoryQuestionsRepository` em arquivo dedicado |
| `const useCase = new CreateQuestionUseCase(...)` dentro do `it` | `let sut` + inicializacao no `beforeEach` |
| `const createQuestion = new CreateQuestionUseCase(...)` | `const sut = new CreateQuestionUseCase(...)` |
| `test('create question', ...)` sem describe | `describe('CreateQuestion', () => { it('should...') })` |
| `expect(result).toBeTruthy()` apenas | `expect(repository.items[0].id).toEqual(result.id)` tambem |

## Troubleshooting

### InMemoryRepository nao implementa novo metodo da interface
**Symptom:** TypeScript erro "Class 'InMemoryQuestionsRepository' incorrectly implements interface 'QuestionsRepository'"
**Cause:** A interface do repositorio foi atualizada com um novo metodo, mas o InMemory repository nao o implementa
**Fix:** Adicione o metodo faltante na classe InMemory. Se o teste nao usa esse metodo, implemente com retorno minimo (ex: `throw new Error('Not implemented')`)

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
