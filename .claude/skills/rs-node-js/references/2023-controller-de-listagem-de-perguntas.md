---
name: rs-node-js-2023-controller-de-listagem-de-perguntas
description: "Applies NestJS listing controller patterns with pagination when building 'list endpoint', 'fetch records', 'paginate results', 'GET route with query params', or 'listing controller'. Enforces Zod query validation with transform, skip/take pagination, and object-wrapped responses. Make sure to use this skill whenever creating any NestJS GET endpoint that returns collections. Not for POST/PUT/DELETE controllers, authentication, or database schema design."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: node-js-2023
  module: nestjs-clean-architecture
  tags: [nestjs, controller, clean-architecture, e2e-test, rest-api]
  mind-lenses: [LT_01, LT_02, MF_01, GB_01, TH_04]
---

# Controller de Listagem com Paginacao no NestJS

> Ao criar endpoints de listagem, sempre retorne colecoes paginadas com validacao de query params via Zod e respostas encapsuladas em objeto.

## Rules

1. **Retorne objeto, nunca array direto** — `return { questions }` nao `return questions`, porque permite adicionar metadados (total, page) sem quebrar o contrato da API
2. **Use Zod com transform para query params** — query params sempre chegam como string ou undefined, entao use `.optional().default().transform().pipe()` para converter e validar em cadeia
3. **Retorne o valor do schema.parse** — no ZodValidationPipe, faca `return this.schema.parse(value)` e nao apenas `this.schema.parse(value)`, porque transformacoes precisam que o valor transformado seja propagado
4. **Paginacao com skip/take** — `skip: (page - 1) * perPage`, `take: perPage`, porque esse padrao garante offset correto para qualquer pagina
5. **Ordene por createdAt desc** — listagens de "recentes" sempre `orderBy: { createdAt: 'desc' }`, porque o usuario espera ver os mais novos primeiro
6. **Defina perPage como constante** — nao hardcode numeros magicos no findMany, extraia `const perPage = 20` para clareza e reuso

## How to write

### Schema de validacao para query param paginado

```typescript
const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>
```

### Controller de listagem

```typescript
@Controller('/questions')
export class FetchRecentQuestionsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    const perPage = 20

    const questions = await this.prisma.question.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy: { createdAt: 'desc' },
    })

    return { questions }
  }
}
```

### ZodValidationPipe com suporte a transform

```typescript
transform(value: unknown) {
  try {
    return this.schema.parse(value)  // RETURN obrigatorio para transforms
  } catch (error) {
    if (error instanceof ZodError) {
      throw new BadRequestException({
        message: 'Validation failed',
        statusCode: 400,
        errors: error.flatten().fieldErrors,
      })
    }
    throw new BadRequestException('Validation failed')
  }
}
```

## Example

**Before (erros comuns):**
```typescript
// Retorna array direto — quebra quando precisar adicionar metadata
@Get()
async handle() {
  return this.prisma.question.findMany()
}

// Schema sem transform — page vem como string "1", nao numero
const schema = z.string().optional()

// Parse sem return — transformacao perdida, valor original propagado
transform(value: unknown) {
  this.schema.parse(value) // BUG: valor transformado descartado
}
```

**After (com esta skill):**
```typescript
@Get()
async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
  const perPage = 20
  const questions = await this.prisma.question.findMany({
    take: perPage,
    skip: (page - 1) * perPage,
    orderBy: { createdAt: 'desc' },
  })
  return { questions }
}

// Schema com transform chain completo
const pageQueryParamSchema = z
  .string().optional().default('1').transform(Number).pipe(z.number().min(1))

// Parse com return
transform(value: unknown) {
  return this.schema.parse(value)
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Query param pode ser undefined | `.optional().default('valor')` antes do transform |
| Precisa validar APOS transform | Use `.pipe(z.number().min(1))` — min() direto nao funciona em string |
| Retorno de colecao | Sempre `{ items }` nunca array solto |
| Listagem sem filtro especifico | Ordene por `createdAt: 'desc'` como padrao |
| perPage fixo | Extraia constante, nao inline no findMany |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `return await prisma.question.findMany()` | `return { questions }` |
| `z.string().min(1)` para page | `z.string().optional().default('1').transform(Number).pipe(z.number().min(1))` |
| `this.schema.parse(value)` sem return | `return this.schema.parse(value)` |
| `skip: page * 20` | `skip: (page - 1) * perPage` |
| `@Query() query: any` | `@Query('page', validationPipe) page: PageQueryParamSchema` |

## Troubleshooting

### Erro inesperado ao seguir este padrao
**Symptom:** Codigo segue o padrao mas comportamento nao e o esperado
**Cause:** Dependencia nao registrada no modulo ou configuracao incompleta
**Fix:** Verificar registro completo no modulo (controllers, providers, imports) e dependencias instaladas

## Deep reference library

- [deep-explanation.md](../../../data/skills/node-js-2023/rs-node-js-2023-controller-de-listagem-de-perguntas/references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](../../../data/skills/node-js-2023/rs-node-js-2023-controller-de-listagem-de-perguntas/references/code-examples.md) — Todos os exemplos de código expandidos com variações
