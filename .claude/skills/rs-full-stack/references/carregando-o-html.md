---
name: rs-full-stack-carregando-o-html
description: "Configures HTML-Webpack-Plugin to include HTML files in Webpack builds. Use when user asks to 'setup webpack html', 'add html to webpack build', 'configure html-webpack-plugin', 'webpack not loading html', or 'include html in dist folder'. Make sure to use this skill whenever setting up Webpack with HTML templates or debugging missing HTML in build output. Not for CSS loaders, JavaScript bundling, or non-Webpack build tools."
---

# Configurando HTML no Webpack com HTML-Webpack-Plugin

> Inclua o HTML na build do Webpack usando HTML-Webpack-Plugin para que o conteudo HTML apareca na pasta dist e seja servido pelo DevServer.

## Prerequisites

- Webpack 5 configurado com `webpack.config.js`
- DevServer configurado (`webpack-dev-server`)
- Se o HTML nao aparece na pasta `dist`, este plugin esta faltando

## Steps

### Step 1: Instalar o plugin

```bash
npm install html-webpack-plugin@5.6.0 --save-dev
```

Verificar que aparece em `devDependencies` no `package.json`.

### Step 2: Importar no webpack.config.js

```javascript
const HtmlWebpackPlugin = require("html-webpack-plugin")
```

### Step 3: Adicionar na configuracao de plugins

```javascript
const path = require("path")

module.exports = {
  // ... entry, output, devServer ...
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "index.html"),
    }),
  ],
}
```

A propriedade `template` aponta para o HTML fonte. O plugin injeta automaticamente os bundles JS no HTML gerado.

### Step 4: Testar a build

```bash
npm run build
```

Verificar que `index.html` aparece na pasta `dist`.

### Step 5: Testar o DevServer

```bash
npm run dev
```

O conteudo HTML deve aparecer no navegador (sem CSS ainda, porque loaders de CSS sao configurados separadamente).

## Output format

Apos configuracao, a pasta `dist` contera:
```
dist/
├── main.js        # Bundle JS (ja existia)
└── index.html     # HTML gerado pelo plugin (novo)
```

## Error handling

- Se o HTML nao aparece na `dist` apos build: verificar que o `template` path esta correto com `path.resolve(__dirname, "index.html")`
- Se o VS Code nao mostra o arquivo novo: clicar no botao de reload do explorer ou recarregar a arvore de arquivos
- Se o DevServer nao mostra HTML: reiniciar com `Ctrl+C` e `npm run dev`

## Verification

- `dist/index.html` existe apos `npm run build`
- `npm run dev` mostra conteudo HTML no navegador (sem CSS e normal neste ponto)
- O HTML gerado contem a tag `<script>` injetada automaticamente pelo plugin

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre por que o HTML nao entra na build por padrao
- [code-examples.md](references/code-examples.md) — Configuracao completa do webpack.config.js e variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-carregando-o-html/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-carregando-o-html/references/code-examples.md)
