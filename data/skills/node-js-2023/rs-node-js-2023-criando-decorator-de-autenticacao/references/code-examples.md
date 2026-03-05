# Code Examples: Custom Decorator de Autenticacao

## Exemplo 1: Acesso via @Request() (antes)

O instrutor mostra primeiro a abordagem direta, para depois refatorar:

```typescript
import { Controller, Post, Body, Request } from '@nestjs/common'
import { Request as ExpressRequest } from 'express'

@Controller('/questions')
export class CreateQuestionController {
  @Post()
  async handle(
    @Body() body: CreateQuestionDto,
    @Request() request: ExpressRequest,
  ) {
    console.log(request.user)
    // { sub: 'uuid-do-usuario' }
  }
}
```

Problemas: tipagem inexistente no `user`, acoplamento ao Express, acesso ao request inteiro.

## Exemplo 2: Criando o decorator

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

## Exemplo 3: Definindo o tipo do payload

```typescript
// src/auth/user-payload.ts
export interface UserPayload {
  sub: string
}
```

Nota: o `sub` vem da convencao JWT (subject = ID do usuario).

## Exemplo 4: Usando no controller (depois)

```typescript
import { Controller, Post, Body, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CurrentUser } from '../auth/current-user.decorator'
import { UserPayload } from '../auth/user-payload'

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  @Post()
  async handle(
    @Body() body: CreateQuestionDto,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.sub
    // userId esta tipado como string, com autocomplete
  }
}
```

## Exemplo 5: Se quisesse passar parametros ao decorator

Caso hipotetico mostrado pelo instrutor — se voce quisesse filtrar campos:

```typescript
// Hipotetico: @CurrentUser('sub') retornaria so o sub
export const CurrentUser = createParamDecorator(
  (data: keyof UserPayload | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest()
    const user = request.user as UserPayload
    return data ? user[data] : user
  },
)
```

O instrutor menciona essa possibilidade mas opta por nao implementar, mantendo o decorator simples.

## Exemplo 6: Estrutura de arquivos

```
src/
└── auth/
    ├── jwt.strategy.ts          # Estrategia JWT (aula anterior)
    ├── jwt-auth.guard.ts        # Guard de autenticacao
    ├── current-user.decorator.ts # Decorator @CurrentUser()
    └── user-payload.ts          # Interface UserPayload
```