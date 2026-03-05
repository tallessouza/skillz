---
name: rs-node-js-2023-usando-config-module-no-nest-js
description: "Applies NestJS ConfigModule setup with Zod validation and type-safe environment variables. Use when user asks to 'configure environment variables in NestJS', 'setup ConfigModule', 'validate env variables with Zod', 'access env vars in NestJS', or 'type-safe config in Nest'. Make sure to use this skill whenever setting up environment configuration in a NestJS project. Not for generic Node.js env handling, dotenv-only setups, or non-NestJS frameworks."
---

# ConfigModule no NestJS com Zod

> Configure variaveis de ambiente com validacao Zod e tipagem completa usando o ConfigModule do NestJS.

## Rules

1. **Use ConfigModule.forRoot() no AppModule** — porque `forRoot` e o padrao do Nest para modulos que precisam de configuracao
2. **Sempre passe isGlobal: true** — porque sem isso voce precisa importar o ConfigModule em cada modulo separadamente
3. **Use validate, nao validationSchema** — porque validationSchema usa Joi por padrao, e Zod e mais ergonomico com TypeScript
4. **Variaveis ambiente sao sempre strings** — use `z.coerce.number()` para converter porta e outros numeros, porque `process.env` so retorna strings
5. **Passe o tipo Env como generic do ConfigService** — porque sem isso o tipo retornado e `unknown` e voce perde inferencia
6. **Use infer: true e isValidated: true no get()** — porque `infer` ativa inferencia de tipo e `isValidated` remove o `| undefined` do retorno

## How to write

### Schema de validacao (src/env.ts)

```typescript
import { z } from 'zod'

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().optional().default(3333),
})

export type Env = z.infer<typeof envSchema>
```

### Registro no AppModule

```typescript
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './env'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
```

### Uso no main.ts

```typescript
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { Env } from './env'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const configService = app.get<ConfigService<Env, true>>(ConfigService)
  const port = configService.get('PORT', { infer: true })

  await app.listen(port)
}
bootstrap()
```

### Uso em qualquer controller/service via injecao de dependencia

```typescript
import { Controller } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Env } from './env'

@Controller()
export class ExampleController {
  constructor(private configService: ConfigService<Env, true>) {}

  getPort() {
    return this.configService.get('PORT', { infer: true })
  }
}
```

## Example

**Before (process.env sem validacao):**
```typescript
// main.ts — sem validacao, sem tipagem
const port = process.env.PORT || 3333
await app.listen(port) // port e string, bug silencioso
```

**After (ConfigModule com Zod):**
```typescript
// env.ts
export const envSchema = z.object({
  PORT: z.coerce.number().optional().default(3333),
})
export type Env = z.infer<typeof envSchema>

// app.module.ts
ConfigModule.forRoot({
  validate: (env) => envSchema.parse(env),
  isGlobal: true,
})

// main.ts
const configService = app.get<ConfigService<Env, true>>(ConfigService)
const port = configService.get('PORT', { infer: true }) // number, validado
await app.listen(port)
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Variavel ambiente numerica | `z.coerce.number()` — converte string para number |
| Variavel obrigatoria | `z.string()` sem `.optional()` — app nao sobe sem ela |
| Variavel com default | `.optional().default(valor)` — nunca sera undefined |
| Acessar env no main.ts | `app.get(ConfigService)` — nao ha injecao de dependencia no main |
| Acessar env em service/controller | Injete `ConfigService<Env, true>` no constructor |
| Multiplos modulos no projeto | `isGlobal: true` — configura uma vez, acessa em todos |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `process.env.PORT` direto no codigo | `configService.get('PORT', { infer: true })` |
| `ConfigService` sem generic | `ConfigService<Env, true>` |
| `configService.get('PORT')` sem infer | `configService.get('PORT', { infer: true })` |
| `validationSchema: envSchema` | `validate: (env) => envSchema.parse(env)` |
| `isGlobal` omitido | `isGlobal: true` no forRoot |
| `as number` para forcar tipo da porta | `z.coerce.number()` no schema |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
