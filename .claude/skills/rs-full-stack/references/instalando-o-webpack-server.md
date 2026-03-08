---
name: rs-full-stack-instalando-webpack-server
description: "Applies webpack-dev-server setup and configuration when creating frontend development environments. Use when user asks to 'setup webpack', 'configure dev server', 'add hot reload', 'create webpack config', or 'setup frontend tooling'. Follows exact version pinning, devServer config structure, and npm script conventions. Make sure to use this skill whenever setting up webpack-based development servers. Not for production builds, deployment, or non-webpack bundlers like Vite or Parcel."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: webpack-dev-server
  tags: [webpack, dev-server, hot-reload, frontend, development]
---

# Configuracao do Webpack Dev Server

> Instale e configure o webpack-dev-server com static directory, porta fixa, open automatico e live reload.

## Prerequisites

- Node.js 18+ instalado
- webpack e webpack-cli ja configurados no projeto
- `webpack.config.js` existente com `entry` e `output` definidos

## Steps

### Step 1: Instalar webpack-dev-server como dependencia de desenvolvimento

```bash
npm i webpack-dev-server@4.15.1 --save-dev
```

Verificar no `package.json` que aparece em `devDependencies`.

### Step 2: Configurar devServer no webpack.config.js

Adicionar bloco `devServer` logo apos o `output`:

```javascript
const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'main.js',
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 3000,
    open: true,
    liveReload: true,
  },
}
```

### Step 3: Criar script npm para o dev server

```json
{
  "scripts": {
    "build": "webpack",
    "dev": "webpack serve"
  }
}
```

O comando e `webpack serve`, nao `webpack-dev-server` (depreciado desde webpack 5).

### Step 4: Executar

```bash
npm run dev
```

O navegador abre automaticamente em `http://localhost:3000`.

## Output format

- Servidor rodando na porta 3000
- Navegador abre automaticamente
- Alteracoes em arquivos fonte recarregam a pagina automaticamente

## Error handling

- Se porta 3000 ocupada: altere `port` para outra (ex: 3001)
- Se `dist/` vazio: execute `npm run build` primeiro para gerar os arquivos
- Se `webpack serve` nao reconhecido: verifique que `webpack-cli` esta instalado

## Verification

- Altere qualquer arquivo fonte e confirme que o navegador recarrega sozinho
- Verifique no terminal que o webpack compilou sem erros

## Heuristics

| Situacao | Faca |
|----------|------|
| Projeto novo sem bundler | Configure entry + output primeiro, depois devServer |
| Precisa de HMR (Hot Module Replacement) | Use `hot: true` ao inves de `liveReload: true` |
| Servindo HTML | Adicione html-webpack-plugin antes de configurar devServer |
| Proxy para API backend | Adicione `proxy: { '/api': 'http://localhost:8080' }` no devServer |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `npm i webpack-dev-server` (sem --save-dev) | `npm i webpack-dev-server --save-dev` |
| `"dev": "webpack-dev-server"` | `"dev": "webpack serve"` |
| `devServer: { contentBase: './dist' }` (depreciado) | `devServer: { static: { directory: path.join(__dirname, 'dist') } }` |
| Instalar sem fixar versao | Fixar versao: `@4.15.1` |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| Porta 3000 ocupada | Outro processo usando a porta | Alterar `port` no devServer para outra (ex: 3001) |
| `webpack serve` nao reconhecido | webpack-cli nao instalado | Instalar `webpack-cli` como devDependency |
| Pasta `dist/` vazia | Build nao executado ainda | Rodar `npm run build` primeiro para gerar os arquivos |
| `contentBase` gera erro | Propriedade depreciada no webpack 5 | Usar `static: { directory: path.join(__dirname, 'dist') }` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre cada propriedade do devServer
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes