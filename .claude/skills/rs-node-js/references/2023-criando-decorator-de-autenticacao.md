---
name: 2023-criando-decorator-de-autenticacao
description: "Applies custom parameter decorator pattern for authentication in NestJS. Use when user asks to 'get current user', 'create auth decorator', 'access authenticated user in controller', 'implement @CurrentUser', or 'extract user from request'. Enforces createParamDecorator usage, UserPayload typing, never accessing @Request() directly. Make sure to use this skill whenever extracting authenticated user data in NestJS controllers. Not for guard implementation, JWT configuration, or middleware setup."
category: coding-lens
tags: [nestjs, decorator, authentication, createParamDecorator, typescript]
mind_lenses: [LT_01, LT_02, MF_01, GB_01, TH_04]
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: authentication
  tags: [nestjs, decorator, authentication, createParamDecorator, typescript, current-user]
---

# Custom Decorator de Autenticacao no NestJS

> Nunca acesse `request` diretamente no controller — crie um parameter decorator tipado para extrair dados do usuario autenticado.

## Rules

1. **Nunca use `@Request()` para pegar usuario** — crie um `@CurrentUser()` decorator, porque acessar o request vaza detalhes do Express e perde tipagem
2. **Use `createParamDecorator`** — nao `createClassDecorator`, porque e para um parametro de metodo
3. **Type o payload com interface propria** — `UserPayload` nao `any`
4. **Marque data como `_: never`** — quando o decorator nao recebe parametros
5. **Nomeie o tipo semanticamente** — `UserPayload` nao `TokenPayload`

## How to write

### CurrentUser Decorator

```typescript
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
export interface UserPayload {
  sub: string
}
```

### Uso no Controller

```typescript
@Post()
async handle(@CurrentUser() user: UserPayload) {
  const userId = user.sub
}
```

## Example

**Before (acesso direto ao request):**
```typescript
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

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `@Req() request: Request` para pegar user | `@CurrentUser() user: UserPayload` |
| `request.user` sem tipagem | `user.sub` com `UserPayload` tipado |
| `data: any` no createParamDecorator | `_: never` quando nao ha parametros |

## Troubleshooting

### Decorator retorna undefined
**Symptom:** `user` e undefined dentro do controller
**Cause:** Guard de autenticacao nao esta aplicado na rota ou no controller
**Fix:** Adicione `@UseGuards(JwtAuthGuard)` antes do `@Post()`

## Deep reference library

- [deep-explanation.md](mdc:data/skills/node-js-2023/rs-node-js-2023-criando-decorator-de-autenticacao/references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](mdc:data/skills/node-js-2023/rs-node-js-2023-criando-decorator-de-autenticacao/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
