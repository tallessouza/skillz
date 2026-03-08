# Code Examples: Testando a Aplicação em Produção

## Cadastro de usuário

### Requisição
```http
POST /users
Content-Type: application/json

{
  "name": "Rodrigo",
  "email": "rodrigo@email.com",
  "password": "123456"
}
```

### Resposta esperada
```json
{
  "id": "uuid-gerado",
  "name": "Rodrigo",
  "email": "rodrigo@email.com"
}
```

### Verificação no banco
```sql
SELECT * FROM users;
```

## Autenticação (Login)

### Requisição
```http
POST /sessions
Content-Type: application/json

{
  "email": "rodrigo@email.com",
  "password": "123456"
}
```

### Resposta esperada
```json
{
  "token": "jwt-token-aqui",
  "user": {
    "id": "uuid",
    "name": "Rodrigo",
    "email": "rodrigo@email.com"
  }
}
```

## Criação de segundo usuário (para testar roles)

```http
POST /users
Content-Type: application/json

{
  "name": "Paulo",
  "email": "paulo@email.com",
  "password": "123456"
}
```

## Alteração de role diretamente no banco

```sql
-- Mudar perfil de cliente para vendedor
UPDATE users SET role = 'sale' WHERE id = '<paulo_user_id>';

-- Verificar alteração
SELECT * FROM users;
```

## Login com usuário vendedor

```http
POST /sessions
Content-Type: application/json

{
  "email": "paulo@email.com",
  "password": "123456"
}
```

## Criação de entrega (autenticado como vendedor)

```http
POST /deliveries
Content-Type: application/json
Authorization: Bearer <token_do_paulo>

{
  "user_id": "<rodrigo_user_id>",
  "description": "Teclado mecânico"
}
```

### Verificação no banco
```sql
SELECT * FROM deliveries;
```

## Listagem de entregas via API

```http
GET /deliveries
Authorization: Bearer <token>
```

### Resposta esperada
```json
[
  {
    "id": "delivery-uuid",
    "user_id": "rodrigo-uuid",
    "description": "Teclado mecânico",
    "status": "processing"
  }
]
```

## Atualização de status da entrega

```http
PATCH /deliveries/<delivery_id>/status
Content-Type: application/json
Authorization: Bearer <token>

{
  "status": "shipped"
}
```

## Listagem de logs da entrega

```http
GET /deliveries/<delivery_id>/show
Authorization: Bearer <token>
```

### Resposta esperada
```json
{
  "id": "delivery-uuid",
  "description": "Teclado mecânico",
  "status": "shipped",
  "logs": [
    {
      "id": "log-uuid",
      "description": "Pedido despachado",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

## Criação de log de entrega

```http
POST /deliveries/<delivery_id>/logs
Content-Type: application/json
Authorization: Bearer <token>

{
  "description": "O pedido está a caminho"
}
```

## Verificação final no banco

```sql
-- Verificar todos os usuários
SELECT * FROM users;

-- Verificar todas as entregas
SELECT * FROM deliveries;

-- Verificar todos os logs (se tabela separada)
SELECT * FROM delivery_logs;
```

## Fluxo completo em sequência

```
1. SELECT * FROM users;                    -- Estado inicial (vazio)
2. POST /users (Rodrigo)                   -- Criar primeiro usuário
3. SELECT * FROM users;                    -- Confirmar criação
4. POST /sessions (Rodrigo)                -- Autenticar
5. POST /users (Paulo)                     -- Criar segundo usuário
6. UPDATE users SET role = 'sale' ...      -- Promover a vendedor
7. SELECT * FROM users;                    -- Confirmar role
8. POST /sessions (Paulo)                  -- Autenticar como vendedor
9. POST /deliveries                        -- Criar entrega para Rodrigo
10. SELECT * FROM deliveries;              -- Confirmar no banco
11. GET /deliveries                        -- Listar via API
12. PATCH /deliveries/:id/status           -- Atualizar status
13. GET /deliveries/:id/show               -- Ver logs
14. POST /deliveries/:id/logs              -- Criar novo log
15. GET /deliveries/:id/show               -- Confirmar log criado
```