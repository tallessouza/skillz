---
name: rs-full-stack-trabalhando-as-fontes
description: "Applies Google Fonts integration and CSS font configuration when building HTML/CSS pages. Use when user asks to 'add a font', 'integrate Google Fonts', 'configure typography', 'set line-height', or 'style headings'. Covers font import via link tag, root-level font-family, line-height defaults, font-size per heading, and color tokens. Make sure to use this skill whenever setting up typography for a new page or adjusting fonts. Not for JavaScript font loading, variable fonts, or font-face declarations from local files."
---

# Trabalhando as Fontes

> Configure tipografia importando a fonte do Google Fonts, aplique no elemento raiz, e defina tamanhos, alturas de linha e cores por nivel de heading.

## Rules

1. **Importe a fonte via link tag apos o stylesheet** — coloque o `<link>` do Google Fonts depois do seu `<link>` de estilos no `<head>`, porque isso garante que a fonte esta disponivel quando o CSS a referencia
2. **Aplique font-family no :root** — defina `font-family` no seletor `:root` para que todos os elementos herdem automaticamente, porque evita repetir a declaracao em cada seletor
3. **Defina line-height padrao no :root** — use `line-height: 150%` como padrao global e sobrescreva apenas nos headings que diferem, porque reduz duplicacao
4. **Use porcentagem para line-height** — `140%` ou `150%` em vez de valores fixos em pixels, porque escala proporcionalmente com o font-size
5. **Extraia cores do design como tokens** — aplique a cor secundaria (texto geral) no `:root` e sobrescreva com a cor primaria nos headings, porque segue o padrao de especificidade crescente
6. **Inspecione cada elemento no Figma** — clique no texto para verificar fonte, tamanho, line-height e cor, porque nem todo layout tem Style Guide organizado

## How to write

### Import no HTML

```html
<head>
  <link rel="stylesheet" href="style.css">
  <!-- Google Fonts DEPOIS do stylesheet -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Alice&display=swap" rel="stylesheet">
</head>
```

### CSS raiz com font-family, line-height e cor

```css
:root {
  font-family: "Alice", serif;
  line-height: 150%;
  color: #4F5666; /* text-color-secondary — cor geral */
}
```

### Headings com tamanho, line-height e cor especificos

```css
h1 {
  font-size: 40px;
  line-height: 140%;
  color: #1B1B1F; /* text-color-primary */
}

h2 {
  font-size: 24px;
  color: #1B1B1F;
}
```

## Example

**Before (sem configuracao de fontes):**
```css
body {
  font-family: Arial, sans-serif;
}
h1 { font-size: 2em; }
h2 { font-size: 1.5em; }
```

**After (com esta skill aplicada):**
```css
:root {
  font-family: "Alice", serif;
  line-height: 150%;
  color: #4F5666;
}

h1 {
  font-size: 40px;
  line-height: 140%;
  color: #1B1B1F;
}

h2 {
  font-size: 24px;
  color: #1B1B1F;
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Apenas uma fonte no projeto | Aplique no `:root`, sem necessidade de classes |
| Multiplas fontes (titulo vs corpo) | Aplique corpo no `:root`, titulo nos headings |
| Peso da fonte e 400 (regular) | Nao declare `font-weight`, ja e o padrao |
| Figma sem Style Guide | Clique em cada texto para inspecionar propriedades |
| Line-height igual na maioria dos elementos | Defina no `:root`, sobrescreva apenas as excecoes |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `<link>` do Google Fonts antes do stylesheet | `<link>` do Google Fonts depois do stylesheet |
| `font-family` repetido em cada seletor | `font-family` uma vez no `:root` |
| `line-height: 24px` (valor fixo) | `line-height: 150%` (proporcional) |
| `font-weight: 400` quando e o unico peso | Omitir `font-weight` (400 e padrao) |
| Cor definida individualmente em cada `<p>` | Cor geral no `:root`, sobrescrever nos headings |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre heranca CSS, inspecao no Figma e estrategia de tokens
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-trabalhando-as-fontes/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-trabalhando-as-fontes/references/code-examples.md)
