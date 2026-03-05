# Code Examples: Criando Camada de Infraestrutura

## Estrutura de pastas antes vs depois

### Antes (tudo em src/)

```
src/
├── app.module.ts
├── main.ts
├── env.ts
├── auth/
│   └── auth.module.ts
├── prisma/
│   ├── prisma.service.ts
│   └── prisma.module.ts
├── controllers/
│   ├── create-account.controller.ts
│   ├── authenticate.controller.ts
│   ├── create-question.controller.ts
│   └── fetch-recent-questions.controller.ts
└── pipes/
    └── zod-validation-pipe.ts
```

### Depois (separado em infra/)

```
src/
├── domain/           # (futuro — regras de negocio puras)
└── infra/
    ├── app.module.ts
    ├── main.ts
    ├── env.ts
    ├── auth/
    │   └── auth.module.ts
    ├── database/
    │   └── prisma/
    │       ├── prisma.service.ts
    │       └── prisma.module.ts
    └── http/
        ├── http.module.ts
        ├── controllers/
        │   ├── create-account.controller.ts
        │   ├── authenticate.controller.ts
        │   ├── create-question.controller.ts
        │   └── fetch-recent-questions.controller.ts
        └── pipes/
            └── zod-validation-pipe.ts
```

## HttpModule completo

```typescript
// src/infra/http/http.module.ts
import { Module } from '@nestjs/common'
import { PrismaService } from '../database/prisma/prisma.service'
import { CreateAccountController } from './controllers/create-account.controller'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateQuestionController } from './controllers/create-question.controller'
import { FetchRecentQuestionsController } from './controllers/fetch-recent-questions.controller'

@Module({
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
  ],
  providers: [
    PrismaService,
    // PrismaService NAO e global, entao precisa estar aqui
    // para que os controllers consigam injeta-lo
  ],
})
export class HttpModule {}
```

## AppModule simplificado

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
    // PrismaService removido daqui — nao e mais necessario
    // porque nenhum controller/provider do AppModule usa ele
  ],
})
export class AppModule {}
```

## nest-cli.json atualizado

```json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true
  },
  "entryFile": "infra/main"
}
```

## Correcao de imports nos controllers

```typescript
// ANTES (path antigo)
import { PrismaService } from '../prisma/prisma.service'
import { AppModule } from '../app.module'

// DEPOIS (path atualizado)
import { PrismaService } from '../../database/prisma/prisma.service'
// AppModule nao e mais importado nos controllers
```

## Exemplo: provider nao-global vs global

```typescript
// Cenario 1: PrismaService NAO e global (padrao)
// Cada module que usa deve declarar em providers
@Module({
  controllers: [CreateAccountController],
  providers: [PrismaService], // OBRIGATORIO
})
export class HttpModule {}

// Cenario 2: Se PrismaModule fosse global
@Global() // Torna todos providers deste module acessiveis globalmente
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}

// Nesse caso, HttpModule NAO precisaria declarar PrismaService em providers
@Module({
  controllers: [CreateAccountController],
  // PrismaService acessivel automaticamente por ser global
})
export class HttpModule {}
```

## Verificacao — comandos usados na aula

```bash
# Iniciar banco de dados
docker compose up -d

# Rodar aplicacao em dev
pnpm run start:dev

# Rodar testes e2e para garantir que nada quebrou
pnpm run test:e2e
```