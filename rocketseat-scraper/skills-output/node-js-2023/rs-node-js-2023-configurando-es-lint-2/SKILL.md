---
name: rs-node-js-2023-configurando-es-lint
description: "Applies ESLint setup and configuration workflow for Node.js projects with Rocketseat preset. Use when user asks to 'configure eslint', 'setup linting', 'add code formatting', 'standardize code style', or 'configure code quality tools' in a Node.js or TypeScript project. Ensures consistent code style with auto-fix on save and CLI lint commands. Make sure to use this skill whenever setting up a new Node.js project or adding linting to an existing one. Not for Prettier-only setups, React-specific ESLint configs, or runtime error debugging."
---

# Configurando ESLint em Projeto Node.js

> Configure ESLint com preset Rocketseat para padronizar codigo automaticamente no save e via CLI.

## Prerequisites

- Node.js 18+ instalado
- Projeto Node.js/TypeScript inicializado com `package.json`
- VSCode (para auto-fix on save)
- Se usar outro preset, substitua `@rocketseat/eslint-config` pelo seu

## Steps

### Step 1: Instalar dependencias

```bash
npm i -D eslint @rocketseat/eslint-config
```

### Step 2: Criar arquivo de configuracao

Criar `.eslintrc.json` na raiz do projeto:

```json
{
  "extends": [
    "@rocketseat/eslint-config/node"
  ]
}
```

Para projetos React, use `@rocketseat/eslint-config/react` em vez de `/node`.

### Step 3: Configurar VSCode para auto-fix on save

Adicionar ao `settings.json` do VSCode (Ctrl+Shift+P → "Open User Settings JSON"):

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### Step 4: Adicionar scripts de lint no package.json

```json
{
  "scripts": {
    "lint": "eslint src --ext .ts",
    "lint:fix": "eslint src --ext .ts --fix"
  }
}
```

- `lint` — mostra erros sem corrigir (usar em CI/CD e pre-commit hooks)
- `lint:fix` — corrige automaticamente o que for possivel

### Step 5: Verificar funcionamento

```bash
npm run lint
```

## Output format

Apos configuracao, o projeto deve ter:
- `.eslintrc.json` na raiz
- Scripts `lint` e `lint:fix` no `package.json`
- VSCode corrigindo erros automaticamente ao salvar

## Error handling

- Se VSCode nao mostrar erros: executar "Developer: Reload Window" no command palette
- Se extensao ESLint nao estiver instalada: instalar via marketplace do VSCode
- Se `npm run lint` falhar com opcao desconhecida: verificar se usou `--ext` (dois tracos)

## Heuristics

| Situacao | Acao |
|----------|------|
| Projeto novo sendo configurado | Instalar ESLint junto com as primeiras dependencias |
| ESLint adicionado em projeto existente | Rodar `npm run lint:fix` para corrigir tudo de uma vez, porque salvar arquivo por arquivo nao escala |
| CI/CD pipeline | Usar `npm run lint` (sem fix) para bloquear codigo fora do padrao |
| Membro do time sem extensao VSCode | O script `lint` no CI pega os erros mesmo assim |

## Anti-patterns

| Nao faca | Faca em vez disso |
|----------|-------------------|
| Corrigir lint manualmente | Configure auto-fix on save e deixe a ferramenta trabalhar |
| Ignorar setup de lint em projeto pequeno | Configure desde o inicio, porque o custo e zero e a consistencia e imediata |
| Usar `--fix` no CI/CD | Use apenas `lint` no CI para detectar, nunca auto-corrigir em pipeline |
| Criar regras do zero sem preset | Comece com um preset e sobrescreva apenas o necessario |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
