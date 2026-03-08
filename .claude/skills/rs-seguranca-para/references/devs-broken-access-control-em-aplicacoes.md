---
name: rs-seguranca-devs-broken-access-control
description: "Enforces Broken Access Control and IDOR prevention patterns when writing backend code with routes, APIs, or database queries. Use when user asks to 'create an endpoint', 'build an API', 'implement CRUD', 'add a route', 'write a controller', 'fetch resource by ID', or any server-side code that handles user-owned resources. Applies rules: validate ownership on every HTTP method (GET/POST/PUT/DELETE), never trust client input (headers/cookies/query strings/hidden fields/JSON bodies), validate nested object references (account IDs, group IDs inside payloads). Make sure to use this skill whenever generating backend code that accesses resources by ID, even if the user does not mention security. Not for frontend-only code, static pages, or authentication/login flows (use devs-boas-praticas-para-autenticacao)."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: seguranca-para-devs
  module: backend-security
  tags: [security, broken-access-control, idor, authorization, backend, api, ownership-validation]
---

# Broken Access Control

> Toda rota que acessa um recurso por ID deve validar que o usuario autenticado tem permissao sobre aquele recurso, em todos os metodos HTTP, sem excecao.

## Rules

1. **Valide ownership em TODOS os metodos HTTP** — GET, POST, PUT e DELETE, porque programadores frequentemente validam no GET e esquecem no DELETE
2. **Nunca confie no cliente** — headers, cookies, campos hidden, query strings e valores dentro de JSON sao territorio do atacante, porque o cliente pode inspecionar e alterar qualquer valor
3. **Valide referencias aninhadas** — se o payload contem um `accountId`, `groupId` ou `bankId`, valide que o usuario tem acesso a esse recurso, porque atacantes trocam IDs internos em objetos JSON
4. **Cuidado com endpoints genericos** — um `update?object=user&id=33` precisa de restricao solida, porque atacantes trocam `user` por `group`, `environment` e outros objetos
5. **IDs sequenciais sao previsiveis** — atacantes deduzem que `/ticket/1` implica `/ticket/2`, porque IDOR explora exatamente essa previsibilidade
6. **Broken Access Control e falha de logica de negocio** — nenhum firewall, WAF ou IA detecta automaticamente, porque so as regras de negocio definem quem pode acessar o que

## How to write

### Rota que retorna recurso por ID

```typescript
app.get('/tickets/:id', auth, async (req, res) => {
  const ticket = await db.ticket.findFirst({
    where: { id: Number(req.params.id), userId: req.user.id }
  })
  if (!ticket) return res.status(403).json({ error: 'Not authorized' })
  return res.json(ticket)
})
```

### POST com referencia aninhada

```typescript
app.post('/entries', auth, async (req, res) => {
  const { description, amount, accountId } = req.body
  const account = await db.account.findFirst({
    where: { id: accountId, companyId: req.user.companyId }
  })
  if (!account) return res.status(403).json({ error: 'Not authorized' })
  const entry = await db.entry.create({
    data: { description, amount, accountId, userId: req.user.id }
  })
  return res.json(entry)
})
```

## Example

**Before (vulneravel a IDOR):**
```typescript
app.get('/tickets/:id', auth, async (req, res) => {
  const ticket = await db.ticket.findUnique({
    where: { id: Number(req.params.id) } // Qualquer usuario acessa qualquer ticket
  })
  return res.json(ticket)
})
```

**After (com validacao de ownership):**
```typescript
app.get('/tickets/:id', auth, async (req, res) => {
  const ticket = await db.ticket.findFirst({
    where: { id: Number(req.params.id), userId: req.user.id }
  })
  if (!ticket) return res.status(403).json({ error: 'Not authorized' })
  return res.json(ticket)
})
```

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `findUnique({ where: { id } })` sem filtro de usuario | `findFirst({ where: { id, userId: req.user.id } })` |
| Validar acesso no GET mas nao no DELETE | Validar acesso em todos os metodos HTTP |
| Confiar em `req.body.userId` vindo do cliente | Usar `req.user.id` do token/sessao autenticada |
| Update generico que aceita qualquer tabela | Whitelist de tabelas + validacao de ownership |

## Troubleshooting

### Recurso retorna 200 mas dados sao de outro usuario
**Symptom:** Endpoint retorna dados que nao pertencem ao usuario autenticado
**Cause:** Query filtra apenas por ID do recurso, sem incluir userId na clausula where
**Fix:** Sempre adicione `userId: req.user.id` (ou companyId, orgId) na query. Use `findFirst` com duplo filtro em vez de `findUnique` com filtro unico.

### Endpoint DELETE nao verifica ownership
**Symptom:** Qualquer usuario autenticado consegue deletar recursos de outros
**Cause:** Validacao de ownership implementada apenas nos endpoints GET/POST, nao no DELETE
**Fix:** Aplique validacao de ownership em TODOS os metodos HTTP. Crie middleware de ownership reutilizavel.

## Deep reference library

- [deep-explanation.md](../../../data/skills/seguranca-para-devs/rs-seguranca-para-devs-broken-access-control-em-aplicacoes/references/deep-explanation.md) — Exemplos reais de IDOR, por que WAF nao detecta, endpoints genericos como superficie de ataque
- [code-examples.md](../../../data/skills/seguranca-para-devs/rs-seguranca-para-devs-broken-access-control-em-aplicacoes/references/code-examples.md) — CRUD completo com ownership, middleware reutilizavel, validacao de referencias aninhadas
