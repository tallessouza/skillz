---
name: rs-node-js-2023-get-question-by-slug
description: "Applies NestJS controller pattern for fetching a single resource by slug with route params, presenter mapping, and E2E testing. Use when user asks to 'create a controller', 'fetch by slug', 'get single resource', 'NestJS route param', or 'E2E test controller'. Follows pattern: route param extraction, use case delegation, presenter mapping, and comprehensive E2E spec. Make sure to use this skill whenever building NestJS controllers that fetch a single entity by identifier. Not for listing/pagination controllers, authentication, or database schema design."
---

# Controller: Buscar Recurso por Slug (NestJS)

> Ao criar um controller NestJS para buscar um unico recurso, extraia o identificador como route param, delegue ao use case, e retorne via presenter.

## Rules

1. **Um controller por caso de uso** — cada controller encapsula uma unica operacao, porque isso mantem responsabilidades claras e testabilidade isolada
2. **Route params para identificadores unicos** — use `@Param('slug')` para extrair o identificador da URL, porque query params sao para filtros, route params sao para identidade
3. **Sempre use Presenter no retorno** — `QuestionPresenter.toHttp()` transforma a entidade de dominio em resposta HTTP, porque o dominio nunca vaza para a camada HTTP
4. **Registre controller E use case no module** — adicione ambos no `HttpModule`, porque o Nest precisa conhecer o controller para roteamento e o use case precisa de `@Injectable()` para injecao de dependencia
5. **E2E test segue o padrao: criar dados, autenticar, requisitar, validar** — porque testes E2E devem cobrir o fluxo completo incluindo autenticacao

## How to write

### Controller com Route Param

```typescript
@Controller('/questions/:slug')
export class GetQuestionBySlugController {
  constructor(private getQuestionBySlug: GetQuestionBySlugUseCase) {}

  @Get()
  async handle(@Param('slug') slug: string) {
    const result = await this.getQuestionBySlug.execute({ slug })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return { question: QuestionPresenter.toHttp(result.value.question) }
  }
}
```

### E2E Test Structure

```typescript
test('[GET] /questions/:slug', async () => {
  const user = await studentFactory.makePrismaStudent()
  const accessToken = jwt.sign({ sub: user.id.toString() })

  await questionFactory.makePrismaQuestion({
    authorId: user.id,
    slug: Slug.create('question-01'),
    title: 'Question 01',
  })

  const response = await request(app.getHttpServer())
    .get('/questions/question-01')
    .set('Authorization', `Bearer ${accessToken}`)
    .send()

  expect(response.statusCode).toBe(200)
  expect(response.body).toEqual({
    question: expect.objectContaining({ title: 'Question 01' }),
  })
})
```

## Example

**Before (copiando controller de listagem sem adaptar):**
```typescript
// Errado: usando query params para buscar recurso unico
@Get()
async handle(@Query('slug') slug: string) {
  const result = await this.getQuestionBySlug.execute({ slug })
  return { questions: result.value.questions.map(QuestionPresenter.toHttp) }
}
```

**After (controller correto para recurso unico):**
```typescript
@Controller('/questions/:slug')
export class GetQuestionBySlugController {
  constructor(private getQuestionBySlug: GetQuestionBySlugUseCase) {}

  @Get()
  async handle(@Param('slug') slug: string) {
    const result = await this.getQuestionBySlug.execute({ slug })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return { question: QuestionPresenter.toHttp(result.value.question) }
  }
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Buscar recurso unico por identificador | Route param (`/resource/:id`) |
| Listar recursos com filtros | Query params (`/resources?page=1`) |
| Copiar controller existente como base | Replace nome do use case, ajustar params e retorno |
| Controller criado mas teste falha | Verificar se registrou no HttpModule (controller + use case) |
| Use case nao injeta no controller | Adicionar `@Injectable()` no use case do dominio |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `@Query('slug') slug` para recurso unico | `@Param('slug') slug` com rota `/:slug` |
| `return { questions: [...] }` para recurso unico | `return { question: Presenter.toHttp(entity) }` |
| Criar controller sem registrar no module | Registrar controller E use case no HttpModule |
| Use case sem `@Injectable()` | Adicionar decorator para injecao de dependencia |
| E2E test sem autenticacao | Criar usuario, gerar token, enviar no header |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
