---
name: rs-discover-conhecendo-display-flex
description: "Applies CSS Flexbox layout patterns when writing HTML/CSS code. Use when user asks to 'create a layout', 'align items', 'style a list', 'use flexbox', 'organize elements side by side', or 'add spacing between elements'. Enforces correct usage of display:flex, flex-direction, gap, and understanding of block vs inline vs flex behavior. Make sure to use this skill whenever generating CSS layouts or styling navigation/lists. Not for CSS Grid, animations, or responsive breakpoints."
---

# Display Flex — Fundamentos

> Ao usar Flexbox, aplique `display: flex` no container pai para controlar o posicionamento dos filhos, nunca nos filhos diretamente.

## Rules

1. **Flex atua no container, afeta os filhos** — `display: flex` vai no elemento pai, porque o flex controla como os filhos se distribuem dentro da caixa
2. **Nao declare `flex-direction: row`** — row ja e o padrao do flex, declarar e redundante e polui o CSS
3. **Use `gap` para espacamento entre elementos** — `gap` espacha somente ENTRE os filhos, nao nas bordas externas, porque e mais limpo que margin entre elementos
4. **Inline vira full-width com flex** — um elemento `inline` (como `<a>`) dentro de um flex container ocupa 100% do espaco disponivel, sem precisar declarar `width: 100%`
5. **Nao declare largura/altura quando o layout ja resolve** — se o elemento ja ocupa todo o espaco disponivel via flex ou block, `width` e `height` fixos sao redundantes
6. **Analise critica do Figma** — o Figma sugere propriedades que nem sempre fazem sentido no contexto real, porque ele gera CSS generico sem entender o fluxo do documento

## How to write

### Lista de navegacao com flex

```css
/* Remove estilo padrao da lista */
ul {
  list-style: none;
}

/* Flex no container para organizar os filhos */
ul {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Link ocupa 100% por estar dentro de flex container */
li a {
  display: flex;
  padding: 12px 16px;
}
```

### Elementos lado a lado (row — padrao)

```css
.container {
  display: flex;
  /* flex-direction: row; — DESNECESSARIO, ja e padrao */
  gap: 16px;
}
```

### Elementos empilhados (column)

```css
.container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
```

## Example

**Before (CSS com propriedades redundantes do Figma):**
```css
ul {
  display: flex;
  flex-direction: row;
  width: 360px;
  height: 200px;
}

li a {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 48px;
}
```

**After (com esta skill aplicada):**
```css
ul {
  display: flex;
  flex-direction: column;
  gap: 8px;
  list-style: none;
}

li a {
  display: flex;
  padding: 12px 16px;
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Elementos um ao lado do outro | `display: flex` no pai (row e padrao) |
| Elementos um abaixo do outro | `display: flex` + `flex-direction: column` |
| Espacamento entre elementos | `gap: Npx` no flex container |
| Elemento inline precisa ocupar 100% | Aplique `display: flex` ou `display: block` |
| Figma sugere width/height fixos | Avalie se o layout ja resolve sem eles |
| Figma sugere flex-direction: row | Ignore, ja e o padrao |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `flex-direction: row` (sem motivo) | Omita, row ja e padrao |
| `width: 100%` em filho de flex | Remova, flex ja faz ocupar 100% |
| `margin` entre cada filho para espacar | `gap: Npx` no container pai |
| `height: 48px` quando padding resolve | `padding: 12px 16px` |
| Copiar todo CSS do Figma sem analisar | Avaliar cada propriedade no contexto |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre block vs inline vs flex e analise critica do Figma
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes