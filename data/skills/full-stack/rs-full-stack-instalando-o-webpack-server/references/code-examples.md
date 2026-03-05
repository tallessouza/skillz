# Code Examples: Webpack Dev Server

## Exemplo 1: Configuracao completa do webpack.config.js (da aula)

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

## Exemplo 2: package.json scripts (da aula)

```json
{
  "scripts": {
    "build": "webpack",
    "dev": "webpack serve"
  }
}
```

## Exemplo 3: Instalacao (da aula)

```bash
npm i webpack-dev-server@4.15.1 --save-dev
```

## Variacao: Com HMR ao inves de liveReload

```javascript
devServer: {
  static: {
    directory: path.join(__dirname, 'dist'),
  },
  port: 3000,
  open: true,
  hot: true, // HMR — troca modulos sem reload completo
},
```

## Variacao: Com proxy para API backend

```javascript
devServer: {
  static: {
    directory: path.join(__dirname, 'dist'),
  },
  port: 3000,
  open: true,
  liveReload: true,
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    },
  },
},
```

## Variacao: Multiplos diretorios estaticos

```javascript
devServer: {
  static: [
    { directory: path.join(__dirname, 'dist') },
    { directory: path.join(__dirname, 'public') },
  ],
  port: 3000,
  open: true,
  liveReload: true,
},
```

## Variacao: Com historyApiFallback para SPA

```javascript
devServer: {
  static: {
    directory: path.join(__dirname, 'dist'),
  },
  port: 3000,
  open: true,
  liveReload: true,
  historyApiFallback: true, // redireciona 404 para index.html
},
```

## Variacao: Script com modo especifico

```json
{
  "scripts": {
    "build": "webpack --mode production",
    "dev": "webpack serve --mode development"
  }
}
```