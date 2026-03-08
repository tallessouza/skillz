---
name: rs-full-stack-criando-o-api-config
description: "Enforces centralized API configuration pattern when setting up HTTP clients or API integrations in JavaScript/React projects. Use when user asks to 'connect to an API', 'configure axios', 'setup fetch', 'create API service', or 'integrate with backend'. Applies baseURL extraction, services folder structure, and config reuse. Make sure to use this skill whenever creating API integration layers. Not for authentication logic, error handling middleware, or state management."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: api-integration
  tags: [api, fetch, axios, baseURL, services]
---

# Configuração Centralizada de API

> Extraia a URL base da API para um único arquivo de configuração, nunca espalhe URLs hardcoded pelo projeto.

## Rules

1. **Crie uma pasta `services/`** dentro de `src/` — porque agrupa todas as funcionalidades que a API serve para a aplicação, separando concerns de UI e dados
2. **Separe configuração de consumo** — `api.js` contém apenas o config, os arquivos de serviço específicos (user, schedule) consomem esse config, porque permite reuso sem duplicação
3. **Use `baseURL` sem recurso** — a URL base termina na porta (`localhost:3333`), nunca inclua paths de recursos, porque o recurso muda por serviço mas a base é sempre a mesma
4. **Exporte como objeto nomeado** — `export const apiConfig = { baseURL: "..." }`, porque permite desestruturação e extensão futura sem breaking changes
5. **Mude a porta em um único lugar** — se a API muda de endereço ou porta, a alteração acontece apenas no `api.js`, porque evita buscar URLs espalhadas por todo o projeto

## How to write

### Estrutura de pastas

```
src/
└── services/
    ├── api.js          # Configuração base (baseURL)
    ├── schedules.js    # Serviço de agendamentos
    └── users.js        # Serviço de usuários
```

### Arquivo de configuração

```javascript
export const apiConfig = {
  baseURL: "http://localhost:3333",
}
```

### Consumo nos serviços

```javascript
import { apiConfig } from "./api"

// Interpolação com recurso específico
const response = await fetch(`${apiConfig.baseURL}/schedules`)
```

## Example

**Before (URL hardcoded em vários lugares):**
```javascript
// schedules.js
const res = await fetch("http://localhost:3333/schedules")

// users.js
const res = await fetch("http://localhost:3333/users")

// profile.js
const res = await fetch("http://localhost:3333/profile")
```

**After (configuração centralizada):**
```javascript
// api.js
export const apiConfig = {
  baseURL: "http://localhost:3333",
}

// schedules.js
import { apiConfig } from "./api"
const res = await fetch(`${apiConfig.baseURL}/schedules`)

// users.js
import { apiConfig } from "./api"
const res = await fetch(`${apiConfig.baseURL}/users`)
```

## Heuristics

| Situação | Faça |
|----------|------|
| API local em desenvolvimento | `http://localhost:{porta}` |
| API remota em produção | `https://api.dominio.com` |
| Múltiplos serviços consomem a API | Todos importam `apiConfig` do mesmo arquivo |
| Porta ou domínio mudou | Altere apenas `api.js` |
| Projeto usa axios | Use `axios.create({ baseURL: apiConfig.baseURL })` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| URL completa hardcoded em cada fetch | `${apiConfig.baseURL}/recurso` |
| Recurso na baseURL (`localhost:3333/schedules`) | Apenas `localhost:3333` na base |
| Config duplicado por arquivo de serviço | Um único `api.js` importado por todos |
| URL como string mágica inline | Constante nomeada exportada |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre centralização de config e manutenibilidade
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| `fetch` retorna Network Error | URL base incorreta ou servidor nao iniciado | Verifique se a API esta rodando e a porta esta correta em `apiConfig.baseURL` |
| CORS bloqueando requisicoes | Backend sem configuracao de CORS | Adicione middleware CORS no servidor (ex: `cors()` no Express) |
| URL duplicada no fetch | Recurso incluido na baseURL | Remova o path de recurso da baseURL, deixe apenas `host:porta` |
| Import do apiConfig falha | Caminho relativo incorreto | Verifique o caminho: `import { apiConfig } from "./api"` |
| Porta mudou e varias telas quebraram | URLs hardcoded espalhadas pelo projeto | Centralize em `api.js` e importe em todos os servicos |