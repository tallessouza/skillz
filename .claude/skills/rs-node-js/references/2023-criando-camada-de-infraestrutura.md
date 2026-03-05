---
name: rs-node-js-2023-camada-infraestrutura
description: "Applies NestJS infrastructure layer separation when structuring or refactoring a NestJS project. Use when user asks to 'organize NestJS project', 'create infra layer', 'separate concerns in Nest', 'refactor folder structure', or 'create HTTP module'. Enforces separation of framework-specific code (controllers, pipes, Prisma) into infra/ with sub-folders by concern (http/, database/, auth/). Make sure to use this skill whenever creating or restructuring a NestJS application. Not for frontend projects, Express.js apps, or non-NestJS frameworks."
---

# Criando Camada de Infraestrutura no NestJS

> Separe tudo que e especifico de framework, banco de dados ou camada externa dentro de `src/infra/`, subdividido por concern.

## Rules

1. **Mova tudo framework-specific para `src/infra/`** — app.module, main.ts, prisma/, controllers/, pipes/, auth/, porque essas sao coisas que nao podem ser testadas unitariamente de forma isolada
2. **Subdivida infra/ por concern** — `infra/http/` para controllers e pipes, `infra/database/` para Prisma, porque HTTP e banco de dados nao tem relacao direta entre si
3. **Crie um module por sub-pasta** — `HttpModule`, `DatabaseModule`, porque cada concern deve declarar seus proprios providers e controllers
4. **Services nao-globais devem ser declarados em cada module que os usa** — se PrismaService nao e `@Global()`, passe-o em `providers` de cada module que injeta ele, porque NestJS nao resolve providers de outros modules automaticamente
5. **Atualize o entryFile no nest-cli.json** — aponte para `infra/main`, porque o NestJS precisa saber onde esta o novo arquivo de entrada
6. **Organizacao de pastas nao define Clean Architecture** — a separacao de concerns e o que importa, nao o nome das pastas; organize da forma que seu time se encontra melhor no codigo

## Steps

### Step 1: Criar pasta infra e mover arquivos

```
src/
├── infra/
│   ├── app.module.ts
│   ├── main.ts
│   ├── env.ts
│   ├── auth/
│   ├── database/
│   │   └── prisma/
│   └── http/
│       ├── controllers/
│       └── pipes/
└── domain/
```

### Step 2: Criar HttpModule

```typescript
// src/infra/http/http.module.ts
import { Module } from '@nestjs/common'
import { PrismaService } from '../database/prisma/prisma.service'
import { CreateAccountController } from './controllers/create-account.controller'
import { AuthenticateController } from './controllers/authenticate.controller'
// ... demais controllers

@Module({
  controllers: [
    CreateAccountController,
    AuthenticateController,
    // ... demais controllers
  ],
  providers: [
    PrismaService, // Obrigatorio: nao e global, controllers precisam dele
  ],
})
export class HttpModule {}
```

### Step 3: Simplificar AppModule

```typescript
// src/infra/app.module.ts
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './env'
import { AuthModule } from './auth/auth.module'
import { HttpModule } from './http/http.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
    HttpModule,
  ],
})
export class AppModule {}
```

### Step 4: Atualizar nest-cli.json

```json
{
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "entryFile": "infra/main"
}
```

### Step 5: Corrigir importacoes

Atualize todos os paths relativos que quebraram com a movimentacao. Exemplo:

```typescript
// Antes
import { PrismaService } from '../prisma/prisma.service'

// Depois
import { PrismaService } from '../../database/prisma/prisma.service'
```

## Verification

- Rode `pnpm run start:dev` e verifique que a aplicacao inicia sem erros
- Rode os testes e2e para garantir que nada quebrou
- Verifique que nenhum import aponta para caminhos antigos

## Error handling

- Se imports ficam com erro no editor apos mover: recarregue o VS Code (Cmd+Shift+P > Reload Window)
- Se NestJS nao encontra o main: verifique `entryFile` no nest-cli.json
- Se controller nao encontra PrismaService: adicione PrismaService em `providers` do module correspondente

## Heuristics

| Situacao | Acao |
|----------|------|
| Auth pode ser usado fora de HTTP | Mantenha auth/ no nivel de infra/, nao dentro de http/ |
| Service e usado em multiplos modules | Considere torna-lo `@Global()` ou crie um shared module |
| Duvida se algo e infra ou domain | Se depende de framework/lib externa = infra; se e regra de negocio pura = domain |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Tudo em um unico AppModule com 20 controllers | Um module por concern (HttpModule, DatabaseModule) |
| PrismaService usado em controller sem declarar no module | Declare PrismaService em providers de cada module que usa |
| Mover arquivos sem atualizar nest-cli.json | Sempre atualize entryFile apos mover main.ts |
| Achar que nome de pasta = arquitetura | Foque na separacao real de concerns, nao nos nomes |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-criando-camada-de-infraestrutura/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-criando-camada-de-infraestrutura/references/code-examples.md)
