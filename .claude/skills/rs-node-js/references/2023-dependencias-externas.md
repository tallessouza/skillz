---
name: 2023-dependencias-externas
description: "Applies Dependency Inversion Principle in DDD by defining repository interfaces before implementations, injecting dependencies into use cases, and using fake repositories for testing. Use when user asks to 'abstract database access', 'inject dependencies', 'create repository interface', or 'decouple use case from ORM'. Make sure to use this skill whenever creating use cases that need to interact with external dependencies like databases, APIs, or services. Not for frontend code, HTTP controllers, or infrastructure configuration."
category: coding-lens
tags: [ddd, entities, migrations, prisma, repository, testing]
mind_lenses: [LT_01, LT_02, MF_01, GB_01, TH_04]
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: ddd-architecture
  tags: [ddd, dependency-inversion, repository-pattern, interfaces, testing, clean-architecture]
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

## Troubleshooting

### Resultado inesperado ao aplicar o padrao
**Symptom:** Comportamento nao corresponde ao esperado apos seguir os passos
**Cause:** Dependencias ou configuracoes previas podem estar faltando
**Fix:** Verifique os prerequisites e confirme que todas as versoes estao compativeis

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
