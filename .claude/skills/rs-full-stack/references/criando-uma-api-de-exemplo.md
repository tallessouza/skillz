---
name: rs-full-stack-criando-uma-api-de-exemplo
description: "Generates json-server mock API setup with sample data and endpoints. Use when user asks to 'create a mock API', 'simulate an API', 'setup json-server', 'fake REST API', or 'test API locally'. Applies correct json structure with resources, IDs, and typed fields. Make sure to use this skill whenever setting up local API simulation for frontend development. Not for real backend development, Express/Fastify servers, or database setup."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: javascript-api-integration
  tags: [json-server, mock-api, rest-api, frontend-development]
---

# Criando uma API com json-server

> Estruture dados em JSON com recursos nomeados, IDs sequenciais e tipos corretos para simular uma REST API completa com json-server.

## Rules

1. **Nomeie recursos no plural** — `products` nao `product`, porque o json-server usa o nome da propriedade como endpoint da rota (`/products`)
2. **Sempre inclua `id` numerico sequencial** — porque o json-server usa `id` automaticamente para filtrar por `/products/1`, `/products/2` etc
3. **Use tipos corretos nos valores** — numeros sem aspas (`150.25`), strings com aspas (`"Mouse"`), porque o JSON tipado permite filtros e ordenacao corretos
4. **Cada propriedade raiz = um endpoint** — `{ "products": [...], "users": [...] }` gera `/products` e `/users` automaticamente
5. **Retorno muda conforme a rota** — `/products` retorna array, `/products/3` retorna objeto unico, `/products/999` retorna 404

## Steps

### Step 1: Criar o arquivo de dados

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

### Step 2: Configurar o script no package.json

```json
{
  "scripts": {
    "server": "json-server db.json --port 3303"
  }
}
```

### Step 3: Executar e testar

```bash
npm run server
```

Endpoints disponiveis automaticamente:
- `GET /products` — retorna todos os produtos (array)
- `GET /products/1` — retorna produto com id 1 (objeto)
- `GET /products/999` — retorna 404 Not Found

## Output format

O json-server gera uma REST API completa:

| Rota | Metodo | Retorno |
|------|--------|---------|
| `/products` | GET | Array com todos os produtos |
| `/products/:id` | GET | Objeto unico ou 404 |

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa listar todos os itens | `GET /recurso` — retorna array |
| Precisa de detalhes de um item | `GET /recurso/:id` — retorna objeto |
| Precisa de mais de um recurso | Adicione outra propriedade raiz no JSON |
| Numero com decimais (preco) | Use ponto flutuante sem aspas: `150.25` |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `"product": [...]` (singular) | `"products": [...]` (plural = endpoint correto) |
| `"id": "1"` (string) | `"id": 1` (numero, filtro automatico) |
| `"price": "150.25"` (string) | `"price": 150.25` (numero, permite ordenacao) |
| Criar rotas manualmente | Deixe o json-server gerar a partir do JSON |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| `json-server: command not found` | Pacote nao instalado | `npm i json-server -D` e use via script no package.json |
| Porta 3303 em uso | Outro processo na mesma porta | Mude a porta no script: `--port 3304` |
| Endpoint retorna array vazio | Propriedade no JSON nao tem itens | Adicione objetos com `id` numerico no array |
| GET /products/1 retorna 404 | ID nao existe no db.json | Verifique se existe objeto com `"id": 1` no array |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre recursos, endpoints e comportamento da API simulada
- [code-examples.md](references/code-examples.md) — Exemplos expandidos com multiplos recursos e variacoes