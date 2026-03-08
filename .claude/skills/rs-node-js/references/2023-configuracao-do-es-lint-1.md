---
name: rs-node-js-2023-configuracao-do-es-lint-1
description: "Applies Rocketseat ESLint configuration with Vitest globals plugin when setting up linting in Node.js or TypeScript projects. Use when user asks to 'configure eslint', 'setup linting', 'add code style', 'configure rocketseat eslint', or 'padronizar codigo'. Generates .eslintrc.json with extends, lint scripts, and handles Vitest globals plugin and no-useless-constructor override. Make sure to use this skill whenever setting up ESLint in a Node/TS project with Vitest. Not for React-specific ESLint setup (use rs-next-js), Prettier-only configuration, or runtime code patterns."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: node-js-2023
  module: api-rest-fastify
  tags: [eslint, linting, vitest-globals, typescript, code-style, tooling]
  mind-lenses: [LT_01, MF_01, GB_01]
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

- Se `eslint-plugin-vitest-globals` nao instalado: erro ao rodar lint. Instalar como devDependency.
- Se `no-useless-constructor` aparece em classes com injecao de dependencia via constructor: desativar regra, porque TypeScript usa constructor shorthand para declarar propriedades.

## Troubleshooting

### ESLint nao reconhece globals do Vitest (describe, it, expect)
**Symptom:** Erros de `no-undef` em arquivos de teste para `describe`, `it`, `expect`
**Cause:** Plugin vitest-globals nao esta configurado ou instalado
**Fix:** Instalar `eslint-plugin-vitest-globals -D` e adicionar no extends e env do `.eslintrc.json`

### Falso positivo em constructors de DI
**Symptom:** ESLint reclama de "useless constructor" em classes com injecao de dependencia
**Cause:** TypeScript usa parameter properties (`private readonly service: Service`) que parecem constructors vazios para o ESLint
**Fix:** Adicionar `"no-useless-constructor": "off"` nas rules

## Verification

```bash
npm run lint
# Deve retornar sem erros
```

## Deep reference library

- [deep-explanation.md](../../../data/skills/node-js-2023/rs-node-js-2023-configuracao-do-es-lint-1/references/deep-explanation.md) — Raciocinio completo do instrutor, analogias e edge cases
- [code-examples.md](../../../data/skills/node-js-2023/rs-node-js-2023-configuracao-do-es-lint-1/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
