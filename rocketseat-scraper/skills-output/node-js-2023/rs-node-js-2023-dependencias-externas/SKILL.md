---
name: rs-node-js-2023-dependencias-externas
description: "Enforces repository pattern contracts when implementing DDD use cases in Node.js/TypeScript. Use when user asks to 'create a use case', 'implement repository', 'add persistence layer', 'connect domain to database', or 'apply DDD patterns'. Applies interface-first design, fake repositories for testing, and dependency inversion between domain and infrastructure. Make sure to use this skill whenever creating use cases that need persistence or external dependencies. Not for ORM configuration, database migrations, or actual database implementation."
---

# Dependencias Externas no DDD

> Defina contratos (interfaces) para dependencias externas antes de implementar — o dominio nunca conhece a infraestrutura concreta.

## Rules

1. **Crie interfaces antes de implementacoes** — `AnswersRepository` como interface, nao classe concreta, porque o dominio nao pode depender de detalhes de persistencia
2. **Use cases recebem repositorios por injecao** — passe o repositorio no construtor do use case, porque isso permite trocar a implementacao sem alterar o dominio
3. **Repositorio nao e mapping direto de tabela** — um repositorio pode agregar multiplas tabelas, APIs ou fontes de dados, porque o conceito de persistencia e abstrato no dominio
4. **Testes usam fake repositories** — crie objetos simples que implementam a interface, porque testes de dominio nao devem depender de banco de dados
5. **Metodos do repositorio retornam Promise** — mesmo que a implementacao fake seja sincrona, use `async`, porque a implementacao real sera assincrona
6. **Identifique dependencias conforme cria use cases** — nao tente mapear todas as dependencias antecipadamente, porque elas emergem naturalmente durante o desenvolvimento

## How to write

### Interface do repositorio

```typescript
// src/domain/forum/application/repositories/answers-repository.ts
export interface AnswersRepository {
  create(answer: Answer): Promise<void>
}
```

### Use case com dependencia injetada

```typescript
export class AnswerQuestionUseCase {
  constructor(private answersRepository: AnswersRepository) {}

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

### Fake repository para testes

```typescript
const fakeAnswersRepository: AnswersRepository = {
  create: async () => {},
}

const sut = new AnswerQuestionUseCase(fakeAnswersRepository)
```

## Example

**Before (use case acoplado a persistencia):**
```typescript
import { PrismaClient } from '@prisma/client'

export class AnswerQuestionUseCase {
  private prisma = new PrismaClient()

  async execute(data: AnswerQuestionRequest) {
    const answer = new Answer(data)
    await this.prisma.answer.create({ data: answer })
    return answer
  }
}
```

**After (com inversao de dependencia):**
```typescript
export class AnswerQuestionUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute(data: AnswerQuestionRequest) {
    const answer = new Answer(data)
    await this.answersRepository.create(answer)
    return answer
  }
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Use case precisa salvar/buscar dados | Crie uma interface de repositorio |
| Use case precisa chamar API externa | Crie uma interface de gateway/client |
| Escrevendo teste de use case | Crie fake que implementa a interface |
| Nao sabe ainda qual banco vai usar | Perfeito — defina so o contrato |
| Repositorio ficou com muitos metodos | Avalie se o agregado esta grande demais |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `import { PrismaClient }` dentro do use case | `constructor(private repo: AnswersRepository)` |
| `new Database()` dentro do dominio | Interface + injecao de dependencia |
| Teste que conecta em banco real | Fake repository que implementa a interface |
| Repositorio com 1 metodo por tabela SQL | Repositorio por agregado do dominio |
| `any` no tipo do repositorio | Interface tipada com entidades do dominio |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
