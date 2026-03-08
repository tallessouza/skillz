---
name: 2023-criando-um-projeto-node
description: "Initializes Node.js projects with ES Modules, node: prefix imports, and native HTTP server setup. Use when user asks to 'create a Node project', 'initialize a new backend', 'set up ES modules', or 'create an HTTP server from scratch'. Make sure to use this skill whenever bootstrapping a new Node.js project or configuring ES Modules with package.json type module. Not for Express/Fastify setup, frontend projects, or Bun/Deno runtimes."
category: workflow
tags: [fastify, modules, testing]
mind_lenses: [LT_01, LT_02, MF_01, GB_01, TH_04]
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: fundamentos
  tags: [node-js, es-modules, http-server, project-setup, node-prefix]
---

# Criando um Projeto Node.js

> Inicialize projetos Node.js com ES Modules, importacoes com prefixo node:, e servidor HTTP nativo.

## Prerequisites

- Node.js 18+ instalado
- npm disponivel no PATH
- Editor com terminal integrado (VSCode recomendado)

## Steps

### Step 1: Inicializar o projeto

```bash
mkdir 01-fundamentos-nodejs
cd 01-fundamentos-nodejs
npm init -y
```

### Step 2: Configurar ES Modules

Adicionar `"type": "module"` no `package.json`, porque o padrao do Node e CommonJS (require), mas o padrao moderno e ES Modules (import/export).

```json
{
  "name": "01-fundamentos-nodejs",
  "version": "1.0.0",
  "type": "module"
}
```

### Step 3: Criar o servidor HTTP

Criar `src/server.js` — usar `server.js` e nao `index.js`, porque em backend o arquivo principal representa um servidor, e `index` e semantica de browser/web.

```javascript
import http from "node:http"

const server = http.createServer((req, res) => {
  return res.end("Hello World")
})

server.listen(3333)
```

### Step 4: Executar

```bash
node src/server.js
```

Testar: `curl http://localhost:3333` ou abrir no navegador.

## Rules

1. **Sempre usar ES Modules** — `import/export` com `"type": "module"` no package.json, porque CommonJS (require) e o padrao legado
2. **Prefixar modulos internos com `node:`** — `import http from "node:http"` nao `from "http"`, porque diferencia modulos internos de terceiros e evita conflitos de nomes
3. **Nomear arquivo principal como `server.js`** — nao `index.js`, porque `index` e semantica de browser e perde significado em contexto backend
4. **Organizar codigo em `src/`** — separar codigo-fonte da raiz do projeto
5. **Usar `res.end()` no servidor nativo** — nao `res.send()` (que e do Express), porque o HTTP nativo usa `end()` para finalizar a resposta

## Heuristics

| Situacao | Acao |
|----------|------|
| Projeto sem framework | Usar `http.createServer` nativo |
| Importando modulo interno do Node | Prefixar com `node:` (ex: `node:http`, `node:crypto`, `node:path`) |
| Importando modulo terceiro (npm) | Sem prefixo (ex: `fastify`, `express`) |
| Precisa de `require()` | Configurar `"type": "module"` e migrar para `import` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `const http = require("http")` | `import http from "node:http"` |
| `import http from "http"` | `import http from "node:http"` |
| `src/index.js` (para servidor) | `src/server.js` |
| `res.send("Hello")` (sem Express) | `res.end("Hello")` |
| `npm init` (interativo) | `npm init -y` |

## Troubleshooting

### Resultado inesperado ao aplicar o padrao
**Symptom:** Comportamento nao corresponde ao esperado apos seguir os passos
**Cause:** Dependencias ou configuracoes previas podem estar faltando
**Fix:** Verifique os prerequisites e confirme que todas as versoes estao compativeis

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
