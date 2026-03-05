---
name: rs-full-stack-aplicando-fontes-projeto
description: "Enforces web typography setup patterns using Google Fonts and CSS custom properties. Use when user asks to 'add fonts', 'setup typography', 'configure Google Fonts', 'style headings', or 'create font variables'. Applies font-family variables, heading hierarchy with weight/size/line-height, link styling with hover states, and font inheritance for nested components. Make sure to use this skill whenever setting up typography in HTML/CSS projects. Not for icon fonts, font-face declarations from local files, or JavaScript font loading."
---

# Tipografia Web com Google Fonts e Variáveis CSS

> Configure tipografia usando variáveis CSS para cada nível hierárquico, herde fontes no body e force herança nos headings para controle total.

## Rules

1. **Importe Google Fonts com preconnect separado** — coloque as linhas `preconnect` antes do `<link>` da fonte, porque o navegador inicia a conexão DNS antes de precisar do recurso
2. **Crie variáveis CSS para cada nível tipográfico** — defina `font: weight size/line-height font-family` em variáveis no `:root`, porque permite reutilizar a mesma configuração em contextos diferentes
3. **Aplique a fonte base no body** — use `font: var(--text)` no body, porque todos os elementos herdam a partir dele
4. **Force herança nos headings** — use `font: inherit` em h1-h3, porque headings têm estilo padrão do navegador que sobrescreve a herança natural
5. **Links sem decoração com cor herdada** — use `text-decoration: none` e `color: inherit` no `a`, porque mantém consistência visual e a cor vem do contexto pai
6. **Hover com variável de cor da marca** — use `color: var(--brand-color-light)` no `a:hover`, porque centraliza a identidade visual nas variáveis

## How to write

### Importação de fontes no HTML

```html
<!-- Preconnect PRIMEIRO (linhas separadas) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<!-- Depois o link da fonte -->
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;800&display=swap" rel="stylesheet">
```

### Variáveis tipográficas no CSS

```css
:root {
  --font-family: "Archivo", sans-serif;

  /* font: weight size/line-height family */
  --h1: 800 24px/135% var(--font-family);
  --h2: 800 16px/140% var(--font-family);
  --h3: 800 14px/140% var(--font-family);
  --text-span: 600 14px/145% var(--font-family);
  --text: 400 16px/140% var(--font-family);
  --text-sm: 400 14px/160% var(--font-family);
}

body {
  font: var(--text);
}

h1, h2, h3 {
  font: inherit;
}

a {
  text-decoration: none;
  color: inherit;
}

a:hover {
  color: var(--brand-color-light);
}
```

## Example

**Before (sem sistema tipográfico):**
```css
h1 { font-size: 24px; font-weight: bold; }
h2 { font-size: 16px; font-weight: bold; }
a { color: blue; }
a:hover { color: darkblue; }
```

**After (com variáveis e herança):**
```css
:root {
  --font-family: "Archivo", sans-serif;
  --h1: 800 24px/135% var(--font-family);
  --h2: 800 16px/140% var(--font-family);
  --text: 400 16px/140% var(--font-family);
}

body { font: var(--text); }
h1, h2, h3 { font: inherit; }
a { text-decoration: none; color: inherit; }
a:hover { color: var(--brand-color-light); }
```

## Heuristics

| Situação | Faça |
|----------|------|
| Heading dentro de card com fonte diferente | O `font: inherit` garante que herda do card pai, não do navegador |
| Texto padrão (16px) | Use `--text` |
| Texto menor em rodapé/caption | Use `--text-sm` (14px) |
| Span destacado dentro de texto | Use `--text-span` (600 weight) |
| Fallback de fonte | Sempre inclua `sans-serif` após a fonte principal |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| `font-size: 24px` direto no h1 | `font: var(--h1)` no contexto pai |
| `color: #xxx` no link | `color: inherit` + hover com variável |
| `font-weight: bold` repetido | Variável com shorthand `font: weight size/line-height family` |
| `<link>` da fonte sem preconnect | Preconnect antes, link da fonte depois |
| Deixar headings com estilo do navegador | `h1, h2, h3 { font: inherit }` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre herança de fontes e por que headings precisam de `font: inherit`
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações