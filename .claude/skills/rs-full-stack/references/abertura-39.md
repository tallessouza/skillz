---
name: rs-full-stack-abertura-39
description: "Applies authentication and authorization concepts when building Node.js APIs with JWT. Use when user asks to 'add auth', 'protect routes', 'implement login', 'use JWT', or 'add authorization'. Distinguishes authentication (who are you?) from authorization (what can you do?) and enforces correct token-based flows. Make sure to use this skill whenever implementing auth in Node.js applications. Not for OAuth provider setup, session-based auth, or frontend auth UI components."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [node, jwt, authentication, authorization, middleware]
---

# Autenticação vs Autorização com JWT em Node.js

> Autenticação verifica QUEM é o usuário; autorização verifica O QUE ele pode fazer. São etapas distintas que devem ser implementadas separadamente.

## Key concept

Autenticação e autorização são frequentemente confundidas, mas resolvem problemas diferentes. Autenticação confirma identidade (login com credenciais → recebe token JWT). Autorização usa essa identidade confirmada para decidir permissões (token JWT na requisição → middleware verifica se o usuário tem acesso ao recurso).

## Decision framework

| Quando você encontra | Aplique |
|---------------------|---------|
| Usuário precisa provar quem é | Autenticação — validar credenciais, retornar JWT |
| Rota precisa ser protegida | Autorização — middleware que verifica JWT no header |
| Dados específicos por usuário | Extrair `userId` do token JWT decodificado |
| Diferentes níveis de acesso | Autorização por role/permission após autenticação |

## How to think about it

### Fluxo completo

```
1. Cliente envia credenciais (email + senha)
2. Servidor AUTENTICA: valida credenciais → gera JWT
3. Cliente armazena token e envia no header Authorization
4. Servidor AUTORIZA: middleware decodifica JWT → verifica permissões
5. Rota protegida executa ou retorna 401/403
```

### Separação de responsabilidades

```typescript
// AUTENTICAÇÃO — rota pública, valida identidade
app.post('/sessions', authenticateController)

// AUTORIZAÇÃO — middleware, verifica token antes da rota
app.get('/profile', verifyJWT, profileController)
app.delete('/users/:id', verifyJWT, verifyAdmin, deleteUserController)
```

## Common misconceptions

| Pessoas pensam | Realidade |
|---------------|-----------|
| Auth é uma coisa só | São duas etapas distintas: autenticação (identidade) e autorização (permissão) |
| JWT substitui sessions completamente | JWT é stateless, útil para APIs, mas tem trade-offs (revogação é mais complexa) |
| Token no body da request | Token vai no header `Authorization: Bearer {token}` |
| Middleware de auth em todas as rotas | Rotas públicas (login, registro) não precisam de verificação de token |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| Verificar permissões sem autenticar primeiro | Sempre autentique antes de autorizar |
| Armazenar senha no JWT payload | Armazene apenas `userId` e `role` no payload |
| Um middleware gigante que faz auth + authz | Separe em `verifyJWT` (autenticação) e `verifyRole` (autorização) |
| Retornar 403 para token inválido | 401 = não autenticado, 403 = não autorizado (são diferentes) |

## When to apply

- Toda API Node.js que precisa proteger rotas
- Quando o usuário pede para "adicionar login" ou "proteger endpoints"
- Ao implementar RBAC (Role-Based Access Control)
- Quando separando rotas públicas de privadas

## Limitations

- Esta skill cobre o modelo mental e a arquitetura. Para implementação detalhada de JWT (signing, refresh tokens, expiração), consulte skills específicas de JWT.
- Não cobre OAuth2/OpenID Connect com providers externos.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre a separação auth/authz e por que JWT é o padrão em APIs Node
- [code-examples.md](references/code-examples.md) — Exemplos completos de fluxo JWT com middleware em Node.js

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| 401 em rotas que deveriam ser publicas | Middleware de auth aplicado globalmente | Aplique middleware apenas em rotas protegidas, nao em login/registro |
| 403 retornado em vez de 401 | Confusao entre autenticacao e autorizacao | 401 = nao autenticado (token invalido), 403 = nao autorizado (sem permissao) |
| Token JWT nao decodifica | Secret key diferente entre sign e verify | Use a mesma secret key em ambas as operacoes |
| Senha aparece no payload do JWT | Dados sensíveis incluidos no token | Armazene apenas `userId` e `role` no payload do JWT |