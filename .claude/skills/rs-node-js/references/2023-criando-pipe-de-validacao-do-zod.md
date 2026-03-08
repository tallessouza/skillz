---
name: 2023-criando-pipe-de-validacao-do-zod
description: "Creates a reusable Zod validation pipe for NestJS controllers with automatic type inference and structured error responses. Use when user asks to 'validate request body in NestJS', 'create validation pipe', 'use Zod with NestJS', 'validate input with schema', or 'infer types from Zod schema'. Enforces: schema-first with z.infer for types, ZodValidationPipe via @UsePipes decorator, ZodSchema in constructor, structured error responses with fromZodError. Make sure to use this skill whenever adding input validation to NestJS controllers using Zod. Not for Fastify validation, frontend form validation, or class-validator based NestJS projects."
category: coding-lens
tags: [decorators, error-handling, nestjs, typescript, zod]
mind_lenses: [LT_01, LT_02, MF_01, GB_01, TH_04]
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: nestjs-validation
  tags: [zod, nestjs, validation, pipe, typescript, schema-validation]
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

## Troubleshooting

### Resultado inesperado ao aplicar o padrao
**Symptom:** Comportamento nao corresponde ao esperado apos seguir os passos
**Cause:** Dependencias ou configuracoes previas podem estar faltando
**Fix:** Verifique os prerequisites e confirme que todas as versoes estao compativeis

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
