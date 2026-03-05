---
name: rs-node-2023-listando-comentarios-autor
description: "Enforces repository pattern for returning related entity data (e.g., comments with author) in Clean Architecture with NestJS. Use when user asks to 'return related data', 'join entities in repository', 'list with author', 'fetch with details', or 'add relationship to query'. Applies rules: create new method instead of modifying existing, use value objects for composed returns, inject InMemory repositories directly for test access. Make sure to use this skill whenever implementing repository methods that need cross-entity data in Clean Architecture. Not for database queries, ORM configuration, or controller implementation."
---

# Listando Dados com Relacionamentos no Repositório

> Quando um repositório precisa retornar dados de entidades relacionadas, crie um novo método que retorna um Value Object composto, nunca modifique o método existente.

## Rules

1. **Crie novo método, não modifique o existente** — `findManyByQuestionIdWithAuthor` ao lado de `findManyByQuestionId`, porque o método original serve para operações internas (editar, deletar) que não precisam dos dados relacionados
2. **Nomes semânticos mesmo que longos** — `findManyByQuestionIdWithAuthor` é melhor que `findManyByQuestionId2`, porque a pessoa entende exatamente o que o método faz ao bater o olho
3. **Use `WithDetails` quando houver múltiplos relacionamentos** — se precisa author + likes + outros, use `findManyByQuestionIdWithDetails` ao invés de encadear `WithAuthorAndLikesAnd...`
4. **Retorne Value Objects, não entidades** — o método composto retorna `CommentWithAuthor[]`, não `QuestionComment[]`, porque o retorno tem forma diferente da entidade
5. **No InMemory, tipe dependências como InMemory diretamente** — use `InMemoryStudentsRepository` ao invés de `StudentsRepository` (contrato), porque você precisa acessar `.items` para fazer buscas por propriedades que não existem no contrato
6. **Valide existência do relacionamento com erro explícito** — lance erro com mensagem descritiva (`Student with ID ${id} does not exist`) para facilitar debugging nos testes

## How to write

### Novo método no contrato do repositório

```typescript
// Mantém o método original intocado
export abstract class QuestionCommentsRepository {
  abstract findManyByQuestionId(questionId: string, params: PaginationParams): Promise<QuestionComment[]>

  // Novo método para retorno composto
  abstract findManyByQuestionIdWithAuthor(questionId: string, params: PaginationParams): Promise<CommentWithAuthor[]>
}
```

### Implementação InMemory com injeção de repositório relacionado

```typescript
export class InMemoryQuestionCommentsRepository implements QuestionCommentsRepository {
  public items: QuestionComment[] = []

  constructor(
    private studentsRepository: InMemoryStudentsRepository, // InMemory direto, não o contrato
  ) {}

  async findManyByQuestionIdWithAuthor(questionId: string, { page }: PaginationParams) {
    const questionComments = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)
      .map((comment) => {
        const author = this.studentsRepository.items.find((student) =>
          student.id.equals(comment.authorId),
        )

        if (!author) {
          throw new Error(`Author with ID ${comment.authorId.toString()} does not exist.`)
        }

        return CommentWithAuthor.create({
          commentId: comment.id,
          content: comment.content,
          authorId: comment.authorId,
          author: author.name,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
        })
      })

    return questionComments
  }
}
```

### Teste com autor associado

```typescript
let studentsRepository: InMemoryStudentsRepository
let questionCommentsRepository: InMemoryQuestionCommentsRepository

beforeEach(() => {
  studentsRepository = new InMemoryStudentsRepository()
  questionCommentsRepository = new InMemoryQuestionCommentsRepository(studentsRepository)
})

it('should list comments with author', async () => {
  const student = makeStudent({ name: 'John Doe' })
  studentsRepository.items.push(student)

  const comment1 = makeQuestionComment({ questionId: question.id, authorId: student.id })
  questionCommentsRepository.items.push(comment1)

  const result = await sut.execute({ questionId: question.id.toString(), page: 1 })

  expect(result.value.comments).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ author: 'John Doe', commentId: comment1.id }),
    ]),
  )
})
```

## Heuristics

| Situação | Faça |
|----------|------|
| Método só precisa da entidade pura (delete, edit) | Mantenha o método original sem relacionamentos |
| Listagem precisa de 1 relacionamento | `WithAuthor`, `WithCategory` — nome específico |
| Listagem precisa de 3+ relacionamentos | `WithDetails` — nome genérico |
| InMemory precisa buscar por ID em outro repositório | Injete o InMemory concreto para acessar `.items` |
| Teste quebra com "does not exist" | Crie e insira a entidade relacionada antes do teste |
| Novo repositório InMemory ganha dependência | Atualize TODOS os testes que instanciam esse repositório |

## Anti-patterns

| Nunca faça | Faça assim |
|------------|------------|
| Modificar `findManyByQuestionId` para incluir autor | Criar `findManyByQuestionIdWithAuthor` separado |
| Retornar `QuestionComment[]` com dados extras | Retornar `CommentWithAuthor[]` (Value Object) |
| `private studentsRepository: StudentsRepository` no InMemory | `private studentsRepository: InMemoryStudentsRepository` |
| Criar método `findById` no contrato só para uso interno do InMemory | Acessar `.items.find()` diretamente |
| Ignorar autor inexistente silenciosamente | `throw new Error(...)` com mensagem descritiva |
| Criar comentários em testes sem autor associado | Sempre criar e inserir o student antes |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-listando-comentarios-com-autor/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-listando-comentarios-com-autor/references/code-examples.md)
