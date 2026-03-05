---
name: rs-api-com-bun-setup-autenticacao-jwt
description: "Applies JWT authentication setup with Elysia framework when building APIs with Bun. Use when user asks to 'setup JWT', 'configure authentication', 'add auth to Elysia', 'create JWT with cookie', or 'setup token authentication'. Covers HS256 secret config, TypeBox payload schema, and cookie-based token strategy. Make sure to use this skill whenever configuring JWT auth in Elysia/Bun projects. Not for frontend auth flows, OAuth providers, or session-based authentication."
---

# Setup da Autenticação JWT no Elysia

> Configure JWT com cookie no Elysia usando secret HS256, schema tipado com TypeBox e cookie httpOnly para autenticação transparente ao frontend.

## Rules

1. **Instale ambos os pacotes juntos** — `@elysiajs/jwt` e `@elysiajs/cookie`, porque a estratégia cookie-based exige os dois módulos coordenados
2. **Use HS256 para monolitos** — algoritmo simétrico (uma chave secreta) é suficiente quando backend é único; use RS256/RS512 apenas quando múltiplos serviços precisam validar tokens
3. **Secret deve ser aleatório e longo** — nunca use strings previsíveis; gere via `openssl rand -hex 32` ou similar, porque a segurança do HS256 depende inteiramente do secret
4. **Guarde o secret em variável de ambiente** — nunca hardcode no código, porque vazamento do secret compromete todos os tokens existentes
5. **Defina schema do payload com TypeBox** — tipar o payload evita erros em rotas downstream e dá autocomplete, porque JWT aceita qualquer dado e sem schema o TypeScript não consegue inferir
6. **Use `sub` para identificar o dono do token** — padrão JWT (subject), geralmente o ID do usuário, porque é a claim padrão para identificação única
7. **Inclua dados de acesso frequente no payload** — como `restaurantId` opcional, porque evita queries/joins repetidos em rotas que precisam filtrar por contexto do usuário
8. **Nunca coloque dados sensíveis no payload** — JWT é assinado mas não criptografado; qualquer pessoa pode decodificar o conteúdo

## How to write

### Instalação

```bash
bun add @elysiajs/jwt @elysiajs/cookie
```

### Configuração do JWT no server

```typescript
import { Elysia } from 'elysia'
import { jwt } from '@elysiajs/jwt'
import { cookie } from '@elysiajs/cookie'
import { t } from 'elysia'
import { env } from '../env'

const app = new Elysia()
  .use(
    jwt({
      name: 'jwt', // opcional, default já é 'jwt'
      secret: env.JWT_SECRET_KEY,
      schema: t.Object({
        sub: t.String(),
        restaurantId: t.Optional(t.String()),
      }),
    })
  )
  .use(cookie())
```

### Variável de ambiente

```typescript
// env.ts
JWT_SECRET_KEY: z.string(), // ou Env.T.String() conforme o projeto
```

```env
JWT_SECRET_KEY=a1b2c3d4e5f6... # gerado com: openssl rand -hex 32
```

## Example

**Before (sem tipagem no payload):**
```typescript
.use(jwt({
  secret: 'my-secret',
}))

// Em outra rota — sem autocomplete, sem tipo
const token = await jwt.sign({ userId: user.id })
// token.sub → undefined, sem garantia de shape
```

**After (com schema TypeBox):**
```typescript
.use(jwt({
  secret: env.JWT_SECRET_KEY,
  schema: t.Object({
    sub: t.String(),
    restaurantId: t.Optional(t.String()),
  }),
}))

// Em outra rota — tipado, com autocomplete
const token = await jwt.sign({
  sub: user.id,
  restaurantId: user.managedRestaurantId ?? undefined,
})
```

## Heuristics

| Situação | Faça |
|----------|------|
| Backend monolito (uma aplicação) | HS256 com secret simétrico |
| Microserviços que validam tokens entre si | RS256/RS512 com chave pública/privada |
| Frontend e backend no mesmo domínio | Cookie-based JWT (frontend não precisa gerenciar token) |
| Frontend e backend em domínios diferentes | Bearer token no header Authorization |
| Dado usado em muitas rotas (ex: restaurantId) | Inclua no payload do JWT |
| Dado sensível (senha, CPF) | Nunca no payload — JWT não é criptografado |
| Cookie config (expiry, httpOnly) | Configure na hora de criar o cookie, não no `.use(cookie())` |

## Anti-patterns

| Nunca escreva | Escreva instead |
|---------------|-----------------|
| `secret: 'my-super-secret-key'` | `secret: env.JWT_SECRET_KEY` |
| `jwt({ secret })` sem schema | `jwt({ secret, schema: t.Object({...}) })` |
| `payload: { password: user.password }` | `payload: { sub: user.id }` |
| Validar token manualmente com crypto | Usar `jwt.verify()` do `@elysiajs/jwt` |
| Enviar JWT no body da response | Salvar JWT em cookie httpOnly |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/api-com/rs-api-com-bun-setup-da-autenticacao-jwt/references/deep-explanation.md)
- [Code examples](../../../data/skills/api-com/rs-api-com-bun-setup-da-autenticacao-jwt/references/code-examples.md)
