---
name: rs-node-js-2023-zod-validation-pipe
description: "Applies NestJS Zod validation pipe pattern when creating controllers with input validation. Use when user asks to 'create a pipe', 'validate request body', 'add Zod validation to NestJS', 'create a controller with validation', or 'handle validation errors'. Enforces schema-first approach with z.infer for type inference, custom ZodValidationPipe class, and structured error responses using zod-validation-error. Make sure to use this skill whenever building NestJS endpoints that receive data. Not for frontend validation, class-validator/class-transformer approaches, or non-NestJS frameworks."
---

# NestJS Zod Validation Pipe

> Valide dados de entrada em controllers NestJS usando Zod com um pipe reutilizavel, inferencia de tipos automatica e erros estruturados.

## Rules

1. **Schema primeiro, tipo inferido** — defina o schema Zod e use `z.infer<typeof schema>` para gerar o tipo, porque evita duplicacao entre schema e interface
2. **Nunca valide inline no controller** — use `@UsePipes(new ZodValidationPipe(schema))` no decorator da rota, porque centraliza validacao e mantem o controller limpo
3. **Use ZodSchema no construtor do pipe** — nao `ZodObject`, porque `ZodSchema` aceita qualquer schema Zod (objects, arrays, unions)
4. **Trate ZodError com instanceof** — no catch, verifique `error instanceof ZodError` antes de formatar, porque outros erros podem ocorrer no try
5. **Retorne erros estruturados** — inclua `message`, `statusCode` e `errors` no response, porque o frontend precisa de informacao actionable
6. **Use zod-validation-error para formatacao** — `fromZodError(error)` gera mensagens legiveis com path, codigo e tipo de validacao

## How to write

### Schema com tipo inferido

```typescript
import { z } from 'zod'

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>
```

### ZodValidationPipe

```typescript
import { PipeTransform, BadRequestException } from '@nestjs/common'
import { ZodError, ZodSchema } from 'zod'
import { fromZodError } from 'zod-validation-error'

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      return this.schema.parse(value)
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: 'Validation failed',
          statusCode: 400,
          errors: fromZodError(error),
        })
      }
      throw new BadRequestException('Validation failed')
    }
  }
}
```

### Aplicando no controller

```typescript
import { UsePipes } from '@nestjs/common'

@Post('/accounts')
@UsePipes(new ZodValidationPipe(createAccountBodySchema))
async create(@Body() body: CreateAccountBodySchema) {
  // body ja esta validado e tipado
}
```

## Example

**Before (validacao inline, sem pipe):**
```typescript
@Post('/accounts')
async create(@Body() body: any) {
  try {
    const parsed = createAccountBodySchema.parse(body)
    // logica...
  } catch (error) {
    throw new BadRequestException('Validation failed')
  }
}
```

**After (com ZodValidationPipe):**
```typescript
@Post('/accounts')
@UsePipes(new ZodValidationPipe(createAccountBodySchema))
async create(@Body() body: CreateAccountBodySchema) {
  // body ja validado, tipado, erros tratados pelo pipe
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Controller recebe dados do body | Crie schema Zod + aplique ZodValidationPipe via `@UsePipes` |
| Precisa do tipo TS do body | Use `z.infer<typeof schema>`, nunca duplique com interface |
| Erro de validacao complexo | Use `fromZodError()` do pacote `zod-validation-error` |
| Validacao em multiplas rotas | Reutilize o mesmo ZodValidationPipe, mude apenas o schema |
| Query params ou route params | Mesmo pipe funciona, aplique no `@Query()` ou `@Param()` |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `body: any` com parse inline | `@UsePipes(new ZodValidationPipe(schema))` com tipo inferido |
| Interface duplicando o schema | `z.infer<typeof schema>` |
| `ZodObject` no construtor do pipe | `ZodSchema` (mais generico) |
| `catch (error: ZodError)` | `catch (error) { if (error instanceof ZodError) }` |
| Retornar apenas string no erro | Retornar objeto com `message`, `statusCode`, `errors` |
| safeParse com if manual em cada rota | Pipe reutilizavel com parse + throw |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-criando-pipe-de-validacao-do-zod/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-criando-pipe-de-validacao-do-zod/references/code-examples.md)
