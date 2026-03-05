---
name: rs-angular-intro-imagens-icones-fontes
description: "Guides Angular asset management for images, icons, and fonts. Use when user asks to 'add an image to Angular', 'use FontAwesome in Angular', 'import custom font', 'configure Google Fonts in Angular', or 'work with SVG in Angular component'. Covers asset folder structure, referencing in components, CDN vs npm for icon libraries, and custom/Google font importing. Make sure to use this skill whenever setting up static assets in an Angular project. Not for Angular routing, state management, or API integration."
---

# Assets no Angular — Imagens, Ícones e Fontes

> Organize assets estaticos (imagens, icones, fontes) na pasta correta e referencie-os de forma consistente nos componentes Angular.

## Conceito central

Assets sao arquivos brutos que nao sofrem transformacao pelo build — imagens, icones e fontes. O Angular serve esses arquivos a partir da pasta `assets/` configurada no `angular.json`.

## Decision framework

| Necessidade | Abordagem |
|-------------|-----------|
| Imagem PNG/JPG no componente | Colocar em `src/assets/images/`, referenciar com path relativo a `assets/` |
| Icone SVG inline | Importar SVG e usar no template com binding ou como background |
| Icones FontAwesome (prototipo rapido) | CDN no `index.html` |
| Icones FontAwesome (producao) | Instalar via npm `@fortawesome/fontawesome-free` e importar no `angular.json` styles |
| Fonte customizada da empresa | Colocar em `src/assets/fonts/`, declarar `@font-face` no CSS global |
| Fonte do Google Fonts | Adicionar `<link>` no `index.html` ou `@import` no `styles.css` |

## Estrutura de pastas

```
src/
├── assets/
│   ├── images/        # PNGs, JPGs, WebPs
│   ├── icons/         # SVGs avulsos
│   └── fonts/         # Fontes .woff2, .ttf, .otf customizadas
├── index.html         # CDN links, Google Fonts <link>
└── styles.css         # @font-face, @import de fontes
```

## Padroes rapidos

### Imagem no componente

```html
<img src="assets/images/logo.png" alt="Logo da empresa" />
```

### SVG inline

```html
<img src="assets/icons/arrow.svg" alt="Seta" />
```

### FontAwesome via CDN (prototipo)

```html
<!-- index.html -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.x/css/all.min.css" />
```

### FontAwesome via npm (producao)

```bash
npm install @fortawesome/fontawesome-free
```

```json
// angular.json → styles
"styles": [
  "node_modules/@fortawesome/fontawesome-free/css/all.min.css",
  "src/styles.css"
]
```

### Fonte customizada

```css
/* styles.css */
@font-face {
  font-family: 'MinhaFonte';
  src: url('assets/fonts/MinhaFonte.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
}

body {
  font-family: 'MinhaFonte', sans-serif;
}
```

### Google Fonts

```html
<!-- index.html -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Prototipo rapido, poucos icones | CDN no `index.html` |
| App em producao | npm install + import no `angular.json` |
| Fonte usada em toda a app | `@font-face` no `styles.css` global |
| Fonte usada em um componente so | `@font-face` no CSS do componente (encapsulado) |
| Imagem referenciada em varios componentes | Sempre path a partir de `assets/` |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Colocar imagens fora de `assets/` | Manter em `src/assets/images/` |
| Hardcodar CDN em producao sem fallback | Instalar via npm para controle de versao |
| Esquecer `angular.json` ao adicionar pasta de assets | Verificar que o path esta em `assets[]` no `angular.json` |
| Usar path absoluto do filesystem (`C:/...`) | Usar path relativo a `assets/` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
