# Code Examples: Configurando Ambientes de Produção no Insomnia

## Configuração JSON do ambiente Dev

```json
{
  "base_url": "http://localhost:3333"
}
```

## Configuração JSON do ambiente Prod

```json
{
  "base_url": "https://rocketlog-api.onrender.com"
}
```

## Exemplo de URL em requisição

Cada requisição usa a variável como prefixo:

```
{{ base_url }}/deliveries
{{ base_url }}/deliveries/:id
{{ base_url }}/users
{{ base_url }}/sessions
```

## Coleção completa de exemplo (insomnia-routes.json)

Estrutura típica de um arquivo de exportação do Insomnia:

```json
{
  "_type": "export",
  "__export_format": 4,
  "resources": [
    {
      "_type": "request",
      "name": "Create Delivery",
      "method": "POST",
      "url": "{{ base_url }}/deliveries",
      "body": {
        "mimeType": "application/json",
        "text": "{ \"product\": \"Package 1\" }"
      }
    },
    {
      "_type": "request",
      "name": "List Deliveries",
      "method": "GET",
      "url": "{{ base_url }}/deliveries"
    },
    {
      "_type": "environment",
      "name": "Dev",
      "data": {
        "base_url": "http://localhost:3333"
      },
      "color": "#7ecf2b"
    },
    {
      "_type": "environment",
      "name": "Prod",
      "data": {
        "base_url": "https://rocketlog-api.onrender.com"
      },
      "color": "#e74c3c"
    }
  ]
}
```

## Variação: múltiplos ambientes com autenticação

```json
{
  "base_url": "http://localhost:3333",
  "auth_token": "dev-jwt-token-here"
}
```

```json
{
  "base_url": "https://rocketlog-api.onrender.com",
  "auth_token": "prod-jwt-token-here"
}
```

Uso nas requisições com header de autorização:

```
Authorization: Bearer {{ auth_token }}
```

## Variação: ambiente de staging

```json
{
  "base_url": "https://rocketlog-api-staging.onrender.com",
  "auth_token": "staging-jwt-token-here"
}
```

Convenção de cores:
- Dev: Verde (`#7ecf2b`)
- Staging: Amarelo (`#f0ad4e`)
- Prod: Vermelho (`#e74c3c`)

## Verificação rápida no navegador

Ao acessar a URL base de produção:

```
GET https://rocketlog-api.onrender.com/
→ Response: "Cannot GET /"
→ Status: 404
→ Significado: API está rodando, rota raiz não existe (esperado)
```

Ao acessar uma rota válida:

```
GET https://rocketlog-api.onrender.com/deliveries
→ Response: [] ou [{ "id": "...", "product": "..." }]
→ Status: 200
→ Significado: API e banco de dados em produção funcionando
```