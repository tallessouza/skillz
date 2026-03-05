---
name: rs-node-js-2023-vo-question-details
description: "Enforces Value Object pattern for aggregating multiple entity relationships in DDD applications. Use when user asks to 'create a detail view', 'combine relationships', 'return entity with related data', 'aggregate author and attachments', or 'build a query with joins'. Applies rules: use Details suffix for 2+ relationships, create new repository methods instead of replacing, prefix IDs with entity name, reuse existing entity classes when all fields needed. Make sure to use this skill whenever building read-model Value Objects that combine data from multiple entities. Not for simple entity CRUD, single-relationship Value Objects, or write operations."
---

# Value Object para Detalhes com Multiplos Relacionamentos

> Ao criar Value Objects que agregam dados de multiplos relacionamentos, use o sufixo "Details" e crie novos metodos no repositorio ao inves de substituir os existentes.

## Rules

1. **Use "Details" quando combinar 2+ relacionamentos** — `QuestionDetails` nao `QuestionWithAuthorAndAttachments`, porque semantica perde vantagem quando o nome fica muito longo
2. **Prefixe IDs com o nome da entidade** — `questionId`, `authorId`, nao `id`, porque Value Objects nao pertencem a uma entidade especifica e precisam de contexto
3. **Reuse classes existentes quando todos os campos sao necessarios** — coloque `Attachment[]` direto no VO se precisa de todos os campos, so crie nova estrutura se precisar de um subconjunto
4. **Crie novos metodos no repositorio, nao substitua** — `findDetailsBySlug` ao lado de `findBySlug`, porque listagens nao precisam de dados de anexos
5. **Retorne o Value Object, nao a entidade** — o caso de uso retorna `QuestionDetails`, nao `Question`, porque o VO representa a visao completa para o frontend
6. **No in-memory repository, valide dependencias com throws** — se autor ou anexo nao existir, lance erro explicito, porque isso indica teste mal configurado

## How to write

### Value Object com multiplos relacionamentos

```typescript
// Sufixo "Details" para 2+ relacionamentos
interface QuestionDetailsProps {
  questionId: UniqueEntityID
  authorId: UniqueEntityID
  author: string // nome do autor (dado desnormalizado)
  title: string
  slug: Slug
  content: string
  attachments: Attachment[] // reuso da classe existente
  bestAnswerId?: UniqueEntityID | null
  createdAt: Date
  updatedAt?: Date | null
}

export class QuestionDetails extends ValueObject<QuestionDetailsProps> {
  get questionId() { return this.props.questionId }
  get authorId() { return this.props.authorId }
  get author() { return this.props.author }
  // ... demais getters
  static create(props: QuestionDetailsProps) {
    return new QuestionDetails(props)
  }
}
```

### Novo metodo no repositorio (contrato)

```typescript
// NAO substitui findBySlug — cria metodo novo
export abstract class QuestionsRepository {
  abstract findBySlug(slug: string): Promise<Question | null>
  abstract findDetailsBySlug(slug: string): Promise<QuestionDetails | null>
}
```

### In-memory repository com multiplas dependencias

```typescript
export class InMemoryQuestionsRepository extends QuestionsRepository {
  constructor(
    private questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository,
    private attachmentsRepository: InMemoryAttachmentsRepository,
    private studentsRepository: InMemoryStudentsRepository,
  ) { super() }

  async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
    const question = this.items.find(q => q.slug.value === slug)
    if (!question) return null

    const author = this.studentsRepository.items.find(
      s => s.id.equals(question.authorId)
    )
    if (!author) throw new Error(`Author with ID ${question.authorId} does not exist`)

    const questionAttachments = this.questionAttachmentsRepository.items
      .filter(qa => qa.questionId.equals(question.id))

    const attachments = questionAttachments.map(qa => {
      const attachment = this.attachmentsRepository.items.find(
        a => a.id.equals(qa.attachmentId)
      )
      if (!attachment) throw new Error(`Attachment with ID ${qa.attachmentId} does not exist`)
      return attachment
    })

    return QuestionDetails.create({
      questionId: question.id,
      authorId: question.authorId,
      author: author.name,
      title: question.title,
      slug: question.slug,
      content: question.content,
      bestAnswerId: question.bestAnswerId,
      attachments,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    })
  }
}
```

## Example

**Before (retornando entidade direto):**
```typescript
// Caso de uso retorna Question sem dados relacionados
async execute({ slug }: Request): Promise<Response> {
  const question = await this.questionsRepository.findBySlug(slug)
  return { question } // sem autor, sem anexos
}
```

**After (com Value Object Details):**
```typescript
async execute({ slug }: Request): Promise<Response> {
  const question = await this.questionsRepository.findDetailsBySlug(slug)
  return { question } // QuestionDetails com autor + anexos
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Frontend precisa de dados de 1 relacionamento | Use `WithAuthor` suffix (ex: `CommentWithAuthor`) |
| Frontend precisa de 2+ relacionamentos | Use `Details` suffix (ex: `QuestionDetails`) |
| Rota de listagem | NAO inclua dados de anexos — use metodo simples |
| Rota de detalhe (clique em item) | Use o metodo Details — traz tudo que o frontend precisa |
| Entidade relacionada tem poucos campos e precisa de todos | Reuse a classe direto no VO |
| Entidade relacionada tem 50 campos e precisa de 3 | Crie interface inline no VO |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `QuestionWithAuthorAndAttachments` | `QuestionDetails` |
| Substituir `findBySlug` para retornar Details | Criar `findDetailsBySlug` como metodo separado |
| `id: UniqueEntityID` em Value Object | `questionId: UniqueEntityID` (prefixado) |
| Criar estrutura nova para anexo quando classe existe | `attachments: Attachment[]` (reuso) |
| Retornar `null` silenciosamente quando autor nao existe no teste | `throw new Error('Author with ID ... does not exist')` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
