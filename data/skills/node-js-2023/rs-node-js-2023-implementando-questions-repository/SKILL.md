---
name: rs-node-js-2023-prisma-repository
description: "Enforces Prisma repository implementation patterns with mappers, pagination, and CRUD operations in Clean Architecture NestJS projects. Use when user asks to 'implement repository', 'create prisma repository', 'add pagination', 'map entity to prisma', or 'implement CRUD with prisma'. Applies bidirectional mapper pattern (toDomain/toPrisma), skip/take pagination, and UncheckedCreateInput typing. Make sure to use this skill whenever implementing persistence layer with Prisma in DDD/Clean Architecture. Not for in-memory repositories, raw SQL queries, or Prisma schema design."
---

# Implementando Repositories Prisma com Clean Architecture

> Repositories Prisma convertem entre dominio e persistencia usando mappers bidirecionais, nunca expondo detalhes do Prisma para as camadas superiores.

## Rules

1. **Mapper bidirecional obrigatorio** — todo repository Prisma precisa de `toDomain()` e `toPrisma()` no mapper, porque a conversao manual dentro do repository viola separacao de responsabilidades
2. **Use UncheckedCreateInput para criacao** — `Prisma.QuestionUncheckedCreateInput` ao inves de `QuestionCreateInput`, porque campos como `id` nao sao obrigatorios na criacao e a tipagem reflete isso
3. **Value objects exigem .value ou .toString()** — `slug.value`, `id.toString()`, porque o Prisma nao entende value objects do dominio
4. **Paginacao com take/skip** — `take: 20, skip: (page - 1) * 20`, porque e o padrao do Prisma para offset pagination
5. **Ordenacao explicita em listagens** — sempre inclua `orderBy` com direcao explicita (`desc`/`asc`), porque sem ordenacao o resultado e indeterminado
6. **Map com mapper estatico** — use `items.map(PrismaQuestionMapper.toDomain)` passando a funcao diretamente, porque e mais conciso que `items.map(item => mapper.toDomain(item))`

## How to write

### Mapper bidirecional

```typescript
import { Question as PrismaQuestion, Prisma } from '@prisma/client'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'

export class PrismaQuestionMapper {
  static toDomain(raw: PrismaQuestion): Question {
    return Question.create(
      {
        title: raw.title,
        content: raw.content,
        slug: Slug.create(raw.slug),
        authorId: new UniqueEntityID(raw.authorId),
        bestAnswerId: raw.bestAnswerId
          ? new UniqueEntityID(raw.bestAnswerId)
          : null,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    question: Question,
  ): Prisma.QuestionUncheckedCreateInput {
    return {
      id: question.id.toString(),
      authorId: question.authorId.toString(),
      bestAnswerId: question.bestAnswerId?.toString(),
      title: question.title,
      content: question.content,
      slug: question.slug.value,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    }
  }
}
```

### Repository com CRUD completo

```typescript
@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(private prisma: PrismaService) {}

  async findBySlug(slug: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: { slug },
    })
    if (!question) return null
    return PrismaQuestionMapper.toDomain(question)
  }

  async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    const questions = await this.prisma.question.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      skip: (page - 1) * 20,
    })
    return questions.map(PrismaQuestionMapper.toDomain)
  }

  async create(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question)
    await this.prisma.question.create({ data })
  }

  async save(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question)
    await this.prisma.question.update({
      where: { id: data.id },
      data,
    })
  }

  async delete(question: Question): Promise<void> {
    await this.prisma.question.delete({
      where: { id: question.id.toString() },
    })
  }
}
```

## Example

**Before (conversao manual no repository):**
```typescript
async create(question: Question): Promise<void> {
  await this.prisma.question.create({
    data: {
      id: question.id.toString(),
      title: question.title,
      slug: question.slug.value,
      content: question.content,
      authorId: question.authorId.toString(),
      bestAnswerId: question.bestAnswerId?.toString(),
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    },
  })
}
```

**After (com mapper):**
```typescript
async create(question: Question): Promise<void> {
  const data = PrismaQuestionMapper.toPrisma(question)
  await this.prisma.question.create({ data })
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Metodo retorna uma entidade | Use `toDomain()` no resultado |
| Metodo retorna lista de entidades | Use `.map(Mapper.toDomain)` |
| Metodo recebe entidade para persistir | Use `toPrisma()` antes de enviar |
| Campo pode ser null (bestAnswerId) | Use optional chaining: `?.toString()` |
| Listagem paginada | Sempre `orderBy` + `take` + `skip` |
| create vs save | create usa `prisma.create`, save usa `prisma.update` com `where: { id }` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Conversao manual de campos dentro do repository | `PrismaQuestionMapper.toPrisma(question)` |
| `questions.map(q => PrismaQuestionMapper.toDomain(q))` | `questions.map(PrismaQuestionMapper.toDomain)` |
| `Prisma.QuestionCreateInput` para criacao | `Prisma.QuestionUncheckedCreateInput` |
| `findMany()` sem `orderBy` em listagens | `findMany({ orderBy: { createdAt: 'desc' } })` |
| `skip: page * 20` | `skip: (page - 1) * 20` |
| `question.slug` direto no data do Prisma | `question.slug.value` |
| `question.id` direto no data do Prisma | `question.id.toString()` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
