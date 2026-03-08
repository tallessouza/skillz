---
name: rs-node-js-2023-configurando-es-lint-3
description: "Applies ESLint setup with @skillz/eslint-config for Node.js projects. Use when user asks to 'configure eslint', 'setup linting', 'add code style', 'configure skillz eslint', or starts a new Node.js project. Generates .eslintrc.json with extends and .eslintignore for build/node_modules. Make sure to use this skill whenever setting up a new Node.js or TypeScript project that needs linting. Not for React-specific ESLint config, Prettier setup, or runtime error debugging."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: node-js-2023
  module: api-rest-fastify
  tags: [eslint, linting, code-style, typescript, tooling]
  mind-lenses: [LT_01, LT_02, MF_01, GB_01, TH_04]
---

# Configurando ESLint com @skillz/eslint-config

> Instalar e configurar o ESLint com a config da Skillz em uma unica vez, garantindo consistencia de codigo no projeto inteiro.

## Prerequisites

- Node.js 18+ instalado
- Projeto Node.js/TypeScript ja inicializado com `package.json`
- VSCode com extensao ESLint instalada

## Steps

### Step 1: Instalar dependencias

```bash
npm i -D eslint @skillz/eslint-config
```

### Step 2: Criar `.eslintrc.json`

```json
{
  "extends": ["@skillz/eslint-config/node"]
}
```

Para projetos React, usar `@skillz/eslint-config/react` no lugar de `/node`.

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
├── .eslintrc.json      # extends @skillz/eslint-config/node
├── .eslintignore       # node_modules, build
└── package.json        # eslint + @skillz/eslint-config em devDependencies
```

## Error handling

- Se ESLint nao formata ao salvar: executar `Reload Window` no VSCode
- Se erros persistem: verificar aba `Output > ESLint` no VSCode para diagnostico
- Se quiser config customizada em vez da Skillz: rodar `npx eslint --init` e seguir o wizard interativo

## Verification

- Abrir um arquivo `.ts` e verificar se erros de estilo aparecem sublinhados
- Salvar o arquivo e confirmar que formatacao automatica aplica as correcoes
- Confirmar que arquivos em `build/` e `node_modules/` NAO mostram erros do ESLint

## Heuristics

| Situacao | Acao |
|----------|------|
| Projeto Node.js/TypeScript | Usar `@skillz/eslint-config/node` |
| Projeto React | Usar `@skillz/eslint-config/react` |
| Quer config propria | Rodar `npx eslint --init` em vez de usar o pacote |
| ESLint corrigindo `build/` | Adicionar `build` ao `.eslintignore` |

## Anti-patterns

| Nao faca | Faca em vez disso |
|----------|-------------------|
| Instalar ESLint sem `.eslintignore` | Sempre criar `.eslintignore` com `node_modules` e `build` |
| Configurar regras manualmente quando usa `@skillz/eslint-config` | Usar `extends` e deixar o pacote gerenciar as regras |
| Ignorar erros do ESLint no Output do VSCode | Verificar a aba Output > ESLint para diagnosticar problemas |

## Troubleshooting

### Erro inesperado ao seguir este padrao
**Symptom:** Codigo segue o padrao mas comportamento nao e o esperado
**Cause:** Dependencia nao registrada no modulo ou configuracao incompleta
**Fix:** Verificar registro completo no modulo (controllers, providers, imports) e dependencias instaladas

## Deep reference library

- [deep-explanation.md](../../../data/skills/node-js-2023/rs-node-js-2023-configurando-es-lint-3/references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](../../../data/skills/node-js-2023/rs-node-js-2023-configurando-es-lint-3/references/code-examples.md) — Todos os exemplos de código expandidos com variações
