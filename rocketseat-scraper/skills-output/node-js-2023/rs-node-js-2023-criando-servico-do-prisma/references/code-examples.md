# Code Examples: Criando Servico do Prisma no NestJS

## Exemplo 1: Abordagem com propriedade client (NAO recomendada)

```typescript
// prisma/prisma.service.ts — abordagem verbosa
import { Injectable } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService {
  public client: PrismaClient

  constructor() {
    this.client = new PrismaClient()
  }
}
```

```typescript
// Uso no controller — note o .client intermediario
@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  async handle() {
    // Verboso: prisma.client.user
    const users = await this.prisma.client.user.findMany()
    return users
  }
}
```

## Exemplo 2: Abordagem com extends (RECOMENDADA)

```typescript
// prisma/prisma.service.ts — abordagem limpa
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
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

  onModuleInit() {
    return this.$connect()
  }

  onModuleDestroy() {
    return this.$disconnect()
  }
}
```

```typescript
// Uso no controller — acesso direto
@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  async handle() {
    // Limpo: prisma.user direto
    const users = await this.prisma.user.findMany()
    return users
  }
}
```

## Exemplo 3: Registro no AppModule

```typescript
// app.module.ts
import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { PrismaService } from './prisma/prisma.service'

@Module({
  controllers: [AppController],
  providers: [PrismaService],
})
export class AppModule {}
```

## Exemplo 4: Log de queries para debug

```typescript
// Temporario — para investigar queries SQL
@Injectable()
export class PrismaService extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: ['query', 'warn', 'error'], // 'query' mostra SQL no console
    })
  }

  onModuleInit() { return this.$connect() }
  onModuleDestroy() { return this.$disconnect() }
}

// Output no console ao executar uma query:
// prisma:query SELECT "public"."User"."id", ... FROM "public"."User" WHERE 1=1
```

## Exemplo 5: nest-cli.json para Prisma recente

```json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true,
    "assets": [
      {
        "include": "../generated/prisma",
        "outDir": "dist/generated",
        "watchAssets": true
      }
    ]
  }
}
```

## Exemplo 6: Padrao generalizado para qualquer conexao externa

```typescript
// O mesmo padrao se aplica a Redis, RabbitMQ, etc.
@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis

  async onModuleInit() {
    this.client = new Redis({ host: 'localhost', port: 6379 })
    await this.client.connect()
  }

  async onModuleDestroy() {
    await this.client.disconnect()
  }
}
```