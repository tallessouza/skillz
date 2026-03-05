# Code Examples: Criando uma API com json-server

## Exemplo basico da aula

```json
// db.json
{
  "products": [
    { "id": 1, "name": "Mouse", "price": 150.25 },
    { "id": 2, "name": "Teclado", "price": 90 },
    { "id": 3, "name": "Monitor", "price": 500 }
  ]
}
```

## Exemplo com multiplos recursos

```json
// db.json
{
  "products": [
    { "id": 1, "name": "Mouse", "price": 150.25 },
    { "id": 2, "name": "Teclado", "price": 90 },
    { "id": 3, "name": "Monitor", "price": 500 }
  ],
  "users": [
    { "id": 1, "name": "João", "email": "joao@email.com" },
    { "id": 2, "name": "Maria", "email": "maria@email.com" }
  ]
}
```

Endpoints gerados: `/products`, `/users`

## Script no package.json

```json
{
  "scripts": {
    "server": "json-server db.json --port 3303"
  }
}
```

## Testando no navegador

```
# Listar todos os produtos (retorna array)
http://localhost:3303/products

# Buscar produto por ID (retorna objeto)
http://localhost:3303/products/1
http://localhost:3303/products/2
http://localhost:3303/products/3

# ID inexistente (retorna 404)
http://localhost:3303/products/7
```

## Variacao: recurso com mais campos

```json
{
  "products": [
    {
      "id": 1,
      "name": "Mouse Gamer",
      "price": 150.25,
      "category": "perifericos",
      "inStock": true
    },
    {
      "id": 2,
      "name": "Teclado Mecanico",
      "price": 290.00,
      "category": "perifericos",
      "inStock": false
    }
  ]
}
```

## Variacao: recurso para e-commerce completo

```json
{
  "products": [
    { "id": 1, "name": "Mouse", "price": 150.25 },
    { "id": 2, "name": "Teclado", "price": 90 }
  ],
  "orders": [
    { "id": 1, "userId": 1, "productId": 2, "quantity": 1 }
  ],
  "users": [
    { "id": 1, "name": "João", "email": "joao@email.com" }
  ]
}
```

Endpoints gerados: `/products`, `/orders`, `/users`