---
name: rs-discover-fontes-estilos-textos
description: "Applies CSS font styling conventions when writing HTML/CSS code. Use when user asks to 'style text', 'add fonts', 'use Google Fonts', 'set font-weight', 'configure typography', or any CSS text styling task. Enforces correct font import via Google Fonts, universal selector for font-family, font-weight/size/line-height patterns, and auto-sizing text elements. Make sure to use this skill whenever generating CSS typography code. Not for JavaScript logic, layout/grid, or responsive breakpoints."
---

# Fontes e Estilos de Texto com CSS

> Ao estilizar textos, importe fontes do Google Fonts, aplique via seletor universal no body, e use font-weight, font-size e line-height para controle tipografico.

## Rules

1. **Importe fontes do Google Fonts** — adicione o `<link>` no `<head>` antes de outros metas, porque fontes do sistema variam entre OS e quebram consistencia visual
2. **Aplique font-family com seletor universal** — `body * { font-family: 'Inter', sans-serif; }` garante heranca em todos os elementos, porque elementos como `input` e `button` nao herdam font-family por padrao
3. **Defina cor de texto no body** — `color: white` ou `color: #FFFFFF` uma unica vez no body, porque evita repetir em cada elemento
4. **Nao fixe width/height em elementos de texto** — `<p>` se adapta automaticamente ao conteudo, porque largura e altura crescem com o texto
5. **Use font-weight numerico** — `500` nao `medium`, `400` nao `regular`, porque o valor numerico e mais preciso e portavel entre fontes
6. **Sempre defina line-height** — controla espacamento vertical entre linhas, porque o padrao do navegador varia e prejudica legibilidade

## How to write

### Importar fonte no HTML

```html
<head>
  <!-- Google Fonts ANTES dos outros metas -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap" rel="stylesheet">
  <meta charset="UTF-8">
</head>
```

### Aplicar fonte e cor globalmente

```css
body * {
  font-family: 'Inter', sans-serif;
  color: #FFFFFF;
}
```

### Estilizar texto especifico

```css
.profile-name {
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
}
```

## Example

**Before (sem fonte importada, estilos repetidos):**

```html
<head>
  <meta charset="UTF-8">
</head>
<body>
  <p style="font-family: Arial; color: white; width: 200px; height: 50px;">@MikeBrito</p>
</body>
```

**After (com esta skill aplicada):**

```html
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap" rel="stylesheet">
  <meta charset="UTF-8">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <p class="profile-name">@MikeBrito</p>
</body>
```

```css
body * {
  font-family: 'Inter', sans-serif;
  color: #FFFFFF;
}

.profile-name {
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Fonte usada em todo o site | Aplique no `body *` com seletor universal |
| Apenas 1-2 pesos usados | Importe somente os pesos necessarios (400, 500) |
| Texto dentro de container com tamanho fixo | Nao fixe width/height no `<p>`, deixe adaptar |
| font-size padrao 16px | Nao precisa declarar, navegador ja usa 16px |
| Cor unica para todos os textos | Defina uma vez no body, nao repita por elemento |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `font-family: Arial` sem import | `font-family: 'Inter', sans-serif` com Google Fonts |
| `<p style="width: 200px; height: 50px">` | `<p>` sem dimensoes fixas |
| `font-weight: bold` | `font-weight: 700` (numerico) |
| `color: white` em cada elemento | `color: #FFFFFF` no `body *` |
| Importar todos os pesos da fonte | Importar apenas `wght@400;500` necessarios |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre heranca CSS, seletor universal e Google Fonts
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes