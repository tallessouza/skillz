---
name: rs-node-2023-controller-criacao-pergunta
description: "Applies NestJS controller patterns with Zod body validation when creating REST endpoints. Use when user asks to 'create a controller', 'add an endpoint', 'validate request body', 'create a POST route in NestJS', or 'use Zod with NestJS'. Enforces per-route validation pipe, slug generation, and Prisma integration. Make sure to use this skill whenever building NestJS controllers with body validation. Not for frontend components, database schema design, or authentication setup."
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

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
