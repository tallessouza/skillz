# Code Examples: Criando Service do Redis

## Instalacao do ioredis

```bash
npm install ioredis
```

## Redis Service completo

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

## Env schema com variaveis Redis

```typescript
// src/infra/env/env.ts (adicionar ao schema existente)
import { z } from 'zod'

export const envSchema = z.object({
  // ... variaveis existentes
  REDIS_HOST: z.string().optional().default('127.0.0.1'),
  REDIS_PORT: z.coerce.number().optional().default(6379),
  REDIS_DB: z.coerce.number().optional().default(0),
})
```

**Nota:** Como todos tem `.default()`, nao e necessario adicionar nada ao arquivo `.env` para desenvolvimento local.

## Cache Module

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

## Database Module importando Cache

```typescript
// src/infra/database/database.module.ts
import { Module } from '@nestjs/common'
import { CacheModule } from '@/infra/cache/cache.module'
// ... outros imports

@Module({
  imports: [CacheModule],
  providers: [
    // ... repositorios existentes
  ],
  exports: [
    // ... exports existentes
  ],
})
export class DatabaseModule {}
```

## Comparacao: PrismaService vs RedisService

### PrismaService (referencia)

```typescript
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: ['warn', 'error'],
    })
  }

  async onModuleInit() {
    await this.$connect() // Necessario no Prisma
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }
}
```

### RedisService

```typescript
@Injectable()
export class RedisService extends Redis implements OnModuleDestroy {
  constructor(envService: EnvService) {
    super({
      host: envService.get('REDIS_HOST'),
      port: envService.get('REDIS_PORT'),
      db: envService.get('REDIS_DB'),
    })
  }

  // SEM onModuleInit — ioredis conecta automaticamente
  onModuleDestroy() {
    return this.disconnect()
  }
}
```

## Proximos passos (mencionados na aula)

O `RedisService` e a conexao bruta. O proximo passo e criar a implementacao do `CacheRepository` (interface de dominio) usando este service:

```typescript
// Estrutura esperada (sera implementado na proxima aula)
@Injectable()
export class RedisCacheRepository implements CacheRepository {
  constructor(private redis: RedisService) {}

  async get(key: string): Promise<string | null> {
    return this.redis.get(key)
  }

  async set(key: string, value: string): Promise<void> {
    await this.redis.set(key, value, 'EX', 60 * 15) // 15 min TTL
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(key)
  }
}
```