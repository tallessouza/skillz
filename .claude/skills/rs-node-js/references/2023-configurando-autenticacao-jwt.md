---
name: rs-node-js-2023-config-autenticacao-jwt
description: "Applies JWT authentication setup patterns with NestJS Passport and RS256 asymmetric keys. Use when user asks to 'configure JWT', 'setup authentication', 'add auth to NestJS', 'create login route', or 'secure API routes'. Covers module registration with async config, private/public key strategy, and dependency injection in module setup. Make sure to use this skill whenever setting up authentication in NestJS projects. Not for frontend auth, OAuth flows, or session-based authentication."
---

# Configurando Autenticacao JWT no NestJS

> Usar algoritmo RS256 com chave publica/privada para autenticacao JWT, nunca HS256 com secret simples em producao.

## Rules

1. **Crie um AuthModule separado** — isole toda logica de autenticacao em `auth/auth.module.ts`, porque modulos importados no AppModule propagam funcionalidade para toda a aplicacao
2. **Use RegisterAsync para configuracao com servicos** — quando precisar de ConfigService ou qualquer DI na configuracao de um modulo, use `registerAsync` com `inject` e `useFactory`, porque `register` nao tem acesso a servicos injetados
3. **Use RS256 em vez de HS256** — RS256 usa par de chaves (privada/publica), porque a chave publica pode ser distribuida para microservicos que so precisam validar tokens, sem poder criar novos
4. **Chave privada so no servico de autenticacao** — apenas o servico que cria tokens deve ter a chave privada, porque vazamento da chave privada permite criacao de tokens fraudulentos
5. **Chave publica em todos os servicos que validam** — a chave publica nao representa risco se vazar, porque ela so verifica tokens, nao cria
6. **Variaveis de ambiente para secrets** — armazene JWT secrets no `.env` e acesse via ConfigService, porque hardcoded secrets sao risco de seguranca

## How to write

### AuthModule com JwtModule.registerAsync

```typescript
// auth/auth.module.ts
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { Env } from '@/env'

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory(config: ConfigService<Env, true>) {
        const privateKey = config.get('JWT_PRIVATE_KEY', { infer: true })
        const publicKey = config.get('JWT_PUBLIC_KEY', { infer: true })

        return {
          signOptions: { algorithm: 'RS256' },
          privateKey: Buffer.from(privateKey, 'base64'),
          publicKey: Buffer.from(publicKey, 'base64'),
        }
      },
    }),
  ],
})
export class AuthModule {}
```

### Importar AuthModule no AppModule

```typescript
// app.module.ts
@Module({
  imports: [
    ConfigModule.forRoot(/* ... */),
    AuthModule,  // tudo definido no AuthModule funciona no app inteiro
  ],
})
export class AppModule {}
```

### Variaveis de ambiente

```env
JWT_PRIVATE_KEY=base64_encoded_private_key
JWT_PUBLIC_KEY=base64_encoded_public_key
```

## Example

**Before (HS256 com secret simples — inseguro para microservicos):**
```typescript
JwtModule.register({
  secret: 'minha-string-qualquer',
  signOptions: { expiresIn: '1d' },
})
```

**After (RS256 com chave assimetrica via ConfigService):**
```typescript
JwtModule.registerAsync({
  inject: [ConfigService],
  useFactory(config: ConfigService<Env, true>) {
    const privateKey = config.get('JWT_PRIVATE_KEY', { infer: true })
    const publicKey = config.get('JWT_PUBLIC_KEY', { infer: true })

    return {
      signOptions: { algorithm: 'RS256' },
      privateKey: Buffer.from(privateKey, 'base64'),
      publicKey: Buffer.from(publicKey, 'base64'),
    }
  },
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Aplicacao monolitica simples | RS256 ainda e preferivel, mas HS256 e aceitavel |
| Multiplos microservicos validam tokens | RS256 obrigatorio — distribua so a chave publica |
| Precisa de DI na config de modulo | `registerAsync` com `inject` + `useFactory` |
| Modulo usa `forRoot` | ConfigModule usa `forRoot`, JwtModule usa `register`/`registerAsync` |
| Secret precisa vir do ambiente | ConfigService com `{ infer: true }` para tipagem |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `secret: 'string-hardcoded'` | `privateKey` via ConfigService + `.env` |
| HS256 com secret compartilhado entre servicos | RS256 com chave publica distribuida |
| `JwtModule.register({ secret: process.env.JWT })` | `JwtModule.registerAsync` com ConfigService injetado |
| Logica de auth espalhada no AppModule | AuthModule separado importado no AppModule |
| Chave privada replicada em microservicos | Chave privada so no servico de autenticacao |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-configurando-autenticacao-jwt/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-configurando-autenticacao-jwt/references/code-examples.md)
