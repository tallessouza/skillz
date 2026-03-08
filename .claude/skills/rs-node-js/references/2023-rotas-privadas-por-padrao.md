---
name: rs-node-js-2023-rotas-privadas-por-padrao
description: "Applies NestJS global authentication guard pattern when configuring route protection. Use when user asks to 'protect routes', 'add authentication to all routes', 'make routes private by default', 'configure global guard', or 'set up NestJS auth guard'. Ensures APP_GUARD provider pattern with public route decorator. Make sure to use this skill whenever setting up NestJS authentication or adding guards globally. Not for JWT token generation, login logic, or Passport strategy configuration."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: nestjs-clean-architecture
  tags: [nestjs, auth-guard, APP_GUARD, public-decorator, jwt, authentication]
---

# Rotas Privadas por Padrao no NestJS

> Registre autenticacao globalmente e decore apenas as rotas publicas, nunca o contrario.

## Rules

1. **Registre o guard globalmente via APP_GUARD** — nao use `@UseGuards()` em cada controller, porque com dezenas de controllers voce vai esquecer de proteger algum e criar uma falha de seguranca
2. **Use o decorator `@Public()` para rotas abertas** — o padrao seguro e bloquear tudo e liberar explicitamente, porque uma rota esquecida fica protegida (fail-safe)
3. **Coloque o provider APP_GUARD no AuthModule** — nao no HttpModule, porque e semanticamente relacionado a autenticacao
4. **Adicione `@Injectable()` no guard customizado** — sem ele o `Reflector` nao sera injetado e `this.reflector` sera `undefined`
5. **Remova `declaration: true` do tsconfig** — projetos NestJS nao sao libs, nao precisam gerar `.d.ts`, e essa flag causa erro de inferencia com RxJS no guard

## How to write

### Provider global no AuthModule

```typescript
// auth.module.ts
import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from './jwt-auth.guard'

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AuthModule {}
```

### Decorator @Public()

```typescript
// src/infra/auth/public.ts
import { SetMetadata } from '@nestjs/common'

export const IS_PUBLIC_KEY = 'isPublic'
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)
```

### Guard com suporte a rotas publicas

```typescript
// jwt-auth.guard.ts
import { Injectable, ExecutionContext } from '@nestjs/common'
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

### Uso nos controllers

```typescript
// Rota publica — precisa do decorator
@Public()
@Controller('/accounts')
export class CreateAccountController { /* ... */ }

// Rota protegida — nao precisa de nada, protegida por padrao
@Controller('/questions')
export class FetchQuestionsController { /* ... */ }
```

## Example

**Before (guard manual em cada controller):**
```typescript
@Controller('/questions')
@UseGuards(JwtAuthGuard)  // repete em TODOS os controllers
export class CreateQuestionController { /* ... */ }

@Controller('/questions')
@UseGuards(JwtAuthGuard)  // esqueceu? falha de seguranca
export class FetchQuestionsController { /* ... */ }
```

**After (guard global + @Public onde necessario):**
```typescript
// Nenhum @UseGuards nos controllers protegidos
@Controller('/questions')
export class CreateQuestionController { /* ... */ }

// Apenas rotas publicas recebem decorator
@Public()
@Controller('/sessions')
export class AuthenticateController { /* ... */ }
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Nova rota na aplicacao | Nao faca nada — ja esta protegida por padrao |
| Rota de login ou criacao de conta | Adicione `@Public()` no controller |
| `this.reflector` retorna `undefined` | Verifique se `@Injectable()` esta no guard |
| Erro de tipo com RxJS no guard | Remova `declaration: true` do tsconfig |
| Migrando de guards manuais | Registre APP_GUARD e remova todos os `@UseGuards()` dos controllers protegidos |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `@UseGuards(JwtAuthGuard)` em cada controller | APP_GUARD global + `@Public()` nas excecoes |
| Guard global no HttpModule | Guard global no AuthModule |
| Esquecer `@Injectable()` no guard | Sempre decore guards com `@Injectable()` |
| `declaration: true` em projeto NestJS final | Remova — so libs precisam de `.d.ts` |

## Troubleshooting

### this.reflector retorna undefined no guard customizado
**Symptom:** Guard lanca erro ao tentar acessar metadata com Reflector
**Cause:** Falta o decorator `@Injectable()` na classe do guard, impedindo injecao do Reflector
**Fix:** Adicione `@Injectable()` na classe do guard e certifique-se de que o constructor recebe `private reflector: Reflector`

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
