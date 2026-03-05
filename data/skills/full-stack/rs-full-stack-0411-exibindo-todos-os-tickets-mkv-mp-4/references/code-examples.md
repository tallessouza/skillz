# Code Examples: Exibindo Todos os Registros

## 1. Método select no banco de dados (database.js)

```javascript
// Dentro da classe Database
select(table) {
  const data = this.#database[table] ?? []
  return data
}
```

**Contexto:** O `#database` é um objeto privado onde cada chave é o nome de uma tabela e o valor é um array de registros. O `??` (nullish coalescing) garante que se a tabela não existir ainda, retorna array vazio.

**Variação — select com log para debug:**
```javascript
select(table) {
  const data = this.#database[table] ?? []
  console.log(`[SELECT] ${table}: ${data.length} registros`)
  return data
}
```

## 2. Controller index.js

```javascript
export function index({ request, response, database }) {
  const tickets = database.select('tickets')
  return response.end(JSON.stringify(tickets))
}
```

**Desestruturação:** O controller recebe um objeto com `request`, `response` e `database` — mesmo padrão do `create.js`. Essa consistência permite que todos os controllers tenham a mesma assinatura.

## 3. Rota GET no arquivo de rotas

```javascript
import { create } from '../controllers/tickets/create.js'
import { index } from '../controllers/tickets/index.js'

// Array de rotas do recurso tickets
const ticketRoutes = [
  {
    method: 'POST',
    path: '/tickets',
    controller: create
  },
  {
    method: 'GET',
    path: '/tickets',
    controller: index
  }
]
```

**Observação:** Note que o `path` é idêntico (`/tickets`). A diferenciação é feita pelo `method`.

## 4. Estrutura completa de controllers (convenção)

```
controllers/
  tickets/
    create.js    → export function create({ request, response, database })
    index.js     → export function index({ request, response, database })
```

**Futuramente se expandiria para:**
```
controllers/
  tickets/
    create.js    → POST   /tickets
    index.js     → GET    /tickets
    show.js      → GET    /tickets/:id
    update.js    → PUT    /tickets/:id
    remove.js    → DELETE /tickets/:id
```

## 5. Fluxo completo — do banco à resposta

```javascript
// database.js — método select
select(table) {
  const data = this.#database[table] ?? []
  return data
}

// controllers/tickets/index.js
export function index({ request, response, database }) {
  const tickets = database.select('tickets')
  return response.end(JSON.stringify(tickets))
}

// routes/tickets.js
import { index } from '../controllers/tickets/index.js'
// { method: 'GET', path: '/tickets', controller: index }
```

## 6. Exemplo de retorno esperado

Após cadastrar dois tickets:

```json
[
  {
    "id": "uuid-1",
    "equipment": "Computador",
    "description": "Não liga",
    "user_name": "Maria"
  },
  {
    "id": "uuid-2",
    "equipment": "Teclado",
    "description": "A tecla de espaço não funciona",
    "user_name": "João Pedro"
  }
]
```

## 7. Variação — aplicando em outro recurso (users)

O mesmo padrão aplicado a users:

```javascript
// controllers/users/index.js
export function index({ request, response, database }) {
  const users = database.select('users')
  return response.end(JSON.stringify(users))
}

// routes/users.js
import { index } from '../controllers/users/index.js'
// { method: 'GET', path: '/users', controller: index }
```

A estrutura é idêntica — muda apenas o nome da tabela e o recurso. Essa é a força da convenção: previsibilidade total.