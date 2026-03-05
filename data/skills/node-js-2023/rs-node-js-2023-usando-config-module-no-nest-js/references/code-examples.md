# Code Examples: ConfigModule no NestJS com Zod

## Exemplo completo passo a passo

### 1. Instalar dependencia

```bash
npm install @nestjs/config
```

### 2. Criar src/env.ts

```typescript
import { z } from 'zod'

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().optional().default(3333),
})

export type Env = z.infer<typeof envSchema>
```

**Notas:**
- `DATABASE_URL` e obrigatoria — app nao sobe sem ela
- `PORT` e opcional com default 3333 — nunca sera undefined em runtime
- `z.coerce.number()` converte a string `"3333"` para o number `3333`

### 3. Configurar AppModule

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
  controllers: [],
  providers: [],
})
export class AppModule {}
```

### 4. Usar no main.ts

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

### 5. Usar em um controller via injecao de dependencia

```typescript
import { Controller, Get } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Env } from './env'

@Controller('/config-example')
export class ExampleController {
  constructor(private configService: ConfigService<Env, true>) {}

  @Get()
  showDatabaseUrl() {
    const dbUrl = this.configService.get('DATABASE_URL', { infer: true })
    return { connected: !!dbUrl }
  }
}
```

## Variacoes do schema Zod para diferentes cenarios

### Aplicacao com JWT e Redis

```typescript
export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().optional().default(3333),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('7d'),
  REDIS_URL: z.string().url().optional(),
})
```

### Aplicacao com feature flags

```typescript
export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().optional().default(3333),
  ENABLE_SWAGGER: z.coerce.boolean().default(false),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
})
```

## Erro quando variavel obrigatoria falta

Se `DATABASE_URL` nao estiver no `.env`, a aplicacao nao sobe e o Zod mostra:

```
ZodError: [
  {
    "code": "invalid_type",
    "expected": "string",
    "received": "undefined",
    "path": ["DATABASE_URL"],
    "message": "Required"
  }
]
```

Isso e o comportamento desejado — fail fast no boot, nao em runtime.