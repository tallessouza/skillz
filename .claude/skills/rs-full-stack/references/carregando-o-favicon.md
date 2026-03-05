---
name: rs-full-stack-carregando-o-favicon
description: "Applies favicon configuration in Webpack projects using HtmlWebpackPlugin. Use when user asks to 'add favicon', 'configure favicon webpack', 'setup html webpack plugin favicon', or 'add icon to tab'. Ensures correct path.resolve usage and favicon property in HtmlWebpackPlugin config. Make sure to use this skill whenever configuring favicons in Webpack-based projects. Not for Vite, Next.js, or other bundlers."
---

# Carregando o Favicon no Webpack

> Configurar o favicon no HtmlWebpackPlugin usando path.resolve para garantir que o icone apareca na aba do navegador e seja incluido no build.

## Rules

1. **Use a propriedade `favicon` do HtmlWebpackPlugin** — nao copie manualmente o arquivo para dist, porque o plugin cuida do build e injeta a tag automaticamente
2. **Use `path.resolve` para o caminho** — caminhos relativos quebram dependendo de onde o webpack roda, porque path.resolve garante caminho absoluto
3. **Coloque assets estaticos em `src/assets/`** — favicons, icones e imagens ficam organizados em um unico lugar, porque facilita manutencao e referencia

## How to write

### Configuracao do favicon no webpack.config.js

```javascript
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'index.html'),
      favicon: path.resolve(__dirname, 'src', 'assets', 'favicon.svg'),
    }),
  ],
}
```

## Example

**Before (sem favicon configurado):**
```javascript
new HtmlWebpackPlugin({
  template: path.resolve(__dirname, 'src', 'index.html'),
})
```

**After (com favicon):**
```javascript
new HtmlWebpackPlugin({
  template: path.resolve(__dirname, 'src', 'index.html'),
  favicon: path.resolve(__dirname, 'src', 'assets', 'favicon.svg'),
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Favicon nao aparece apos mudanca | Pare o dev server, execute o build, reinicie |
| Favicon em formato SVG | Use diretamente, navegadores modernos suportam |
| Favicon em PNG/ICO | Mesmo processo, mude apenas a extensao no path |
| Verificar se favicon foi incluido no build | Cheque a pasta `dist/` pelo arquivo |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Copiar favicon manualmente para `dist/` | Configure `favicon` no HtmlWebpackPlugin |
| `favicon: './src/assets/favicon.svg'` | `favicon: path.resolve(__dirname, 'src', 'assets', 'favicon.svg')` |
| Adicionar tag `<link rel="icon">` manualmente no HTML | Deixe o HtmlWebpackPlugin injetar automaticamente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre build pipeline e hot reload com favicon
- [code-examples.md](references/code-examples.md) — Exemplos expandidos com variacoes de formato e estrutura

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-carregando-o-favicon/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-carregando-o-favicon/references/code-examples.md)
