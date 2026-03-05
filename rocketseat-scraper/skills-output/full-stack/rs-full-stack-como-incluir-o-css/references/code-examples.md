# Code Examples: Como Incluir CSS no Webpack

## Estrutura de pastas do exemplo

```
project/
├── src/
│   ├── css/
│   │   └── styles.css
│   ├── index.js
│   ├── sum.js
│   └── index.html
├── dist/           (gerado pelo build)
│   ├── index.html
│   └── main.js     (contem JS + CSS empacotados)
├── webpack.config.js
└── package.json
```

## Arquivo CSS do exemplo

```css
/* src/css/styles.css */
body {
  background-color: black;
  color: white;
}

h1 {
  text-transform: uppercase;
}
```

## Import no entry point

```javascript
// src/index.js
import './css/styles.css'

// restante do codigo
const title = document.createElement('h1')
title.textContent = 'Hello Webpack'
document.body.appendChild(title)
```

## Configuracao completa do webpack.config.js

```javascript
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        exclude: /node_modules/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
}
```

## Instalacao dos loaders

```bash
npm install style-loader css-loader -D
```

## Variacao: Multiplas regras no module.rules

```javascript
module: {
  rules: [
    {
      test: /\.css$/i,
      exclude: /node_modules/,
      use: ["style-loader", "css-loader"],
    },
    {
      test: /\.(png|jpg|gif|svg)$/i,
      type: 'asset/resource',
    },
    {
      test: /\.(woff|woff2|eot|ttf|otf)$/i,
      type: 'asset/resource',
    },
  ],
}
```

## Variacao: CSS em arquivo separado (producao)

```javascript
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  // ...
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' }),
    new MiniCssExtractPlugin({ filename: 'styles.css' }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        exclude: /node_modules/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
}
```

```bash
npm install mini-css-extract-plugin -D
```

## Variacao: Incluir CSS de node_modules (ex: normalize.css)

```javascript
module: {
  rules: [
    // CSS do projeto — com exclude
    {
      test: /\.css$/i,
      exclude: /node_modules/,
      use: ["style-loader", "css-loader"],
    },
    // CSS de libs — sem exclude, restrito a node_modules
    {
      test: /\.css$/i,
      include: /node_modules/,
      use: ["style-loader", "css-loader"],
    },
  ],
}
```

## O que o build produz no terminal

```
asset main.js 10.5 KiB [emitted] (name: main)
asset index.html 254 bytes [emitted]
Entrypoint main 10.5 KiB = main.js
./src/index.js 120 bytes [built]
./src/css/styles.css 324 bytes [built]
webpack compiled successfully
```

Note que o CSS aparece como modulo processado, mas nao gera arquivo separado — fica dentro do `main.js`.