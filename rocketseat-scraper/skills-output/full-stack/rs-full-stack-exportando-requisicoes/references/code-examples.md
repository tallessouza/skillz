# Code Examples: Exportando Requisicoes do Insomnia

## Estrutura tipica do JSON exportado

```json
{
  "_type": "export",
  "__export_format": 4,
  "__export_date": "2024-01-01T00:00:00.000Z",
  "__export_source": "insomnia.desktop.app",
  "resources": [
    {
      "_id": "req_abc123",
      "_type": "request",
      "name": "Create Order",
      "method": "POST",
      "url": "http://localhost:3333/orders",
      "body": {
        "mimeType": "application/json",
        "text": "{\"table_session_id\": \"uuid-here\", \"product_id\": \"uuid-here\", \"quantity\": 2}"
      },
      "headers": [
        {
          "name": "Content-Type",
          "value": "application/json"
        }
      ]
    },
    {
      "_id": "req_def456",
      "_type": "request",
      "name": "List Products",
      "method": "GET",
      "url": "http://localhost:3333/products"
    }
  ]
}
```

## Nomeacao do arquivo

```bash
# Padrao simples (recomendado pelo instrutor)
requests_insomnia.json

# Alternativas validas
insomnia_collection.json
api_requests.json
```

## Adicionando ao .gitignore (caso NAO queira versionar)

```gitignore
# Descomente se nao quiser versionar as requisicoes
# requests_insomnia.json
```

## Importacao via linha de comando (alternativa)

Embora a aula mostre o fluxo via GUI, o Insomnia tambem suporta importacao via CLI com o `inso`:

```bash
# Instalar o CLI do Insomnia
npm install -g insomnia-inso

# Listar specs disponiveis
inso export spec

# Exportar via CLI
inso export spec --output requests_insomnia.json
```

## Integracao com projeto Node.js

Estrutura de projeto apos exportar:

```
api-restaurant/
├── src/
│   ├── routes/
│   ├── controllers/
│   └── ...
├── package.json
├── tsconfig.json
└── requests_insomnia.json    ← arquivo exportado aqui
```