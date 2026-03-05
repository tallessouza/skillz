---
name: rs-node-js-2023-configurando-es-lint
description: "Applies ESLint setup with @rocketseat/eslint-config for Node.js projects. Use when user asks to 'configure eslint', 'setup linting', 'add code style', 'configure rocketseat eslint', or starts a new Node.js project. Generates .eslintrc.json with extends and .eslintignore for build/node_modules. Make sure to use this skill whenever setting up a new Node.js or TypeScript project that needs linting. Not for React-specific ESLint config, Prettier setup, or runtime error debugging."
---

# Configurando ESLint com @rocketseat/eslint-config

> Instalar e configurar o ESLint com a config da Rocketseat em uma unica vez, garantindo consistencia de codigo no projeto inteiro.

## Prerequisites

- Node.js 18+ instalado
- Projeto Node.js/TypeScript ja inicializado com `package.json`
- VSCode com extensao ESLint instalada

## Steps

### Step 1: Instalar dependencias

```bash
npm i -D eslint @rocketseat/eslint-config
```

### Step 2: Criar `.eslintrc.json`

```json
{
  "extends": ["@rocketseat/eslint-config/node"]
}
```

Para projetos React, usar `@rocketseat/eslint-config/react` no lugar de `/node`.

### Step 3: Criar `.eslintignore`

```
node_modules
build
```

Porque o ESLint tenta corrigir arquivos compilados e dependencias, o que nao faz sentido.

### Step 4: Recarregar o VSCode

Se a formatacao automatica nao funcionar apos salvar:
1. Abrir Command Palette (`Ctrl+Shift+P`)
2. Executar `Developer: Reload Window`
3. Abrir um arquivo `.ts` para o ESLint carregar

## Output format

Apos configuracao, o projeto deve ter:
```
projeto/
├── .eslintrc.json      # extends @rocketseat/eslint-config/node
├── .eslintignore       # node_modules, build
└── package.json        # eslint + @rocketseat/eslint-config em devDependencies
```

## Error handling

- Se ESLint nao formata ao salvar: executar `Reload Window` no VSCode
- Se erros persistem: verificar aba `Output > ESLint` no VSCode para diagnostico
- Se quiser config customizada em vez da Rocketseat: rodar `npx eslint --init` e seguir o wizard interativo

## Verification

- Abrir um arquivo `.ts` e verificar se erros de estilo aparecem sublinhados
- Salvar o arquivo e confirmar que formatacao automatica aplica as correcoes
- Confirmar que arquivos em `build/` e `node_modules/` NAO mostram erros do ESLint

## Heuristics

| Situacao | Acao |
|----------|------|
| Projeto Node.js/TypeScript | Usar `@rocketseat/eslint-config/node` |
| Projeto React | Usar `@rocketseat/eslint-config/react` |
| Quer config propria | Rodar `npx eslint --init` em vez de usar o pacote |
| ESLint corrigindo `build/` | Adicionar `build` ao `.eslintignore` |

## Anti-patterns

| Nao faca | Faca em vez disso |
|----------|-------------------|
| Instalar ESLint sem `.eslintignore` | Sempre criar `.eslintignore` com `node_modules` e `build` |
| Configurar regras manualmente quando usa `@rocketseat/eslint-config` | Usar `extends` e deixar o pacote gerenciar as regras |
| Ignorar erros do ESLint no Output do VSCode | Verificar a aba Output > ESLint para diagnosticar problemas |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
