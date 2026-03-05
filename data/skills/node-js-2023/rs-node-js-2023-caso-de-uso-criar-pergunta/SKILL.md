---
name: rs-node-js-2023-criar-pergunta-use-case
description: "Applies DDD use case creation pattern when writing Node.js/TypeScript use cases. Use when user asks to 'create a use case', 'implement a feature', 'add business logic', 'create domain service', or 'implement clean architecture'. Enforces: typed request/response objects, repository contract injection, Value Object wrapping for IDs, object return pattern for extensibility. Make sure to use this skill whenever generating use cases or application layer code in DDD projects. Not for entity creation, infrastructure layer, or controller/route implementation."
---

# Caso de Uso: Padrao de Criacao em DDD

> Todo caso de uso recebe dados primitivos, converte para Value Objects do dominio, persiste via contrato de repositorio, e retorna um objeto tipado — nunca a entidade diretamente.

## Rules

1. **Sempre tipar Request e Response** — crie interfaces `{UseCaseName}UseCaseRequest` e `{UseCaseName}UseCaseResponse`, porque isso documenta o contrato e permite extensao futura
2. **Retorne objeto, nunca a entidade direta** — `return { question }` nao `return question`, porque objetos permitem adicionar informacoes auxiliares sem quebrar consumidores existentes
3. **Converta primitivos para Value Objects na fronteira** — `new UniqueEntityId(authorId)` nao passe string onde o dominio espera Value Object, porque preserva a integridade do dominio
4. **Injete repositorio como contrato (interface)** — o caso de uso depende da interface, nao da implementacao, porque permite trocar persistencia sem tocar na logica de negocio
5. **Delegue comportamento para a entidade** — se a entidade gera slug automaticamente a partir do titulo, nao duplique essa logica no caso de uso, porque a entidade e dona do seu comportamento
6. **Execute metodo async retornando Promise tipada** — `async execute(): Promise<Response>`, porque toda operacao de persistencia e assincrona

## How to write

### Estrutura do caso de uso

```typescript
interface CreateQuestionUseCaseRequest {
  authorId: string
  title: string
  content: string
}

interface CreateQuestionUseCaseResponse {
  question: Question
}

export class CreateQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    authorId,
    title,
    content,
  }: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {
    const question = Question.create({
      authorId: new UniqueEntityId(authorId),
      title,
      content,
    })

    await this.questionsRepository.create(question)

    return { question }
  }
}
```

### Teste unitario com fake repository

```typescript
const fakeQuestionsRepository = new InMemoryQuestionsRepository()
const sut = new CreateQuestionUseCase(fakeQuestionsRepository)

it('should create a question', async () => {
  const { question } = await sut.execute({
    authorId: '1',
    title: 'Nova pergunta',
    content: 'Conteudo da pergunta',
  })

  expect(question.id).toBeTruthy()
})
```

## Example

**Before (retorno direto, sem tipagem):**
```typescript
class CreateQuestionUseCase {
  async execute(authorId: string, title: string, content: string) {
    const question = Question.create({
      authorId, // string direto onde deveria ser UniqueEntityId
      title,
      content,
    })
    await this.repo.create(question)
    return question // retorno direto — impossivel estender sem quebrar
  }
}
```

**After (com este skill aplicado):**
```typescript
interface CreateQuestionUseCaseRequest {
  authorId: string
  title: string
  content: string
}

interface CreateQuestionUseCaseResponse {
  question: Question
}

class CreateQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    authorId,
    title,
    content,
  }: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {
    const question = Question.create({
      authorId: new UniqueEntityId(authorId),
      title,
      content,
    })

    await this.questionsRepository.create(question)

    return { question }
  }
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Caso de uso recebe ID como string | Converta para UniqueEntityId na fronteira do use case |
| Entidade tem comportamento automatico (ex: gerar slug) | Nao passe o campo, deixe a entidade resolver |
| Precisa retornar dado extra alem da entidade | Adicione ao objeto Response sem quebrar consumidores |
| Repositorio ainda nao existe | Crie a interface (contrato) primeiro, implemente depois |
| Teste unitario de caso de uso | Use fake/in-memory repository implementando a interface |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `execute(authorId: string, title: string, ...)` | `execute({ authorId, title, ... }: Request)` |
| `return question` (entidade direta) | `return { question }` (objeto extensivel) |
| `authorId: authorId` (string onde espera VO) | `authorId: new UniqueEntityId(authorId)` |
| `constructor(private repo: PrismaQuestionsRepo)` | `constructor(private repo: QuestionsRepository)` (interface) |
| `question.slug = Slug.create(title)` no use case | Deixe a entidade gerar o slug internamente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
