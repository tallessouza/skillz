---
name: rs-full-stack-align-items
description: "Applies CSS Flexbox align-items rules when writing layout code. Use when user asks to 'align items', 'center vertically', 'create a flex layout', 'fix vertical alignment', or 'use flexbox'. Enforces correct cross-axis alignment with align-items values: stretch, flex-start, center, flex-end, baseline. Make sure to use this skill whenever generating flexbox layout code that involves cross-axis positioning. Not for justify-content, grid layout, or inline text alignment."
---

# Align-Items no Flexbox

> Align-items controla o posicionamento dos itens no eixo cruzado — o eixo perpendicular ao flex-direction.

## Rules

1. **Defina altura no container para row, largura para column** — align-items so funciona quando ha espaco no eixo cruzado, porque sem espaco nao ha onde mover os itens
2. **Lembre que o padrao e stretch** — sem declarar align-items, os itens esticam para preencher o eixo cruzado inteiro, porque `stretch` e o valor inicial
3. **Baseline alinha pela base do texto, nao pela borda do elemento** — existe uma linha virtual na base do texto de cada item, e todos se alinham por ela, porque o proposito e alinhar conteudo textual de tamanhos diferentes
4. **O eixo cruzado muda com flex-direction** — em `row` o eixo cruzado e vertical, em `column` e horizontal, porque align-items sempre atua no eixo perpendicular ao principal
5. **Stretch so funciona se o item nao tiver dimensao fixa no eixo cruzado** — se um item tem height fixa (em row) ou width fixa (em column), stretch nao tem efeito, porque a dimensao explicita tem prioridade

## How to write

### Alinhamento vertical em row (caso mais comum)

```css
.container {
  display: flex;
  flex-direction: row;
  height: 400px; /* Obrigatorio: cria espaco no eixo cruzado */
  align-items: center; /* flex-start | center | flex-end | baseline | stretch */
}
```

### Alinhamento horizontal em column

```css
.container {
  display: flex;
  flex-direction: column;
  align-items: center; /* Agora move no eixo horizontal */
}
```

### Baseline com textos de tamanhos diferentes

```css
.container {
  display: flex;
  align-items: baseline;
}

.item-large {
  font-size: 45px;
}

.item-small {
  font-size: 16px;
}
/* Todos alinhados pela linha base do texto, independente do font-size */
```

## Example

**Before (itens esticados sem intencao):**
```css
.container {
  display: flex;
  height: 400px;
  /* align-items nao declarado = stretch por padrao */
}
```

**After (alinhamento intencional):**
```css
.container {
  display: flex;
  height: 400px;
  align-items: center; /* Centraliza no eixo cruzado explicitamente */
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Centralizar verticalmente em row | `align-items: center` + `height` no container |
| Textos de tamanhos diferentes na mesma linha | `align-items: baseline` |
| Itens devem preencher toda a altura | `align-items: stretch` (ou omita, e o padrao) |
| Itens no topo do container | `align-items: flex-start` |
| Itens no fundo do container | `align-items: flex-end` |
| Mudou flex-direction para column | Lembre que align-items agora atua na horizontal |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Usar margin-top/bottom manual para centralizar verticalmente | `align-items: center` no flex container |
| Esquecer height no container e achar que align-items nao funciona | Adicionar height explicita para criar espaco no eixo cruzado |
| Confundir baseline com flex-end | Baseline alinha pelo texto, flex-end pela borda inferior do container |
| Usar align-items esperando mover no eixo principal | Usar justify-content para o eixo principal |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre eixo cruzado, stretch e baseline
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-align-items/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-align-items/references/code-examples.md)
