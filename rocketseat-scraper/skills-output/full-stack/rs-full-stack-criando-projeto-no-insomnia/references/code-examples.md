# Code Examples: Configurando Projeto no Insomnia

## Exemplo 1: Configuração do Shared Environment Dev

```json
{
  "base_url": "http://localhost:3333"
}
```

## Exemplo 2: Configuração do Shared Environment Prod (futuro)

```json
{
  "base_url": "https://api.rocketlog.com.br"
}
```

## Exemplo 3: Folder Environment para Users

```json
{
  "resource": "users"
}
```

## Exemplo 4: Folder Environment para Orders

```json
{
  "resource": "orders"
}
```

## Exemplo 5: Folder Environment para Deliveries

```json
{
  "resource": "deliveries"
}
```

## Exemplo 6: URLs compostas com variáveis

### Request: Create User
- **Método:** POST
- **URL:** `{{ base_url }}/{{ resource }}`
- **Resolve para:** `http://localhost:3333/users`

### Request: List Users
- **Método:** GET
- **URL:** `{{ base_url }}/{{ resource }}`
- **Resolve para:** `http://localhost:3333/users`

### Request: Get User by ID
- **Método:** GET
- **URL:** `{{ base_url }}/{{ resource }}/{{ user_id }}`
- **Resolve para:** `http://localhost:3333/users/abc-123`

Para esse caso, adicionar `user_id` como variável no folder environment ou usar diretamente no request.

## Exemplo 7: Estrutura completa de uma collection de API REST

```
Rocket Log (Collection)
│
├── [Shared Env] Dev
│   └── base_url: http://localhost:3333
│
├── [Shared Env] Prod
│   └── base_url: https://api.rocketlog.com.br
│
├── 📁 Users (resource: "users")
│   ├── POST   Create    → {{ base_url }}/{{ resource }}
│   ├── GET    List      → {{ base_url }}/{{ resource }}
│   ├── GET    Show      → {{ base_url }}/{{ resource }}/{{ user_id }}
│   ├── PUT    Update    → {{ base_url }}/{{ resource }}/{{ user_id }}
│   └── DELETE Remove    → {{ base_url }}/{{ resource }}/{{ user_id }}
│
├── 📁 Orders (resource: "orders")
│   ├── POST   Create    → {{ base_url }}/{{ resource }}
│   ├── GET    List      → {{ base_url }}/{{ resource }}
│   └── GET    Show      → {{ base_url }}/{{ resource }}/{{ order_id }}
│
└── 📁 Deliveries (resource: "deliveries")
    ├── POST   Create    → {{ base_url }}/{{ resource }}
    └── PATCH  Complete  → {{ base_url }}/{{ resource }}/{{ delivery_id }}/complete
```

## Exemplo 8: Testando a primeira request

A API do projeto Rocket Log, na aula, responde com uma mensagem simples de "Ok" ao receber POST em `/users`. O fluxo:

1. Garantir que o servidor está rodando na porta 3333
2. No Insomnia, selecionar ambiente `Dev`
3. Ir na pasta `Users` → request `Create`
4. Método: POST
5. URL: `{{ base_url }}/{{ resource }}`
6. Body: nenhum por enquanto (apenas testando conectividade)
7. Clicar Send
8. Resposta esperada: mensagem "Ok" confirmando que a rota está funcionando