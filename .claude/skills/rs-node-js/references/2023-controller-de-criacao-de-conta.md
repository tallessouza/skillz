---
name: rs-node-js-2023-controller-criacao-conta
description: "Enforces NestJS one-controller-per-route pattern when creating controllers, routes, or endpoints. Use when user asks to 'create a route', 'add an endpoint', 'create a controller', 'implement CRUD', or 'add a NestJS route'. Applies rules: one file per route, @Controller prefix on class, @Body decorator for request data, ConflictException for duplicates, strict TypeScript config. Make sure to use this skill whenever generating NestJS controller code. Not for frontend components, database schemas, or non-NestJS backends."
---

# Controller por Rota no NestJS

> Cada rota da aplicacao tem seu proprio arquivo de controller, eliminando decisoes de onde colocar novas rotas e mantendo arquivos pequenos.

## Rules

1. **Um controller por rota** — crie `create-account.controller.ts`, `delete-account.controller.ts`, etc., porque quando um controller acumula rotas, surge o problema de "em qual controller coloco esta rota que conecta dois dominios?"
2. **Use o sufixo `.controller.ts`** — `create-account.controller.ts` nao `createAccount.ts`, porque o NestJS reconhece o padrao e extensoes de icones do editor tambem
3. **Prefixo no `@Controller`, metodo no decorator HTTP** — coloque o recurso no `@Controller('accounts')` e deixe `@Post()` vazio, porque com uma rota por controller o prefixo ja e suficiente
4. **Metodo unico chamado `handle`** — como so ha uma rota por controller, nomeie o metodo como `handle`, porque elimina decisoes de nomenclatura
5. **Use `@Body()` para extrair o corpo** — nunca acesse `req.body` diretamente, porque o NestJS usa decorators para selecionar partes da requisicao (`@Body`, `@Param`, `@Query`)
6. **Lance exceptions tipadas, nunca retorne status manual** — use `ConflictException`, `NotFoundException`, etc., porque o NestJS converte automaticamente no status code correto (409, 404, etc.)
7. **Ative `strict: true` e `strictNullChecks: true` no tsconfig** — porque sem isso `findUnique` nao indica que o retorno pode ser `null`, escondendo bugs

## How to write

### Controller de criacao

```typescript
// src/controllers/create-account.controller.ts
import { Body, Controller, HttpCode, Post, ConflictException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Controller('/accounts')
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  async handle(@Body() body: any) {
    const { name, email, password } = body

    const userWithSameEmail = await this.prisma.user.findUnique({
      where: { email },
    })

    if (userWithSameEmail) {
      throw new ConflictException('User with same email address already exists.')
    }

    await this.prisma.user.create({
      data: { name, email, password },
    })
  }
}
```

### Registro no AppModule

```typescript
@Module({
  controllers: [CreateAccountController],
})
export class AppModule {}
```

## Example

**Before (controller monolitico):**
```typescript
@Controller('/users')
export class UserController {
  @Post() create() { /* ... */ }
  @Get() list() { /* ... */ }
  @Delete(':id') delete() { /* ... */ }
  // onde coloco "adicionar usuario a grupo"?
}
```

**After (um controller por rota):**
```typescript
// create-account.controller.ts
@Controller('/accounts')
export class CreateAccountController {
  @Post()
  async handle(@Body() body: any) { /* ... */ }
}

// add-user-to-group.controller.ts
@Controller('/groups/:groupId/members')
export class AddUserToGroupController {
  @Post()
  async handle(@Body() body: any) { /* ... */ }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Nova rota que conecta dois dominios | Crie novo controller, nao adicione em controller existente |
| Rota POST de criacao | Use `@HttpCode(201)` explicito |
| Verificacao de unicidade antes de criar | `findUnique` + `ConflictException` |
| Precisa do body da requisicao | `@Body()` no parametro do metodo |
| Logs do NestJS muito verbosos | `NestFactory.create(AppModule, { logger: false })` |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Controller com multiplas rotas CRUD | Um arquivo por rota |
| `res.status(409).json({...})` | `throw new ConflictException('message')` |
| `req.body.name` | `@Body() body` e desestruturar |
| `strict: false` no tsconfig | `strict: true` e `strictNullChecks: true` |
| Catch generico retornando 500 | Exceptions tipadas do NestJS (`ConflictException`, `NotFoundException`) |
| Metodo nomeado `createAccount()` | Metodo `handle()` (uma rota por controller) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-controller-de-criacao-de-conta/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-controller-de-criacao-de-conta/references/code-examples.md)
