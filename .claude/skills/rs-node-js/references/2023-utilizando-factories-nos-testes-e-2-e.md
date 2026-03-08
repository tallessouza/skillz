---
name: rs-node-js-2023-factories-testes-e2e
description: "Enforces the Factory pattern for creating test entities in NestJS E2E tests with Prisma. Use when user asks to 'write e2e test', 'create test factory', 'setup test data', 'test with database', or 'NestJS testing'. Applies injectable factories that bridge domain entities to persistence layer, imports DatabaseModule in test modules, and uses mappers for Prisma conversion. Make sure to use this skill whenever creating or refactoring NestJS E2E tests that need database entities. Not for unit tests, domain-layer factories, or mock-based testing."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: factories-e2e-nestjs
  tags: [factory, e2e, testing, nestjs, prisma, injectable, mapper, database-module]
---

# Factories nos Testes E2E (NestJS + Prisma)

> Crie factories injetaveis que reutilizam as factories de dominio e persistem via Prisma, eliminando duplicacao nos testes E2E.

## Rules

1. **Separe factory de dominio e factory de persistencia** — a factory de dominio (`makeStudent`) cria a entidade em memoria, a factory de persistencia (`makePrismaStudent`) salva no banco, porque cada camada tem responsabilidade diferente
2. **Use `@Injectable()` nas factories de persistencia** — porque precisam do `PrismaService` via injecao de dependencia do NestJS
3. **Importe o `DatabaseModule` no modulo de teste** — porque o `PrismaService` nao e reexportado automaticamente pelo `AppModule`, apenas pelo `DatabaseModule`
4. **Reutilize a factory de dominio dentro da factory de persistencia** — chame `makeStudent(data)` e converta com o mapper, porque evita duplicar logica de criacao
5. **Use mappers para converter dominio → persistencia** — `PrismaStudentMapper.toPrisma(entity)`, porque mantem a separacao de camadas
6. **Registre factories como providers no `createTestingModule`** — e obtenha via `moduleRef.get(Factory)`, porque segue o padrao de DI do NestJS

## How to write

### Factory de persistencia

```typescript
@Injectable()
export class StudentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaStudent(
    data: Partial<StudentProps> = {},
  ): Promise<Student> {
    const student = makeStudent(data)

    await this.prisma.user.create({
      data: PrismaStudentMapper.toPrisma(student),
    })

    return student
  }
}
```

### Setup do modulo de teste

```typescript
const moduleRef = await Test.createTestingModule({
  imports: [AppModule, DatabaseModule],
  providers: [StudentFactory, QuestionFactory],
}).compile()

const studentFactory = moduleRef.get(StudentFactory)
const questionFactory = moduleRef.get(QuestionFactory)
```

### Uso no teste

```typescript
const user = await studentFactory.makePrismaStudent()

const question = await questionFactory.makePrismaQuestion({
  authorId: user.id,
  title: 'Question 01',
  slug: Slug.create('question-01'),
})
```

## Example

**Before (duplicacao manual):**
```typescript
const user = await prisma.user.create({
  data: { name: 'John', email: 'john@example.com', password: 'hash' },
})

const question = await prisma.question.create({
  data: { title: 'Question 01', slug: 'question-01', authorId: user.id },
})
```

**After (com factories):**
```typescript
const user = await studentFactory.makePrismaStudent({ name: 'John' })

const question = await questionFactory.makePrismaQuestion({
  authorId: user.id,
  title: 'Question 01',
  slug: Slug.create('question-01'),
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Teste precisa de entidade no banco | Use factory de persistencia (`makePrismaX`) |
| Teste unitario de dominio | Use factory de dominio (`makeX`) |
| Factory precisa de PrismaService | Marque com `@Injectable()` e registre como provider |
| PrismaService nao encontrado no teste | Importe `DatabaseModule` no `createTestingModule` |
| Entidade depende de outra (question → author) | Passe o ID da entidade pai como parametro |
| Precisa de valor fixo no teste (slug, title) | Passe override na factory, nao confie no valor aleatorio |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `prisma.user.create({ data: {...} })` direto no teste | `studentFactory.makePrismaStudent({...})` |
| Factory de persistencia sem `@Injectable()` | `@Injectable() class StudentFactory` |
| Importar so `AppModule` esperando ter Prisma | Importar `AppModule` + `DatabaseModule` |
| Duplicar logica de criacao na factory de persistencia | Chamar `makeStudent(data)` + mapper |
| Confiar em valores aleatorios quando o teste valida valor especifico | Passar override: `{ slug: Slug.create('my-slug') }` |

## Troubleshooting

### PrismaService nao encontrado ao usar factory no teste E2E
**Symptom:** `Nest can't resolve dependencies of StudentFactory (?)` ao compilar o modulo de teste
**Cause:** O `DatabaseModule` nao foi importado no `createTestingModule`, e o `PrismaService` nao esta disponivel para injecao
**Fix:** Adicione `DatabaseModule` no array de imports: `Test.createTestingModule({ imports: [AppModule, DatabaseModule], providers: [StudentFactory] })`

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
