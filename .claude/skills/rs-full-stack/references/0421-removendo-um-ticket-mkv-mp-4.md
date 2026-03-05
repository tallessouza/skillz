---
name: rs-full-stack-removendo-um-ticket
description: "Applies the delete route pattern for removing resources in Node.js APIs. Use when user asks to 'delete a record', 'remove an item', 'create a DELETE endpoint', 'implement resource deletion', or 'add a remove route'. Follows controller-based architecture with route params for ID, splice-based removal, and proper HTTP responses. Make sure to use this skill whenever implementing deletion functionality in Node.js APIs. Not for soft-delete patterns, bulk deletion, or database ORM operations."
---

# Removendo um Recurso via DELETE

> Implemente rotas DELETE seguindo o padrao: rota com ID no parametro, controller dedicado, busca por indice, splice para remocao e persistencia.

## Rules

1. **Rota DELETE recebe apenas o ID via parametro** — nao envie body na requisicao, porque o ID no path ja identifica o recurso univocamente
2. **Crie um controller dedicado para remocao** — `remove.js` separado, porque cada operacao CRUD tem seu proprio controller
3. **Valide existencia antes de remover** — busque o indice com `findIndex`, porque tentar remover algo inexistente deve retornar erro
4. **Use splice(index, 1) para remover** — o segundo argumento 1 indica remocao de apenas um elemento, porque splice sem limite remove tudo a partir do indice
5. **Persista apos remover** — chame a funcao de persistencia no banco, porque a remocao so existe em memoria ate ser salva
6. **Retorne resposta vazia com status 200** — use `response.end()` sem body, porque DELETE bem-sucedido nao precisa retornar conteudo

## How to write

### Rota DELETE

```javascript
import remove from "./controllers/tickets/remove.js"

// DELETE /tickets/:id
server.delete("/tickets/:id", (request, response) => {
  remove(request, response, database)
})
```

### Controller de remocao

```javascript
export function remove(request, response, database) {
  const { id } = request.params

  database.delete("tickets", id)

  return response.end()
}
```

### Metodo delete no banco de dados

```javascript
delete(table, id) {
  const index = this.#database[table].findIndex(row => row.id === id)

  if (index > -1) {
    this.#database[table].splice(index, 1)
    this.#persist()
  }
}
```

## Example

**Before (sem controller dedicado, sem validacao):**
```javascript
server.delete("/tickets/:id", (request, response) => {
  const { id } = request.params
  const data = readJSON("db.json")
  data.tickets = data.tickets.filter(t => t.id !== id)
  writeJSON("db.json", data)
  response.json({ deleted: true })
})
```

**After (com padrao controller + database):**
```javascript
// routes/tickets.js
server.delete("/tickets/:id", (request, response) => {
  remove(request, response, database)
})

// controllers/tickets/remove.js
export function remove(request, response, database) {
  const { id } = request.params
  database.delete("tickets", id)
  return response.end()
}

// database.js — metodo delete
delete(table, id) {
  const index = this.#database[table].findIndex(row => row.id === id)
  if (index > -1) {
    this.#database[table].splice(index, 1)
    this.#persist()
  }
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| DELETE de recurso unico | ID no path param, sem body |
| Recurso nao encontrado | Retorne 404 (findIndex retorna -1) |
| Confirmacao de delecao | `response.end()` com status 200, sem body |
| Multiplos recursos para deletar | Crie rota separada, nunca reutilize a de ID unico |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `filter()` para remover e reatribuir array inteiro | `splice(index, 1)` para remover in-place |
| Body na requisicao DELETE com o ID | ID exclusivamente no path param |
| Logica de banco dentro do controller | Metodo dedicado na classe database |
| `response.json({ deleted: true })` | `response.end()` sem conteudo |
| Remover sem verificar se existe | Checar `index > -1` antes do splice |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre o padrao DELETE e splice vs filter
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-0421-removendo-um-ticket-mkv-mp-4/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-0421-removendo-um-ticket-mkv-mp-4/references/code-examples.md)
