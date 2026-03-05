# Code Examples: Webpack Dev Server

## Exemplo 1: Configuracao minima

```javascript
// webpack.config.js
const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'development',
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 3000,
  },
}
```

## Exemplo 2: Com open habilitado

```javascript
devServer: {
  static: {
    directory: path.join(__dirname, 'dist'),
  },
  port: 3000,
  open: true, // abre o navegador automaticamente
},
```

## Exemplo 3: Porta customizada

```javascript
devServer: {
  static: {
    directory: path.join(__dirname, 'dist'),
  },
  port: 3333, // qualquer porta disponivel
  open: true,
},
```

## Exemplo 4: package.json scripts

```json
{
  "scripts": {
    "build": "webpack",
    "dev": "webpack serve"
  },
  "devDependencies": {
    "webpack": "^5.x",
    "webpack-cli": "^5.x",
    "webpack-dev-server": "^4.x"
  }
}
```

## Instalacao

```bash
# Instalar como dependencia de desenvolvimento
npm install webpack-dev-server --save-dev

# Executar o servidor
npm run dev
```

## Fluxo completo do instrutor

1. Instala: `npm install webpack-dev-server --save-dev`
2. Adiciona `devServer` no `webpack.config.js` com `static`, `port`
3. Cria script `"dev": "webpack serve"` no `package.json`
4. Executa `npm run dev`
5. Acessa `http://localhost:3000`
6. Demonstra troca de porta para 3333 — para servidor, muda config, reinicia
7. Demonstra hot reload — edita JS, navegador atualiza sozinho
8. Adiciona `open: true` — navegador abre automaticamente ao iniciar