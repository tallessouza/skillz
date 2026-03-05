---
name: rs-node-js-2023-decorator-autenticacao
description: "Enforces NestJS custom parameter decorator patterns when accessing authenticated user data in controllers. Use when user asks to 'get current user', 'access authenticated user', 'create a decorator', 'get user from token', or any NestJS auth task. Applies createParamDecorator with ExecutionContext, proper typing, and clean controller signatures. Make sure to use this skill whenever implementing authentication access in NestJS controllers. Not for JWT strategy setup, guards configuration, or login/signup endpoints."
---

# Custom Decorator de Autenticacao no NestJS

> Nunca acesse `request` diretamente no controller — crie um parameter decorator tipado para extrair dados do usuario autenticado.

## Rules

1. **Nunca use `@Request()` para pegar usuario** — crie um `@CurrentUser()` decorator, porque acessar o request inteiro vaza detalhes do Express no controller e perde tipagem
2. **Use `createParamDecorator`** — nao `createClassDecorator`, porque o decorator e para um parametro de metodo, nao para uma classe
3. **Type o payload com interface/schema proprio** — `UserPayload` nao `any`, porque sem tipagem voce perde autocomplete e seguranca
4. **Marque data como `_: never`** — quando o decorator nao recebe parametros, porque documenta a intencao e previne uso incorreto
5. **Nomeie o tipo semanticamente** — `UserPayload` nao `TokenPayload`, porque o contexto de uso e o usuario, nao o token

## How to write

### CurrentUser Decorator

```typescript
// src/auth/current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { UserPayload } from './user-payload'

export const CurrentUser = createParamDecorator(
  (_: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest()
    return request.user as UserPayload
  },
)
```

### UserPayload Type

```typescript
// src/auth/user-payload.ts
export interface UserPayload {
  sub: string
}
```

### Uso no Controller

```typescript
@Post()
async handle(@CurrentUser() user: UserPayload) {
  const userId = user.sub
  // usar userId diretamente, sem acessar request
}
```

## Example

**Before (acesso direto ao request):**

```typescript
import { Request } from 'express'

@Post()
async handle(@Req() request: Request) {
  const userId = request.user.sub // sem tipagem, acoplado ao Express
}
```

**After (com decorator customizado):**

```typescript
@Post()
async handle(@CurrentUser() user: UserPayload) {
  const userId = user.sub // tipado, desacoplado, limpo
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Precisa do ID do usuario autenticado | Use `@CurrentUser()` e acesse `user.sub` |
| Decorator nao recebe parametros | Primeiro argumento `_: never` |
| Precisa de dados extras do token | Extenda `UserPayload` com novos campos |
| Precisa de dados do request alem do user | Crie outro decorator especifico, nao use `@Req()` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `@Req() request: Request` para pegar user | `@CurrentUser() user: UserPayload` |
| `request.user` sem tipagem | `user.sub` com `UserPayload` tipado |
| `TokenPayload` como nome do tipo | `UserPayload` (semantico ao contexto de uso) |
| `data: any` no createParamDecorator | `_: never` quando nao ha parametros |
| Logica de auth dentro do controller | Decorator + Guard separados |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
