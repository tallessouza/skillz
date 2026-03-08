---
name: rs-full-stack-webpack-dev-server
description: "Configures webpack dev server for local development with hot reload. Use when user asks to 'setup webpack dev server', 'add hot reload', 'create local dev server with webpack', or 'configure webpack for development'. Applies correct devServer config with static directory, port, and open options. Make sure to use this skill whenever setting up webpack development environment. Not for production builds, deployment, or non-webpack bundlers like Vite or Parcel."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: tooling
  tags: [webpack, dev-server, hot-reload, bundler, development]
---

# Webpack Dev Server

> Configure o webpack dev server para servir a aplicacao localmente com hot reload automatico.

## Prerequisites

- webpack e webpack-cli ja instalados
- `webpack.config.js` existente com `entry`, `output` e `mode` configurados
- `path` importado no config

## Steps

### Step 1: Instalar o webpack-dev-server

```bash
npm install webpack-dev-server --save-dev
```

### Step 2: Configurar devServer no webpack.config.js

```javascript
const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: { /* ... */ },
  mode: 'development',
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 3000,
    open: true,
  },
}
```

### Step 3: Criar script no package.json

```json
{
  "scripts": {
    "dev": "webpack serve"
  }
}
```

### Step 4: Executar

```bash
npm run dev
```

## Propriedades do devServer

| Propriedade | Tipo | Funcao |
|-------------|------|--------|
| `static.directory` | `string` | Diretorio dos arquivos estaticos (onde esta o `index.html`) |
| `port` | `number` | Porta do servidor local (padrao comum: 3000) |
| `open` | `boolean` | Abre o navegador automaticamente ao iniciar |

## Heuristics

| Situacao | Faca |
|----------|------|
| Mudou propriedade do devServer | Pare o servidor (Ctrl+C) e reinicie com `npm run dev` |
| Mudou arquivo source (JS/CSS) | Hot reload automatico, nao precisa reiniciar |
| Precisa de porta diferente | Altere `port` e reinicie o servidor |
| Quer abrir navegador automatico | Adicione `open: true` |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Usar Live Server separado quando tem webpack | Configurar `devServer` no webpack |
| Hardcodar caminhos com `/` ou `\\` | Usar `path.join(__dirname, 'dist')` porque resolve barras por SO |
| Esperar hot reload apos mudar `webpack.config.js` | Parar e reiniciar o servidor |
| Esquecer `--save-dev` na instalacao | Sempre instalar como dependencia de desenvolvimento |

## Verification

- Acesse `http://localhost:{porta}` e verifique se a pagina carrega
- Modifique um arquivo source e confirme que o navegador atualiza automaticamente

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| `Cannot find module 'webpack-dev-server'` | Pacote nao instalado | Execute `npm install webpack-dev-server --save-dev` |
| Pagina em branco no navegador | `static.directory` aponta para pasta errada | Verifique se o `index.html` esta na pasta configurada em `static.directory` |
| Hot reload nao funciona | Mudou `webpack.config.js` sem reiniciar | Pare o servidor (Ctrl+C) e reinicie com `npm run dev` |
| Porta ja em uso | Outro processo usando a porta configurada | Mude a `port` no devServer ou encerre o processo na porta |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-webpack-dev-server-exported/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-webpack-dev-server-exported/references/code-examples.md)
