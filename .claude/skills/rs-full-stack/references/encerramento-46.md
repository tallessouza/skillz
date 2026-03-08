---
name: rs-full-stack-encerramento-46
description: "Outlines authentication and authorization concepts including JWT, roles, and access control layers in Node.js applications. Use when user asks 'what is authentication vs authorization', 'explain JWT', 'how do roles work', or 'access control in Node'. Make sure to use this skill whenever the user needs a quick mental model of auth layers before implementing. Not for actual implementation code, database setup, or specific framework configuration."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: autenticacao
  tags: [jwt, autenticacao, autorizacao, roles, seguranca]
---

# Autenticação vs Autorização — Mental Model

> Autenticação verifica QUEM é o usuário; autorização verifica O QUE ele pode fazer.

## Key concepts

Autenticação e autorização são duas camadas distintas de acesso em uma aplicação. Implementá-las separadamente (sem banco de dados primeiro) ajuda a entender cada conceito antes de integrar com persistência.

## Decision framework

| Quando encontrar | Aplique |
|-----------------|---------|
| Usuário precisa provar identidade | Autenticação (login, JWT) |
| Usuário autenticado tenta acessar recurso | Autorização (roles, permissões) |
| Rotas com acesso restrito por perfil | Rules/roles — verificar perfil antes de permitir |
| Token precisa trafegar entre client/server | JWT (JSON Web Token) — stateless, self-contained |

## Camadas de acesso

### 1. Autenticação
- Verifica credenciais (email/senha, token)
- Gera JWT com payload do usuário
- Middleware valida token em rotas protegidas

### 2. Autorização
- Verifica roles/permissões do usuário autenticado
- Define O QUE cada perfil pode acessar
- Implementada como middleware após autenticação

### 3. Roles (Papéis)
- Cada usuário tem um perfil (admin, user, editor)
- Rules definem acesso por perfil
- Verificação acontece após confirmar autenticação

## Example

```javascript
// Middleware de autenticacao (verifica QUEM)
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]
  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  req.user = decoded
  next()
}

// Middleware de autorizacao (verifica O QUE)
function authorize(role) {
  return (req, res, next) => {
    if (req.user.role !== role) return res.status(403).json({ error: 'Forbidden' })
    next()
  }
}
```

## Common misconceptions

| Pessoas pensam | Realidade |
|---------------|-----------|
| Auth é uma coisa só | São duas camadas distintas: autenticação (quem) e autorização (o quê) |
| Precisa de banco de dados para implementar auth | Pode implementar auth com dados em memória para aprender o conceito isolado |
| JWT substitui autorização | JWT é mecanismo de autenticação; autorização é uma camada separada sobre ele |

## When to apply

- Ao projetar qualquer sistema que tenha login e controle de acesso
- Ao separar concerns: primeiro autenticação funciona, depois autorização
- Ao escolher entre session-based e token-based (JWT = stateless)

## Limitations

- Este modelo mental é o fundamento — implementação real requer banco de dados, refresh tokens, e tratamento de edge cases
- Roles simples podem não ser suficientes para sistemas complexos (considerar RBAC/ABAC)

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Token JWT expirado retorna 401 | Token tem tempo de vida limitado | Implemente refresh token ou re-autentique o usuario |
| Usuario autenticado mas sem permissao | Falta middleware de autorizacao apos autenticacao | Adicione middleware de verificacao de roles apos o middleware de auth |
| JWT invalido apos restart do servidor | Secret mudou ou nao esta em variavel de ambiente | Armazene JWT_SECRET em .env e mantenha consistente entre deploys |
| Roles nao funcionam para usuarios novos | Role padrao nao atribuida na criacao | Defina role default no cadastro: role = "user" |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre separação de autenticação e autorização
- [code-examples.md](references/code-examples.md) — Exemplos de código expandidos com variações