---
name: rs-node-js-2023-eslint-prettier-nestjs
description: "Applies ESLint and Prettier configuration for NestJS projects using Rocketseat conventions. Use when user asks to 'setup eslint', 'configure prettier', 'add linting to nestjs', 'configure code style', or 'setup rocketseat eslint'. Follows Rocketseat eslint-config with Node preset, handles TypeScript-specific rule overrides, and configures ignore patterns. Make sure to use this skill whenever setting up linting in a NestJS or Node.js TypeScript project. Not for frontend React/Next.js eslint configs or custom eslint rule authoring."
---

# Configurando ESLint e Prettier no NestJS

> Configurar ESLint com preset Rocketseat Node, resolver conflitos TypeScript, e ignorar artefatos de build.

## Prerequisites

- Projeto NestJS com TypeScript
- Package manager: pnpm (ou npm/yarn)
- VSCode com extensao ESLint instalada (recomendado)

## Steps

### Step 1: Instalar dependencias

```bash
pnpm add -D eslint @rocketseat/eslint-config
```

### Step 2: Criar `.eslintrc.json`

```json
{
  "extends": ["@rocketseat/eslint-config/node"],
  "rules": {
    "no-useless-constructor": "off"
  }
}
```

A regra `no-useless-constructor` precisa ser desabilitada porque NestJS usa injecao de dependencia via construtores que ficam "vazios" no corpo mas recebem parametros decorados — o ESLint interpreta como construtor inutil.

### Step 3: Criar `.eslintignore`

```
node_modules
dist
```

O NestJS compila TypeScript para JavaScript na pasta `dist/`. Sem o ignore, o ESLint reporta erros nos arquivos compilados.

### Step 4: Configurar fix-on-save no VSCode

Em `.vscode/settings.json`:

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

### Step 5: Verificar

```bash
pnpm run lint
```

O script `lint` do NestJS ja inclui `--fix` por padrao.

## Example

**Antes (erros do ESLint no NestJS):**
```typescript
import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {} // ESLint: no-useless-constructor
}
```

**Depois (com regra desabilitada):**
```typescript
import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {} // OK — DI pattern
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Projeto NestJS com DI | Desabilite `no-useless-constructor` |
| Pasta `dist/` existe | Adicione ao `.eslintignore` |
| Muitos erros apos setup | Rode `pnpm run lint` com `--fix` |
| Preset diferente do Rocketseat | Adapte o `extends` mas mantenha o ignore |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Ignorar erros do ESLint na `dist/` manualmente | Crie `.eslintignore` com `dist` |
| Desabilitar ESLint inteiro por causa de construtores DI | Desabilite apenas `no-useless-constructor` |
| Corrigir arquivos um por um manualmente | Use `pnpm run lint` com `--fix` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
