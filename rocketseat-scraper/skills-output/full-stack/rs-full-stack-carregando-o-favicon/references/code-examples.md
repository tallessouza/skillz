# Code Examples: Carregando o Favicon no Webpack

## Exemplo basico do projeto Hair Day

```javascript
// webpack.config.js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: path.resolve(__dirname, 'src', 'index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'index.html'),
      favicon: path.resolve(__dirname, 'src', 'assets', 'favicon.svg'),
    }),
  ],
}
```

## Variacao: favicon PNG com hash

```javascript
new HtmlWebpackPlugin({
  template: path.resolve(__dirname, 'src', 'index.html'),
  favicon: path.resolve(__dirname, 'src', 'assets', 'favicon.png'),
})
```

## Variacao: favicon ICO tradicional

```javascript
new HtmlWebpackPlugin({
  template: path.resolve(__dirname, 'src', 'index.html'),
  favicon: path.resolve(__dirname, 'src', 'assets', 'favicon.ico'),
})
```

## Verificacao apos build

```bash
# Executar o build
npm run build

# Verificar se o favicon foi copiado para dist/
ls dist/
# Deve mostrar: bundle.js  favicon.svg  index.html

# Iniciar o dev server
npm run dev

# Verificar no navegador: a aba deve mostrar o icone
```

## HTML gerado automaticamente

Apos o build, o HtmlWebpackPlugin gera algo como:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link rel="icon" href="favicon.svg">
  <title>Hair Day</title>
</head>
<body>
  <div id="root"></div>
  <script src="bundle.js"></script>
</body>
</html>
```

A tag `<link rel="icon">` e injetada automaticamente — voce nao precisa adiciona-la no template.