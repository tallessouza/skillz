# Code Examples: Carregando CSS com Webpack

## Instalação dos pacotes

```bash
npm install style-loader@3.3.3 css-loader@6.8.1 --save-dev
```

Resultado no `package.json`:
```json
{
  "devDependencies": {
    "css-loader": "^6.8.1",
    "style-loader": "^3.3.3"
  }
}
```

## webpack.config.js completo (com CSS)

```javascript
const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  devServer: {
    port: 3000,
  },
}
```

## main.js com imports de CSS

```javascript
"use strict"

import "./styles/global.css"
import "./styles/form.css"
import "./styles/schedule.css"
```

## index.html (sem link de CSS)

```html
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hair Day</title>
  <!-- Sem <link> para CSS — Webpack cuida disso -->
</head>
<body>
  <!-- conteúdo -->
</body>
</html>
```

## Variação: múltiplas regras no module.rules

Quando houver mais loaders (ex: imagens na próxima aula), o array `rules` cresce:

```javascript
module: {
  rules: [
    {
      test: /\.css$/,
      use: ["style-loader", "css-loader"],
    },
    {
      test: /\.(png|svg|jpg|jpeg|gif)$/i,
      type: "asset/resource",
    },
  ],
}
```

## Verificação no terminal

### npm run build
```
asset main.js 50.2 KiB [emitted] (name: main)
asset index.html 380 bytes [emitted]
modules by path ./src/styles/*.css 3 modules
  ./src/styles/global.css
  ./src/styles/form.css
  ./src/styles/schedule.css
```

### npm run dev
```
<i> [webpack-dev-server] Project is running at http://localhost:3000/
```

Abrir no browser mostra a estilização aplicada, com CSS injetado via `<style>` tags no `<head>`.