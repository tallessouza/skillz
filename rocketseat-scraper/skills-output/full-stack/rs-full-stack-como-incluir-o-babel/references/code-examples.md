# Code Examples: Como Incluir o Babel no Webpack

## Instalacao

```bash
npm install @babel/core @babel/preset-env babel-loader --save-dev
```

## webpack.config.js completo com Babel

```javascript
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      // Rule para CSS
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      // Rule para JavaScript (Babel)
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                targets: 'defaults'
              }]
            ]
          }
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
}
```

## Variacao: targets especificos

```javascript
{
  test: /\.js$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: [
        ['@babel/preset-env', {
          targets: {
            chrome: '80',
            firefox: '78',
            safari: '14',
            edge: '80'
          }
        }]
      ]
    }
  }
}
```

## Variacao: usando .babelrc separado

Quando a configuracao do Babel cresce, pode-se extrair para `.babelrc`:

```json
{
  "presets": [
    ["@babel/preset-env", {
      "targets": "defaults"
    }]
  ]
}
```

E simplificar a rule no Webpack:

```javascript
{
  test: /\.js$/,
  exclude: /node_modules/,
  use: 'babel-loader'
}
```

## Variacao: com browserslist no package.json

```json
{
  "browserslist": [
    "> 1%",
    "last 2 versions",
    "not dead"
  ]
}
```

Com isso, `@babel/preset-env` automaticamente le o `browserslist` do `package.json` sem precisar definir `targets` na rule.

## Verificacao

```bash
npm run build
```

Saida esperada: `webpack compiled successfully` sem erros.