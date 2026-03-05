# Code Examples: API de Restaurante — Fluxo Completo

## 1. Abertura de Mesa (Table Session)

### Request — Mesa disponivel
```http
POST /table-sessions
Content-Type: application/json

{
  "table_id": 4
}
```

### Response — Sucesso (201)
```json
{
  "id": 4,
  "table_id": 4,
  "opened_at": "2024-01-15T10:30:00Z",
  "closed_at": null
}
```

### Request — Mesa ocupada
```http
POST /table-sessions
Content-Type: application/json

{
  "table_id": 2
}
```

### Response — Erro (400)
```json
{
  "message": "This table is already in use"
}
```

## 2. Listagem de Sessoes Abertas

### Request
```http
GET /table-sessions
```

### Response (200)
```json
[
  { "id": 2, "table_id": 2, "opened_at": "2024-01-15T09:00:00Z", "closed_at": null },
  { "id": 3, "table_id": 3, "opened_at": "2024-01-15T09:15:00Z", "closed_at": null },
  { "id": 4, "table_id": 4, "opened_at": "2024-01-15T10:30:00Z", "closed_at": null }
]
```

## 3. CRUD de Produtos

### Criar produto
```http
POST /products
Content-Type: application/json

{
  "name": "Sorvete de chocolate",
  "price": 15
}
```

### Resposta (201)
```json
{
  "id": 25,
  "name": "Sorvete de chocolate",
  "price": 15
}
```

### Filtrar por nome
```http
GET /products?name=refri
```

### Resposta (200)
```json
[
  { "id": 23, "name": "Refrigerante em lata", "price": 7.50 }
]
```

### Atualizar produto
```http
PUT /products/25
Content-Type: application/json

{
  "name": "Sorvete de morango",
  "price": 15
}
```

### Deletar produto
```http
DELETE /products/25
```

### Verificar delecao
```http
GET /products?name=sorvete
```
```json
[]
```

## 4. Adicionar Itens ao Pedido

### Adicionar 1 bolinho de mandioca
```http
POST /order-items
Content-Type: application/json

{
  "product_id": 17,
  "quantity": 1,
  "table_session_id": 4
}
```

### Adicionar 2 refrigerantes
```http
POST /order-items
Content-Type: application/json

{
  "product_id": 23,
  "quantity": 2,
  "table_session_id": 4
}
```

## 5. Listar Itens do Pedido

### Request
```http
GET /order-items?table_session_id=4
```

### Response (200)
```json
[
  {
    "id": 1,
    "product_id": 17,
    "product_name": "Bolinho de mandioca",
    "quantity": 1,
    "price": 75.00
  },
  {
    "id": 2,
    "product_id": 23,
    "product_name": "Refrigerante em lata",
    "quantity": 2,
    "price": 7.50
  }
]
```

## 6. Resumo da Sessao (Total da Conta)

### Request
```http
GET /table-sessions/4/summary
```

### Response (200)
```json
{
  "table_session_id": 4,
  "total": 90.00,
  "items_count": 3
}
```

## 7. Fechar Mesa

### Request — Primeira vez
```http
DELETE /table-sessions/4/close
```

### Response (200)
```json
{
  "message": "Table session closed",
  "closed_at": "2024-01-15T12:00:00Z"
}
```

### Request — Mesa ja fechada
```http
DELETE /table-sessions/4/close
```

### Response (400)
```json
{
  "message": "This table session is already closed"
}
```

## 8. Padrao de Rotas Completo

```
# Mesas fisicas
GET    /tables

# Sessoes de mesa
GET    /table-sessions
POST   /table-sessions
DELETE  /table-sessions/:id/close
GET    /table-sessions/:id/summary

# Produtos
GET    /products?name=:query
POST   /products
PUT    /products/:id
DELETE /products/:id

# Itens de pedido
GET    /order-items?table_session_id=:id
POST   /order-items
```