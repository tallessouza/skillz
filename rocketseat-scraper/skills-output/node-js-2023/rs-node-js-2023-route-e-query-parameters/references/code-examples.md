# Code Examples: Route e Query Parameters

## Exemplo 1: Estrutura de rotas da aplicacao

O codigo base que Diego esta construindo usa um array de rotas:

```javascript
const routes = [
  {
    method: 'GET',
    path: '/users',
    handler: (req, res) => {
      // Listagem — query params para filtro
      // GET /users?search=diego&page=1
      return res.end(JSON.stringify(users))
    }
  },
  {
    method: 'POST',
    path: '/users',
    handler: (req, res) => {
      // Criacao — dados no request body
      const { name, email } = req.body
      users.push({ id: randomUUID(), name, email })
      return res.writeHead(201).end()
    }
  },
  {
    method: 'DELETE',
    path: '/users/:id',
    handler: (req, res) => {
      // Remocao — route param identifica o recurso
      // DELETE /users/uuid-aqui
      return res.writeHead(204).end()
    }
  }
]
```

## Exemplo 2: Query Parameters na URL

```
GET http://localhost:3333/users?userId=1
```

- `userId` = chave (nome do parametro)
- `1` = valor
- Multiplos params concatenados com `&`:

```
GET http://localhost:3333/users?userId=1&name=Diego&page=2
```

## Exemplo 3: Route Parameters na URL

```
GET http://localhost:3333/users/1        → buscar usuario 1
DELETE http://localhost:3333/users/1     → deletar usuario 1
PUT http://localhost:3333/users/1        → atualizar usuario 1
```

O `1` nao tem nome explicito — o contexto vem do metodo HTTP + path.

## Exemplo 4: Request Body (Insomnia)

```
POST http://localhost:3333/users
Content-Type: application/json

{
  "name": "Diego",
  "email": "diego@rocketseat.com.br"
}
```

A URL nao contem nenhuma informacao do corpo — tudo vai no body separadamente.

## Exemplo 5: Problema do ID dinamico

Diego mostra no Insomnia que o ID do usuario e um UUID gerado automaticamente:

```
DELETE http://localhost:3333/users/a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

Esse valor muda para cada usuario, entao a rota precisa aceitar um parametro dinamico (`:id`) em vez de um valor fixo.

## Tabela resumo de uso

| Metodo | Path | Params | Uso |
|--------|------|--------|-----|
| `GET` | `/users` | `?search=diego&page=1` | Listar com filtro |
| `GET` | `/users/:id` | route param | Buscar um usuario |
| `POST` | `/users` | body: `{ name, email }` | Criar usuario |
| `PUT` | `/users/:id` | route param + body | Atualizar usuario |
| `DELETE` | `/users/:id` | route param | Remover usuario |