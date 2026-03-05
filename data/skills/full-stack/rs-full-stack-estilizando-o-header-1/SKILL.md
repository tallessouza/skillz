---
name: rs-full-stack-estilizando-o-header-1
description: "Applies CSS header styling patterns using Flexbox layout, gap spacing, and alignment when building page headers or profile sections. Use when user asks to 'style a header', 'create a profile section', 'layout header with flexbox', or 'align header elements'. Enforces flex-based composition with gap instead of margins, proper nesting selectors, and CSS file separation. Make sure to use this skill whenever styling header components with profile info and metadata lists. Not for JavaScript logic, responsive breakpoints, or CSS Grid layouts."
---

# Estilizando o Header com CSS Flexbox

> Componha headers usando Flexbox com gap para espaçamento, seletores aninhados para escopo, e arquivos CSS separados por seção.

## Rules

1. **Separe CSS por seção** — crie `header.css`, `main.css`, etc. e importe com `@import url("header.css")`, porque facilita manutenção e localização de estilos
2. **Use `gap` ao invés de margin entre irmãos** — `gap: 32px` no container flex, porque gap é bidirecional e não causa colapso de margem
3. **Use `padding-block` para espaçamento vertical do header** — `padding-block: 32px`, porque respeita writing-mode e é mais semântico que padding-top/bottom
4. **Limite largura com `max-width`** — aplique no container de texto, não no header inteiro, porque preserva flexibilidade do layout externo
5. **Use `flex-direction: column` para listas verticais** — combine com `gap` para espaçamento uniforme entre itens, porque evita margin em cada `li`
6. **Aplique `font` no container, não em cada filho** — se todos os filhos usam o mesmo tamanho, aplique no header/container e deixe herdar, porque reduz duplicação

## How to write

### Estrutura de arquivos CSS

```css
/* index.css */
@import url("header.css");
@import url("main.css");
```

### Header com profile e info

```css
header {
  padding-block: 32px;
  font: var(--text-md);
}

.profile {
  display: flex;
  align-items: center;
  gap: 32px;
}

.profile > div {
  max-width: 384px;
}

.profile h1 {
  font: var(--text-lg);
  color: var(--text-color-primary);
  margin-bottom: 8px;
}
```

### Lista de informações com Flexbox

```css
.info {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 280px;
}

.info li {
  display: flex;
  align-items: center;
  gap: 8px;
}
```

### Container com espaçamento horizontal

```css
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

## Example

**Before (margins espalhados, sem estrutura):**
```css
header { padding-top: 32px; padding-bottom: 32px; }
.profile img { margin-right: 32px; }
.profile h1 { font-size: 18px; margin-bottom: 8px; }
.info { list-style-type: none; }
.info li { margin-bottom: 16px; }
.info li img { margin-right: 8px; }
```

**After (flex + gap, organizado):**
```css
header { padding-block: 32px; font: var(--text-md); }
.profile { display: flex; align-items: center; gap: 32px; }
.profile h1 { font: var(--text-lg); color: var(--text-color-primary); margin-bottom: 8px; }
.info { list-style: none; display: flex; flex-direction: column; gap: 16px; width: 280px; }
.info li { display: flex; align-items: center; gap: 8px; }
.container { display: flex; justify-content: space-between; align-items: center; }
```

## Heuristics

| Situação | Faça |
|----------|------|
| Elementos lado a lado | `display: flex` + `gap` |
| Elementos empilhados | `display: flex; flex-direction: column` + `gap` |
| Espaçamento entre primeiro e último | `justify-content: space-between` |
| Centralizar verticalmente | `align-items: center` |
| Texto com largura limitada | `max-width` no container do texto |
| Mesmo font-size em todos os filhos | Aplique no pai, deixe herdar |
| Remover bullets de lista | `list-style: none` |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|-----------------|
| `margin-right: 32px` entre irmãos flex | `gap: 32px` no container |
| `padding-top: 32px; padding-bottom: 32px` | `padding-block: 32px` |
| Todos estilos num único CSS | Arquivo separado por seção (`header.css`) |
| `font-size` repetido em cada `p`, `span` | `font` no container pai |
| `list-style-type: none` | `list-style: none` (shorthand) |
| `margin-bottom` em cada `li` | `gap` no `ul` com flex-direction column |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre composição flex, Active Recall, e decisões de layout
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações