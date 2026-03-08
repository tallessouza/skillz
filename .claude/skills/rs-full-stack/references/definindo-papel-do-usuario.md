---
name: rs-full-stack-definindo-papel-do-usuario
description: "Enforces JWT role-based access control patterns when implementing authentication in Node.js/Express APIs. Use when user asks to 'add user roles', 'restrict access', 'define permissions', 'create middleware', or 'implement authorization'. Applies rules: role in JWT payload, typed token payload interface, role injected into request, Express type augmentation. Make sure to use this skill whenever implementing role-based authorization in Express/Node APIs. Not for frontend auth, OAuth flows, or database-level RLS."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: authentication
  tags: [JWT, RBAC, authorization, middleware, Express, TypeScript, roles]
---

# Definindo Papel do Usuário (JWT Role-Based Access)

> Insira o papel (role) do usuário no payload do JWT e propague-o via middleware para toda a requisição.

## Rules

1. **Defina roles como propriedade do usuário** — `role: "customer"` ou `role: "seller"`, porque o controle de acesso depende de papéis explícitos, não de IDs
2. **Insira o role no payload do JWT** — junto com `sub` (user ID), porque o middleware precisa extrair o papel sem consultar o banco
3. **Crie uma interface `TokenPayload`** — tipando `role: string` e `sub: string`, porque `jwt.verify` retorna `unknown` e sem tipagem o TS não reconhece as propriedades
4. **Propague o role no objeto `request.user`** — atribua `role` junto com `id` no middleware, porque controllers precisam acessar o papel sem repetir lógica de decodificação
5. **Atualize o `express.d.ts`** — adicione `role: string` na interface `User` do Express, porque sem isso o TypeScript bloqueia o acesso a `request.user.role`
6. **Após adicionar role ao token, exija novo login** — tokens anteriores não contêm o campo `role`, porque JWT é imutável após assinatura

## How to write

### Token payload tipado

```typescript
interface TokenPayload {
  role: string
  sub: string
}

const { role, sub: userId } = jwt.verify(
  token,
  secret
) as TokenPayload
```

### Inserindo role no JWT (session controller)

```typescript
const fakeUser = { id: "user-id-123", role: "customer" }

const token = sign({ role: fakeUser.role }, secret, {
  subject: fakeUser.id,
})
```

### Middleware propagando role

```typescript
request.user = {
  id: userId,
  role,
}
```

### Augmentação de tipos do Express

```typescript
// express.d.ts
declare namespace Express {
  interface Request {
    user: {
      id: string
      role: string
    }
  }
}
```

## Example

**Before (sem role — apenas ID no token):**
```typescript
// session controller
const token = sign({}, secret, { subject: user.id })

// middleware
const { sub } = jwt.verify(token, secret)
request.user = { id: sub }

// controller — não sabe o papel
console.log(request.user.id) // funciona
console.log(request.user.role) // undefined
```

**After (com role no payload):**
```typescript
// session controller
const token = sign({ role: user.role }, secret, { subject: user.id })

// middleware
const { role, sub: userId } = jwt.verify(token, secret) as TokenPayload
request.user = { id: userId, role }

// controller — papel disponível
console.log(request.user.role) // "customer"
```

## Heuristics

| Situação | Faça |
|----------|------|
| Novo campo precisa estar disponível em todas as rotas | Adicione ao payload do JWT + middleware + express.d.ts |
| Token antigo não tem o campo novo | Exija novo login (nova sessão) para gerar token atualizado |
| Precisa restringir rota por papel | Leia `request.user.role` no controller ou crie middleware de autorização |
| `jwt.verify` retorna tipo genérico | Crie interface `TokenPayload` e use `as TokenPayload` |

## Anti-patterns

| Nunca faça | Faça assim |
|------------|------------|
| Buscar role no banco a cada request | Insira role no JWT payload |
| Deixar payload do JWT vazio `sign({}, secret)` | Passe dados úteis `sign({ role }, secret)` |
| Acessar `request.user.role` sem tipar | Crie `TokenPayload` interface e atualize `express.d.ts` |
| Reusar token antigo após mudar estrutura do payload | Gere novo token (novo login) |
| Hardcodar verificação de role em cada controller | Crie middleware de autorização reutilizável |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| `request.user.role` retorna `undefined` | Token antigo nao contem campo `role` | Faca logout e login novamente para gerar token atualizado |
| TypeScript bloqueia acesso a `role` | Falta augmentation no `express.d.ts` | Adicione `role: string` na interface `Request.user` |
| `jwt.verify` retorna tipo generico | Falta interface `TokenPayload` | Crie interface e use `as TokenPayload` no verify |
| Middleware nao propaga o role | `request.user` nao recebe o campo `role` | Adicione `role` ao objeto atribuido a `request.user` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre roles em JWT, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações