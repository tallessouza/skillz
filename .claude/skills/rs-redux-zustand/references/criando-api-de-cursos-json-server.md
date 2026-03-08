---
name: rs-redux-zustand-criando-api-de-cursos-json-server
description: "Applies JSON Server setup pattern for creating fake REST APIs during frontend development. Use when user asks to 'create a mock API', 'setup json-server', 'simulate backend', 'fake API for development', 'prototype without backend', or 'centralize HTTP client with axios'. Configures json-server with watch mode, realistic delay, and centralized Axios client. Make sure to use this skill whenever setting up local development mock APIs for React/frontend projects. Not for production API design (use rs-node-js), Express/Fastify server setup, or database configuration."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: redux-zustand
  module: json-server-api
  tags: [json-server, mock-api, axios, development, prototyping, fake-api]
compatibility: "Requires Node.js 14+ and npm. json-server as devDependency."
---

# Criando API com JSON Server

> Configure um servidor REST fake com json-server para desenvolvimento frontend.

## Prerequisites

- Node.js 14+
- `npm install json-server -D` + `npm install axios`

## Steps

### Step 1: Criar server.json na raiz

```json
{ "courses": [{ "id": 1, "title": "Curso", "modules": [{ "id": 1, "title": "Modulo 1", "lessons": [{ "id": "1", "title": "Aula 1", "duration": "09:45" }] }] }] }
```

### Step 2: Script no package.json

```json
{ "scripts": { "server": "json-server -w server.json -d 500" } }
```

### Step 3: Cliente Axios centralizado

```typescript
// src/lib/axios.ts
import axios from 'axios'
export const api = axios.create({ baseURL: 'http://localhost:3000' })
```

### Step 4: Rodar em paralelo

```bash
npm run dev     # Terminal 1: Frontend
npm run server  # Terminal 2: API fake
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Prototipando sem backend | json-server |
| Testar loading states | `-d 500` ou mais |
| URL da API pode mudar | Centralize com `axios.create({ baseURL })` |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Hardcode dados no estado | Busque de API (mesmo fake) |
| URL base em cada fetch | `axios.create({ baseURL })` |
| json-server como dep de producao | Instale com `-D` |

## Troubleshooting

### json-server nao inicia
**Symptom:** Erro ao executar `npm run server`.
**Cause:** JSON invalido no server.json (aspas simples, trailing commas).
**Fix:** Use aspas duplas em todas as chaves/valores, remova virgulas finais.

## Deep reference library

- [deep-explanation.md](../../../data/skills/redux-zustand/rs-redux-zustand-criando-api-de-cursos-json-server/references/deep-explanation.md) — Por que simular API, papel do delay, conversao JS para JSON
- [code-examples.md](../../../data/skills/redux-zustand/rs-redux-zustand-criando-api-de-cursos-json-server/references/code-examples.md) — server.json completo, scripts, axios client, verificacao no navegador
