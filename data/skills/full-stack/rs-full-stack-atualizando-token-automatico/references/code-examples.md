# Code Examples: Atualizando Token Automático

## Exemplo 1: Configuração passo a passo no Insomnia

### Passo 1 — Limpar o campo de token
```
Authorization: Bearer [apague o valor fixo aqui]
```

### Passo 2 — Inserir referência dinâmica
```
1. Digite: $
2. Um dropdown aparece
3. Selecione: Response → Body Attribute
4. Uma janela de configuração abre
```

### Passo 3 — Configurar a referência
```
Request: [Sessions] POST       ← escolha a request de sessão
Filter:  $.token               ← JSONPath para o campo token
```

### Passo 4 — Confirmar
```
Clique "Done"
O campo fica com um "quadradinho" representando a referência dinâmica
```

## Exemplo 2: Testando a atualização automática

### Sessão com role customer
```http
POST /sessions
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "123456"
}

# Resposta:
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiY3VzdG9tZXIi..."
}
```

### Request autenticada (resolve automaticamente)
```http
GET /customers
Authorization: Bearer {% response "body", "req_sessions_post", "$.token" %}

# Resolve para:
# Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiY3VzdG9tZXIi...
```

### Após mudar role no backend para "sale"
```http
POST /sessions  (Send novamente)

# Nova resposta:
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoic2FsZSI..."
}

GET /customers  (Send)
# Automaticamente usa o novo token com role "sale"
```

## Exemplo 3: Filtrando outros campos

### Extrair apenas o token
```
Filter: $.token
→ "eyJhbGciOiJIUzI1NiJ9..."
```

### Extrair o role do usuário (se necessário)
```
Filter: $.user.role
→ "customer"
```

### Extrair o ID do usuário
```
Filter: $.user.id
→ "abc-123-def"
```

## Exemplo 4: Equivalente no Postman

No Postman, o conceito é similar mas usa **Tests scripts** e **Environment variables**:

```javascript
// Na aba "Tests" da request POST /sessions:
const response = pm.response.json();
pm.environment.set("auth_token", response.token);

// No header de outras requests:
// Authorization: Bearer {{auth_token}}
```

## Erro comum demonstrado na aula

### Errado — caractere $ residual
```
Authorization: Bearer $[referência dinâmica]
                      ^
                      Este $ extra quebra a request
```

### Correto — apenas a referência
```
Authorization: Bearer [referência dinâmica]
```