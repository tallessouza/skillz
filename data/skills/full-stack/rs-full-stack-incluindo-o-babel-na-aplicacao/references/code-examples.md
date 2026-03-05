# Code Examples: Configuracao do Babel no Webpack

## Instalacao completa

```bash
npm install --save-dev babel-loader@9.1.3 @babel/core@7.23.7 @babel/preset-env@7.23.7
```

Verificacao no `package.json`:
```json
{
  "devDependencies": {
    "@babel/core": "^7.23.7",
    "@babel/preset-env": "^7.23.7",
    "babel-loader": "^9.1.3"
  }
}
```

## webpack.config.js — Rule do Babel

```javascript
// webpack.config.js
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      // Rule para CSS (ja existente)
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      // Rule para Babel (nova)
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
};
```

## Erro comum — nome errado do preset

```javascript
// ERRADO — causa "Cannot find package"
{
  test: /\.js$/,
  exclude: /node_modules/,
  use: {
    loader: "babel-loader",
    options: {
      presets: ["@babel/presets-env"],  // S a mais!
    },
  },
}

// CORRETO
{
  test: /\.js$/,
  exclude: /node_modules/,
  use: {
    loader: "babel-loader",
    options: {
      presets: ["@babel/preset-env"],  // singular
    },
  },
}
```

## Erro comum — options fora de use

```javascript
// ERRADO — options ignorado silenciosamente
{
  test: /\.js$/,
  exclude: /node_modules/,
  use: {
    loader: "babel-loader",
  },
  options: {  // Fora de use — nao funciona!
    presets: ["@babel/preset-env"],
  },
}

// CORRETO — options dentro de use
{
  test: /\.js$/,
  exclude: /node_modules/,
  use: {
    loader: "babel-loader",
    options: {
      presets: ["@babel/preset-env"],
    },
  },
}
```

## Variacao: com browserslist

```javascript
// package.json — adicionar browserslist para controle fino
{
  "browserslist": [
    "> 1%",
    "last 2 versions",
    "not dead"
  ]
}
```

O `@babel/preset-env` le automaticamente o `browserslist` e aplica apenas as transformacoes necessarias para os browsers alvo.

## Variacao: com arquivo .babelrc separado

Em projetos maiores, pode-se extrair a config do Babel:

```json
// .babelrc
{
  "presets": ["@babel/preset-env"]
}
```

```javascript
// webpack.config.js — sem options, pois .babelrc e lido automaticamente
{
  test: /\.js$/,
  exclude: /node_modules/,
  use: "babel-loader",
}
```

## Comandos de verificacao

```bash
# Build para verificar se Babel esta funcionando
npm run build

# Se erro "Cannot find package" → verificar nome e instalacao
npm ls babel-loader @babel/core @babel/preset-env
```