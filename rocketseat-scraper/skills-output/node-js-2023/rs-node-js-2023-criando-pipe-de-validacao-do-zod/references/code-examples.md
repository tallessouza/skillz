# Code Examples: NestJS Zod Validation Pipe

## 1. Instalacao

```bash
npm install zod zod-validation-error
```

## 2. Schema completo com tipo inferido

```typescript
import { z } from 'zod'

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>
// Resultado: { name: string; email: string; password: string }
```

## 3. ZodValidationPipe completo

```typescript
// src/pipes/zod-validation-pipe.ts
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

## 4. Controller usando o pipe

```typescript
import { Body, Controller, Post, UsePipes } from '@nestjs/common'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { z } from 'zod'

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller('/accounts')
export class CreateAccountController {
  @Post()
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, email, password } = body
    // body ja validado e tipado — usar diretamente
  }
}
```

## 5. Evolucao do tratamento de erros (passo a passo)

### Versao 1 — parse inline (ruim: 500 error)

```typescript
@Post()
async handle(@Body() body: any) {
  const { name, email, password } = createAccountBodySchema.parse(body)
  // Se falhar → ZodError nao tratado → 500 Internal Server Error
}
```

### Versao 2 — try/catch basico (melhor: 400 mas sem detalhes)

```typescript
@Post()
async handle(@Body() body: any) {
  try {
    const { name, email, password } = createAccountBodySchema.parse(body)
  } catch (error) {
    throw new BadRequestException('Validation failed')
  }
}
```

### Versao 3 — com error.format() (bom: mostra erros)

```typescript
catch (error) {
  if (error instanceof ZodError) {
    throw new BadRequestException({
      message: 'Validation failed',
      statusCode: 400,
      errors: error.format(),
    })
  }
}
```

### Versao 4 — com fromZodError (melhor: formatacao legivel)

```typescript
import { fromZodError } from 'zod-validation-error'

catch (error) {
  if (error instanceof ZodError) {
    throw new BadRequestException({
      message: 'Validation failed',
      statusCode: 400,
      errors: fromZodError(error),
    })
  }
}
```

## 6. Exemplo de response de erro

Request com email invalido:
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": {
    "details": [
      {
        "code": "invalid_string",
        "message": "Invalid email",
        "path": ["email"],
        "validation": "email"
      }
    ]
  }
}
```

## 7. Variacao: safeParse (alternativa que o instrutor mencionou mas descartou)

```typescript
// safeParse retorna { success: boolean, data?, error? }
const result = createAccountBodySchema.safeParse(body)

if (!result.success) {
  throw new BadRequestException({
    message: 'Validation failed',
    errors: fromZodError(result.error),
  })
}

const { name, email, password } = result.data
```

O instrutor descartou essa abordagem por rota porque "como a gente vai usar isso basicamente em todas as rotas, e muito melhor criar uma forma mais global" — o pipe.