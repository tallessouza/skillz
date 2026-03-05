# Code Examples: Protegendo Rotas com Guards

## Exemplo completo: JWT Strategy

```typescript
// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { z } from 'zod'
import { Env } from '@/env'

// Schema de validacao do payload do token
const tokenSchema = z.object({
  sub: z.string().uuid(), // ID do usuario
})

type TokenSchema = z.infer<typeof tokenSchema>

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService<Env, true>) {
    // Apenas chave publica — Strategy so valida, nunca cria tokens
    const publicKey = config.get('JWT_PUBLIC_KEY', { infer: true })

    super({
      // Token vem do header Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Chave publica decodificada de base64
      secretOrKey: Buffer.from(publicKey, 'base64'),
      // Algoritmo assimetrico
      algorithms: ['RS256'],
    })
  }

  // Valida que o payload tem a estrutura esperada
  async validate(payload: TokenSchema) {
    return tokenSchema.parse(payload)
  }
}
```

## Exemplo completo: Guard customizado

```typescript
// src/auth/jwt-auth.guard.ts
import { AuthGuard } from '@nestjs/passport'

// Nenhuma implementacao necessaria — apenas encapsula a string 'jwt'
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

## Exemplo completo: Controller protegido

```typescript
// src/controllers/create-question.controller.ts
import { Controller, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'

@Controller('/questions')
@UseGuards(JwtAuthGuard) // Toda rota deste controller exige autenticacao
export class CreateQuestionController {
  @Post()
  async handle() {
    return 'ok'
  }
}
```

## Exemplo completo: Registro no modulo

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common'
import { JwtStrategy } from './auth/jwt.strategy'
import { CreateQuestionController } from './controllers/create-question.controller'

@Module({
  imports: [
    // ... ConfigModule, JwtModule (ja configurados)
  ],
  controllers: [
    CreateQuestionController,
  ],
  providers: [
    JwtStrategy, // Registrar a strategy como provider
  ],
})
export class AppModule {}
```

## Exemplo: Cliente HTTP com variavel automatica

```http
### Login - obtem o token
# @name authenticate
POST http://localhost:3333/sessions
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "123456"
}

### Criar pergunta - usa token automaticamente
POST http://localhost:3333/questions
Authorization: Bearer {{authenticate.response.body.accessToken}}
```

## Exemplo: Guard aplicado em metodo especifico (variacao)

```typescript
@Controller('/questions')
export class QuestionController {
  @Get()
  // Esta rota e publica
  async list() {
    return []
  }

  @Post()
  @UseGuards(JwtAuthGuard) // Apenas esta rota exige autenticacao
  async create() {
    return 'ok'
  }
}
```

## Fluxo de autenticacao completo

```
Cliente envia request
    │
    ▼
Header: Authorization: Bearer <token>
    │
    ▼
ExtractJwt.fromAuthHeaderAsBearerToken() extrai o token
    │
    ▼
Passport verifica assinatura com chave publica (RS256)
    │
    ├── Token invalido/expirado → 401 Unauthorized
    │
    ▼
validate(payload) executa
    │
    ├── Zod parse falha (sem sub/uuid) → 401 Unauthorized
    │
    ▼
Request prossegue para o controller
```