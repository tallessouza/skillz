---
name: rs-node-js-2023-criando-servico-do-prisma
description: "Generates NestJS Prisma service setup when user asks to 'setup Prisma with NestJS', 'create database service', 'configure Prisma in Nest', 'connect database in NestJS', or 'create Prisma provider'. Enforces class extension pattern over client property, lifecycle hooks for connect/disconnect, and proper DI registration. Make sure to use this skill whenever integrating Prisma ORM into a NestJS application. Not for standalone Prisma usage outside NestJS, raw SQL connections, or TypeORM/Sequelize setups."
---

# Criando Servico do Prisma no NestJS

> Estenda PrismaClient como um servico NestJS injetavel, com lifecycle hooks para gerenciar conexao.

## Rules

1. **Estenda PrismaClient, nao crie propriedade client** — `class PrismaService extends PrismaClient`, porque elimina a repeticao de `this.client` em todos os acessos e o servico JA E o cliente
2. **Decore com @Injectable()** — todo servico que sera injetado precisa do decorator, porque sem ele o container de DI do Nest nao consegue resolver a dependencia
3. **Registre como provider no AppModule** — adicione PrismaService no array `providers` do modulo raiz, porque sem registro o Nest nao sabe instanciar o servico
4. **Implemente OnModuleInit e OnModuleDestroy** — chame `this.$connect()` e `this.$disconnect()`, porque se a aplicacao crashar a conexao precisa fechar, e no auto-reload precisa reconectar
5. **Configure nest-cli.json para output do Prisma** — adicione assets do generated/prisma no compilerOptions, porque versoes recentes do Prisma geram o client em local customizado
6. **Passe opcoes via super()** — log, datasources e outras configs vao no construtor via `super({...})`, porque a classe estende PrismaClient diretamente

## How to write

### PrismaService completo

```typescript
// src/prisma/prisma.service.ts
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

### Registro no AppModule

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'

@Module({
  providers: [PrismaService],
})
export class AppModule {}
```

### Injecao em controller ou servico

```typescript
@Controller('/users')
export class UserController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async list() {
    return this.prisma.user.findMany()
  }
}
```

### nest-cli.json (versoes recentes do Prisma)

```json
{
  "compilerOptions": {
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

## Example

**Before (propriedade client separada — verboso):**

```typescript
@Injectable()
export class PrismaService {
  public client: PrismaClient

  constructor() {
    this.client = new PrismaClient()
  }
}

// No controller: this.prisma.client.user.findMany()
```

**After (extends PrismaClient — limpo):**

```typescript
@Injectable()
export class PrismaService extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({ log: ['warn', 'error'] })
  }
  onModuleInit() { return this.$connect() }
  onModuleDestroy() { return this.$disconnect() }
}

// No controller: this.prisma.user.findMany()
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Servico conecta com meio externo (DB, Redis, etc) | Implemente OnModuleInit + OnModuleDestroy |
| Precisa de log SQL para debug | Adicione `log: ['query']` no super() temporariamente |
| Producao | Use `log: ['warn', 'error']` apenas |
| Multiplos modulos precisam do Prisma | Registre PrismaService no AppModule (modulo raiz) ou crie PrismaModule com exports |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|-------------------|
| `public client = new PrismaClient()` dentro do service | `extends PrismaClient` na classe |
| `this.prisma.client.user.findMany()` | `this.prisma.user.findMany()` |
| Service sem `@Injectable()` | Sempre decore com `@Injectable()` |
| Apenas `OnModuleInit` sem `OnModuleDestroy` | Implemente ambos, porque crash sem disconnect vaza conexoes |
| `new PrismaClient()` direto no controller | Injete PrismaService via construtor |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-criando-servico-do-prisma/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-criando-servico-do-prisma/references/code-examples.md)
