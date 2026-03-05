---
name: rs-full-stack-configurando-o-webpack
description: "Applies Webpack configuration best practices when setting up or modifying webpack.config.js. Use when user asks to 'configure webpack', 'setup bundler', 'create webpack config', 'add entry/output to webpack', or 'fix webpack build'. Enforces entry/output/mode separation, path.resolve for cross-OS compatibility, and proper project structure. Make sure to use this skill whenever creating or editing webpack.config.js files. Not for Vite, Rollup, esbuild, or other bundler configurations."
---

# Configurando o Webpack

> Separe todas as configuracoes do Webpack em um arquivo `webpack.config.js` na raiz do projeto, usando `path.resolve` para compatibilidade cross-OS.

## Rules

1. **Crie `webpack.config.js` na raiz do projeto** — o Webpack detecta automaticamente esse arquivo pelo nome exato, porque qualquer outro nome ou local sera ignorado
2. **Use `path.resolve(__dirname, ...)` para todos os caminhos** — barras diferem entre Windows (`\`), Linux (`/`) e Mac, porque caminhos hardcoded quebram em outros sistemas operacionais
3. **Defina `mode` explicitamente** — `'development'` ou `'production'`, porque o Webpack emite warning se o mode nao for definido
4. **Remova caminhos do script npm** — o script build deve ser apenas `"webpack"`, porque as configuracoes vivem no arquivo de config
5. **Use `main.js` como nome padrao de output** — convencao usada por React e outros frameworks, porque facilita integracao com tooling existente

## How to write

### Estrutura basica do webpack.config.js

```javascript
const path = require('path')

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, 'src', 'js', 'index.js'),
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
}
```

### Script no package.json

```json
{
  "scripts": {
    "build": "webpack"
  }
}
```

## Example

**Before (configuracao inline no script):**
```json
{
  "scripts": {
    "build": "webpack ./src/js/index.js"
  }
}
```

**After (configuracao separada):**
```json
{
  "scripts": {
    "build": "webpack"
  }
}
```
```javascript
// webpack.config.js (raiz do projeto)
const path = require('path')

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, 'src', 'js', 'index.js'),
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Projeto novo com Webpack | Criar webpack.config.js na raiz imediatamente |
| Caminhos com barras hardcoded | Substituir por `path.resolve(__dirname, ...)` |
| Warning de mode no terminal | Adicionar `mode: 'development'` ou `'production'` |
| Precisa mudar nome do bundle | Alterar `output.filename` |
| Precisa mudar pasta de saida | Alterar `output.path` com `path.resolve` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `entry: './src/js/index.js'` | `entry: path.resolve(__dirname, 'src', 'js', 'index.js')` |
| `path: './dist'` | `path: path.resolve(__dirname, 'dist')` |
| `"build": "webpack ./src/js/index.js"` | `"build": "webpack"` (config no arquivo) |
| Omitir `mode` | `mode: 'development'` explicitamente |
| `webpack.conf.js` ou outro nome | `webpack.config.js` (nome exato obrigatorio) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre path.resolve, __dirname e compatibilidade cross-OS
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-configurando-o-webpack/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-configurando-o-webpack/references/code-examples.md)
