---
name: 2023-criando-env-module
description: "Applies EnvService wrapper pattern over ConfigService in NestJS for type-safe environment variable access. Use when user asks to 'access environment variables', 'create env module', 'wrap config service', 'type env variables', or 'simplify config access'. Enforces EnvService with generics, dedicated EnvModule, explicit imports over global modules. Make sure to use this skill whenever accessing environment variables in NestJS projects. Not for Zod env validation, dotenv setup, or non-NestJS projects."
category: coding-lens
tags: [nestjs, environment, config-service, generics, typescript]
mind_lenses: [LT_01, LT_02, MF_01, GB_01, TH_04]
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: configuration
  tags: [nestjs, environment, config-service, generics, typescript, env-module]
---

# Criando EnvModule no NestJS

> Encapsular o ConfigService em um EnvService tipado que infere tipos automaticamente, eliminando sintaxe verbosa em cada ponto de uso.

## Rules

1. **Nunca use ConfigService diretamente nos consumers** — crie um `EnvService` wrapper, porque `configService.get<Env['KEY'], true>('KEY', { infer: true })` e repetitivo
2. **Exporte EnvService via modulo dedicado** — crie `EnvModule` com providers + exports
3. **Use generics no metodo get** — `get<T extends keyof Env>(key: T): Env[T]`
4. **Importe EnvModule onde precisar de env** — nao dependa de global modules
5. **Agrupe env.ts, env.service.ts e env.module.ts na mesma pasta** — `src/infra/env/`

## How to write

### EnvService com generics

```typescript
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
@Module({
  providers: [EnvService],
  exports: [EnvService],
})
export class EnvModule {}
```

### Consumindo

```typescript
const envService = app.get(EnvService)
const port = envService.get('PORT') // tipo correto sem cast
```

## Example

**Before (ConfigService direto):**
```typescript
const configService = app.get<ConfigService<Env, true>>(ConfigService)
const port = configService.get('PORT', { infer: true })
```

**After (EnvService limpo):**
```typescript
const envService = app.get(EnvService)
const port = envService.get('PORT')
```

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `configService.get<Env['X'], true>('X', { infer: true })` | `envService.get('X')` |
| `@Global() EnvModule` sem necessidade | Importe EnvModule explicitamente |
| `get(key: keyof Env)` sem generic T | `get<T extends keyof Env>(key: T): Env[T]` |

## Troubleshooting

### Sub-modulo nao encontra EnvService
**Symptom:** Erro de resolucao de dependencia ao usar EnvService em JwtModule.registerAsync
**Cause:** EnvModule nao foi importado no modulo que usa registerAsync
**Fix:** Adicione `EnvModule` nos `imports` do modulo que precisa de env

## Deep reference library

- [deep-explanation.md](mdc:data/skills/node-js-2023/rs-node-js-2023-criando-env-module/references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](mdc:data/skills/node-js-2023/rs-node-js-2023-criando-env-module/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
