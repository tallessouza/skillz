---
name: rs-node-js-2023-implementando-repositorios
description: "Applies Prisma repository implementation patterns when creating NestJS repositories, data access layers, or database abstractions. Use when user asks to 'create a repository', 'implement data access', 'add Prisma CRUD', 'create NestJS service for database', or 'implement repository pattern'. Enforces mapper usage, consistent method signatures, and proper async/await patterns. Make sure to use this skill whenever generating repository classes that wrap Prisma. Not for business logic, controllers, or domain entity design."
---

# Implementando Repositórios Prisma no NestJS

> Todo repositório Prisma segue a mesma estrutura: injeção do PrismaService, métodos CRUD com mappers, e paginação via skip/take.

## Rules

1. **Sempre injete PrismaService via construtor** — `constructor(private prisma: PrismaService)`, porque é o padrão de DI do NestJS e permite testabilidade
2. **Use mappers para converter entre Prisma e Domain** — `PrismaEntityMapper.toDomain()` e `.toPrisma()`, porque a camada de domínio não deve conhecer o schema do Prisma
3. **Delete pode pular o mapper** — quando só precisa do `id`, use `entity.id.toString()` direto, porque não há conversão de dados necessária
4. **Métodos findMany com paginação usam skip/take** — `skip: (page - 1) * 20, take: 20, orderBy: { createdAt: 'desc' }`, porque é o padrão consistente de paginação
5. **Desestruture params nos métodos** — `findManyRecent({ page })` em vez de `params.page`, porque melhora legibilidade
6. **Todo método que usa await deve ser async** — erro comum esquecer o `async` na assinatura, causando erros silenciosos

## How to write

### Estrutura base do repositório

```typescript
@Injectable()
export class PrismaEntityRepository implements EntityRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Entity | null> {
    const entity = await this.prisma.entity.findUnique({
      where: { id },
    })

    if (!entity) return null

    return PrismaEntityMapper.toDomain(entity)
  }

  async findManyByParentId(parentId: string, { page }: PaginationParams): Promise<Entity[]> {
    const entities = await this.prisma.entity.findMany({
      where: { parentId },
      orderBy: { createdAt: 'desc' },
      take: 20,
      skip: (page - 1) * 20,
    })

    return entities.map(PrismaEntityMapper.toDomain)
  }

  async create(entity: Entity): Promise<void> {
    const data = PrismaEntityMapper.toPrisma(entity)
    await this.prisma.entity.create({ data })
  }

  async save(entity: Entity): Promise<void> {
    const data = PrismaEntityMapper.toPrisma(entity)
    await this.prisma.entity.update({
      where: { id: data.id },
      data,
    })
  }

  async delete(entity: Entity): Promise<void> {
    await this.prisma.entity.delete({
      where: { id: entity.id.toString() },
    })
  }
}
```

### Repositório de attachments (sem create/save individuais)

```typescript
@Injectable()
export class PrismaQuestionAttachmentsRepository implements QuestionAttachmentsRepository {
  constructor(private prisma: PrismaService) {}

  async findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]> {
    const attachments = await this.prisma.attachment.findMany({
      where: { questionId },
    })

    return attachments.map(PrismaQuestionAttachmentMapper.toDomain)
  }

  async deleteManyByQuestionId(questionId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: { questionId },
    })
  }
}
```

## Example

**Before (repositório incompleto, sem mapper, sem async):**
```typescript
class PrismaAnswersRepository {
  findById(id: string) {
    const answer = this.prisma.answer.findUnique({ where: { id } })
    return answer // retorna Prisma type direto
  }

  delete(answer) {
    const data = PrismaAnswerMapper.toPrisma(answer) // mapper desnecessário
    this.prisma.answer.delete({ where: { id: data.id } })
  }
}
```

**After (com this skill applied):**
```typescript
@Injectable()
class PrismaAnswersRepository implements AnswersRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Answer | null> {
    const answer = await this.prisma.answer.findUnique({ where: { id } })
    if (!answer) return null
    return PrismaAnswerMapper.toDomain(answer)
  }

  async delete(answer: Answer): Promise<void> {
    await this.prisma.answer.delete({
      where: { id: answer.id.toString() }, // sem mapper, só id
    })
  }
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Novo repositório com mesmos métodos de outro | Copie a estrutura, troque entity name e mapper |
| Método delete | Use `entity.id.toString()` direto, sem mapper |
| findMany com relação pai | Adicione `where: { parentId }` + paginação |
| Attachment repository | Só precisa de `findManyByParentId` e `deleteManyByParentId` |
| Vários repositórios similares | Use find-and-replace no nome da entidade, depois ajuste os detalhes |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Retornar Prisma type direto do repositório | Sempre converter com `Mapper.toDomain()` |
| `delete` passando pelo mapper completo | `delete` usando `entity.id.toString()` |
| `findMany` sem paginação | Sempre incluir `skip/take` com `orderBy` |
| Esquecer `async` em método com `await` | Sempre marcar `async` na assinatura |
| `params.page` sem desestruturar | `{ page }` desestruturado nos parâmetros |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
