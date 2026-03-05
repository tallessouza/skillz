---
name: rs-full-stack-explicando-o-css-grid
description: "Applies CSS Grid mental model when structuring page layouts with rows and columns. Use when user asks to 'create a layout', 'build a page structure', 'position elements', 'make a grid', or 'design a header/sidebar/footer layout'. Enforces grid thinking: container as sliced box with columns and rows where child elements occupy specific cells or spans. Make sure to use this skill whenever building multi-section page layouts. Not for Flexbox one-dimensional alignment, animations, or typography."
---

# CSS Grid — Modelo Mental

> Pense no grid como uma prateleira fatiada em colunas e linhas: voce posiciona cada elemento filho exatamente onde quiser.

## Key concept

CSS Grid transforma um container numa grade bidimensional. Diferente do Flexbox (unidimensional), o Grid trabalha com **colunas E linhas simultaneamente**. Toda tag HTML e uma caixa — ao aplicar `display: grid`, essa caixa e fatiada em compartimentos onde elementos filhos podem ser posicionados livremente.

A analogia central: imagine uma **prateleira de livros**. Ela tem espacos organizados em colunas e linhas. Voce pode colocar um livro num unico espaco, ou fazer ele ocupar dois espacos, ou deixar espacos vazios. O Grid funciona exatamente assim.

## Decision framework

| Quando voce encontra | Aplique |
|---------------------|---------|
| Layout com header + sidebar + content + footer | Grid com areas nomeadas |
| Elementos que ocupam multiplas colunas ou linhas | `grid-column: span N` / `grid-row: span N` |
| Necessidade de espacos vazios no layout | Deixe celulas sem elementos atribuidos |
| Layout unidimensional (so linha OU so coluna) | Considere Flexbox ao inves de Grid |
| Grade complexa com 3+ colunas e 3+ linhas | Grid com `grid-template-columns` e `grid-template-rows` |

## How to think about it

### O container e uma caixa fatiada

```html
<div id="app">
  <!-- Ao aplicar display: grid, essa div vira uma grade -->
  <!-- Elementos filhos sao posicionados nas celulas -->
  <header>...</header>
  <aside>...</aside>
  <main>...</main>
  <footer>...</footer>
</div>
```

```css
#app {
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header  header"
    "side    content"
    "footer  footer";
}
```

### Elementos ocupam celulas livremente

Um elemento pode ocupar **uma celula**, **varias celulas na mesma linha**, **varias celulas em coluna**, ou **um bloco retangular** de celulas. Voce controla isso com propriedades nos filhos.

### Linhas do grid sao invisiveis

As linhas que dividem a grade nao aparecem visualmente — elas existem apenas como estrutura logica para posicionamento. O resultado visual sao os elementos posicionados, sem bordas de grade.

## Common misconceptions

| Pensam que | Realidade |
|-----------|-----------|
| Grid substitui Flexbox | Sao complementares — Grid para 2D, Flexbox para 1D |
| Precisa preencher todas as celulas | Celulas podem ficar vazias propositalmente |
| Grid e so para layouts de pagina inteira | Funciona em qualquer container, de qualquer tamanho |
| As linhas do grid aparecem na tela | Sao invisiveis — apenas estrutura logica |

## When to apply

- Layouts de pagina com header, sidebar, content, footer
- Dashboards com cards em posicoes especificas
- Galerias de imagens com tamanhos variados
- Qualquer layout onde elementos precisam ser posicionados em duas dimensoes

## Limitations

- Para alinhar itens numa unica direcao (row ou column), Flexbox e mais simples
- Grid nao substitui a necessidade de responsividade — combine com media queries ou `auto-fit`/`auto-fill`
- Browser support e excelente hoje, mas layouts muito complexos podem ser dificeis de debugar sem DevTools

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes