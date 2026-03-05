---
name: rs-node-js-2023-protegendo-rotas-guards
description: "Applies NestJS Guard pattern with Passport JWT strategy when protecting routes or implementing authentication. Use when user asks to 'protect a route', 'add authentication', 'create a guard', 'JWT strategy', 'restrict access', or 'authorize requests' in NestJS. Enforces correct JWT strategy setup with public key validation, Zod payload schema, and UseGuards decorator. Make sure to use this skill whenever implementing route protection in NestJS applications. Not for login/token generation, session-based auth, or non-NestJS frameworks."
---

# Protegendo Rotas com Guards no NestJS

> Rotas protegidas usam Guards com Passport JWT Strategy: a chave publica valida tokens, a chave privada so gera tokens.

## Rules

1. **Separe geracao de validacao** — chave privada no JwtModule (gerar tokens), chave publica na Strategy (validar tokens), porque sao responsabilidades distintas e a strategy nunca precisa criar tokens
2. **Extraia o token do header Authorization Bearer** — use `ExtractJwt.fromAuthHeaderAsBearerToken()`, porque e o padrao mais comum e seguro
3. **Valide o payload com Zod** — mesmo que o token seja valido criptograficamente, valide que o payload contem as informacoes necessarias (sub/uuid), porque tokens validos podem ter payloads incompletos
4. **Registre a Strategy como provider** — adicione no `providers` do modulo, porque o NestJS so conhece classes registradas no modulo
5. **Use @Injectable()** — toda Strategy precisa do decorator `@Injectable()`, porque sem ele o NestJS nao consegue fazer injecao de dependencia
6. **Crie um guard customizado** — estenda `AuthGuard('jwt')` em uma classe propria (`JwtAuthGuard`), porque simplifica o uso nos controllers e centraliza a configuracao

## How to write

### JWT Strategy

```typescript
// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { z } from 'zod'
import { Env } from '@/env'

const tokenSchema = z.object({
  sub: z.string().uuid(),
})

type TokenSchema = z.infer<typeof tokenSchema>

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService<Env, true>) {
    const publicKey = config.get('JWT_PUBLIC_KEY', { infer: true })

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Buffer.from(publicKey, 'base64'),
      algorithms: ['RS256'],
    })
  }

  async validate(payload: TokenSchema) {
    return tokenSchema.parse(payload)
  }
}
```

### Guard customizado

```typescript
// src/auth/jwt-auth.guard.ts
import { AuthGuard } from '@nestjs/passport'

export class JwtAuthGuard extends AuthGuard('jwt') {}
```

### Aplicando no controller

```typescript
@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  @Post()
  async handle() {
    return 'ok'
  }
}
```

### Registrando no modulo

```typescript
@Module({
  providers: [JwtStrategy, CreateQuestionController],
  controllers: [CreateQuestionController],
})
export class AppModule {}
```

## Example

**Before (rota desprotegida):**
```typescript
@Controller('/questions')
export class CreateQuestionController {
  @Post()
  async handle() {
    // qualquer pessoa acessa
    return 'ok'
  }
}
```

**After (rota protegida com Guard):**
```typescript
@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  @Post()
  async handle() {
    // apenas usuarios autenticados com token JWT valido
    return 'ok'
  }
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Rota precisa de usuario autenticado | `@UseGuards(JwtAuthGuard)` no controller ou no metodo |
| Payload do token precisa de mais campos | Estenda o `tokenSchema` com os campos necessarios |
| Multiplas strategies (JWT + API Key) | Crie strategies separadas, cada uma com seu guard |
| Token vem de query param ou body | Mude o `jwtFromRequest` (mas prefira header) |
| Algoritmo simetrico (HS256) | Use `secretOrKey` com string simples, sem Buffer |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `@UseGuards(AuthGuard('jwt'))` repetido em cada controller | Crie `JwtAuthGuard` e use a classe |
| Chave privada na Strategy | Apenas chave publica — Strategy so valida |
| `validate()` sem validacao de schema | Use Zod para garantir estrutura do payload |
| Strategy sem `@Injectable()` | Sempre adicione o decorator |
| Strategy criada mas nao registrada no modulo | Adicione nos `providers` do modulo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-protegendo-totas-com-guards/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-protegendo-totas-com-guards/references/code-examples.md)
