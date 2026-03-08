# Code Examples: Bundlers e Webpack

## Configuração básica do Webpack

### Setup mínimo do projeto

```bash
# Inicializar projeto
mkdir meu-projeto && cd meu-projeto
npm init -y

# Instalar Webpack como devDependency
npm install webpack webpack-cli --save-dev
```

### Estrutura de diretórios esperada

```
meu-projeto/
├── src/
│   └── index.js       # Entry point
├── dist/
│   └── bundle.js      # Output (gerado pelo Webpack)
├── webpack.config.js   # Configuração
├── package.json
└── node_modules/
```

### webpack.config.js — Configuração mínima

```javascript
const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
}
```

### Scripts no package.json

```json
{
  "scripts": {
    "build": "webpack --mode production",
    "dev": "webpack --mode development --watch"
  }
}
```

## Variações de configuração

### Com múltiplos entry points

```javascript
module.exports = {
  entry: {
    app: './src/index.js',
    admin: './src/admin.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
}
```

### Com loader para CSS

```javascript
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
}
```

### Com Babel loader para JS moderno

```javascript
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
}
```

## Modos de execução

### Desenvolvimento (source maps, sem minificação)

```bash
npx webpack --mode development
```

### Produção (minificado, otimizado)

```bash
npx webpack --mode production
```

### Watch mode (recompila automaticamente)

```bash
npx webpack --mode development --watch
```

## Exemplo de uso no HTML

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Meu Projeto</title>
</head>
<body>
  <!-- Um único script ao invés de múltiplos -->
  <script src="./dist/bundle.js"></script>
</body>
</html>
```