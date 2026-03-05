# Code Examples: Implementando Cache com Redis

## 1. Docker Compose completo

```yaml
version: '3'
services:
  postgres:
    container_name: nest-clean-pg
    image: postgres
    ports:
      - 5432:5432
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: docker
      POSTGRES_DB: nest-clean
    volumes:
      - ./data/pg:/var/lib/postgresql/data

  cache:
    container_name: nest-clean-cache
    image: redis
    ports:
      - 6379:6379
    volumes:
      - ./data/redis:/data
```

### Comandos de verificacao

```bash
# Subir containers
docker compose up -d

# Verificar se esta rodando
docker ps
# Saida esperada: container "nest-clean-cache" na porta 6379
```

## 2. Interface CacheRepository (dominio)

```typescript
export abstract class CacheRepository {
  abstract set(key: string, value: string): Promise<void>
  abstract get(key: string): Promise<string | null>
  abstract delete(key: string): Promise<void>
}
```

## 3. Implementacao RedisCacheRepository

```typescript
import { Injectable } from '@nestjs/common'
import { CacheRepository } from '../cache-repository'
import { RedisService } from './redis.service'

@Injectable()
export class RedisCacheRepository implements CacheRepository {
  constructor(private redis: RedisService) {}

  async set(key: string, value: string): Promise<void> {
    // EX = expiracao em segundos
    // 60 * 15 = 900 segundos = 15 minutos
    await this.redis.set(key, value, 'EX', 60 * 15)
  }

  async get(key: string): Promise<string | null> {
    return this.redis.get(key)
  }

  async delete(key: string): Promise<void> {
    // del retorna numero de chaves deletadas, mas descartamos o retorno
    await this.redis.del(key)
  }
}
```

## 4. CacheModule com wiring completo

```typescript
import { Module } from '@nestjs/common'
import { EnvModule } from '../env/env.module'
import { RedisService } from './redis.service'
import { CacheRepository } from './cache-repository'
import { RedisCacheRepository } from './redis/redis-cache-repository'

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

## 5. Variacoes do SET com opcoes Redis

```typescript
// Cache por 15 minutos (padrao do curso)
await this.redis.set(key, value, 'EX', 60 * 15)

// Cache por 1 hora
await this.redis.set(key, value, 'EX', 60 * 60)

// Cache em milissegundos (500ms — para rate limiting por exemplo)
await this.redis.set(key, value, 'PX', 500)

// Só seta se a chave NAO existe (util para locks)
await this.redis.set(key, value, 'EX', 60, 'NX')

// Só seta se a chave JA existe (util para refresh)
await this.redis.set(key, value, 'EX', 60, 'XX')

// Expira em timestamp especifico
const expiresAt = Math.floor(Date.now() / 1000) + 3600 // 1h from now
await this.redis.set(key, value, 'EXAT', expiresAt)
```

## 6. Uso tipico em um use case

```typescript
@Injectable()
export class GetQuestionBySlugUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private cacheRepository: CacheRepository,
  ) {}

  async execute({ slug }: GetQuestionBySlugRequest) {
    const cacheKey = `question:${slug}`

    // Tenta buscar do cache primeiro
    const cached = await this.cacheRepository.get(cacheKey)
    if (cached) {
      return { question: JSON.parse(cached) }
    }

    // Se nao tem cache, busca do banco
    const question = await this.questionsRepository.findBySlug(slug)
    if (!question) {
      throw new ResourceNotFoundError()
    }

    // Salva no cache para proximas requisicoes
    await this.cacheRepository.set(cacheKey, JSON.stringify(question))

    return { question }
  }
}
```

## 7. Invalidacao de cache apos mutacao

```typescript
@Injectable()
export class EditQuestionUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private cacheRepository: CacheRepository,
  ) {}

  async execute({ slug, title, content }: EditQuestionRequest) {
    const question = await this.questionsRepository.findBySlug(slug)
    if (!question) throw new ResourceNotFoundError()

    question.title = title
    question.content = content
    await this.questionsRepository.save(question)

    // Invalida o cache para que a proxima leitura busque dados frescos
    await this.cacheRepository.delete(`question:${slug}`)

    return { question }
  }
}
```

## 8. Docker Compose para producao (com bitnami)

```yaml
cache:
  container_name: nest-clean-cache
  image: bitnami/redis:latest
  ports:
    - 6379:6379
  environment:
    - REDIS_PASSWORD=sua_senha_segura
    - REDIS_DISABLE_COMMANDS=FLUSHDB,FLUSHALL
  volumes:
    - ./data/redis:/bitnami/redis/data
```