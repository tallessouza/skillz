---
name: rs-full-stack-mais-especifico
description: "Enforces CSS specificity best practices when writing stylesheets. Use when user asks to 'style a component', 'fix CSS not applying', 'override styles', 'debug CSS specificity', or 'write CSS'. Guards against inline styles and !important abuse. Make sure to use this skill whenever generating CSS or debugging style conflicts. Not for JavaScript logic, HTML structure, or CSS layout/positioning techniques."
---

# Especificidade CSS: inline style e !important

> Resolva conflitos de especificidade usando seletores adequados (id, class, tag), nunca recorrendo a inline style ou !important.

## Rules

1. **Nunca use `!important`** — porque se esquecer onde colocou, nenhuma combinacao de id, class ou inline style vai funcionar e o debug vira pesadelo
2. **Nunca use atributo `style` inline na tag** — porque sobrescreve qualquer seletor CSS externo e quebra a manutencao
3. **Resolva conflitos aumentando especificidade do seletor** — adicione id ou class mais especifico em vez de forcar com inline/important, porque mantem o CSS previsivel
4. **Aumente especificidade somente conforme necessidade** — nao comece com id se class resolve, porque especificidade excessiva cria os mesmos problemas que important

## Hierarquia de peso

| Nivel | Exemplo | Peso |
|-------|---------|------|
| Tag | `h1 { }` | Baixo |
| Class | `.title { }` | Medio |
| ID | `#title { }` | Alto |
| Inline style | `style="..."` | Muito alto |
| `!important` | `color: red !important` | Maximo (perigoso) |

## How to write

### Resolver conflito de estilo corretamente

```css
/* Aumente especificidade com seletor mais preciso */
.container #title {
  font-size: 32px;
}
```

### Quando precisa sobrescrever estilo de terceiros

```css
/* Prefira seletor mais especifico antes de considerar !important */
body .third-party-widget .title {
  font-size: 16px;
}
```

## Example

**Before (problematico):**

```html
<h1 id="title" style="font-size: 32px">Titulo</h1>
```

```css
#title {
  font-size: 12px; /* Ignorado — inline style vence */
}
```

**After (com esta skill aplicada):**

```html
<h1 id="title">Titulo</h1>
```

```css
#title {
  font-size: 32px; /* Funciona normalmente, facil de manter */
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Estilo nao esta aplicando | Verifique se ha inline style ou !important em outro lugar |
| Precisa sobrescrever CSS de lib externa | Aumente especificidade do seletor antes de usar !important |
| !important parece inevitavel | Use, mas documente com comentario explicando o motivo |
| Inline style em componente dinamico | Mova para classe CSS; use classe condicional se precisa variar |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `style="font-size: 32px"` na tag | `.titulo { font-size: 32px; }` no CSS |
| `font-size: 12px !important` | Seletor mais especifico: `#container .titulo { }` |
| `!important` para "resolver rapido" | Investigar qual seletor esta vencendo e ajustar especificidade |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre hierarquia de especificidade e analogias
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-mais-especifico/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-mais-especifico/references/code-examples.md)
