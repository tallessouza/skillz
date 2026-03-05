---
name: rs-full-stack-copiando-os-assets
description: "Configures copy-webpack-plugin to bundle static assets (icons, images, SVGs) into the dist folder during webpack builds. Use when user asks to 'copy assets', 'bundle icons', 'configure webpack for static files', 'move images to dist', or 'setup asset copying in webpack'. Make sure to use this skill whenever configuring webpack to handle static assets that aren't imported in JS/CSS. Not for image optimization, lazy loading, or file-loader/asset modules configuration."
---

# Copy Assets com Webpack

> Usar copy-webpack-plugin para copiar assets estaticos (icones, SVGs, imagens) da pasta source para a pasta dist durante o build.

## Prerequisites

- Webpack configurado no projeto
- Pasta de assets existente (ex: `src/assets/`)
- Se copy-webpack-plugin nao estiver instalado: `npm i copy-webpack-plugin@11.0.0 -D`

## Steps

### Step 1: Instalar o plugin

```bash
npm i copy-webpack-plugin@11.0.0 -D
```

### Step 2: Importar no webpack.config.js

```javascript
const CopyWebpackPlugin = require('copy-webpack-plugin')
```

### Step 3: Adicionar ao array de plugins

```javascript
plugins: [
  new HtmlWebpackPlugin({ /* ... */ }),
  new CopyWebpackPlugin({
    patterns: [
      {
        from: path.resolve(__dirname, 'src', 'assets'),
        to: path.resolve(__dirname, 'dist', 'src', 'assets'),
      },
    ],
  }),
]
```

## Output format

Apos `npm run build`, a estrutura gerada:

```
dist/
├── src/
│   └── assets/
│       ├── icon1.svg
│       ├── icon2.svg
│       └── ...
├── index.html
└── bundle.js
```

## Error handling

- Se a pasta de assets nao aparecer em dist apos o build: recarregue o explorador de arquivos (F5 no VS Code), porque o hot reload pode nao detectar novos diretorios imediatamente
- Se os icones nao aparecem no browser: hard refresh (Cmd+Shift+R / Ctrl+Shift+R) para limpar cache

## Verification

1. Rodar `npm run build`
2. Verificar que `dist/src/assets/` existe e contem os arquivos
3. Rodar `npm run dev` e confirmar que icones/imagens aparecem no browser

## Heuristics

| Situacao | Acao |
|----------|------|
| Assets referenciados em HTML/CSS por path relativo | Usar copy-webpack-plugin para manter a estrutura |
| Assets importados em JS (`import icon from './icon.svg'`) | Usar asset modules do webpack, nao este plugin |
| Muitas pastas de assets (fonts, images, icons) | Adicionar multiplos objetos no array `patterns` |
| Assets so necessarios em producao | Usar condicional no webpack config baseado em `mode` |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Copiar assets manualmente para dist | Configurar copy-webpack-plugin |
| Usar scripts npm separados para copiar | Integrar no pipeline do webpack |
| Hardcodar paths absolutos no `from`/`to` | Usar `path.resolve(__dirname, ...)` |
| Esquecer `-D` na instalacao | Sempre salvar como devDependency |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre quando usar copy-webpack-plugin vs asset modules
- [code-examples.md](references/code-examples.md) — Exemplos expandidos com multiplos patterns e configuracoes avancadas