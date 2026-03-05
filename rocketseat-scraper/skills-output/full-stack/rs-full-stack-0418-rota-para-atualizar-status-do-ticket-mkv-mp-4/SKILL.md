---
name: rs-full-stack-rota-atualizar-status-ticket
description: "Applies PATCH route pattern for updating specific resource status in Node.js APIs. Use when user asks to 'close a ticket', 'update status', 'create a PATCH route', 'change resource state', or 'partial update endpoint'. Enforces PATCH over PUT for single-field updates, sub-resource route naming (/:id/close), and dedicated controller per action. Make sure to use this skill whenever creating status-change endpoints or partial update routes. Not for full resource updates (PUT), CRUD scaffolding, or database query optimization."
---

# Rota para Atualizar Status de Recurso (PATCH)

> Use PATCH com sub-rota nomeada pela acao quando atualizar um campo especifico de um recurso.

## Rules

1. **Use PATCH, nao PUT, para atualizacao parcial** — `PATCH /tickets/:id/close` nao `PUT /tickets/:id`, porque PATCH sinaliza modificacao de um campo especifico, nao substituicao do recurso inteiro
2. **Nomeie a sub-rota pela acao** — `/tickets/:id/close` nao `/tickets/:id/update-status`, porque a rota descreve a intencao de negocio, nao a operacao tecnica
3. **Crie controller dedicado por acao de status** — `updateStatus.js` separado do `update.js`, porque cada acao tem logica propria e mantem responsabilidade unica
4. **Nao envie body quando a acao e implicita** — se a rota `/close` ja define o novo status, o corpo da requisicao e desnecessario, porque a semantica esta na URL
5. **Importe com extensao .js explicita** — `import { updateStatus } from './updateStatus.js'`, porque Node.js ESM exige extensao

## How to write

### Rota PATCH com sub-recurso

```javascript
// routes/tickets.js
import { updateStatus } from '../controllers/tickets/updateStatus.js'

// PATCH /tickets/:id/close
app.patch('/tickets/:id/close', (request, response) => {
  updateStatus(request, response, database)
})
```

### Controller dedicado para acao de status

```javascript
// controllers/tickets/updateStatus.js
export function updateStatus(request, response, database) {
  const { id } = request.params

  // Atualiza apenas o status, nao o ticket inteiro
  database.update('tickets', id, { status: 'closed' })

  return response.end('OK')
}
```

## Example

**Before (PUT generico para tudo):**
```javascript
app.put('/tickets/:id', (request, response) => {
  const body = request.body // precisa enviar { status: 'closed' }
  update(request, response, database)
})
```

**After (PATCH com sub-rota semantica):**
```javascript
app.patch('/tickets/:id/close', (request, response) => {
  updateStatus(request, response, database) // status implicito na rota
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Mudar um campo especifico (status, flag) | PATCH com sub-rota nomeada pela acao |
| Substituir recurso inteiro | PUT com body completo |
| Multiplas acoes de status (close, reopen, archive) | Um controller por acao, todas PATCH |
| Acao nao precisa de dados extras | Nao exija body na requisicao |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `PUT /tickets/:id` com `{ status: 'closed' }` | `PATCH /tickets/:id/close` sem body |
| Controller generico `update` para tudo | Controller `updateStatus` dedicado |
| `import { x } from './x'` sem extensao | `import { x } from './x.js'` |
| Rota `/tickets/:id/update-status` | Rota `/tickets/:id/close` (acao explicita) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre PATCH vs PUT e design de sub-rotas
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes