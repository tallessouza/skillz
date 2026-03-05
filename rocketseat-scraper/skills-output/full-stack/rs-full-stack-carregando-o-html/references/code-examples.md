# Code Examples: Carregando o HTML no Webpack

## Configuracao completa do webpack.config.js (apos esta aula)

```javascript
const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
  entry: "./src/index.js",

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
  },

  devServer: {
    static: path.resolve(__dirname, "dist"),
    port: 3000,
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "index.html"),
    }),
  ],
}
```

## Instalacao do plugin

```bash
# Versao especifica (como na aula)
npm install html-webpack-plugin@5.6.0 --save-dev

# Ou versao mais recente compativel com Webpack 5
npm install html-webpack-plugin --save-dev
```

## package.json resultante (devDependencies)

```json
{
  "devDependencies": {
    "html-webpack-plugin": "^5.6.0",
    "webpack": "^5.x.x",
    "webpack-cli": "^5.x.x",
    "webpack-dev-server": "^4.x.x"
  }
}
```

## Comandos de verificacao

```bash
# Build — gera dist/ com HTML + JS
npm run build

# DevServer — serve com hot reload
npm run dev
```

## Variacao: Multiplos HTMLs

```javascript
plugins: [
  new HtmlWebpackPlugin({
    template: path.resolve(__dirname, "index.html"),
    filename: "index.html",
    chunks: ["main"],
  }),
  new HtmlWebpackPlugin({
    template: path.resolve(__dirname, "about.html"),
    filename: "about.html",
    chunks: ["about"],
  }),
]
```

## Variacao: Opcoes adicionais do plugin

```javascript
new HtmlWebpackPlugin({
  template: path.resolve(__dirname, "index.html"),
  title: "Hair Day",
  minify: {
    collapseWhitespace: true,
    removeComments: true,
  },
  inject: "body", // injeta scripts no final do body
})
```

## Estrutura de pastas antes e depois

### Antes do build
```
projeto/
├── index.html          # Template fonte
├── src/
│   └── index.js
├── webpack.config.js
└── package.json
```

### Depois de `npm run build`
```
projeto/
├── index.html
├── src/
│   └── index.js
├── dist/
│   ├── main.js         # Bundle JS
│   └── index.html      # HTML gerado (com <script> injetado)
├── webpack.config.js
└── package.json
```