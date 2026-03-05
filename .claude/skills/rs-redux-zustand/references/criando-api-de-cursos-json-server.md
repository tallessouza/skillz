---
name: rs-redux-zustand-json-server-api
description: "Applies JSON Server setup pattern for creating fake REST APIs during frontend development. Use when user asks to 'create a mock API', 'setup json-server', 'simulate backend', 'fake API for development', or 'prototype without backend'. Configures json-server with watch mode, realistic delay, and Axios client. Make sure to use this skill whenever setting up local development APIs or mock servers for React/frontend projects. Not for production API design, Express/Fastify server setup, or database configuration."
---

# Criando API com JSON Server

> Configure um servidor REST fake com json-server para desenvolvimento frontend, incluindo watch mode, delay realista e cliente Axios.

## Rules

1. **Use json-server para prototipar** — instale como dependencia de dev e crie um `server.json` na raiz do projeto, porque permite simular uma API completa sem escrever codigo backend
2. **Adicione delay nas respostas** — use a flag `-d 500` para simular latencia real, porque isso forca a implementacao correta de loading states na UI
3. **Ative watch mode** — use a flag `-w` para que mudancas no arquivo JSON reiniciem o servidor automaticamente, porque agiliza iteracao durante desenvolvimento
4. **Centralize o cliente HTTP** — crie `src/lib/axios.ts` com `axios.create({ baseURL })`, porque evita repetir a URL base em cada requisicao
5. **JSON valido no server.json** — use aspas duplas em todas as chaves e valores, sem trailing commas, porque JSON nao e JavaScript

## Steps

### Step 1: Instalar dependencias

```bash
npm install json-server -D
npm install axios
```

### Step 2: Criar server.json na raiz

```json
{
  "courses": [
    {
      "id": 1,
      "title": "Nome do Curso",
      "modules": [
        {
          "id": 1,
          "title": "Modulo 1",
          "lessons": [
            {
              "id": "lesson-1",
              "title": "Aula 1",
              "duration": "09:45"
            }
          ]
        }
      ]
    }
  ]
}
```

### Step 3: Adicionar script no package.json

```json
{
  "scripts": {
    "server": "json-server -w server.json -d 500"
  }
}
```

### Step 4: Criar cliente Axios

```typescript
// src/lib/axios.ts
import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:3000',
})
```

### Step 5: Rodar em paralelo

```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: API fake
npm run server
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Prototipando frontend sem backend | json-server com server.json |
| Precisa testar loading states | Adicione `-d 500` ou mais |
| Dados do JSON mudaram | Flag `-w` reinicia automaticamente |
| Multiplas rotas necessarias | Adicione mais chaves ao server.json |
| Precisa de rotas aninhadas | json-server suporta relacoes via foreign keys |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Hardcode dados estaticos no estado | Busque de uma API (mesmo fake) |
| Copie a URL base em cada fetch | Centralize com `axios.create({ baseURL })` |
| Use aspas simples no server.json | Use aspas duplas (JSON valido) |
| Deixe trailing commas no JSON | Remova todas as virgulas finais |
| Instale json-server como dependencia de producao | Instale com `-D` (devDependency) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/redux-zustand/rs-redux-zustand-criando-api-de-cursos-json-server/references/deep-explanation.md)
- [Code examples](../../../data/skills/redux-zustand/rs-redux-zustand-criando-api-de-cursos-json-server/references/code-examples.md)
