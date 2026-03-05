---
name: rs-full-stack-grid-ou-flex
description: "Applies CSS Grid vs Flexbox decision-making when writing layouts. Use when user asks to 'create a layout', 'style a component', 'build a navigation', 'add CSS grid', 'use flexbox', or any CSS layout task. Evaluates layout complexity and chooses the simpler tool: Flex for one-dimensional flows, Grid for two-dimensional structures. Make sure to use this skill whenever generating CSS layout code. Not for JavaScript logic, animations, or non-layout styling."
---

# Grid ou Flex — Decisao Pratica

> Observe o layout, observe a complexidade, escolha a ferramenta que resolve com menos codigo.

## Rules

1. **Ambos chegam no mesmo resultado** — Grid e Flex sao ferramentas complementares, nao concorrentes. A escolha e por simplicidade, nao por "certo ou errado"
2. **Escolha pelo menor codigo** — se Flex resolve em 2 propriedades, nao use Grid com 5. Se Grid expressa a estrutura naturalmente, nao force Flex com malabarismos
3. **Flex para fluxos unidimensionais** — menus horizontais, listas inline, alinhamento simples. Uma linha de `display: flex` + `gap` resolve
4. **Grid para estruturas bidimensionais** — layouts com linhas E colunas simultaneas, areas nomeadas, posicionamento complexo
5. **Nao fique preso na duvida** — se ambos resolvem, escolha o que domina mais. A produtividade importa mais que a "pureza tecnica"

## How to write

### Menu horizontal (Flex e o obvio)

```css
/* Simples, direto — flex resolve */
.nav {
  display: flex;
  gap: 8px;
}
```

### Menu horizontal (Grid funciona, mas e mais codigo)

```css
/* Funciona, mas por que usar 3 propriedades se flex resolve com 2? */
.nav {
  display: grid;
  grid-auto-flow: column;
  justify-content: start;
  gap: 16px;
}
```

### Layout com sidebar + conteudo (Grid e o obvio)

```css
/* Grid expressa a estrutura naturalmente */
.page {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: auto 1fr auto;
}
```

## Example

**Before (forçando Grid para algo simples):**
```css
.toolbar {
  display: grid;
  grid-auto-flow: column;
  justify-content: start;
  gap: 8px;
}
```

**After (Flex resolve com menos):**
```css
.toolbar {
  display: flex;
  gap: 8px;
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Itens em uma unica direcao (linha ou coluna) | Flex |
| Layout com linhas E colunas definidas | Grid |
| Ambos resolvem igualmente | Escolha o que gera menos CSS |
| Alinhamento simples de filhos | Flex |
| Areas nomeadas no layout | Grid |
| Nao sabe qual usar | Comece com Flex, migre pra Grid se complicar |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Grid com `grid-auto-flow: column` + `justify-content: start` para menu simples | `display: flex; gap: 8px` |
| Flex com wraps aninhados para simular grid 2D | `display: grid; grid-template-columns/rows` |
| Escolher ferramenta por "moda" ou "preferencia fixa" | Avaliar o layout especifico e escolher pelo menor codigo |
| Ficar paralisado na duvida "Grid ou Flex?" | Escolher qualquer um e seguir — ambos funcionam |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-grid-ou-flex/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-grid-ou-flex/references/code-examples.md)
