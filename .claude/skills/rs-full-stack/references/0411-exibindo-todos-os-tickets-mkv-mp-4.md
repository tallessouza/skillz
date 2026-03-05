---
name: rs-full-stack-0411-exibindo-todos-tickets
description: "Applies RESTful controller naming conventions and CRUD listing patterns when building Node.js APIs. Use when user asks to 'list records', 'create a GET endpoint', 'add an index route', 'fetch all items from database', or 'build a REST API'. Enforces index/create/show/update/remove naming for controllers, select method pattern for data access. Make sure to use this skill whenever creating listing endpoints or organizing controller files. Not for frontend rendering, pagination, or filtering logic."
---

# Exibindo Todos os Registros (Index Pattern)

> Ao criar endpoints de listagem, siga a convenção index para o controller e implemente um método select no banco de dados que retorne array vazio como fallback.

## Rules

1. **Use nomes convencionais para controllers** — `index` (listar), `create` (criar), `show` (exibir um), `update` (atualizar), `remove` (remover), porque outros devs reconhecem instantaneamente a responsabilidade do arquivo
2. **Método GET para listagem** — rotas de listagem sempre usam GET no mesmo path do create, porque REST diferencia operações pelo método HTTP, não pela URL
3. **Retorne array vazio quando tabela não existe** — `this.#database[table] ?? []`, porque evita erros de undefined e o cliente sempre recebe um array iterável
4. **Um controller por arquivo, uma responsabilidade** — `index.js` só lista, `create.js` só cria, porque facilita manutenção e localização de bugs
5. **Serialize a resposta com JSON.stringify** — `response.end(JSON.stringify(data))`, porque o Node.js puro não serializa objetos automaticamente

## How to write

### Método select no banco de dados

```javascript
select(table) {
  const data = this.#database[table] ?? []
  return data
}
```

### Controller index (listagem)

```javascript
export function index({ request, response, database }) {
  const tickets = database.select('tickets')
  return response.end(JSON.stringify(tickets))
}
```

### Rota GET para listagem

```javascript
import { index } from '../controllers/tickets/index.js'

// Dentro do array de rotas
{
  method: 'GET',
  path: '/tickets',
  controller: index
}
```

## Example

**Before (sem convenção, tudo misturado):**

```javascript
// routes/tickets.js
import { handleTickets } from '../controllers/ticketHandler.js'

{ method: 'GET', path: '/tickets', controller: handleTickets }
```

```javascript
// controllers/ticketHandler.js - faz tudo
export function handleTickets({ request, response, database }) {
  if (request.method === 'GET') { /* lista */ }
  if (request.method === 'POST') { /* cria */ }
}
```

**After (com convenções REST aplicadas):**

```javascript
// controllers/tickets/index.js — só lista
export function index({ request, response, database }) {
  const tickets = database.select('tickets')
  return response.end(JSON.stringify(tickets))
}

// controllers/tickets/create.js — só cria
export function create({ request, response, database }) {
  // ...
}
```

```javascript
// routes/tickets.js
import { create } from '../controllers/tickets/create.js'
import { index } from '../controllers/tickets/index.js'

{ method: 'POST', path: '/tickets', controller: create },
{ method: 'GET',  path: '/tickets', controller: index }
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Listar todos os registros de um recurso | Criar `controllers/{recurso}/index.js` com método GET |
| Mesmo path, operação diferente | Diferenciar pelo método HTTP (GET vs POST), não pela URL |
| Tabela pode não existir no banco | Retornar `?? []` como fallback seguro |
| Testar endpoint de listagem | Criar primeiro um registro via POST, depois verificar com GET |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `getTickets`, `listTickets`, `fetchAll` | `index` (convenção REST) |
| `if (!data) return []` com check manual | `data ?? []` (nullish coalescing) |
| Um arquivo controller com switch/if por método | Um arquivo por operação CRUD |
| `response.write(tickets)` sem stringify | `response.end(JSON.stringify(tickets))` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre convenções REST e organização de controllers
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-0411-exibindo-todos-os-tickets-mkv-mp-4/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-0411-exibindo-todos-os-tickets-mkv-mp-4/references/code-examples.md)
