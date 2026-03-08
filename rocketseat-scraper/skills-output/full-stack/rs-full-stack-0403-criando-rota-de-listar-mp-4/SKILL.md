---
name: rs-full-stack-0403-criando-rota-de-listar
description: "Enforces patterns for creating authorized listing routes in Express/Node.js APIs with role-based middleware. Use when user asks to 'list resources', 'create index route', 'add GET endpoint', 'restrict route by role', or 'apply middleware to specific route'. Covers per-route vs per-group middleware application and Manager/Employee authorization patterns. Make sure to use this skill whenever building listing endpoints with access control. Not for frontend rendering, pagination logic, or database query optimization."
---

# Criando Rota de Listar com Autorização

> Rotas de listagem usam o método `index` e aplicam middleware de autorização diretamente na rota quando o controle de acesso é específico para aquele endpoint.

## Rules

1. **Nomeie o método de listagem como `index`** — método assíncrono no controller que recebe `request` e `response`, porque é a convenção REST para listagem de recursos
2. **Aplique middleware por rota quando a restrição é específica** — passe o middleware como argumento intermediário no `.get()`, porque nem todas as rotas do grupo precisam da mesma restrição
3. **Aplique middleware por grupo quando a restrição é compartilhada** — use `router.use(middleware)` antes do grupo de rotas, porque evita repetição quando todas as rotas abaixo precisam da mesma verificação
4. **Restrinja listagem geral ao perfil Manager** — apenas gerentes devem ver todas as solicitações, porque funcionários comuns não devem ter acesso ao panorama completo
5. **Sempre teste com tokens de diferentes perfis** — verifique que Employee recebe 401/403 e Manager recebe 200, porque autorização sem teste é ilusão de segurança

## How to write

### Controller com método index

```javascript
// No controller, crie o método assíncrono index
async index(request, response) {
  // Lógica de listagem aqui
  return response.json({ message: "ok" })
}
```

### Middleware por rota (restrição específica)

```javascript
// Quando apenas UMA rota precisa de restrição específica
refundRoutes.get(
  "/",
  verifyUserAuthorization("manager"),
  refundController.index
)
```

### Middleware por grupo (restrição compartilhada)

```javascript
// Quando TODAS as rotas abaixo precisam da mesma restrição
router.use(ensureAuthenticated)
// Todas as rotas registradas após este ponto exigem autenticação
```

## Example

**Before (sem autorização na listagem):**
```javascript
refundRoutes.get("/", refundController.index)
```

**After (com autorização por perfil):**
```javascript
refundRoutes.get(
  "/",
  verifyUserAuthorization("manager"),
  refundController.index
)
```

## Heuristics

| Situação | Faça |
|----------|------|
| Listagem de todos os recursos do sistema | Restrinja ao perfil Manager |
| Listagem dos próprios recursos do usuário | Autenticação basta, sem restrição de role |
| Várias rotas com mesma restrição | Use `router.use(middleware)` no grupo |
| Uma rota com restrição diferente do grupo | Passe middleware como argumento na rota |
| Testando autorização | Crie usuários com perfis diferentes e troque tokens |

## Anti-patterns

| Nunca faça | Faça instead |
|------------|--------------|
| Listagem aberta sem middleware | Sempre proteja com autenticação + autorização |
| Aplicar middleware de role no grupo inteiro quando só uma rota precisa | Aplique por rota com argumento intermediário |
| Testar só com usuário autorizado | Teste com ambos os perfis (Employee e Manager) |
| Alterar role no banco sem recriar sessão | Faça novo login para gerar token atualizado |
| Esquecer de distinguir middleware por rota vs por grupo | Escolha conscientemente baseado no escopo da restrição |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre middleware por rota vs por grupo e fluxo de teste de autorização
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações