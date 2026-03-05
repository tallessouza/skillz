---
name: rs-seguranca-devs-broken-access-control
description: "Enforces Broken Access Control prevention patterns when writing backend code with routes, APIs, or database queries. Use when user asks to 'create an endpoint', 'build an API', 'implement CRUD', 'add a route', 'write a controller', or any server-side code that handles user-owned resources. Applies rules: validate ownership on every HTTP method (GET/POST/PUT/DELETE), never trust client input (headers/cookies/query strings/hidden fields/JSON bodies), validate nested object references (account IDs, group IDs inside payloads). Make sure to use this skill whenever generating backend code that accesses resources by ID, even if the user doesn't mention security. Not for frontend-only code, static pages, or authentication/login flows."
---

# Broken Access Control

> Toda rota que acessa um recurso por ID deve validar que o usuario autenticado tem permissao sobre aquele recurso, em todos os metodos HTTP, sem excecao.

## Rules

1. **Valide ownership em TODOS os metodos HTTP** — GET, POST, PUT e DELETE, porque programadores frequentemente validam no GET e esquecem no DELETE
2. **Nunca confie no cliente** — headers, cookies, campos hidden, query strings e valores dentro de JSON sao territorio do atacante, porque o cliente pode inspecionar e alterar qualquer valor antes de enviar
3. **Valide referencias aninhadas** — se o payload contem um `accountId`, `groupId` ou `bankId`, valide que o usuario tem acesso a esse recurso, porque atacantes trocam IDs internos em objetos JSON para acessar dados de outros usuarios
4. **Cuidado com endpoints genericos** — um `update?object=user&id=33` generico precisa de restricao solida, porque atacantes vao trocar `user` por `group`, `environment` e outros objetos do sistema
5. **IDs sequenciais sao previsíveis** — atacantes deduzem que `/ticket/1` implica `/ticket/2`, porque IDOR (Insecure Direct Object Reference) explora exatamente essa previsibilidade
6. **Broken Access Control e falha de logica de negocio** — nenhum firewall, WAF ou IA detecta automaticamente, porque so as regras de negocio definem quem pode acessar o que

## How to write

### Rota que retorna recurso por ID

```typescript
// Sempre filtre pelo usuario autenticado + ID do recurso
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

  // Validar que a conta pertence ao usuario
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

### DELETE com validacao de ownership

```typescript
app.delete('/entries/:id', auth, async (req, res) => {
  const entry = await db.entry.findFirst({
    where: { id: Number(req.params.id), userId: req.user.id }
  })
  if (!entry) return res.status(403).json({ error: 'Not authorized' })

  await db.entry.delete({ where: { id: entry.id } })
  return res.status(204).send()
})
```

## Example

**Before (vulneravel a IDOR):**
```typescript
app.get('/tickets/:id', auth, async (req, res) => {
  // Busca apenas pelo ID — qualquer usuario autenticado acessa qualquer ticket
  const ticket = await db.ticket.findUnique({
    where: { id: Number(req.params.id) }
  })
  return res.json(ticket)
})
```

**After (com validacao de ownership):**
```typescript
app.get('/tickets/:id', auth, async (req, res) => {
  // Filtra por ID + usuario autenticado
  const ticket = await db.ticket.findFirst({
    where: { id: Number(req.params.id), userId: req.user.id }
  })
  if (!ticket) return res.status(403).json({ error: 'Not authorized' })
  return res.json(ticket)
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Rota recebe ID na URL (`/resource/:id`) | Filtrar por ID + userId na query |
| Body JSON contem ID de recurso relacionado | Validar que o recurso relacionado pertence ao usuario |
| Endpoint generico serve multiplas tabelas | Whitelist explicita de tabelas permitidas + validacao por tabela |
| CRUD completo (GET/POST/PUT/DELETE) | Validar ownership em cada um dos 4 metodos |
| Campo hidden em formulario contem ID | Revalidar no servidor, nunca confiar no valor do cliente |
| Listagem de recursos (GET /resources) | Filtrar pelo userId na query, nao retornar tudo |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `findUnique({ where: { id } })` sem filtro de usuario | `findFirst({ where: { id, userId: req.user.id } })` |
| Validar acesso no GET mas nao no DELETE | Validar acesso em todos os metodos HTTP |
| Confiar em `req.body.userId` vindo do cliente | Usar `req.user.id` do token/sessao autenticada |
| Update generico que aceita qualquer tabela | Whitelist de tabelas + validacao de ownership por tabela |
| Validar ownership do recurso principal mas nao dos relacionados | Validar todos os IDs referenciados no payload |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/seguranca-para/rs-seguranca-para-devs-broken-access-control-em-aplicacoes/references/deep-explanation.md)
- [Code examples](../../../data/skills/seguranca-para/rs-seguranca-para-devs-broken-access-control-em-aplicacoes/references/code-examples.md)
