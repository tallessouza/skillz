---
name: rs-full-stack-variaveis-css
description: "Enforces CSS custom properties (variables) best practices when writing stylesheets. Use when user asks to 'style a component', 'create CSS variables', 'theme a page', 'use custom properties', or any CSS authoring task involving reusable values. Applies rules: double-dash prefix, no spaces in names, :root for globals, scoped overrides for local changes, var() function usage. Make sure to use this skill whenever generating CSS that repeats values or needs theming support. Not for JavaScript variables, Sass/LESS variables, or CSS-in-JS solutions."
---

# Variáveis no CSS (Custom Properties)

> Definir variáveis com escopo intencional: globais em `:root`, locais no seletor mais próximo do uso.

## Rules

1. **Prefixe sempre com `--`** — `--bg-color` nao `bgColor`, porque o navegador exige dois tracos para reconhecer custom properties
2. **Sem espacos no nome** — use tracos como separador: `--font-size-base` nao `--font size base`, porque espacos invalidam a declaracao
3. **Sem caracteres especiais nem numeros no inicio** — `--primary-color` nao `--1color` ou `--côr`, porque causa comportamento imprevisivel entre navegadores
4. **Globais em `:root`** — variaveis que todo o projeto usa vao em `:root`, porque `:root` e o seletor de maior escopo no DOM
5. **Sobrescreva localmente quando necessario** — redeclare a mesma variavel dentro de um seletor filho para mudar o valor naquele escopo, porque CSS custom properties seguem cascata e heranca
6. **Use `var()` para consumir** — `background-color: var(--bg-color)`, nunca referencie sem a funcao `var()`

## How to write

### Variavel global

```css
:root {
  --bg-color: lightblue;
  --text-color: #333;
  --spacing-md: 16px;
}
```

### Variavel local (escopo)

```css
body {
  --bg-color: lightgreen; /* sobrescreve :root para body e filhos */
  background-color: var(--bg-color);
}
```

### Consumo com var()

```css
.card {
  background-color: var(--bg-color);
  color: var(--text-color);
  padding: var(--spacing-md);
}
```

## Example

**Before (valores repetidos sem variavel):**
```css
body {
  background-color: lightblue;
}
.header {
  background-color: lightblue;
}
.card {
  border-color: lightblue;
}
```

**After (com variaveis CSS):**
```css
:root {
  --brand-color: lightblue;
}
body {
  background-color: var(--brand-color);
}
.header {
  background-color: var(--brand-color);
}
.card {
  border-color: var(--brand-color);
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Cor usada em 2+ lugares | Extrair para variavel em `:root` |
| Componente precisa de variacao visual | Sobrescrever variavel no seletor do componente |
| Valor usado so dentro de um seletor | Declarar variavel local naquele seletor |
| Tema claro/escuro | Redeclarar variaveis em classe `.dark` ou media query |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `--bg color: blue` | `--bg-color: blue` |
| `background: --bg-color` | `background: var(--bg-color)` |
| Repetir `#3b82f6` em 10 seletores | `--primary: #3b82f6` em `:root` + `var(--primary)` |
| Variavel global para valor usado 1 vez | Valor inline direto no seletor |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre escopo, cascata e heranca de custom properties
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-variaveis-2/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-variaveis-2/references/code-examples.md)
