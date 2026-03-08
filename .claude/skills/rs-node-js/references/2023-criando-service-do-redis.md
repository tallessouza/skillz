---
name: 2023-criando-service-do-redis
description: "Creates a Redis service for NestJS by extending the ioredis Redis class with environment-based configuration and lifecycle hooks. Use when user asks to 'integrate Redis with NestJS', 'create Redis service', 'setup cache with ioredis', 'configure Redis connection', or 'add Redis module'. Enforces: extend Redis class from ioredis, configure via EnvService with defaults, implement onModuleDestroy for cleanup, never call connect manually, separate CacheModule from DatabaseModule. Make sure to use this skill whenever adding Redis connectivity to a NestJS application. Not for standalone Redis scripts, frontend caching, or non-NestJS Node.js projects."
category: coding-lens
tags: [cache, modules, nestjs, prisma, redis, streams]
mind_lenses: [LT_01, LT_02, MF_01, GB_01, TH_04]
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: cache-redis
  tags: [redis, ioredis, nestjs, cache, dependency-injection, lifecycle-hooks]
---

# Criando Service do Redis no NestJS

> Integre Redis ao NestJS estendendo a classe IoRedis diretamente, com configuracao via env e lifecycle hooks.

## Rules

1. **Use ioredis, nunca redis** — `ioredis` trabalha com Promises nativamente, enquanto `redis` tradicional usa callbacks
2. **Estenda a classe Redis** — o service herda de `Redis` do ioredis, porque ao dar `new` no service, o `new Redis()` e chamado automaticamente via `super()`
3. **Separe cache em pasta propria** — `src/infra/cache/redis/` assim como `src/infra/database/prisma/`, porque amanha pode haver outros armazenamentos de cache
4. **Configure via EnvService com defaults** — host, port e db devem ter valores padrao (`127.0.0.1`, `6379`, `0`), usuario nao precisa definir variaveis se usar defaults
5. **Implemente onModuleDestroy** — desconecte o Redis quando o NestJS for derrubado, porque conexoes orfas causam leaks
6. **Nao implemente onModuleInit** — diferente do Prisma, ioredis conecta automaticamente no constructor, chamar `connect()` separadamente causa erro
7. **Importe o CacheModule no DatabaseModule** — porque os repositorios que usam cache vivem no contexto do database

## How to write

### Redis Service

```typescript
// src/infra/cache/redis/redis.service.ts
import { Injectable, OnModuleDestroy } from '@nestjs/common'
import Redis from 'ioredis'

import { EnvService } from '@/infra/env/env.service'

@Injectable()
export class RedisService extends Redis implements OnModuleDestroy {
  constructor(envService: EnvService) {
    super({
      host: envService.get('REDIS_HOST'),
      port: envService.get('REDIS_PORT'),
      db: envService.get('REDIS_DB'),
    })
  }

  onModuleDestroy() {
    return this.disconnect()
  }
}
```

### Env Schema

```typescript
// Adicionar ao schema do env (zod)
REDIS_HOST: z.string().optional().default('127.0.0.1'),
REDIS_PORT: z.coerce.number().optional().default(6379),
REDIS_DB: z.coerce.number().optional().default(0),
```

### Cache Module

```typescript
// src/infra/cache/cache.module.ts
import { Module } from '@nestjs/common'

import { EnvModule } from '@/infra/env/env.module'
import { RedisService } from './redis/redis.service'

@Module({
  imports: [EnvModule],
  providers: [RedisService],
  exports: [RedisService],
})
export class CacheModule {}
```

### Importar no Database Module

```typescript
// src/infra/database/database.module.ts
import { CacheModule } from '@/infra/cache/cache.module'

@Module({
  imports: [CacheModule],
  // ... providers e exports existentes
})
export class DatabaseModule {}
```

## Example

**Before (conexao inline sem service):**
```typescript
import Redis from 'ioredis'

const redis = new Redis({ host: 'localhost', port: 6379 })

// Espalhado pelo codigo, sem cleanup, sem modulo
async function getCache(key: string) {
  return redis.get(key)
}
```

**After (com este skill aplicado):**
```typescript
// Service dedicado com lifecycle gerenciado pelo NestJS
@Injectable()
export class RedisService extends Redis implements OnModuleDestroy {
  constructor(envService: EnvService) {
    super({
      host: envService.get('REDIS_HOST'),
      port: envService.get('REDIS_PORT'),
      db: envService.get('REDIS_DB'),
    })
  }

  onModuleDestroy() {
    return this.disconnect()
  }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa de cache em NestJS | Crie `CacheModule` com `RedisService` estendendo ioredis |
| Multiplas apps no mesmo Redis | Use `db` diferente para cada (0, 1, 2...) |
| Ambiente sem Redis configurado | Defaults no env schema garantem que funciona sem `.env` |
| Precisa de cleanup na shutdown | `onModuleDestroy` com `this.disconnect()` |
| Repositorio precisa de cache | Importe `CacheModule` no modulo do repositorio |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `new Redis()` inline nos services | `RedisService extends Redis` como provider |
| Hardcode host/port no constructor | `EnvService` com defaults no schema |
| `onModuleInit` chamando `this.connect()` | Nada — ioredis conecta automaticamente |
| Cache e database no mesmo modulo | Modulos separados: `CacheModule` e `DatabaseModule` |
| Usar pacote `redis` com callbacks | Usar `ioredis` com Promises nativas |

## Troubleshooting

### Resultado inesperado ao aplicar o padrao
**Symptom:** Comportamento nao corresponde ao esperado apos seguir os passos
**Cause:** Dependencias ou configuracoes previas podem estar faltando
**Fix:** Verifique os prerequisites e confirme que todas as versoes estao compativeis

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
