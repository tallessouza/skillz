# Code Examples: Salvando Dados com Insert em File-Based Database

## Exemplo 1: Metodo insert completo

```javascript
// Dentro da classe Database
insert(table, data) {
  // Verifica se a tabela ja existe como array
  if (Array.isArray(this.#database[table])) {
    // Tabela existe — adiciona ao array existente
    this.#database[table].push(data)
  } else {
    // Tabela nao existe — cria com primeiro registro
    this.#database[table] = [data]
  }

  // Persiste no arquivo apos a insercao
  this.#persist()
}
```

## Exemplo 2: Controller de criacao de ticket

```javascript
// Route handler para POST /tickets
const createTicket = (request, response, database) => {
  const { equipment, description, userName } = request.body

  const ticket = {
    id: randomUUID(),
    equipment,
    description,
    userName,
    status: 'open',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  database.insert('tickets', ticket)

  return response
    .writeHead(201)
    .end(JSON.stringify(ticket))
}
```

## Exemplo 3: Estrutura do arquivo db.json apos insercoes

```json
{
  "tickets": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "equipment": "Notebook Dell",
      "description": "Tela quebrada",
      "userName": "Joao",
      "status": "open",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

## Exemplo 4: Variacao — insert com multiplas tabelas

```javascript
// Inserindo em diferentes tabelas
database.insert('tickets', {
  id: randomUUID(),
  equipment: 'Monitor LG',
  status: 'open'
})

database.insert('users', {
  id: randomUUID(),
  name: 'Maria',
  role: 'technician'
})

// Resultado no db.json:
// {
//   "tickets": [{ ... }],
//   "users": [{ ... }]
// }
```

## Exemplo 5: Classe Database completa ate este ponto

```javascript
import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf8')
      .then(data => {
        this.#database = JSON.parse(data)
      })
      .catch(() => {
        this.#persist()
      })
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist()
  }
}
```

## Exemplo 6: Testando via HTTP

```bash
# Primeira insercao — cria a tabela 'tickets'
curl -X POST http://localhost:3333/tickets \
  -H "Content-Type: application/json" \
  -d '{"equipment": "Notebook", "description": "Nao liga", "userName": "Pedro"}'

# Response: 201 Created
# {
#   "id": "...",
#   "equipment": "Notebook",
#   "description": "Nao liga",
#   "userName": "Pedro",
#   "status": "open",
#   "createdAt": "...",
#   "updatedAt": "..."
# }

# Segunda insercao — adiciona ao array existente
curl -X POST http://localhost:3333/tickets \
  -H "Content-Type: application/json" \
  -d '{"equipment": "Impressora", "description": "Papel travado", "userName": "Ana"}'
```