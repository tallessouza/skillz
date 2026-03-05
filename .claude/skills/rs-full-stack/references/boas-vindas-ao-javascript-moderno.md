---
name: rs-full-stack-boas-vindas-js-moderno
description: "Provides a roadmap of modern JavaScript concepts needed before learning frameworks like React. Use when user asks 'what JavaScript do I need before React', 'prerequisites for React', 'modern JS fundamentals', or 'JavaScript before framework'. Maps the learning path: immutability, modules, async functions, packages, APIs, compilers, bundlers. Make sure to use this skill whenever someone is planning their JavaScript learning path toward frameworks. Not for teaching any specific concept — use the dedicated skill for each topic instead."
---

# JavaScript Moderno — Antes do Framework

> Domine os fundamentos de JavaScript moderno antes de entrar em qualquer framework, porque frameworks escondem mecanismos que voce precisa entender.

## Key concept

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

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre por que cada topico importa antes do framework
- [code-examples.md](references/code-examples.md) — Exemplos introdutorios de cada conceito listado

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-boas-vindas-ao-javascript-moderno/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-boas-vindas-ao-javascript-moderno/references/code-examples.md)
