---
name: rs-full-stack-adicionando-css-no-html
description: "Enforces correct CSS integration patterns when linking stylesheets to HTML files. Use when user asks to 'add CSS', 'link a stylesheet', 'style an HTML page', 'create a new HTML project', or 'setup a web page'. Applies rules: external stylesheet over inline/embedded, correct link tag attributes, proper relative paths. Make sure to use this skill whenever setting up HTML+CSS projects or reviewing how styles are connected. Not for CSS properties, selectors, or layout techniques."
---

# Adicionando CSS no HTML

> Sempre use arquivos CSS externos linkados via tag `<link>`, nunca inline styles ou tags `<style>` embutidas.

## Rules

1. **Use arquivo .css externo** — crie um arquivo separado e linke com `<link>`, porque mantém separação de responsabilidades e facilita manutenção
2. **Nunca use atributo style inline** — `style="background-color: red"` tem especificidade altíssima e sobrescreve quase tudo, criando CSS impossível de manter
3. **Nunca use tag `<style>` embutida** — mistura estrutura com apresentação e não é reutilizável entre páginas
4. **Atributo rel="stylesheet" é obrigatório** — sem ele o browser não interpreta o arquivo como folha de estilo
5. **Href deve apontar o caminho correto** — use caminhos relativos, atualize se mover o arquivo para outra pasta

## How to write

### Link correto de CSS externo

```html
<!-- No <head> do HTML -->
<link rel="stylesheet" href="style.css">
```

### Estrutura de projeto básica

```
projeto/
├── index.html
└── style.css
```

### Com CSS em subpasta

```html
<!-- CSS dentro de pasta css/ -->
<link rel="stylesheet" href="css/style.css">
```

## Example

**Before (inline — problematico):**
```html
<body style="background-color: red">
  <h1 style="color: white">Titulo</h1>
</body>
```

**After (arquivo externo):**
```html
<!-- index.html -->
<head>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>Titulo</h1>
</body>
```

```css
/* style.css */
body {
  background-color: red;
}

h1 {
  color: white;
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Projeto novo | Crie `style.css` na raiz e linke no `<head>` |
| CSS em outra pasta | Ajuste o `href` com caminho relativo correto |
| Precisa de estilo rapido para teste | Ainda assim use arquivo externo — custa 10 segundos a mais |
| Multiplas paginas HTML | Todas linkam o mesmo `style.css` — reutilizacao |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `<body style="background-color: red">` | `body { background-color: red; }` no .css |
| `<style>body { ... }</style>` no HTML | `<link rel="stylesheet" href="style.css">` |
| `<link href="style.css">` sem rel | `<link rel="stylesheet" href="style.css">` |
| Caminho errado: `href="style.css"` quando esta em `css/` | `href="css/style.css"` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre especificidade e separacao de responsabilidades
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-adicionando-css-no-html/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-adicionando-css-no-html/references/code-examples.md)
