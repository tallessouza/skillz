---
name: rs-node-js-2023-refatorando-testes-e-2-e
description: "Enforces Factory pattern in NestJS E2E tests, replacing direct PrismaService usage with dedicated Factory classes. Use when user asks to 'write e2e test', 'create integration test', 'refactor test', 'test NestJS controller', or 'setup test factories'. Applies rules: inject factories via providers, use DatabaseModule import, remove direct Prisma manipulation, use makePrismaEntity methods. Make sure to use this skill whenever writing or reviewing NestJS E2E tests. Not for unit tests, mock-based tests, or non-NestJS testing frameworks."
---

# Refatorando Testes E2E com Factories

> Testes E2E usam Factories dedicadas para criar entidades no banco, nunca manipulam PrismaService diretamente.

## Rules

1. **Injete Factories via providers** — declare cada Factory no array `providers` do `Test.createTestingModule`, porque isso mantém o teste desacoplado da camada de persistência
2. **Importe DatabaseModule** — adicione `DatabaseModule` nos `imports` do módulo de teste, porque as Factories dependem do PrismaService internamente
3. **Use `makePrismaEntity` para criar dados** — chame `factory.makePrismaStudent()`, `factory.makePrismaQuestion()`, etc., porque encapsula toda a lógica de criação e mapeamento
4. **Remova referências diretas ao PrismaService** — se o teste só cria dados, elimine `PrismaService` do teste e use apenas Factories, porque reduz acoplamento
5. **Mantenha PrismaService apenas para validação** — quando o teste precisa verificar que algo foi salvo no banco (ex: `prisma.question.findFirst`), mantenha o PrismaService apenas para essa consulta
6. **Use `Promise.all` para criações paralelas** — ao criar múltiplas entidades, agrupe com `await Promise.all([...])`, porque acelera o setup do teste

## How to write

### Setup do módulo de teste com Factories

```typescript
const moduleRef = await Test.createTestingModule({
  imports: [AppModule, DatabaseModule],
  providers: [StudentFactory, QuestionFactory],
}).compile()

studentFactory = moduleRef.get(StudentFactory)
questionFactory = moduleRef.get(QuestionFactory)
```

### Criando entidades com Factory

```typescript
const user = await studentFactory.makePrismaStudent()

await Promise.all([
  questionFactory.makePrismaQuestion({
    authorId: user.id,
    title: 'Question 01',
  }),
  questionFactory.makePrismaQuestion({
    authorId: user.id,
    title: 'Question 02',
  }),
])
```

### Criando entidade com atributos específicos (ex: autenticação)

```typescript
const user = await studentFactory.makePrismaStudent({
  email: 'johndoe@example.com',
  password: await hash('123456', 8),
})
```

## Example

**Before (PrismaService direto no teste):**
```typescript
const moduleRef = await Test.createTestingModule({
  imports: [AppModule],
}).compile()

prisma = moduleRef.get(PrismaService)

// Setup manual com Prisma
await prisma.user.create({
  data: { name: 'John', email: 'john@example.com', password: '...' },
})
await prisma.question.create({
  data: { title: 'Question 01', authorId: user.id, slug: '...' },
})
```

**After (com Factories):**
```typescript
const moduleRef = await Test.createTestingModule({
  imports: [AppModule, DatabaseModule],
  providers: [StudentFactory, QuestionFactory],
}).compile()

studentFactory = moduleRef.get(StudentFactory)
questionFactory = moduleRef.get(QuestionFactory)

const user = await studentFactory.makePrismaStudent()
await questionFactory.makePrismaQuestion({
  authorId: user.id,
  title: 'Question 01',
})
```

## Heuristics

| Situação | Faça |
|----------|------|
| Teste só cria dados no banco | Use apenas Factories, remova PrismaService |
| Teste precisa verificar dado salvo | Mantenha PrismaService só para a query de validação |
| Múltiplas entidades do mesmo tipo | `Promise.all` com chamadas à Factory |
| Entidade precisa de atributos específicos | Passe override object para `makePrismaEntity({...})` |
| Nova entidade no domínio | Crie nova Factory seguindo o padrão existente |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|---------------------|
| `prisma.user.create({ data: {...} })` no teste | `studentFactory.makePrismaStudent({...})` |
| `prisma.question.create({ data: {...} })` no teste | `questionFactory.makePrismaQuestion({...})` |
| Módulo de teste sem `DatabaseModule` nos imports | `imports: [AppModule, DatabaseModule]` |
| Factory sem declarar em `providers` | `providers: [StudentFactory, QuestionFactory]` |
| `user.id` como objeto em vez de string | `user.id.toString()` onde necessário |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
