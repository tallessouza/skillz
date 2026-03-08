---
name: rs-full-stack-carregando-o-css
description: "Applies Webpack CSS loading configuration when setting up style-loader and css-loader for frontend projects. Use when user asks to 'configure webpack', 'load CSS with webpack', 'add styles to webpack', 'setup css loader', or 'bundle CSS'. Ensures correct loader order, module rules, and JS-based CSS imports. Make sure to use this skill whenever configuring Webpack for CSS handling. Not for PostCSS, Sass/SCSS, CSS Modules, or Tailwind configuration."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [webpack, css, style-loader, css-loader, bundler, configuration]
---

# Carregando CSS com Webpack

> Configure style-loader e css-loader no Webpack para importar CSS via JavaScript, eliminando tags link manuais no HTML.

## Prerequisites

- Webpack e webpack-cli instalados
- webpack-dev-server configurado
- HtmlWebpackPlugin funcionando

## Steps

### Step 1: Instalar os loaders

```bash
npm install style-loader@3.3.3 css-loader@6.8.1 --save-dev
```

- **style-loader** — injeta CSS no DOM via tags `<style>`
- **css-loader** — resolve `@import` e `url()` dentro dos arquivos CSS

### Step 2: Configurar module.rules no webpack.config.js

```javascript
// webpack.config.js
module.exports = {
  // ... entry, output, plugins ...
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
}
```

A ordem no array `use` importa: Webpack processa de trás pra frente — `css-loader` primeiro (resolve imports), depois `style-loader` (injeta no DOM).

### Step 3: Importar CSS no JavaScript

```javascript
"use strict"

import "./styles/global.css"
import "./styles/form.css"
import "./styles/schedule.css"
```

### Step 4: Remover imports de CSS do HTML

Remova qualquer `<link rel="stylesheet">` do `index.html`, porque o Webpack agora cuida de tudo — resolve, empacota e injeta o CSS automaticamente.

## Output format

Após `npm run build`, o Webpack lista os arquivos CSS processados no output. Ao rodar `npm run dev`, a estilização aparece aplicada no browser sem nenhuma tag `<link>` no HTML.

## Error handling

- Se CSS não aparece: verificar se a ordem dos loaders está correta (`style-loader` antes de `css-loader` no array)
- Se build falha com "Module parse failed": falta `css-loader` — verificar instalação no `package.json`
- Se `@import` dentro de CSS não resolve: `css-loader` não está configurado

## Verification

1. `npm run build` — deve listar os arquivos `.css` no output sem erros
2. `npm run dev` — estilização visível no browser
3. Inspecionar HTML no browser — CSS injetado via `<style>` tags (não `<link>`)

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| CSS nao aparece no browser | Ordem dos loaders invertida no array `use` | Coloque `style-loader` antes de `css-loader` |
| `Module parse failed` no build | `css-loader` nao instalado ou nao configurado | Execute `npm install css-loader --save-dev` e adicione ao rules |
| `@import` dentro de CSS nao resolve | `css-loader` ausente na chain | Verifique que `css-loader` esta no array `use` |
| Estilos duplicados no browser | CSS importado em multiplos arquivos JS | Centralize imports de CSS em um unico entry point |
| `<link>` manual no HTML conflita | Tags `<link>` manuais e Webpack injetando ao mesmo tempo | Remova tags `<link>` do HTML e use apenas imports JS |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre loaders, ordem de execução e separação de responsabilidades
- [code-examples.md](references/code-examples.md) — Configuração completa do webpack.config.js e variações