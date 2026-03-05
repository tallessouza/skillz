---
name: rs-node-js-2023-fetch-question-answers
description: "Applies DDD use case pattern for listing related entities with pagination when writing Node.js backend code. Use when user asks to 'list answers', 'fetch related items', 'create a use case with pagination', 'list child entities', or 'implement findManyBy repository method'. Enforces repository method signature conventions: first param is the foreign key, second is a config object for pagination/filters. Make sure to use this skill whenever creating use cases that list related entities with pagination in Clean Architecture. Not for creating entities, editing, deleting, or authentication use cases."
---

# Caso de Uso: Listar Entidades Relacionadas com Paginacao

> Ao criar um caso de uso que lista entidades filhas de uma entidade pai, siga o padrao: repositorio com findManyBy + foreign key, paginacao via objeto de configuracao, e testes cobrindo listagem basica e paginacao.

## Rules

1. **Nomeie o caso de uso pelo que ele busca** — `FetchQuestionAnswers`, `FetchCourseStudents`, porque o nome descreve exatamente a relacao pai-filho sendo consultada
2. **Primeiro parametro do repositorio e o foreign key, segundo e o objeto de config** — `findManyByQuestionId(questionId, { page })` nao `findManyByQuestionId({ questionId, page })`, porque o foreign key ja esta no nome do metodo e nao e metadata
3. **Objeto de configuracao e para metadata** — paginacao, filtros, ordenacao vao dentro do objeto, porque sao configuracoes da query, nao identificadores
4. **Reuse o padrao de paginacao existente** — use `PaginationParams` compartilhado, porque evita duplicacao entre casos de uso semelhantes
5. **Testes cobrem dois cenarios obrigatorios** — listagem basica (pagina 1) e paginacao (pagina 2), porque valida tanto o filtro quanto o slice

## How to write

### Caso de uso

```typescript
interface FetchQuestionAnswersRequest {
  questionId: string
  page: number
}

interface FetchQuestionAnswersResponse {
  answers: Answer[]
}

export class FetchQuestionAnswersUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    questionId,
    page,
  }: FetchQuestionAnswersRequest): Promise<FetchQuestionAnswersResponse> {
    const answers = await this.answersRepository.findManyByQuestionId(
      questionId,
      { page },
    )

    return { answers }
  }
}
```

### Metodo do repositorio (interface)

```typescript
export abstract class AnswersRepository {
  abstract findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<Answer[]>
}
```

### Implementacao in-memory

```typescript
async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
  const answers = this.items
    .filter((item) => item.questionId.toString() === questionId)
    .slice((page - 1) * 20, page * 20)

  return answers
}
```

## Example

**Before (parametros misturados no objeto):**
```typescript
// foreign key dentro do objeto de config — ERRADO
findManyByQuestionId({ questionId, page })
```

**After (foreign key separado do objeto de config):**
```typescript
// foreign key como primeiro param, config como segundo
findManyByQuestionId(questionId, { page })
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Listando entidades filhas de uma pai | `findManyBy{ParentEntity}Id(parentId, { page })` |
| Nao precisa de ordenacao customizada | Nao passe `createdAt` nas factories de teste |
| Caso de uso muito parecido com outro existente | Copie e adapte (repository, entity, nomes) |
| Quer pular um teste temporariamente | Use `.skip` no `it`, nao comente o bloco |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `findManyByQuestionId({ questionId, page })` | `findManyByQuestionId(questionId, { page })` |
| `findByTopicId` quando e questionId | `findManyByQuestionId` — use o nome correto da relacao |
| Teste sem cenario de paginacao | Sempre teste pagina 1 (basico) e pagina 2 (paginado) |
| Factory de teste com dados desnecessarios | Passe apenas o que o teste exige (ex: `questionId`) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
