---
name: rs-full-stack-propriedades-grid-auto
description: "Applies CSS Grid auto properties (grid-auto-flow, grid-auto-rows, grid-auto-columns) when building grid layouts. Use when user asks to 'create a grid', 'layout items in columns', 'make a responsive grid', or 'auto-size grid rows/columns'. Enforces correct flow direction, auto-sizing patterns, and loop behavior understanding. Make sure to use this skill whenever generating CSS Grid code that needs automatic placement or sizing. Not for Flexbox layouts, Grid template definitions, or grid-area placement."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: css-grid
  tags:
    - css
    - grid
    - layout
    - auto-flow
    - responsive
---

# Propriedades Grid Auto

> Ao usar CSS Grid, controle o fluxo e dimensionamento automatico dos itens com grid-auto-flow, grid-auto-rows e grid-auto-columns.

## Rules

1. **grid-auto-flow padrao e row** — nao precisa declarar `grid-auto-flow: row` explicitamente, porque ja e o comportamento padrao do Grid
2. **Mude para column quando o fluxo precisa ser horizontal** — use `grid-auto-flow: column` quando itens devem fluir em colunas, porque rows e o default e nao produz layout horizontal
3. **Auto-rows/columns fazem loop** — valores como `50px 1fr 2fr` em grid-auto-rows criam um ciclo que se repete (item 1=50px, item 2=1fr, item 3=2fr, item 4=50px...), porque o Grid aplica os valores em sequencia automatica
4. **Combine auto-flow com a propriedade auto correspondente** — `grid-auto-flow: column` combina com `grid-auto-columns`, `grid-auto-flow: row` com `grid-auto-rows`, porque cada direcao de fluxo tem sua propriedade de dimensionamento
5. **Use max-content para colunas que abracem o conteudo** — `grid-auto-columns: max-content` faz cada coluna ter exatamente o tamanho do conteudo, porque evita espaco desperdicado
6. **Padrao de auto-rows/columns e 1fr** — sem declaracao explicita, cada track automatica ocupa 1fr do espaco disponivel

## How to write

### Fluxo em colunas com dimensionamento automatico

```css
.grid-container {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  gap: 16px;
}
```

### Loop de tamanhos em rows

```css
.grid-container {
  display: grid;
  height: 100vh;
  /* Ciclo: 1fr, 2fr, 3fr, 1fr, 2fr, 3fr... */
  grid-auto-rows: 1fr 2fr 3fr;
}
```

### Colunas com tamanhos fixos em loop

```css
.grid-container {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 50px 100px 200px;
}
```

## Example

**Before (tentando forcar layout horizontal sem auto-flow):**
```css
.container {
  display: grid;
  grid-template-columns: repeat(5, max-content);
  gap: 16px;
}
```

**After (com grid-auto-flow column — funciona para N itens dinamicos):**
```css
.container {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  gap: 16px;
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Itens devem fluir horizontal, quantidade dinamica | `grid-auto-flow: column` + `grid-auto-columns` |
| Rows com alturas alternadas (padrao ciclico) | `grid-auto-rows: valor1 valor2 valor3` |
| Cada coluna deve ter tamanho do conteudo | `grid-auto-columns: max-content` |
| Layout vertical padrao sem customizacao | Nao declare grid-auto-flow (row e default) |
| Precisa de tracks com tamanho fixo conhecido | Use `grid-template-*` em vez de `grid-auto-*` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `grid-auto-flow: row` (redundante) | Omita a propriedade (row ja e default) |
| `grid-auto-flow: column` + `grid-auto-rows: ...` | `grid-auto-flow: column` + `grid-auto-columns: ...` |
| `grid-template-columns` para N itens dinamicos | `grid-auto-flow: column` + `grid-auto-columns` |
| Tamanhos fixos em px sem considerar overflow | Use `max-content` ou `minmax()` para flexibilidade |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre loop behavior, quando usar cada propriedade auto, e comparacao com grid-template
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo da aula com variacoes e cenarios reais

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Itens nao fluem horizontalmente | `grid-auto-flow` esta no default (row) | Adicione `grid-auto-flow: column` |
| Colunas automaticas com tamanho errado | Usando `grid-auto-rows` com `grid-auto-flow: column` | Use `grid-auto-columns` quando o fluxo e por colunas |
| Loop de tamanhos nao funciona como esperado | Quantidade de valores no auto-rows/columns nao corresponde ao ciclo desejado | Verifique a sequencia de valores e que o container tem altura/largura suficiente |

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-propriedades-grid-auto/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-propriedades-grid-auto/references/code-examples.md)
