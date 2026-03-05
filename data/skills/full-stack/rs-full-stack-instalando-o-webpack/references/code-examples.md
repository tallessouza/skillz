# Code Examples: Configuracao Inicial do Webpack

## 1. Instalacao completa

```bash
npm install webpack@5.89.0 webpack-cli@5.1.4 --save-dev
```

Resultado no `package.json`:
```json
{
  "devDependencies": {
    "webpack": "5.89.0",
    "webpack-cli": "5.1.4"
  }
}
```

## 2. Script de build no package.json

```json
{
  "scripts": {
    "server": "node server.js",
    "build": "webpack"
  }
}
```

## 3. Entry point: src/main.js

```javascript
// src/main.js
// Ponto de entrada da aplicacao — por enquanto vazio
// Todos os imports da aplicacao partem daqui
```

## 4. webpack.config.js completo

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

## 5. Executando a build

```bash
npm run build
```

Saida esperada:
```
asset main.js X bytes [emitted] (name: main)
webpack 5.89.0 compiled successfully in X ms
```

Estrutura resultante:
```
project/
├── dist/
│   └── main.js          # Bundle compilado
├── src/
│   └── main.js          # Entry point (source)
├── webpack.config.js
├── package.json
└── node_modules/
```

## 6. Variacoes do webpack.config.js

### Com multiplos entry points (variacao avancada)

```javascript
const path = require("path")

module.exports = {
  target: "web",
  mode: "development",
  entry: {
    main: path.resolve(__dirname, "src", "main.js"),
    admin: path.resolve(__dirname, "src", "admin.js"),
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
}
```

### Com mode dinamico via variavel de ambiente

```javascript
const path = require("path")

module.exports = {
  target: "web",
  mode: process.env.NODE_ENV || "development",
  entry: path.resolve(__dirname, "src", "main.js"),
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
}
```

## 7. Anti-pattern: caminho manual (ERRADO)

```javascript
// ERRADO — pode quebrar em outro SO
module.exports = {
  entry: "./src/main.js",
  output: {
    filename: "main.js",
    path: "./dist",
  },
}
```

```javascript
// CORRETO — funciona em qualquer SO
const path = require("path")

module.exports = {
  entry: path.resolve(__dirname, "src", "main.js"),
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
}
```

## 8. Anti-pattern: ESM no config (ERRADO)

```javascript
// ERRADO — webpack.config.js roda no Node com CommonJS
import path from "path"

export default {
  entry: path.resolve(__dirname, "src", "main.js"),
}
```

```javascript
// CORRETO — CommonJS para arquivos de config Node
const path = require("path")

module.exports = {
  entry: path.resolve(__dirname, "src", "main.js"),
}
```