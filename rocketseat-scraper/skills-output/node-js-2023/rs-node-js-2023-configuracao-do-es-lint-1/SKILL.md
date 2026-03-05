---
name: rs-nodejs-configuracao-eslint
description: "Applies Rocketseat ESLint configuration when setting up linting in Node.js or TypeScript projects. Use when user asks to 'configure eslint', 'setup linting', 'add code style', 'configure rocketseat eslint', or 'padronizar codigo'. Generates .eslintrc.json, lint scripts, and handles Vitest globals plugin. Make sure to use this skill whenever setting up ESLint in a Node/TS project. Not for React-specific ESLint setup, Prettier configuration, or runtime code patterns."
---

# Configuracao do ESLint com Rocketseat Config

> Configurar ESLint com a config da Rocketseat, scripts de lint, e resolver problemas comuns como Vitest globals e no-useless-constructor.

## Prerequisites

- Node.js 18+ com npm
- Projeto TypeScript ja inicializado
- Vitest configurado (se usar testes)

## Steps

### Step 1: Instalar dependencias

```bash
npm install eslint @rocketseat/eslint-config -D
```

Se usar Vitest:
```bash
npm install eslint-plugin-vitest-globals -D
```

### Step 2: Criar .eslintrc.json

```json
{
  "extends": [
    "@rocketseat/eslint-config/node",
    "plugin:vitest-globals/recommended"
  ],
  "env": {
    "vitest-globals/env": true
  },
  "rules": {
    "no-useless-constructor": "off"
  }
}
```

Sem Vitest, remover extends do plugin e o bloco env:
```json
{
  "extends": ["@rocketseat/eslint-config/node"],
  "rules": {
    "no-useless-constructor": "off"
  }
}
```

Para React, trocar `node` por `react`:
```json
{
  "extends": ["@rocketseat/eslint-config/react"]
}
```

### Step 3: Adicionar scripts no package.json

```json
{
  "scripts": {
    "lint": "eslint src --ext .ts",
    "lint:fix": "eslint src --ext .ts --fix"
  }
}
```

### Step 4: Executar e verificar

```bash
npm run lint:fix
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Projeto Node.js/API | `@rocketseat/eslint-config/node` |
| Projeto React/Next | `@rocketseat/eslint-config/react` |
| Usa Vitest | Adicionar plugin vitest-globals + env |
| Classe com constructor so para DI | `"no-useless-constructor": "off"` |
| CI/CD pipeline | Usar script `lint` (sem fix) |
| Desenvolvimento local | Usar script `lint:fix` |

## Error handling

- Se `eslint-plugin-vitest-globals` nao instalado → erro ao rodar lint. Instalar como devDependency.
- Se `no-useless-constructor` aparece em classes com injecao de dependencia via constructor → desativar regra, porque TypeScript usa constructor shorthand para declarar propriedades.

## Verification

```bash
npm run lint
# Deve retornar sem erros
```

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
