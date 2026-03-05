# Code Examples: Atualizacao de Registros

## Exemplo 1: Metodo update no Database (in-memory)

```javascript
// database.js
update(table, id, data) {
  const rowIndex = this.#database[table].findIndex(row => row.id === id)

  if (rowIndex > -1) {
    this.#database[table][rowIndex] = { id, ...data }
  }
}
```

**Passo a passo:**
1. `findIndex` percorre o array buscando o registro com o ID correspondente
2. Se encontrado, `rowIndex` sera >= 0
3. O registro e substituido por um novo objeto com o ID original + dados novos
4. Se nao encontrado (`rowIndex === -1`), nada acontece

## Exemplo 2: Rota PUT completa

```javascript
// routes.js
{
  method: 'PUT',
  path: buildRoutePath('/users/:id'),
  handler: (req, res) => {
    const { id } = req.params
    const { name, email } = req.body

    database.update('users', id, { name, email })

    return res.writeHead(204).end()
  }
}
```

**Passo a passo:**
1. `method: 'PUT'` — define que esta rota responde a requisicoes PUT
2. `path` usa `buildRoutePath` que converte `:id` em regex para capturar o parametro
3. `req.params.id` extrai o ID da URL
4. `req.body` ja foi parseado pelo middleware de JSON
5. `database.update` delega a logica de busca e substituicao ao banco
6. `204` indica sucesso sem corpo de resposta

## Exemplo 3: Bug demonstrado na aula (NAO faca isso)

```javascript
// ERRADO — substitui a tabela inteira
update(table, id, data) {
  this.#database[table] = { id, ...data }
}
```

**O que acontece:** o array `this.#database['users']` (que contem N registros) e substituido por um unico objeto `{ id, ...data }`. Todos os outros usuarios sao perdidos.

## Exemplo 4: Testando via HTTP client (Insomnia/HTTPie)

```http
### Criar usuario
POST http://localhost:3333/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com"
}

### Listar usuarios (copiar o ID retornado)
GET http://localhost:3333/users

### Atualizar usuario
PUT http://localhost:3333/users/ID-COPIADO-AQUI
Content-Type: application/json

{
  "name": "John Doe Updated",
  "email": "john.updated@example.com"
}
# Resposta: 204 No Content

### Verificar atualizacao
GET http://localhost:3333/users
# Resposta: usuario com nome e email atualizados
```

## Exemplo 5: Comparacao dos tres metodos do banco

```javascript
// CREATE — adiciona ao final do array
create(table, data) {
  this.#database[table].push(data)
  return data
}

// DELETE — remove pelo indice
delete(table, id) {
  const rowIndex = this.#database[table].findIndex(row => row.id === id)
  if (rowIndex > -1) {
    this.#database[table].splice(rowIndex, 1)
  }
}

// UPDATE — substitui pelo indice (preservando ID)
update(table, id, data) {
  const rowIndex = this.#database[table].findIndex(row => row.id === id)
  if (rowIndex > -1) {
    this.#database[table][rowIndex] = { id, ...data }
  }
}
```

**Padrao comum entre DELETE e UPDATE:**
- Ambos usam `findIndex` para localizar o registro
- Ambos verificam `> -1` antes de agir
- DELETE usa `splice` para remover; UPDATE usa atribuicao direta para substituir