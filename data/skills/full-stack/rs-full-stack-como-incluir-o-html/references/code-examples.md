# Code Examples: HtmlWebpackPlugin

## Exemplo basico (da aula)

### Instalacao

```bash
npm install html-webpack-plugin -D
```

### webpack.config.js completo

```javascript
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new HtmlWebpackPlugin()
  ],
}
```

### Resultado no dist/index.html (gerado automaticamente)

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Webpack App</title>
  </head>
  <body>
    <script src="main.js"></script>
  </body>
</html>
```

## Variacao: Usando template customizado

Quando o projeto ja tem um `index.html` com conteudo proprio:

```javascript
plugins: [
  new HtmlWebpackPlugin({
    template: './src/index.html'
  })
]
```

Nesse caso, o plugin usa o HTML existente como base e injeta as tags `<script>` nele, preservando todo o conteudo original.

## Variacao: Configurando titulo e meta tags

```javascript
plugins: [
  new HtmlWebpackPlugin({
    title: 'Minha Aplicacao',
    meta: {
      viewport: 'width=device-width, initial-scale=1',
    }
  })
]
```

## Variacao: Multiplos HTML para multiplos entry points

```javascript
module.exports = {
  entry: {
    main: './src/index.js',
    admin: './src/admin.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      chunks: ['main'],
    }),
    new HtmlWebpackPlugin({
      filename: 'admin.html',
      chunks: ['admin'],
    }),
  ],
}
```

## Script de build no package.json

```json
{
  "scripts": {
    "build": "webpack"
  }
}
```

Executar com:

```bash
npm run build
```

## Estrutura de pastas apos o build

```
projeto/
├── src/
│   ├── index.js
│   └── index.html      (opcional — template)
├── dist/                (gerado pelo build)
│   ├── main.js
│   └── index.html       (com <script> injetado)
├── webpack.config.js
└── package.json
```