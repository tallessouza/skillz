---
name: rs-node-js-2023-controller-de-criacao-de-pergunta
description: "Applies NestJS controller patterns with Zod body validation when creating REST endpoints. Use when user asks to 'create a controller', 'add an endpoint', 'validate request body', 'create a POST route in NestJS', or 'use Zod with NestJS'. Enforces per-route validation pipe, slug generation, and Prisma integration. Make sure to use this skill whenever building NestJS controllers with body validation. Not for frontend components, database schema design, or authentication setup."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: node-js-2023
  module: nestjs-clean-architecture
  tags: [nestjs, controller, clean-architecture, e2e-test, rest-api]
  mind-lenses: [LT_01, LT_02, MF_01, GB_01, TH_04]
---

# Controller com Validacao Zod no NestJS

> Cada controller NestJS valida o body da requisicao com Zod no nivel do parametro, nao no nivel do controller.

## Rules

1. **Defina o schema Zod antes do controller** — `const createQuestionBodySchema = z.object({...})` seguido de `type CreateQuestionBody = z.infer<typeof createQuestionBodySchema>`, porque separa validacao de logica
2. **Use pipe no parametro @Body(), nao no @UsePipes()** — pipe inline no `@Body()` e mais granular e explicito sobre qual parametro esta sendo validado
3. **Extraia o pipe para uma constante** — `const bodyValidationPipe = new ZodValidationPipe(schema)` evita linhas longas e melhora legibilidade
4. **Gere slugs com normalize('NFD')** — remove acentos sem mapear caractere por caractere, porque e mais robusto para i18n
5. **Slug e unico no banco** — cuidado com titulos duplicados gerando o mesmo slug, trate a constraint unique
6. **Nao retorne nada em endpoints de criacao** — `return` e desnecessario quando o status 201 ja comunica sucesso

## How to write

### Schema + Type + Pipe

```typescript
const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

type CreateQuestionBody = z.infer<typeof createQuestionBodySchema>

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema)
```

### Controller com pipe inline no @Body()

```typescript
@Controller('/questions')
export class CreateQuestionController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: CreateQuestionBody,
  ) {
    const { title, content } = body
    const userId = user.sub

    const slug = this.convertToSlug(title)

    await this.prisma.question.create({
      data: {
        title,
        content,
        slug,
        authorId: userId,
      },
    })
  }

  private convertToSlug(title: string): string {
    return title
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
  }
}
```

## Example

**Before (pipe no nivel do controller — menos granular):**
```typescript
@Controller('/questions')
@UsePipes(new ZodValidationPipe(createQuestionBodySchema))
export class CreateQuestionController {
  @Post()
  async handle(@Body() body: CreateQuestionBody) {
    // valida tudo no controller, mesmo params e query que nao precisam
  }
}
```

**After (pipe no parametro — granular):**
```typescript
@Controller('/questions')
export class CreateQuestionController {
  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreateQuestionBody,
  ) {
    // apenas o body e validado pelo Zod
  }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Endpoint recebe body JSON | Zod schema + pipe no `@Body()` |
| Slug precisa ser unico | Trate constraint unique do banco ou adicione sufixo |
| Endpoint de criacao (POST) | Retorne apenas status 201, sem body |
| Funcao auxiliar usada so no controller | Metodo `private` na mesma classe |
| Acentos no titulo | `normalize('NFD')` + regex para remover diacriticos |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `@UsePipes()` no controller inteiro para validar so o body | `@Body(bodyValidationPipe)` no parametro |
| Pipe inline com `new ZodValidationPipe(schema)` direto no `@Body()` | Constante `bodyValidationPipe` extraida acima da classe |
| Mapeamento manual de acentos (`a->a, e->e`) | `normalize('NFD').replace(/[\u0300-\u036f]/g, '')` |
| `return await this.prisma.question.create(...)` em POST | `await` sem `return` — 201 sem body |
| `user.sub` sem desestruturar | `const userId = user.sub` para clareza |

## Troubleshooting

### Erro inesperado ao seguir este padrao
**Symptom:** Codigo segue o padrao mas comportamento nao e o esperado
**Cause:** Dependencia nao registrada no modulo ou configuracao incompleta
**Fix:** Verificar registro completo no modulo (controllers, providers, imports) e dependencias instaladas

## Deep reference library

- [deep-explanation.md](../../../data/skills/node-js-2023/rs-node-js-2023-controller-de-criacao-de-pergunta/references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](../../../data/skills/node-js-2023/rs-node-js-2023-controller-de-criacao-de-pergunta/references/code-examples.md) — Todos os exemplos de código expandidos com variações
