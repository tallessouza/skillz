---
name: rs-node-js-2023-cache-redis
description: "Applies Redis caching patterns when implementing cache repositories in NestJS applications. Use when user asks to 'add caching', 'implement Redis', 'create cache repository', 'setup Redis with NestJS', or 'configure cache layer'. Covers docker-compose setup, Redis repository implementation with expiration, and NestJS module wiring. Make sure to use this skill whenever adding cache infrastructure to a NestJS or Node.js project. Not for in-memory caching, HTTP cache headers, or CDN configuration."
---

# Implementando Cache com Redis no NestJS

> Implemente cache com Redis usando um repositorio que abstrai os metodos do Redis atras de uma interface de cache, com expiracao obrigatoria.

## Rules

1. **Sempre defina tempo de expiracao no cache** — use `EX` (segundos) no `set`, porque cache sem expiracao causa informacao desatualizada e consome memoria indefinidamente
2. **Use imagem bitnami/redis em producao** — a imagem `redis` padrao serve para desenvolvimento, mas `bitnami/redis` tem configuracoes de seguranca melhores
3. **Implemente via repositorio com interface** — `RedisCacheRepository implements CacheRepository`, porque permite trocar a implementacao sem afetar o dominio
4. **Registre com provide/useClass no module** — use o padrao `{ provide: CacheRepository, useClass: RedisCacheRepository }` para inversao de dependencia
5. **Exporte o CacheRepository do CacheModule** — outros modulos que importam o CacheModule precisam acessar o repositorio
6. **Nao esqueca o @Injectable()** — sem ele o NestJS nao consegue resolver as dependencias da classe

## How to write

### Docker Compose para Redis

```yaml
cache:
  container_name: nest-clean-cache
  image: redis  # producao: bitnami/redis
  ports:
    - 6379:6379
  volumes:
    - ./data/redis:/data
```

### Redis Cache Repository

```typescript
import { Injectable } from '@nestjs/common'
import { CacheRepository } from '../cache-repository'
import { RedisService } from './redis.service'

@Injectable()
export class RedisCacheRepository implements CacheRepository {
  constructor(private redis: RedisService) {}

  async set(key: string, value: string): Promise<void> {
    await this.redis.set(key, value, 'EX', 60 * 15) // 15 minutos
  }

  async get(key: string): Promise<string | null> {
    return this.redis.get(key)
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(key)
  }
}
```

### Cache Module wiring

```typescript
@Module({
  imports: [EnvModule],
  providers: [
    RedisService,
    { provide: CacheRepository, useClass: RedisCacheRepository },
  ],
  exports: [CacheRepository],
})
export class CacheModule {}
```

## Example

**Before (sem cache, acesso direto):**
```typescript
// Sem abstração, sem expiração
async getQuestion(slug: string) {
  return this.prisma.question.findUnique({ where: { slug } })
}
```

**After (com cache layer):**
```typescript
// Cache repository com expiração automática
async getQuestion(slug: string) {
  const cached = await this.cacheRepository.get(`question:${slug}`)
  if (cached) return JSON.parse(cached)

  const question = await this.prisma.question.findUnique({ where: { slug } })
  await this.cacheRepository.set(`question:${slug}`, JSON.stringify(question))
  return question
}
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Dado muda raramente e é lido frequentemente | Cache com EX longo (15-60 min) |
| Dado muda com frequencia | Cache curto (1-5 min) ou sem cache |
| Precisa invalidar ao atualizar | Use `delete` no cache apos mutacao |
| Primeiro deploy com Redis | `docker compose up -d` e `docker ps` para verificar |
| Erro "can't resolve dependencies" | Verificar `@Injectable()` e se o service correto esta nos providers |

## Anti-patterns

| Nunca faca | Faca isto |
|------------|-----------|
| Cache sem expiracao (`set` sem `EX`) | Sempre passe `EX` com segundos |
| Imagem `redis` em producao | Use `bitnami/redis` em producao |
| Injetar RedisService diretamente nos use cases | Injete CacheRepository (interface) |
| Esquecer `exports` no CacheModule | Exporte CacheRepository para outros modulos consumirem |
| Usar `EnvService` onde deveria ser `RedisService` | Verifique o tipo correto no constructor |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-implementando-cache-com-redis/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-implementando-cache-com-redis/references/code-examples.md)
