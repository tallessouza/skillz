# Code Examples: NestJS com DDD, SOLID e Clean Architecture

## Nota

Esta aula é introdutória e não contém código. Os exemplos abaixo ilustram a estrutura que será construída ao longo do módulo, baseado no que o instrutor descreve.

## Estrutura Esperada do Projeto

```
src/
├── infra/                    # Camada Nest (framework)
│   ├── http/
│   │   └── controllers/      # Controllers Nest
│   ├── database/
│   │   └── prisma/           # Prisma service e repositories
│   ├── cache/                # Módulo de caching
│   ├── messaging/            # Mensageria
│   └── env/                  # Variáveis ambiente
│
├── domain/                   # Camada de domínio (sem framework)
│   ├── entities/
│   ├── use-cases/
│   ├── repositories/         # Interfaces (contratos)
│   └── value-objects/
│
└── app.module.ts             # Root module Nest
```

## Fase 1: Controller Básico (Fundamentos)

```typescript
// src/infra/http/controllers/create-account.controller.ts
import { Controller, Post, Body } from '@nestjs/common'

@Controller('/accounts')
export class CreateAccountController {
  @Post()
  async handle(@Body() body: CreateAccountBody) {
    // Fase 1: lógica direto no controller
    // Fase 2: delegará para use case do domínio
  }
}
```

## Fase 2: Controller Integrado com Use Case do Domínio

```typescript
// src/infra/http/controllers/create-account.controller.ts
import { Controller, Post, Body } from '@nestjs/common'
import { CreateAccountUseCase } from '@/domain/use-cases/create-account'

@Controller('/accounts')
export class CreateAccountController {
  constructor(private createAccount: CreateAccountUseCase) {}

  @Post()
  async handle(@Body() body: CreateAccountBody) {
    await this.createAccount.execute({
      name: body.name,
      email: body.email,
      password: body.password,
    })
  }
}
```

## Repository: Interface no Domínio, Implementação no Nest

```typescript
// domain/repositories/accounts-repository.ts (SEM framework)
export interface AccountsRepository {
  create(account: Account): Promise<void>
  findByEmail(email: string): Promise<Account | null>
}

// infra/database/prisma/repositories/prisma-accounts-repository.ts (COM Nest)
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { AccountsRepository } from '@/domain/repositories/accounts-repository'

@Injectable()
export class PrismaAccountsRepository implements AccountsRepository {
  constructor(private prisma: PrismaService) {}

  async create(account: Account): Promise<void> {
    await this.prisma.account.create({ data: { /* ... */ } })
  }

  async findByEmail(email: string): Promise<Account | null> {
    return this.prisma.account.findUnique({ where: { email } })
  }
}
```