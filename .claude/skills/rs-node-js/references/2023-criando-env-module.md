---
name: rs-node-js-2023-criando-env-module
description: "Enforces creation of a typed EnvModule wrapper around NestJS ConfigService when working with environment variables. Use when user asks to 'access env variables', 'create config service', 'setup environment validation', 'type environment variables in NestJS', or any NestJS configuration task. Wraps ConfigService with automatic type inference via generics, eliminating verbose infer/true syntax. Make sure to use this skill whenever setting up environment variable access in NestJS projects. Not for frontend env handling, dotenv-only setups, or non-NestJS frameworks."
---

# Criando EnvModule

> Encapsular o ConfigService do NestJS em um EnvService tipado que infere tipos automaticamente, eliminando sintaxe verbosa em cada ponto de uso.

## Rules

1. **Nunca use ConfigService diretamente nos consumers** — crie um `EnvService` wrapper, porque a sintaxe `configService.get<Env['KEY'], true>('KEY', { infer: true })` e repetitiva e propensa a erro
2. **Exporte EnvService via modulo dedicado** — crie `EnvModule` com providers + exports, porque providers registrados apenas no AppModule nao sao visiveis em sub-modulos como JwtModule.registerAsync
3. **Use generics no metodo get para inferencia automatica** — `get<T extends keyof Env>(key: T): Env[T]`, porque sem o generic o retorno seria `string | number` em vez do tipo exato da chave
4. **Importe EnvModule onde precisar de env** — nao dependa de global modules, porque imports explicitos tornam dependencias visiveis e testaveis
5. **Agrupe env.ts, env.service.ts e env.module.ts na mesma pasta** — `src/infra/env/`, porque coesao facilita manutencao

## How to write

### EnvService com generics

```typescript
// src/infra/env/env.service.ts
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Env } from './env'

@Injectable()
export class EnvService {
  constructor(private configService: ConfigService<Env, true>) {}

  get<T extends keyof Env>(key: T): Env[T] {
    return this.configService.get(key, { infer: true })
  }
}
```

### EnvModule

```typescript
// src/infra/env/env.module.ts
import { Module } from '@nestjs/common'
import { EnvService } from './env.service'

@Module({
  providers: [EnvService],
  exports: [EnvService],
})
export class EnvModule {}
```

### Consumindo no main.ts

```typescript
const envService = app.get(EnvService)
const port = envService.get('PORT')
// port ja tem o tipo correto (number) sem cast manual
```

## Example

**Before (ConfigService direto — verboso e repetitivo):**
```typescript
// main.ts
const configService = app.get<ConfigService<Env, true>>(ConfigService)
const port = configService.get('PORT', { infer: true })

// jwt.strategy.ts
constructor(config: ConfigService<Env, true>) {
  const publicKey = config.get('JWT_PUBLIC_KEY', { infer: true })
  super({ secretOrKey: publicKey })
}
```

**After (EnvService — limpo e tipado):**
```typescript
// main.ts
const envService = app.get(EnvService)
const port = envService.get('PORT')

// jwt.strategy.ts
constructor(env: EnvService) {
  const publicKey = env.get('JWT_PUBLIC_KEY')
  super({ secretOrKey: publicKey })
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Novo projeto NestJS com env vars | Crie EnvModule desde o inicio |
| Sub-modulo precisa de env (ex: JwtModule.registerAsync) | Importe EnvModule no imports do registerAsync |
| ConfigService usado em mais de 1 arquivo | Refatore para EnvService |
| Validacao com Zod ja existe (env.ts) | EnvService complementa — nao substitui a validacao |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `configService.get<Env['X'], true>('X', { infer: true })` | `envService.get('X')` |
| `@Global() EnvModule` sem necessidade | Importe EnvModule explicitamente onde usar |
| EnvService nos providers do AppModule sem exports | Crie EnvModule separado com exports |
| `get(key: keyof Env)` sem generic T | `get<T extends keyof Env>(key: T): Env[T]` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-criando-env-module/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-criando-env-module/references/code-examples.md)
