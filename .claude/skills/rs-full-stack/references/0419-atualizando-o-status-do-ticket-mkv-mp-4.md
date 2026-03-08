---
name: rs-full-stack-atualizando-status-ticket
description: "Applies pattern of reusing existing database methods to update entity status in Node.js APIs. Use when user asks to 'update status', 'close a ticket', 'change record state', 'patch an entity', or 'reuse existing db methods'. Enforces minimal-code approach: leverage existing update methods instead of creating new ones. Make sure to use this skill whenever implementing status transitions or partial updates in REST APIs. Not for creating new CRUD methods, database schema design, or frontend status UI."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [node, rest-api, status-update, code-reuse, partial-update]
---

# Atualizando Status Reutilizando Metodos Existentes

> Antes de criar um metodo novo, verifique se um metodo generico existente resolve o problema.

## Rules

1. **Reutilize metodos genericos de update** — se o banco ja tem `database.update(table, id, data)`, use-o para mudar status, porque criar metodo especifico para cada campo gera codigo redundante
2. **Extraia o ID dos parametros da requisicao** — `const { id } = request.params`, porque o ID identifica o recurso no padrao REST
3. **Passe apenas os campos que mudam** — `{ status: 'closed' }` nao o objeto inteiro, porque update parcial evita sobrescrever dados
4. **Retorne resposta minima em updates** — `response.writeHead(204).end()` ou simplesmente `response.end()` com 200, porque o cliente ja sabe o que mudou
5. **Mantenha status como valores constantes** — `'open'`, `'closed'`, nao valores livres, porque facilita filtragem e previne typos

## How to write

### Update de status via metodo generico

```javascript
// Reutiliza database.update existente — zero metodos novos
const { id } = request.params

database.update('tickets', id, { status: 'closed' })

return response.writeHead(204).end()
```

### Rota PATCH para status

```javascript
// PATCH /tickets/:id/close
{ method: 'PATCH', path: '/tickets/:id/close', handler: (request, response) => {
  const { id } = request.params
  database.update('tickets', id, { status: 'closed' })
  return response.writeHead(204).end()
}}
```

## Example

**Before (metodo desnecessario):**

```javascript
// Criando metodo especifico no database — redundante
class Database {
  closeTicket(id) {
    const index = this.#database['tickets'].findIndex(row => row.id === id)
    this.#database['tickets'][index].status = 'closed'
    this.#persist()
  }
}
```

**After (reutilizando update existente):**

```javascript
// Usa o update generico que ja existe
database.update('tickets', id, { status: 'closed' })
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Precisa mudar 1 campo de uma entidade | Use `database.update(table, id, { campo: valor })` |
| Precisa de metodo novo no database | Primeiro verifique se `update` generico resolve |
| Response de update sem body | Use status 204 (No Content) ou 200 com body vazio |
| Filtrar por status apos update | Use query params: `?status=open` ou `?status=closed` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `database.closeTicket(id)` | `database.update('tickets', id, { status: 'closed' })` |
| `database.changeStatus(id, status)` | `database.update('tickets', id, { status })` |
| `response.end(JSON.stringify({ ok: true }))` em update simples | `response.writeHead(204).end()` |
| Status como numeros magicos (`status: 2`) | Status como strings legíveis (`status: 'closed'`) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre reutilizacao de metodos e design de APIs REST
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Status nao muda no banco | Metodo `update` nao esta sendo chamado corretamente | Verifique se os parametros sao `(table, id, data)` na ordem correta |
| Criou metodo especifico desnecessario | Nao verificou se `update` generico resolve | Use `database.update('tickets', id, { status: 'closed' })` |
| Response retorna corpo quando nao deveria | Usando `response.json()` em vez de `response.end()` | Use `response.writeHead(204).end()` para respostas sem corpo |
| Typo no valor do status | Status como string livre | Considere usar constantes: `const STATUS = { OPEN: 'open', CLOSED: 'closed' }` |