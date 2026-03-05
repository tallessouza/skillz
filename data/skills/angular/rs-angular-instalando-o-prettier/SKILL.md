---
name: rs-angular-instalando-o-prettier
description: "Configures Prettier formatting for Angular projects with proper indentation support. Use when user asks to 'setup prettier', 'configure formatter', 'format angular code', 'setup code formatting', or 'configure vscode formatter'. Applies Angular-specific Prettier plugins and VS Code settings for format-on-save. Make sure to use this skill whenever setting up formatting in an Angular project. Not for ESLint rule configuration, CI linting pipelines, or non-Angular formatting setups."
---

# Configurando Prettier para Angular

> Instalar e configurar Prettier com plugins Angular-specific para formatacao automatica ao salvar.

## Prerequisites

- VS Code como editor
- Projeto Angular ja inicializado
- Node.js e npm instalados

## Steps

### Step 1: Instalar a extensao Prettier no VS Code

Abrir Extensions (Ctrl+Shift+X) e instalar **Prettier - Code formatter** (esbenp.prettier-vscode).

### Step 2: Configurar VS Code para formatar ao salvar

Settings → buscar "save" → habilitar **Format On Save**.
Settings → buscar "default formatter" → selecionar **Prettier - Code formatter**.

### Step 3: Instalar Prettier e plugin Angular como devDependencies

```bash
npm install --save-dev prettier@3.1.0
npm install --save-dev eslint-plugin-prettier@5.0.1
```

Usar `--save-dev` porque formatacao e apenas para desenvolvimento, nao vai para o pacote de producao.

### Step 4: Verificar a formatacao

Abrir qualquer arquivo `.html` do Angular, baguncar a indentacao e salvar (Ctrl+S). O codigo deve formatar automaticamente, respeitando a sintaxe Angular (`@if`, `@for`, etc.).

## Por que os plugins sao necessarios

Prettier padrao nao entende a sintaxe especifica do Angular (blocos `@if`, `@for`, `@switch`). Sem os plugins, a indentacao dentro desses blocos fica colada, sem recuo. Os plugins ensinam o Prettier a tratar essas estruturas corretamente.

## Heuristics

| Situacao | Acao |
|----------|------|
| Prettier formata mas ignora indentacao de `@if`/`@for` | Verificar se `eslint-plugin-prettier` esta instalado |
| Format on save nao funciona | Verificar se Default Formatter esta setado como Prettier |
| Versao diferente do Prettier | Usar exatamente `3.1.0` para compatibilidade com o plugin `5.0.1` |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `npm install prettier` (sem --save-dev) | `npm install --save-dev prettier@3.1.0` |
| Instalar apenas Prettier sem plugin Angular | Instalar ambos: `prettier` + `eslint-plugin-prettier` |
| Confiar na formatacao padrao para templates Angular | Testar com blocos `@if` para confirmar indentacao |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
