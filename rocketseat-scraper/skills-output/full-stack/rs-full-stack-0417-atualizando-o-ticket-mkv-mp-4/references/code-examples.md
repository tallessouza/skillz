# Code Examples: Atualizando Registros

## Exemplo 1: Metodo update completo (da aula)

```javascript
// database.js
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

## Exemplo 2: Controller de update (da aula)

```javascript
// No handler da rota PUT /tickets/:id
const { equipamento, descricao } = req.body

database.update('tickets', id, {
  equipamento,
  descricao,
  updated_at: new Date(),
})

return res.writeHead(200).end()
```

## Exemplo 3: findIndex retornando -1

```javascript
// ID valido
const rowIndex = data.findIndex(row => row.id === '550e8400-e29b-41d4-a716-446655440009')
// rowIndex = 1 (encontrou na posicao 1)

// ID invalido (com X no final)
const rowIndex = data.findIndex(row => row.id === '550e8400-e29b-41d4-a716-446655440009X')
// rowIndex = -1 (nao encontrou)
```

## Exemplo 4: Spread merge em acao

```javascript
// Estado atual do registro
const registroAtual = {
  id: '550e8400-e29b-41d4-a716-446655440009',
  equipamento: 'teclado',
  descricao: 'tecla com defeito',
  status: 'open',
  created_at: '2024-01-15T10:00:00.000Z',
  updated_at: '2024-01-15T10:00:00.000Z',
}

// Dados enviados no update
const novosDados = {
  equipamento: 'mouse',
  descricao: 'botao esquerdo travando',
  updated_at: new Date(),
}

// Resultado do spread merge
const registroAtualizado = { ...registroAtual, ...novosDados }
// {
//   id: '550e8400-...-440009',          ← preservado
//   equipamento: 'mouse',               ← sobrescrito
//   descricao: 'botao esquerdo travando', ← sobrescrito
//   status: 'open',                     ← preservado
//   created_at: '2024-01-15T10:00:00.000Z', ← preservado (nunca muda)
//   updated_at: '2024-01-20T14:30:00.000Z', ← sobrescrito
// }
```

## Exemplo 5: Variacao — update com retorno de status

```javascript
update(table, id, data) {
  const rowIndex = this.#database[table].findIndex(row => row.id === id)

  if (rowIndex > -1) {
    this.#database[table][rowIndex] = {
      ...this.#database[table][rowIndex],
      ...data,
    }

    this.#persist()
    return true // registro atualizado
  }

  return false // registro nao encontrado
}
```

## Exemplo 6: Variacao — controller com tratamento de not found

```javascript
const updated = database.update('tickets', id, {
  equipamento,
  descricao,
  updated_at: new Date(),
})

if (updated) {
  return res.writeHead(200).end()
} else {
  return res.writeHead(404).end(JSON.stringify({ message: 'Ticket not found' }))
}
```

## Exemplo 7: Aplicando o mesmo padrao para outras entidades

```javascript
// Update de usuario
database.update('users', userId, {
  name: 'Novo Nome',
  email: 'novo@email.com',
  updated_at: new Date(),
})

// Update de produto
database.update('products', productId, {
  price_in_cents: 2990,
  updated_at: new Date(),
})

// Update parcial — so muda um campo
database.update('tickets', ticketId, {
  status: 'closed',
  updated_at: new Date(),
})
```