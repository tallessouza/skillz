---
name: rs-full-stack-criando-header-menus
description: "Applies CSS utility-first patterns and modern nesting when building headers, navbars, or navigation menus. Use when user asks to 'create a header', 'build a navbar', 'style navigation', 'add menu layout', or 'implement utility classes in CSS'. Enforces utility-first class strategy, CSS nesting, logical properties (block/inline), and container pattern. Make sure to use this skill whenever generating header/nav HTML+CSS structures. Not for JavaScript interactivity, responsive breakpoints, or CSS animations."
---

# Header e Menus com CSS Utility-First

> Construa headers usando classes utilitárias de responsabilidade única, CSS nesting moderno e propriedades lógicas (block/inline).

## Rules

1. **Use classes utilitárias de responsabilidade única** — cada classe faz exatamente uma coisa (`grid`, `grid-flow-col`), porque permite reuso em qualquer elemento sem duplicar CSS
2. **Use CSS nesting nativo** — aninhe seletores dentro do pai (`#primary { div:nth-child(2) { ... } }`), porque reflete a hierarquia HTML e elimina repetição de seletores
3. **Use propriedades lógicas, não físicas** — `padding-block` (vertical), `padding-inline` (horizontal), `margin-inline: auto` (centralizar), porque funcionam independente da direção do texto
4. **Crie um container reutilizável** — `max-width` + `padding-inline` + `margin-inline: auto`, porque garante largura máxima com padding lateral consistente
5. **Prefira Grid para layout estrutural, Flex para alinhamento interno** — Grid organiza a estrutura macro, Flex alinha itens dentro de células, porque cada um resolve um problema diferente
6. **Remova bordas laterais com `border-inline: none`** — quando a borda deve ser apenas horizontal, porque propriedades lógicas permitem controle por eixo

## How to write

### Estrutura HTML do header

```html
<header class="container">
  <nav id="primary" class="grid grid-flow-col">
    <div><!-- menu icon + label --></div>
    <div><!-- logo --></div>
    <div><!-- search icon + label --></div>
  </nav>
  <nav id="secondary" class="grid grid-flow-col">
    <a href="#">Categoria 1</a>
    <a href="#">Categoria 2</a>
  </nav>
</header>
```

### Classes utilitárias (global.css)

```css
.grid {
  display: grid;
}

.grid-flow-col {
  grid-auto-flow: column;
}

.container {
  max-width: 1280px;
  padding-inline: 32px;
  margin-inline: auto;
}
```

### Estilização com nesting (header.css)

```css
#primary {
  padding-block: 20px;

  div:nth-child(2) {
    margin-inline: auto;
  }

  div:nth-child(3) {
    justify-self: end;
  }

  div {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

#secondary {
  padding-block: 14px;
  border: 1px solid var(--stroke-color);
  border-inline: none;
  justify-content: space-between;
}
```

## Example

**Before (sem utility-first, sem nesting):**

```css
#primary {
  display: grid;
  grid-auto-flow: column;
  padding-top: 20px;
  padding-bottom: 20px;
}

#primary div:nth-child(2) {
  margin-left: auto;
  margin-right: auto;
}

#secondary {
  display: grid;
  grid-auto-flow: column;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
}
```

**After (utility-first + nesting + propriedades lógicas):**

```css
/* global.css — classes reutilizáveis */
.grid { display: grid; }
.grid-flow-col { grid-auto-flow: column; }

/* header.css — específico com nesting */
#primary {
  padding-block: 20px;

  div:nth-child(2) {
    margin-inline: auto;
  }
}

#secondary {
  padding-block: 14px;
  border: 1px solid var(--stroke-color);
  border-inline: none;
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Layout macro (colunas, linhas) | Use Grid via classe utilitária |
| Alinhar ícone + texto lado a lado | Use Flex com `align-items: center` e `gap` |
| Centralizar elemento no eixo horizontal | `margin-inline: auto` |
| Padding vertical (topo/baixo) | `padding-block` |
| Padding horizontal (esquerda/direita) | `padding-inline` |
| Borda apenas horizontal | `border` completo + `border-inline: none` |
| Distribuir itens de menu | `justify-content: space-between` |

## Anti-patterns

| Nunca escreva | Escreva |
|---------------|---------|
| `margin-left: auto; margin-right: auto` | `margin-inline: auto` |
| `padding-top: 20px; padding-bottom: 20px` | `padding-block: 20px` |
| `#primary div:nth-child(2) { }` (fora do bloco) | Dentro de `#primary { div:nth-child(2) { } }` (nesting) |
| `.header-grid { display: grid; grid-auto-flow: column; padding: ... }` | `.grid` + `.grid-flow-col` separadas (utility-first) |
| `border-left: none; border-right: none` | `border-inline: none` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre utility-first, CSS nesting e propriedades lógicas
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-criando-o-header-e-os-menus/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-criando-o-header-e-os-menus/references/code-examples.md)
