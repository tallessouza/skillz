# Code Examples: Atualizando Status Reutilizando Metodos Existentes

## Exemplo 1: Update basico da aula

```javascript
// Rota de fechar ticket — handler completo
// O ID vem de request.params (extraido pelo router)
// database.update ja existe e faz persist automatico

const { id } = request.params

database.update('tickets', id, { status: 'closed' })

return response.end()
```

## Exemplo 2: Metodo update generico do database (contexto)

```javascript
// Este metodo JA EXISTE no database — nao precisa criar novo
update(table, id, data) {
  const rowIndex = this.#database[table].findIndex(row => row.id === id)

  if (rowIndex > -1) {
    this.#database[table][rowIndex] = {
      ...this.#database[table][rowIndex],
      ...data,
    }
    this.#persist()
  }
}
```

## Exemplo 3: Fluxo completo de criacao e fechamento

```javascript
// 1. Criar ticket (POST /tickets)
// Body: { equipment: "Monitor", description: "Monitor desliga de repente", user: "Maria" }
// Resultado: ticket criado com status "open" automaticamente

// 2. Listar tickets abertos (GET /tickets?status=open)
// Resultado: retorna o ticket da Maria

// 3. Fechar ticket (PATCH /tickets/:id/close)
database.update('tickets', id, { status: 'closed' })
// Resultado: status muda para "closed"

// 4. Verificar (GET /tickets?status=open)
// Resultado: lista vazia — ticket nao aparece mais

// 5. Verificar (GET /tickets?status=closed)
// Resultado: ticket da Maria aparece como closed
```

## Exemplo 4: Variacao com status dinamico

```javascript
// Se quiser permitir reabrir tickets tambem
// PATCH /tickets/:id/status
const { id } = request.params
const { status } = request.body // 'open' ou 'closed'

const validStatuses = ['open', 'closed']
if (!validStatuses.includes(status)) {
  return response.writeHead(422).end(JSON.stringify({
    error: 'Invalid status. Use: open, closed'
  }))
}

database.update('tickets', id, { status })
return response.writeHead(204).end()
```

## Exemplo 5: Rota dentro da tabela de rotas

```javascript
const routes = [
  // ... outras rotas
  {
    method: 'PATCH',
    path: buildRoutePath('/tickets/:id/close'),
    handler: (request, response) => {
      const { id } = request.params

      database.update('tickets', id, { status: 'closed' })

      return response.end()
    }
  }
]
```

## Exemplo 6: Anti-pattern — metodo desnecessario

```javascript
// NAO FACA: criar metodo especifico quando update generico resolve
class Database {
  closeTicket(id) {
    this.update('tickets', id, { status: 'closed' })
  }

  reopenTicket(id) {
    this.update('tickets', id, { status: 'open' })
  }

  // Cada novo status = novo metodo = codigo redundante
  // Todos fazem a mesma coisa: chamam update com campo diferente
}

// FACA: use update diretamente
database.update('tickets', id, { status: 'closed' })
database.update('tickets', id, { status: 'open' })
```