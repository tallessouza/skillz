# Code Examples: Configurando o Webpack

## Exemplo 1: Configuracao minima completa

```javascript
// webpack.config.js (raiz do projeto)
const path = require('path')

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, 'src', 'js', 'index.js'),
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
}
```

## Exemplo 2: package.json antes e depois

**Antes (entry inline):**
```json
{
  "scripts": {
    "build": "webpack ./src/js/index.js"
  }
}
```

**Depois (config em arquivo separado):**
```json
{
  "scripts": {
    "build": "webpack"
  }
}
```

## Exemplo 3: Variacao com output customizado

```javascript
const path = require('path')

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, 'src', 'js', 'index.js'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build', 'static'),
  },
}
```

## Exemplo 4: Mode de producao

```javascript
const path = require('path')

module.exports = {
  mode: 'production', // minifica e otimiza o bundle
  entry: path.resolve(__dirname, 'src', 'js', 'index.js'),
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
}
```

## Exemplo 5: Multiplos entry points (extensao do conceito)

```javascript
const path = require('path')

module.exports = {
  mode: 'development',
  entry: {
    main: path.resolve(__dirname, 'src', 'js', 'index.js'),
    admin: path.resolve(__dirname, 'src', 'js', 'admin.js'),
  },
  output: {
    filename: '[name].js', // gera main.js e admin.js
    path: path.resolve(__dirname, 'dist'),
  },
}
```

## Estrutura de pastas resultante

```
projeto/
├── src/
│   └── js/
│       └── index.js          # entry point
├── dist/
│   └── main.js               # output gerado pelo webpack
├── webpack.config.js          # configuracao (raiz!)
├── package.json               # script: "build": "webpack"
└── node_modules/
```

## Fluxo de execucao

```
npm run build
  → executa "webpack"
  → Webpack detecta webpack.config.js na raiz
  → Le entry: src/js/index.js
  → Resolve todas as dependencias (imports)
  → Empacota tudo em dist/main.js
  → Usa mode 'development' (sem minificacao)
```