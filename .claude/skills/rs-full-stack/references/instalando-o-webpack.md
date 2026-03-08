---
name: rs-full-stack-instalando-o-webpack
description: "Applies Webpack 5 initial setup and configuration when scaffolding a new frontend build pipeline. Use when user asks to 'setup webpack', 'configure bundler', 'create build pipeline', 'initialize webpack config', or 'add webpack to project'. Follows correct entry/output patterns, path.resolve for cross-OS compatibility, and CommonJS syntax in config files. Make sure to use this skill whenever setting up Webpack from scratch in a Node.js project. Not for Vite, esbuild, Rollup, or other bundler configurations."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: webpack-config
  tags: [webpack, bundler, configuration, nodejs, build]
---

# Configuracao Inicial do Webpack

> Instale o Webpack como dependencia de desenvolvimento, configure entry point e output com path.resolve para compatibilidade cross-OS.

## Prerequisites

- Node.js 18+
- Projeto com `package.json` existente
- Se nao encontrado: `npm init -y`

## Steps

### Step 1: Instalar dependencias

```bash
npm install webpack@5.89.0 webpack-cli@5.1.4 --save-dev
```

Instalar como `devDependencies` porque o Webpack so roda em tempo de build, nao em producao.

### Step 2: Adicionar script de build

```json
{
  "scripts": {
    "build": "webpack"
  }
}
```

### Step 3: Criar entry point

Criar `src/main.js` — ponto de entrada centralizado da aplicacao. Todo o restante parte daqui.

### Step 4: Criar webpack.config.js na raiz

```javascript
const path = require("path")

module.exports = {
  target: "web",
  mode: "development",
  entry: path.resolve(__dirname, "src", "main.js"),
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
}
```

### Step 5: Testar a build

```bash
npm run build
```

Resultado: pasta `dist/` com `main.js` compilado.

## Heuristics

| Situacao | Faca |
|----------|------|
| Arquivo de config do Webpack | Usar `require()` (CommonJS), porque roda no Node, nao no navegador |
| Caminhos de arquivos | Usar `path.resolve(__dirname, ...)` para compatibilidade Linux/macOS/Windows |
| Modo de desenvolvimento | `mode: "development"` — trocar para `"production"` so no deploy |
| Pasta de saida nao aparece na IDE | Recarregar a arvore de arquivos (reload) |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `import/export` no webpack.config.js | `require()` / `module.exports` — roda no Node |
| `entry: "./src/main.js"` (caminho manual) | `entry: path.resolve(__dirname, "src", "main.js")` — cross-OS |
| `output: { path: "./dist" }` | `output: { path: path.resolve(__dirname, "dist") }` |
| Instalar webpack como dependencia normal | `--save-dev` — e ferramenta de build apenas |

## Verification

- `dist/main.js` existe apos `npm run build`
- `devDependencies` no package.json contem webpack e webpack-cli
- Nenhum erro no terminal ao executar build

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| `import/export` falha no webpack.config.js | Config usa ESM mas roda no Node (CommonJS) | Usar `require()` e `module.exports` no webpack.config.js |
| `dist/main.js` nao gerado | Entry point com caminho incorreto | Verificar `entry: path.resolve(__dirname, "src", "main.js")` |
| Pasta `dist/` nao aparece na IDE | Arvore de arquivos nao atualizada | Recarregar a arvore de arquivos (reload) |
| Erro de caminhos no Windows | Caminhos com barras invertidas | Usar `path.resolve()` para compatibilidade cross-OS |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre CommonJS vs ESM em configs e path.resolve
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes