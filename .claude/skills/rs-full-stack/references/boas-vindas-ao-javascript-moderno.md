---
name: rs-full-stack-boas-vindas-js-moderno
description: "Provides a roadmap of modern JavaScript concepts needed before learning frameworks like React. Use when user asks 'what JavaScript do I need before React', 'prerequisites for React', 'modern JS fundamentals', or 'JavaScript before framework'. Maps the learning path: immutability, modules, async functions, packages, APIs, compilers, bundlers. Make sure to use this skill whenever someone is planning their JavaScript learning path toward frameworks. Not for teaching any specific concept — use the dedicated skill for each topic instead."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: javascript
  tags: [javascript, es6, modules, async-await, bundlers, learning-path]
---

# JavaScript Moderno — Antes do Framework

> Domine os fundamentos de JavaScript moderno antes de entrar em qualquer framework, porque frameworks escondem mecanismos que voce precisa entender.

## Key concepts

Frameworks como React nao inventam magica — eles combinam funcionalidades nativas do JavaScript moderno. Quem entende o que acontece "por debaixo dos panos" aprende frameworks mais rapido, debugga com mais confianca e toma decisoes arquiteturais melhores.

## Decision framework

| Quando voce encontrar | Estude primeiro |
|----------------------|-----------------|
| `useState`, `useReducer` no React | Imutabilidade em JavaScript |
| `import/export` em qualquer framework | Modulos ES6 |
| `useEffect`, data fetching | Funcoes assincronas (async/await, Promises) |
| `npm install`, `package.json` | Gerenciamento de pacotes |
| Consumo de dados externos | APIs e fetch |
| JSX, TypeScript, sintaxe moderna | Compiladores (Babel, SWC) |
| Build, deploy, tree-shaking | Bundlers (Vite, webpack, esbuild) |

## Mapa de aprendizado

### 1. Imutabilidade
Por que frameworks reagem a mudancas de estado — e por que mutar objetos diretamente quebra reatividade.

### 2. Modulos (ES Modules)
Como organizar codigo em arquivos independentes com `import`/`export` — a base de qualquer projeto moderno.

### 3. Funcoes assincronas
Promises, async/await, e como o JavaScript lida com operacoes que levam tempo (fetch, timers, I/O).

### 4. Pacotes (npm/yarn)
Como reutilizar codigo da comunidade, gerenciar dependencias e entender `node_modules`.

### 5. APIs
Como consumir dados de servidores externos usando fetch e entender o ciclo request/response.

### 6. Compiladores
Por que JSX, TypeScript e sintaxe moderna precisam ser transformados antes de rodar no browser.

### 7. Bundlers
Como multiplos arquivos viram um bundle otimizado para producao.

## Example

```javascript
// Conceitos de JS moderno que frameworks usam por baixo
import { fetchUser } from './api.js'          // ES Modules
const user = { ...oldUser, name: 'Novo' }     // Imutabilidade (spread)
const data = await fetchUser(1)               // Async/await
```

## Common misconceptions

| Pessoas pensam | Realidade |
|---------------|-----------|
| "Posso aprender React sem saber JS direito" | React usa imutabilidade, modulos, async, destructuring — sem isso, voce copia codigo sem entender |
| "Bundlers sao configuracao chata" | Entender bundlers explica por que `import` funciona no browser e como otimizar performance |
| "async/await e so sintaxe bonita" | E o modelo mental de como JavaScript lida com concorrencia — fundamental para data fetching em qualquer framework |

## When to apply

- Antes de iniciar estudos em React, Vue, Svelte ou qualquer framework frontend
- Quando sentir que "copia codigo de framework mas nao entende o que acontece"
- Ao planejar um roteiro de estudos JavaScript

## Limitations

Este skill e um mapa de navegacao, nao o conteudo em si. Para cada topico listado, existe um skill dedicado com regras, exemplos e anti-patterns especificos.


## Troubleshooting

| Problema | Solução |
|----------|---------|
| **Framework code feels like magic** | Study the underlying JS concept first — e.g., learn immutability before useState, learn ES Modules before framework imports. |
| **Import/export not working in browser** | Ensure the `<script>` tag has `type='module'` or use a bundler like Vite to handle module resolution. |
| **Async/await not behaving as expected** | Remember that `await` only works inside `async` functions and that each `await` pauses execution until the Promise resolves. |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre por que cada topico importa antes do framework
- [code-examples.md](references/code-examples.md) — Exemplos introdutorios de cada conceito listado