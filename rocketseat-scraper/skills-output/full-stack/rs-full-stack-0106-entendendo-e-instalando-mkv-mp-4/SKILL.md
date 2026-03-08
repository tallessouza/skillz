---
name: rs-full-stack-0106-entendendo-e-instalando-cors
description: "Enforces CORS configuration best practices when building Node.js APIs that serve frontend clients from different origins. Use when user asks to 'configure CORS', 'fix CORS error', 'enable cross-origin', 'connect frontend to API', or 'setup API for frontend access'. Applies rules: always enable CORS on APIs consumed by separate frontend servers, configure allowed origins explicitly in production, understand same-origin vs cross-origin. Make sure to use this skill whenever creating an Express/Node API that will be consumed by a frontend application. Not for same-origin server-side rendering, proxy configurations, or nginx reverse proxy CORS headers."
---

# CORS — Cross-Origin Resource Sharing

> Toda API que será consumida por um frontend hospedado em origem diferente DEVE habilitar CORS, caso contrário o navegador bloqueará todas as requisições.

## Rules

1. **Sempre adicione CORS em APIs consumidas por frontends separados** — porque frontend e backend rodam em servidores/portas diferentes, o navegador bloqueia requisições cross-origin por padrão
2. **Entenda same-origin vs cross-origin** — mesma origem = mesmo servidor + mesma porta. Origens diferentes = servidores ou portas distintos, porque o navegador trata cada combinação host:porta como uma origem única
3. **Configure origens permitidas explicitamente em produção** — `cors({ origin: 'https://meufront.com' })` em vez de `cors()` aberto, porque CORS aberto permite qualquer origem acessar sua API
4. **CORS é um mecanismo do navegador, não do servidor** — o servidor apenas envia headers (`Access-Control-Allow-Origin`), quem bloqueia ou libera é o navegador, porque ferramentas como curl/Insomnia ignoram CORS completamente

## Como funciona

### Cenário: Frontend e Backend em origens diferentes

```
Servidor A (Frontend)        Servidor B (API/Backend)
http://localhost:3000   →    http://localhost:3333
        │                            │
        │  GET /refunds              │
        │ ─────────────────────────► │
        │                            │
        │  ✗ Bloqueado (sem CORS)    │
        │  ✓ Liberado (com CORS)     │
        │ ◄───────────────────────── │
```

### Mesma origem (CORS não necessário)

```
Servidor A
http://localhost:3000
├── /index.html (frontend)
├── /api/refunds (backend)
└── Mesma origem = sem bloqueio
```

## Como habilitar

### Instalação

```bash
npm install cors
```

### Configuração básica (Express)

```javascript
const cors = require('cors')
const express = require('express')

const app = express()

// Habilita CORS para todas as origens (desenvolvimento)
app.use(cors())
```

### Configuração para produção

```javascript
app.use(cors({
  origin: 'https://meufront.com',
  credentials: true
}))
```

## Example

**Antes (frontend recebe erro de CORS):**
```javascript
const express = require('express')
const app = express()

app.get('/refunds', (req, res) => {
  res.json({ refunds: [] })
})
// Frontend em outra origem recebe:
// Access to fetch blocked by CORS policy: 
// No 'Access-Control-Allow-Origin' header
```

**Depois (com CORS habilitado):**
```javascript
const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())

app.get('/refunds', (req, res) => {
  res.json({ refunds: [] })
})
// Frontend em qualquer origem consegue acessar
```

## Heuristics

| Situação | Ação |
|----------|------|
| API será consumida por frontend em porta/domínio diferente | Adicionar CORS |
| Frontend e backend no mesmo servidor e porta | CORS não necessário |
| Ambiente de desenvolvimento local | `cors()` sem restrição é aceitável |
| Ambiente de produção | Configurar `origin` com domínio específico |
| Erro "blocked by CORS policy" no console | Verificar se CORS está habilitado na API |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| Ignorar erro de CORS e tentar contornar no frontend | Habilitar CORS no backend |
| Usar `cors()` aberto em produção | Configurar `origin` explicitamente |
| Adicionar headers CORS manualmente em cada rota | Usar middleware `cors()` no app |
| Achar que CORS protege a API contra ataques | Entender que CORS é política do navegador, não firewall |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre same-origin policy, headers HTTP e fluxo preflight
- [code-examples.md](references/code-examples.md) — Exemplos completos de configuração CORS com Express