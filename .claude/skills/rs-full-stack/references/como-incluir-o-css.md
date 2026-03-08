---
name: rs-full-stack-como-incluir-o-css
description: "Applies Webpack CSS bundling configuration when setting up CSS loaders in a Webpack project. Use when user asks to 'configure webpack for css', 'add css to webpack', 'bundle css with javascript', 'setup css-loader', or 'style-loader configuration'. Ensures correct loader order, module rules, and exclude patterns. Make sure to use this skill whenever configuring Webpack to handle CSS files. Not for CSS-in-JS solutions, PostCSS, Sass/LESS configuration, or Vite/esbuild setups."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [webpack, css, css-loader, style-loader, bundling, build]
---

# Como Incluir CSS no Webpack

> Configure o Webpack para empacotar CSS junto com JavaScript usando css-loader e style-loader na ordem correta.

## Rules

1. **Importe CSS via JavaScript** — `import './css/styles.css'` no entry point, porque o Webpack resolve dependencias a partir dos imports JS
2. **Use dois loaders obrigatorios** — `css-loader` interpreta os arquivos CSS, `style-loader` injeta o CSS no DOM via tag `<style>`
3. **Ordem dos loaders e invertida** — coloque `style-loader` antes de `css-loader` no array `use`, porque Webpack processa de baixo pra cima (ultimo para primeiro)
4. **Exclua node_modules** — adicione `exclude: /node_modules/` na regra CSS, porque nao ha necessidade de processar CSS de dependencias externas
5. **Instale como devDependencies** — `npm install style-loader css-loader -D`, porque sao ferramentas de build, nao de runtime

## How to write

### Regra de modulo para CSS

```javascript
// webpack.config.js
module.exports = {
  // ...entry, output, plugins
  module: {
    rules: [
      {
        test: /\.css$/i,
        exclude: /node_modules/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
}
```

### Import do CSS no JavaScript

```javascript
// src/index.js
import './css/styles.css'

// resto do codigo JS...
```

## Example

**Before (sem configuracao — build falha):**

```javascript
// webpack.config.js
module.exports = {
  entry: './src/index.js',
  output: { filename: 'main.js', path: path.resolve(__dirname, 'dist') },
  plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })],
  // sem module.rules → erro ao importar CSS
}
```

**After (com loaders configurados):**

```javascript
// webpack.config.js
module.exports = {
  entry: './src/index.js',
  output: { filename: 'main.js', path: path.resolve(__dirname, 'dist') },
  plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })],
  module: {
    rules: [
      {
        test: /\.css$/i,
        exclude: /node_modules/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| CSS nao aparece na pagina | Verifique se o import esta no JS entry point |
| Erro "Module parse failed" com .css | Instale e configure css-loader + style-loader |
| Quer CSS em arquivo separado (nao inline) | Use `mini-css-extract-plugin` em vez de style-loader |
| Multiplos tipos de arquivo (css, scss, less) | Crie uma regra separada no array `rules` para cada tipo |
| CSS de biblioteca externa necessario | Remova `exclude: /node_modules/` ou crie regra separada sem exclude |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| Linkar CSS direto no HTML quando usa Webpack | Importe via JS para Webpack resolver dependencias |
| Colocar `css-loader` antes de `style-loader` no array | `["style-loader", "css-loader"]` — style primeiro |
| Instalar loaders como dependencies normais | `npm install -D` — sao devDependencies |
| Criar regra sem `test` com regex | Sempre use `test: /\.css$/i` com flag case-insensitive |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| `Module parse failed` ao importar .css | Loaders CSS nao instalados ou configurados | Instale `css-loader` e `style-loader` e adicione a rule |
| CSS nao aparece na pagina | Import do CSS ausente no JS entry point | Adicione `import './css/styles.css'` no arquivo de entrada |
| Ordem dos loaders invertida causa erro | `css-loader` antes de `style-loader` no array | Use `["style-loader", "css-loader"]` — style primeiro |
| CSS de biblioteca nao processado | `exclude: /node_modules/` bloqueia o CSS externo | Crie regra separada sem exclude para CSS de node_modules |
| Estilos inline em vez de arquivo separado | `style-loader` injeta via `<style>` tag | Use `mini-css-extract-plugin` para gerar arquivo CSS separado |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre como Webpack processa CSS e por que o CSS fica dentro do JS
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes