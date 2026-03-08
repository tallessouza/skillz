---
name: rs-full-stack-multi-line
description: "Applies CSS flex-wrap multi-line layout patterns when writing CSS/HTML code. Use when user asks to 'create a grid', 'wrap elements', 'multi-line layout', 'flex-wrap', or 'align content'. Enforces correct mental model: each wrapped line creates a new sub-container with its own main axis. Covers flex-wrap, wrap-reverse, and align-content interactions. Make sure to use this skill whenever generating flexbox layouts with wrapping elements. Not for CSS Grid, single-line flex layouts, or JavaScript logic."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: css-flexbox
  tags: [css, flexbox, flex-wrap, align-content, multi-line]
---

# Flex Wrap — Multilinhas com Flexbox

> Ao usar flex-wrap, cada nova linha cria um sub-container com seu proprio eixo principal — entender isso e a chave para alinhar corretamente.

## Rules

1. **flex-wrap habilita align-content** — align-content so funciona quando flex-wrap esta ativo, porque sem wrap existe apenas uma linha e nao ha conteudo para distribuir verticalmente
2. **Cada linha wrappada e um sub-container** — imaginar dois eixos independentes (um por linha) explica por que align-items afeta cada linha separadamente
3. **align-content unifica os eixos** — quando aplicado, trate como um unico eixo cortando todas as linhas, porque align-content controla a distribuicao do conjunto
4. **align-items perde efeito com align-content** — quando align-content esta definido, ele domina o posicionamento vertical, porque controla o espaco entre linhas inteiras
5. **flex-shrink e o padrao** — itens flex encolhem para caber no container por padrao (flex-shrink: 1), por isso definir width: 100px nao garante 100px sem wrap ativo
6. **wrap-reverse inverte a direcao de empilhamento** — linhas novas vao para cima em vez de para baixo, util para layouts invertidos

## How to write

### Layout basico com wrap

```css
.container {
  display: flex;
  flex-wrap: wrap; /* habilita multilinhas */
  gap: 8px;
}

.item {
  width: 120px; /* largura real respeitada com wrap ativo */
  height: 80px;
}
```

### Centralizando todas as linhas juntas

```css
.container {
  display: flex;
  flex-wrap: wrap;
  align-content: center; /* todas as linhas agrupadas no centro */
  height: 400px;
}
```

### Distribuindo linhas com espacamento

```css
.container {
  display: flex;
  flex-wrap: wrap;
  align-content: space-between; /* primeira linha no topo, ultima embaixo */
  height: 400px;
}
```

## Example

**Before (sem wrap — itens encolhem e ignoram width):**
```css
.container {
  display: flex;
  /* sem flex-wrap — itens comprimidos numa unica linha */
}
.item {
  width: 100px; /* ignorado — flex-shrink comprime */
}
```

**After (com wrap — itens respeitam largura e quebram linha):**
```css
.container {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start; /* linhas agrupadas no topo */
}
.item {
  width: 120px; /* largura respeitada, excesso vai para proxima linha */
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Itens com largura fixa que devem quebrar linha | `flex-wrap: wrap` + width definido nos itens |
| Alinhar cada linha independentemente | Use `align-items` sem `align-content` |
| Agrupar todas as linhas como bloco unico | Use `align-content` (center, flex-start, flex-end) |
| Espacamento uniforme entre linhas | `align-content: space-evenly` |
| Itens nao respeitam width definido | Verificar se flex-wrap esta ativo |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|---------------------|
| `align-content: center` sem `flex-wrap: wrap` | Adicione `flex-wrap: wrap` primeiro |
| `align-items: center` esperando afetar todas as linhas como bloco | Use `align-content: center` para controlar o bloco |
| Width fixo em itens flex sem wrap | Adicione `flex-wrap: wrap` ou use `min-width` |
| `flex-wrap: wrap` sem altura no container para align-content | Defina height no container para align-content ter espaco |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| Itens nao quebram linha e encolhem | `flex-wrap` nao esta ativo | Adicione `flex-wrap: wrap` ao container |
| `align-content` nao funciona | Falta `flex-wrap: wrap` ou container sem altura definida | Ative `flex-wrap` e defina `height` no container |
| `align-items` nao afeta todas as linhas como bloco | `align-items` atua em cada linha individualmente | Use `align-content` para controlar o bloco de linhas |
| Itens com width fixo nao respeitam a largura | `flex-shrink: 1` e o padrao e comprime os itens | Adicione `flex-wrap: wrap` para respeitar a largura |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Modelo mental dos sub-containers, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes