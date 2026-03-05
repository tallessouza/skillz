---
name: rs-node-js-2023-prisma-repositories
description: "Enforces the Repository Pattern with Prisma in NestJS applications following Clean Architecture. Use when user asks to 'implement repository', 'connect Prisma to domain', 'create database layer', 'implement persistence', or 'setup NestJS module with Prisma'. Applies rules: domain contracts in application layer, Prisma implementations in infra layer, Injectable decorator on all repositories, providers AND exports in database module. Make sure to use this skill whenever implementing persistence with Prisma in NestJS Clean Architecture projects. Not for raw Prisma queries, migrations, schema design, or non-NestJS projects."
---

# Implementando Repositorios do Prisma

> Repositorios Prisma implementam contratos do dominio na camada de infraestrutura, respeitando a direcao de dependencia da Clean Architecture.

## Rules

1. **Contratos vivem no dominio, implementacoes na infra** — `domain/forum/application/repositories/` contem interfaces, `infra/database/prisma/repositories/` contem implementacoes, porque camadas externas importam das internas, nunca o contrario
2. **Prefixe com Prisma** — `PrismaQuestionsRepository implements QuestionsRepository`, porque diferencia da implementacao in-memory usada em testes
3. **Todo repositorio injetavel precisa do decorator** — `@Injectable()` em cada classe de repositorio, porque o NestJS usa isso para resolver dependencias no construtor dos use cases
4. **Providers E Exports no modulo** — declare cada repositorio em `providers` E em `exports` do `DatabaseModule`, porque providers sem exports ficam visiveis apenas dentro do proprio modulo
5. **Organize banco de dados em pasta dedicada** — crie `infra/database/` agrupando Prisma e futuros ORMs, porque isola a tecnologia de persistencia
6. **DatabaseModule substitui providers diretos** — outros modulos importam `DatabaseModule`, nao declaram `PrismaService` diretamente, porque centraliza a configuracao de banco

## How to write

### Estrutura de pastas

```
src/infra/database/
├── database.module.ts
└── prisma/
    ├── prisma.service.ts
    └── repositories/
        ├── prisma-questions-repository.ts
        ├── prisma-answers-repository.ts
        ├── prisma-question-comments-repository.ts
        ├── prisma-answer-comments-repository.ts
        ├── prisma-question-attachments-repository.ts
        └── prisma-answer-attachments-repository.ts
```

### Repositorio Prisma

```typescript
import { Injectable } from '@nestjs/common'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
  // Implementar todos os metodos do contrato
  // Inicialmente pode usar throw new Error('Method not implemented.')
}
```

### Database Module

```typescript
import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaQuestionsRepository } from './prisma/repositories/prisma-questions-repository'
// ... demais repositorios

@Module({
  providers: [
    PrismaService,
    PrismaQuestionsRepository,
    PrismaAnswersRepository,
    PrismaQuestionCommentsRepository,
    PrismaAnswerCommentsRepository,
    PrismaQuestionAttachmentsRepository,
    PrismaAnswerAttachmentsRepository,
  ],
  exports: [
    PrismaService,
    PrismaQuestionsRepository,
    PrismaAnswersRepository,
    PrismaQuestionCommentsRepository,
    PrismaAnswerCommentsRepository,
    PrismaQuestionAttachmentsRepository,
    PrismaAnswerAttachmentsRepository,
  ],
})
export class DatabaseModule {}
```

### Consumindo no HTTP Module

```typescript
@Module({
  imports: [DatabaseModule], // nao precisa declarar PrismaService diretamente
  controllers: [QuestionController],
})
export class HttpModule {}
```

## Example

**Before (PrismaService direto no HttpModule):**
```typescript
@Module({
  providers: [PrismaService],
  controllers: [QuestionController],
})
export class HttpModule {}
```

**After (DatabaseModule centralizado):**
```typescript
// database.module.ts
@Module({
  providers: [PrismaService, PrismaQuestionsRepository],
  exports: [PrismaService, PrismaQuestionsRepository],
})
export class DatabaseModule {}

// http.module.ts
@Module({
  imports: [DatabaseModule],
  controllers: [QuestionController],
})
export class HttpModule {}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Novo repositorio de dominio criado | Criar implementacao Prisma correspondente com prefixo `Prisma` |
| Repositorio precisa ser usado em controller | Verificar se esta em `exports` do DatabaseModule |
| Erro de provider nao encontrado | Verificar se esta em `providers` E `exports` do modulo |
| Trocando ORM no futuro | Criar nova pasta ao lado de `prisma/` dentro de `database/` |
| Implementacao inicial | `throw new Error('Method not implemented.')` e ok temporariamente |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `PrismaService` direto em `providers` de outro modulo | `imports: [DatabaseModule]` |
| Repositorio Prisma sem `@Injectable()` | Sempre adicionar `@Injectable()` |
| `providers` sem `exports` correspondente | Duplicar em ambos se outros modulos precisam |
| Import de infra dentro do dominio | Dominio nunca importa de infra — so o contrario |
| Repositorio sem `implements ContratoDoDominio` | Sempre implementar o contrato da camada de aplicacao |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
