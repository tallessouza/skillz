---
name: rs-full-stack-color-text-transform-decoration
description: "Applies CSS color, text-transform, and text-decoration properties when styling text elements. Use when user asks to 'style text', 'change text color', 'uppercase text', 'remove link underline', 'add text decoration', or 'format links'. Covers color values, text-transform modes, and text-decoration shorthand with line, style, color, and thickness. Make sure to use this skill whenever generating CSS that involves text styling or link formatting. Not for layout, spacing, fonts, or box-model properties."
---

# Color, Text-Transform e Text-Decoration

> Ao estilizar texto com CSS, use `color` para cor, `text-transform` para caixa, e `text-decoration` como shorthand para linhas decorativas.

## Rules

1. **Use `text-transform` em vez de alterar o texto no HTML** — `uppercase`, `lowercase`, `capitalize` mantêm o conteúdo original acessível e editável
2. **`text-decoration` é um shorthand** — combina `text-decoration-line`, `text-decoration-color`, `text-decoration-style` e `text-decoration-thickness` numa única declaração
3. **Não remova underline de links sem alternativa visual** — usuários associam sublinhado a link; só use `text-decoration: none` quando o contexto torna claro que é clicável (botão, nav, cor distinta + hover)
4. **Ordem do shorthand text-decoration** — `line`, `color`, `style` e `thickness` podem vir em qualquer ordem, porque o browser diferencia pelos tipos de valor

## How to write

### Color

```css
/* Aplique cor diretamente no elemento desejado */
p {
  color: red;
}

/* Funciona com qualquer formato de cor */
h1 {
  color: #3b82f6;
}
```

### Text-Transform

```css
/* Uppercase — todo o texto em caixa alta */
.badge {
  text-transform: uppercase;
}

/* Lowercase — todo o texto em caixa baixa */
.slug {
  text-transform: lowercase;
}

/* Capitalize — primeira letra de cada palavra em maiúscula */
.title {
  text-transform: capitalize;
}

/* None — valor padrão, sem transformação */
```

### Text-Decoration shorthand

```css
/* Linha por cima, vermelha */
a {
  text-decoration: overline red;
}

/* Linha ao meio, tracejada, dupla não — dashed */
del {
  text-decoration: line-through dashed;
}

/* Linha embaixo, ondulada, 2px */
.error {
  text-decoration: underline wavy red 2px;
}
```

### Removendo decoração de links (com cuidado)

```css
/* Só remova quando o contexto deixa claro que é um link */
nav a {
  text-decoration: none;
  color: #2563eb;
}

nav a:hover {
  text-decoration: underline;
}
```

## Example

**Before (link sem estilização consciente):**
```css
a {
  text-decoration: none; /* removeu sem alternativa visual */
}
```

**After (com esta skill aplicada):**
```css
a {
  text-decoration: none;
  color: #2563eb;
  font-weight: 500;
}

a:hover {
  text-decoration: underline;
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Texto precisa ser visualmente uppercase | Use `text-transform: uppercase`, não altere o HTML |
| Link dentro de navegação/botão | `text-decoration: none` é seguro, contexto já indica clicabilidade |
| Link inline no meio de um parágrafo | Mantenha `underline` ou use cor + hover bem distintos |
| Precisa de linha decorativa customizada | Use o shorthand com style (`wavy`, `dashed`, `dotted`, `double`) e thickness |
| Quer remover decoração padrão de `<mark>` ou `<abbr>` | `text-decoration: none` explícito |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `TEXT CONTENT` no HTML para caixa alta | `text-transform: uppercase` no CSS |
| `text-decoration: none` em todos os links globalmente | `text-decoration: none` apenas em contextos onde clicabilidade é óbvia |
| `text-decoration-line: underline; text-decoration-color: red; text-decoration-style: wavy;` separados sem necessidade | `text-decoration: underline wavy red` shorthand |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre UX de links, shorthand anatomy e text-transform
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações