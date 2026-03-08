---
name: rs-full-stack-instalando-e-configurando-axios
description: "Enforces Axios HTTP client setup and configuration best practices when creating API service layers in frontend applications. Use when user asks to 'install axios', 'configure API client', 'setup HTTP requests', 'consume an API', or 'create a services folder'. Applies pattern: centralized API instance with baseURL, services directory structure, typed API module. Make sure to use this skill whenever setting up HTTP communication between frontend and backend. Not for backend HTTP calls, fetch API usage, or GraphQL client configuration."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: api-consumption
  tags: [axios, http, api, frontend, services]
---

# Instalando e Configurando Axios

> Centralize a configuracao do cliente HTTP em um unico modulo com baseURL fixa, separando o endereco base dos recursos consumidos.

## Prerequisites

- Projeto frontend com npm/yarn inicializado
- Backend/API rodando localmente (ex: `http://localhost:3333`)
- Se Axios nao instalado: `npm i axios`

## Steps

### Step 1: Instalar o Axios

```bash
npm i axios
```

### Step 2: Criar a pasta de servicos

Dentro de `src/`, criar a pasta `services/` — porque centraliza todos os servicos externos que a aplicacao consome.

```
src/
└── services/
    └── api.ts
```

### Step 3: Configurar a instancia do Axios

```typescript
import axios from "axios"

export const api = axios.create({
  baseURL: "http://localhost:3333",
})
```

### Step 4: Consumir recursos via instancia

```typescript
// A baseURL permanece fixa, apenas o recurso muda
await api.post("/users", { name, email })
await api.get("/refunds")
await api.get("/refunds/123")
```

## Output format

```
src/
└── services/
    └── api.ts    # Instancia unica do Axios com baseURL configurada
```

## Heuristics

| Situacao | Faca |
|----------|------|
| API local em desenvolvimento | Use `http://localhost:PORT` como baseURL |
| API em producao | Use `https://` (protocolo seguro) |
| Multiplas APIs diferentes | Crie instancias separadas (ex: `api.ts`, `authApi.ts`) |
| BaseURL muda por ambiente | Use variavel de ambiente (`import.meta.env.VITE_API_URL`) |

## Anti-patterns

| Nunca faca | Faca isto |
|------------|-----------|
| Repetir URL completa em cada requisicao | Definir `baseURL` no `axios.create()` |
| Importar `axios` diretamente nos componentes | Importar a instancia `api` de `services/api.ts` |
| Hardcodar IP da maquina como baseURL | Usar `localhost` porque e dinamico entre maquinas |
| Misturar config de API com logica de componente | Isolar em `src/services/api.ts` |

## Verification

- `api.ts` exporta instancia com `baseURL` definida
- Nenhum componente importa `axios` diretamente — todos usam `api`
- BaseURL nao inclui recursos (sem `/users`, `/refunds` no final)

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| Erro de CORS ao fazer requisicao | Backend nao configurou headers CORS | Configurar CORS no backend ou usar proxy no dev server |
| `Network Error` sem detalhes | Backend nao esta rodando | Verificar se o servidor esta ativo na porta configurada |
| baseURL aponta para IP da maquina | Hardcoded IP nao funciona em outras maquinas | Usar `localhost` ou variavel de ambiente |
| Requisicao retorna 404 | Recurso nao existe no backend | Verificar rota exata no backend e conferir baseURL |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre baseURL, protocolo HTTP vs HTTPS, e pasta services
- [code-examples.md](references/code-examples.md) — Exemplos expandidos de consumo com POST, GET e recursos variados