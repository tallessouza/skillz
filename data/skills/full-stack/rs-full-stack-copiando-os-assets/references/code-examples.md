# Code Examples: Copy Assets com Webpack

## Exemplo basico (da aula)

### Instalacao
```bash
npm i copy-webpack-plugin@11.0.0 -D
```

### package.json (resultado)
```json
{
  "devDependencies": {
    "copy-webpack-plugin": "11.0.0"
  }
}
```

### webpack.config.js completo
```javascript
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src', 'assets'),
          to: path.resolve(__dirname, 'dist', 'src', 'assets'),
        },
      ],
    }),
  ],
}
```

## Variacao: multiplas pastas de assets

```javascript
new CopyWebpackPlugin({
  patterns: [
    {
      from: path.resolve(__dirname, 'src', 'assets', 'icons'),
      to: path.resolve(__dirname, 'dist', 'icons'),
    },
    {
      from: path.resolve(__dirname, 'src', 'assets', 'fonts'),
      to: path.resolve(__dirname, 'dist', 'fonts'),
    },
    {
      from: path.resolve(__dirname, 'public'),
      to: path.resolve(__dirname, 'dist'),
    },
  ],
})
```

## Variacao: copiar apenas arquivos especificos

```javascript
new CopyWebpackPlugin({
  patterns: [
    {
      from: path.resolve(__dirname, 'src', 'assets'),
      to: path.resolve(__dirname, 'dist', 'assets'),
      globOptions: {
        ignore: ['**/*.psd', '**/*.ai'], // ignorar arquivos de design
      },
    },
  ],
})
```

## Variacao: com transformacao de path

```javascript
new CopyWebpackPlugin({
  patterns: [
    {
      from: 'src/assets/**/*.svg',
      to: 'assets/[name][ext]', // flatten: todos os SVGs na raiz de assets/
    },
  ],
})
```

## Variacao: condicional por ambiente

```javascript
const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' }),
    ...(isProduction
      ? [
          new CopyWebpackPlugin({
            patterns: [
              {
                from: path.resolve(__dirname, 'src', 'assets'),
                to: path.resolve(__dirname, 'dist', 'assets'),
              },
            ],
          }),
        ]
      : []),
  ],
}
```

## Estrutura de pastas antes e depois do build

### Antes (source)
```
src/
├── assets/
│   ├── arrow.svg
│   ├── calendar.svg
│   ├── clock.svg
│   └── scissors.svg
├── index.html
└── index.js
```

### Depois (dist, apos npm run build)
```
dist/
├── src/
│   └── assets/
│       ├── arrow.svg
│       ├── calendar.svg
│       ├── clock.svg
│       └── scissors.svg
├── index.html
└── bundle.js
```