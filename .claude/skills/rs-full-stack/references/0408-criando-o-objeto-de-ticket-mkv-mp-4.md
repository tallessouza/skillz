---
name: rs-full-stack-criando-objeto-ticket
description: "Enforces proper object construction patterns for API resources in Node.js when creating entities with user-provided and system-generated fields. Use when user asks to 'create an endpoint', 'build a POST route', 'create a resource object', 'set up a CRUD entity', or 'design an API model'. Applies rules: separate user-input from system-defaults, always generate UUID with node:crypto, set default status, include createdAt/updatedAt timestamps. Make sure to use this skill whenever building POST endpoints or constructing resource objects in Node.js APIs. Not for database schema design, frontend forms, or authentication flows."
---

# Criando Objetos de Recurso em APIs Node.js

> Ao construir objetos de recurso, separe claramente dados informados pelo usuario de dados gerados pela API.

## Rules

1. **Separe dados do usuario dos dados do sistema** — campos como `equipment`, `description`, `userName` vem do body da requisicao; campos como `id`, `status`, `createdAt`, `updatedAt` sao gerados pela API, porque o usuario nao deve controlar identificadores nem metadados internos
2. **Gere IDs com `node:crypto` randomUUID** — use `import { randomUUID } from 'node:crypto'` com prefixo `node:` para indicar modulo nativo, porque UUID v4 garante unicidade sem dependencia externa
3. **Defina status padrao na criacao** — todo recurso novo recebe um status inicial (ex: `"open"`), porque o usuario nao deve definir o estado inicial do registro
4. **Inclua timestamps de criacao e atualizacao** — `createdAt` e `updatedAt` recebem `new Date()` na criacao; apenas `updatedAt` muda em atualizacoes futuras, porque isso permite rastrear historico do registro
5. **Desestruture o body da requisicao** — extraia campos nomeados via `const { field1, field2 } = request.body` em vez de acessar `request.body.field`, porque torna explicito quais campos sao esperados
6. **Retorne o objeto completo como JSON** — use `JSON.stringify()` no response para serializar, porque o cliente precisa confirmar o que foi criado incluindo campos gerados

## How to write

### Construcao do objeto de recurso

```javascript
import { randomUUID } from "node:crypto"

function create(request, response) {
  const { equipment, description, userName } = JSON.parse(request.body)

  const ticket = {
    id: randomUUID(),
    equipment,
    description,
    userName,
    status: "open",
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  return response.writeHead(201).end(JSON.stringify(ticket))
}
```

## Example

**Before (campos misturados, sem ID, sem timestamps):**
```javascript
function create(request, response) {
  const ticket = JSON.parse(request.body)
  return response.end(JSON.stringify(ticket))
}
```

**After (separacao clara, campos do sistema adicionados):**
```javascript
import { randomUUID } from "node:crypto"

function create(request, response) {
  const { equipment, description, userName } = JSON.parse(request.body)

  const ticket = {
    id: randomUUID(),
    equipment,
    description,
    userName,
    status: "open",
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  return response.writeHead(201).end(JSON.stringify(ticket))
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Endpoint POST que cria recurso | Sempre adicione `id`, `status`, `createdAt`, `updatedAt` |
| Endpoint PUT/PATCH que atualiza | Atualize apenas `updatedAt`, mantenha `createdAt` intacto |
| Precisa de ID unico | `randomUUID()` de `node:crypto`, nunca incremental |
| Campo tem valor padrao previsivel | Defina na API, nao espere o usuario informar |
| Body da requisicao | Desestruture apenas os campos esperados |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `const ticket = request.body` | `const { equipment, description } = request.body` |
| `id: tickets.length + 1` | `id: randomUUID()` |
| `import crypto from 'crypto'` | `import { randomUUID } from 'node:crypto'` |
| Objeto sem `createdAt`/`updatedAt` | Sempre inclua timestamps |
| `status` definido pelo usuario no POST | `status: "open"` fixo na API |
| `response.end(ticket)` | `response.end(JSON.stringify(ticket))` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre separacao de campos, UUID e timestamps
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-0408-criando-o-objeto-de-ticket-mkv-mp-4/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-0408-criando-o-objeto-de-ticket-mkv-mp-4/references/code-examples.md)
