# Code Examples: Rotas Privadas por Padrao

## Exemplo completo: public.ts

```typescript
// src/infra/auth/public.ts
import { SetMetadata } from '@nestjs/common'

export const IS_PUBLIC_KEY = 'isPublic'
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)
```

O `SetMetadata` e uma funcao factory do NestJS que cria um decorator customizado. Quando voce usa `@Public()` em um controller ou metodo, ele adiciona o metadata `{ isPublic: true }` naquela rota.

## Exemplo completo: JwtAuthGuard com suporte a rotas publicas

```typescript
// src/infra/auth/jwt-auth.guard.ts
import { ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { IS_PUBLIC_KEY } from './public'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super()
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) {
      return true
    }

    return super.canActivate(context)
  }
}
```

### Passo a passo:

1. `@Injectable()` — permite injecao do `Reflector`
2. `extends AuthGuard('jwt')` — herda a verificacao JWT do Passport
3. `constructor(private reflector: Reflector)` — injeta o servico que le metadata
4. `canActivate()` — sobrescreve o metodo que decide se a rota e acessivel
5. `getAllAndOverride()` — busca o metadata `isPublic` no handler e na classe
6. Se `isPublic === true` → retorna `true` (acesso liberado sem JWT)
7. Senao → chama `super.canActivate()` que faz a verificacao JWT normal

## Exemplo completo: AuthModule com APP_GUARD

```typescript
// src/infra/auth/auth.module.ts
import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { JwtAuthGuard } from './jwt-auth.guard'
import { JwtStrategy } from './jwt.strategy'

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      // ... configuracao do JWT
    }),
  ],
  providers: [
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AuthModule {}
```

## Exemplo: Controller publico (login)

```typescript
// src/infra/http/controllers/authenticate.controller.ts
import { Controller, Post, Body } from '@nestjs/common'
import { Public } from '@/infra/auth/public'

@Public()
@Controller('/sessions')
export class AuthenticateController {
  @Post()
  async handle(@Body() body: AuthenticateBodySchema) {
    // logica de autenticacao
    // nao precisa de JWT nos headers
  }
}
```

## Exemplo: Controller publico (criacao de conta)

```typescript
// src/infra/http/controllers/create-account.controller.ts
import { Controller, Post, Body } from '@nestjs/common'
import { Public } from '@/infra/auth/public'

@Public()
@Controller('/accounts')
export class CreateAccountController {
  @Post()
  async handle(@Body() body: CreateAccountBodySchema) {
    // logica de criacao de conta
    // nao precisa de JWT nos headers
  }
}
```

## Exemplo: Controller protegido (sem decorator adicional)

```typescript
// src/infra/http/controllers/create-question.controller.ts
import { Controller, Post, Body } from '@nestjs/common'
// Nao precisa importar UseGuards nem JwtAuthGuard!

@Controller('/questions')
export class CreateQuestionController {
  @Post()
  async handle(@Body() body: CreateQuestionBodySchema) {
    // protegido automaticamente pelo APP_GUARD
    // requisicao sem JWT valido retorna 401 Unauthorized
  }
}
```

## Antes e depois: removendo @UseGuards

```typescript
// ANTES — guard manual em cada controller
import { UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'

@Controller('/questions')
@UseGuards(JwtAuthGuard)  // ← isso vai embora
export class CreateQuestionController { /* ... */ }

@Controller('/questions')
@UseGuards(JwtAuthGuard)  // ← isso tambem
export class FetchRecentQuestionsController { /* ... */ }

// DEPOIS — limpo, sem repeticao
@Controller('/questions')
export class CreateQuestionController { /* ... */ }

@Controller('/questions')
export class FetchRecentQuestionsController { /* ... */ }
```

## Fix do tsconfig.json

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    // REMOVER esta linha:
    // "declaration": true,
    
    // O resto permanece igual
    "module": "commonjs",
    "target": "es2021",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "outDir": "./dist",
    "baseUrl": "./src",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

## Teste via HTTP client

```http
### Rota publica — funciona sem token
POST http://localhost:3333/sessions
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "123456"
}

### Rota protegida — falha sem token (401 Unauthorized)
GET http://localhost:3333/questions

### Rota protegida — funciona com token
GET http://localhost:3333/questions
Authorization: Bearer eyJhbGciOiJSUzI1NiIs...
```