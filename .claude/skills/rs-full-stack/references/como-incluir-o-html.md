---
name: rs-full-stack-como-incluir-o-html
description: "Applies HtmlWebpackPlugin configuration when setting up Webpack to bundle HTML with JavaScript. Use when user asks to 'configure webpack', 'bundle HTML', 'add HTML to webpack', 'setup webpack plugins', or 'include HTML in build output'. Ensures correct plugin installation, CommonJS import, and plugins array configuration. Make sure to use this skill whenever configuring Webpack build pipelines that need HTML output. Not for Vite, Parcel, esbuild, or other bundlers."
---

# HtmlWebpackPlugin — Incluir HTML no Bundle Webpack

> Ao configurar Webpack, sempre inclua o HtmlWebpackPlugin para que o HTML seja empacotado junto com o JavaScript, com script tags injetadas automaticamente.

## Rules

1. **Instale como devDependency** — `npm install html-webpack-plugin -D`, porque e uma ferramenta de build, nao de runtime
2. **Use CommonJS no webpack.config.js** — `require()` e nao `import`, porque webpack.config.js roda no Node diretamente
3. **Instancie com `new` no array plugins** — `new HtmlWebpackPlugin()`, porque plugins Webpack sao classes que precisam ser instanciadas
4. **O plugin injeta o script automaticamente** — nao adicione tags `<script>` manualmente no HTML, porque o plugin faz isso no build

## Steps

### Step 1: Instalar o plugin

```bash
npm install html-webpack-plugin -D
```

### Step 2: Importar no webpack.config.js

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin')
```

### Step 3: Adicionar na secao plugins

```javascript
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

### Step 4: Executar o build

```bash
npm run build
```

## Output format

Apos o build, a pasta `dist/` contera:
- `main.js` — JavaScript empacotado
- `index.html` — HTML com tag `<script src="main.js">` injetada automaticamente

## Verification

- Verificar que `dist/index.html` existe apos o build
- Verificar que o HTML contem a tag `<script>` apontando para o bundle JS
- Abrir `dist/index.html` com Live Server para confirmar funcionamento

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa customizar o template HTML | Passe `{ template: './src/index.html' }` ao construtor |
| Multiplos entry points | O plugin injeta todos automaticamente |
| HTML source nao tem `<script>` tags | Correto — o plugin injeta no build |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `import HtmlWebpackPlugin from '...'` no webpack.config | `const HtmlWebpackPlugin = require('html-webpack-plugin')` |
| Adicionar `<script src="main.js">` manualmente no HTML | Deixar o plugin injetar automaticamente |
| Instalar sem `-D` | `npm install html-webpack-plugin -D` |
| Colocar plugin como objeto sem `new` | `new HtmlWebpackPlugin()` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre por que usar CommonJS e como o plugin funciona internamente
- [code-examples.md](references/code-examples.md) — Exemplos expandidos com configuracoes customizadas

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-como-incluir-o-html/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-como-incluir-o-html/references/code-examples.md)
