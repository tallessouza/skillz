# Code Examples: Removendo um Ticket

## Exemplo 1: Rota completa no arquivo de rotas

```javascript
// routes/tickets.js
import { create } from "./controllers/tickets/create.js"
import { index } from "./controllers/tickets/index.js"
import { update } from "./controllers/tickets/update.js"
import { close } from "./controllers/tickets/close.js"
import remove from "./controllers/tickets/remove.js"

// DELETE /tickets/:id
server.delete("/tickets/:id", (request, response) => {
  remove(request, response, database)
})
```

Nota: a rota e `/tickets/:id` (sem `/close` ou outro sufixo), porque DELETE no recurso ja indica remocao.

## Exemplo 2: Controller remove.js

```javascript
// controllers/tickets/remove.js
export function remove(request, response, database) {
  const { id } = request.params

  database.delete("tickets", id)

  return response.end()
}
```

Versao inicial para debug (retornando o ID):
```javascript
export function remove(request, response, database) {
  const { id } = request.params
  return response.end(id)
}
```

## Exemplo 3: Metodo delete na classe Database

```javascript
// database.js
delete(table, id) {
  const index = this.#database[table].findIndex(row => row.id === id)

  if (index > -1) {
    this.#database[table].splice(index, 1)
    this.#persist()
  }
}
```

## Exemplo 4: Comparacao com o metodo update (mesmo padrao de busca)

```javascript
// update — muta o registro encontrado
update(table, id, data) {
  const index = this.#database[table].findIndex(row => row.id === id)

  if (index > -1) {
    this.#database[table][index] = { ...this.#database[table][index], ...data }
    this.#persist()
  }
}

// delete — remove o registro encontrado
delete(table, id) {
  const index = this.#database[table].findIndex(row => row.id === id)

  if (index > -1) {
    this.#database[table].splice(index, 1)
    this.#persist()
  }
}
```

## Exemplo 5: Variacao com tratamento de erro (404)

```javascript
// Controller com resposta 404
export function remove(request, response, database) {
  const { id } = request.params

  const deleted = database.delete("tickets", id)

  if (!deleted) {
    return response.writeHead(404).end(
      JSON.stringify({ error: "Ticket not found" })
    )
  }

  return response.writeHead(204).end()
}

// Database retornando boolean
delete(table, id) {
  const index = this.#database[table].findIndex(row => row.id === id)

  if (index > -1) {
    this.#database[table].splice(index, 1)
    this.#persist()
    return true
  }

  return false
}
```

## Exemplo 6: Teste via Insomnia

```
Method: DELETE
URL: http://localhost:3333/tickets/550e8400-e29b-41d4-a716-446655440009
Body: (vazio)

Response:
Status: 200 OK
Body: (vazio)
```

Verificacao apos delete:
```
Method: GET
URL: http://localhost:3333/tickets

Response:
[
  { "id": "...", "equipment": "...", ... },
  { "id": "...", "equipment": "...", ... }
]
// O ticket deletado nao aparece mais
```

## Estrutura final de arquivos

```
src/
├── routes/
│   └── tickets.js          # Todas as rotas CRUD
├── controllers/
│   └── tickets/
│       ├── create.js        # POST /tickets
│       ├── index.js         # GET /tickets
│       ├── update.js        # PUT /tickets/:id
│       ├── close.js         # PATCH /tickets/:id/close
│       └── remove.js        # DELETE /tickets/:id
└── database.js              # Classe com insert, select, update, delete
```