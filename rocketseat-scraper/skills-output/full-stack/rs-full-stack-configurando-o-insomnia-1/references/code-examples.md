# Code Examples: Configurando o Insomnia

## Exemplo 1: Environment Dev completo

```json
{
  "base_url": "http://localhost:3333",
  "auth_token": "Bearer eyJhbGciOiJIUzI1NiIs..."
}
```

## Exemplo 2: Environment de Produção

```json
{
  "base_url": "https://api.restaurant.com",
  "auth_token": "Bearer prod_token_here"
}
```

## Exemplo 3: Folder Environment — Products

```json
{
  "resource": "products"
}
```

## Exemplo 4: Folder Environment — Users

```json
{
  "resource": "users"
}
```

## Exemplo 5: Folder Environment — Orders

```json
{
  "resource": "orders"
}
```

## Exemplo 6: Estrutura completa de uma API REST no Insomnia

```
API Restaurant (Collection)
│
├── Base Environment
│   └── base_url = "http://localhost:3333"
│
├── Environments
│   ├── Dev (verde)  → base_url = "http://localhost:3333"
│   └── Prod (vermelho) → base_url = "https://api.restaurant.com"
│
├── Products/ (resource = "products")
│   ├── Index    GET    {{base_url}}/{{resource}}
│   ├── Show     GET    {{base_url}}/{{resource}}/1
│   ├── Create   POST   {{base_url}}/{{resource}}
│   │   Body: { "name": "Pizza", "price": 2990 }
│   ├── Update   PUT    {{base_url}}/{{resource}}/1
│   │   Body: { "name": "Pizza Margherita", "price": 3490 }
│   └── Delete   DELETE {{base_url}}/{{resource}}/1
│
├── Users/ (resource = "users")
│   ├── Index    GET    {{base_url}}/{{resource}}
│   ├── Show     GET    {{base_url}}/{{resource}}/1
│   └── Create   POST   {{base_url}}/{{resource}}
│       Body: { "name": "João", "email": "joao@email.com" }
│
└── Orders/ (resource = "orders")
    ├── Index    GET    {{base_url}}/{{resource}}
    ├── Show     GET    {{base_url}}/{{resource}}/1
    └── Create   POST   {{base_url}}/{{resource}}
        Body: { "user_id": 1, "product_ids": [1, 2] }
```

## Exemplo 7: URL renderizada passo a passo

```
Variáveis definidas:
  base_url = "http://localhost:3333"  (Base Environment)
  resource = "products"               (Folder Environment)

URL no Insomnia:  {{base_url}}/{{resource}}
URL renderizada:  http://localhost:3333/products

Se trocar para ambiente Prod:
  base_url = "https://api.restaurant.com"
  
URL renderizada:  https://api.restaurant.com/products
```

## Exemplo 8: Request com body JSON (POST Create)

```
Method: POST
URL: {{base_url}}/{{resource}}
Headers:
  Content-Type: application/json
Body:
{
  "name": "Hambúrguer Artesanal",
  "description": "Blend de costela e fraldinha",
  "price_in_cents": 3500,
  "category": "burgers"
}
```