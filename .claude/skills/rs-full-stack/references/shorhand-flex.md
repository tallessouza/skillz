---
name: rs-full-stack-shorhand-flex
description: "Applies correct CSS flex shorthand syntax when writing flexbox layouts. Use when user asks to 'style with flexbox', 'add flex properties', 'create a flex layout', 'set flex-grow/shrink/basis', or any CSS layout task involving flex items. Enforces correct value interpretation: 1-value numeric = grow, 1-value unit = basis, 2-value rules, 3-value order (grow, shrink, basis). Make sure to use this skill whenever writing flex shorthand in CSS. Not for grid layouts, flex container properties (justify-content, align-items), or non-CSS tasks."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: css-flexbox
  tags:
    - css
    - flexbox
    - flex-shorthand
    - layout
    - flex-grow
---

# Shorthand Flex

> Ao usar a propriedade `flex`, a ordem e o tipo dos valores determinam completamente o comportamento — um numero e uma unidade significam coisas diferentes.

## Rules

1. **Domine os keywords primeiro** — `flex: initial` (0 1 auto), `flex: auto` (1 1 auto), `flex: none` (0 0 0), porque sao os atalhos mais comuns e evitam erros
2. **Um valor numerico = grow** — `flex: 1` significa grow=1, shrink=1, basis=0 (nao auto), porque o browser assume basis=0 quando recebe apenas um numero
3. **Um valor com unidade = basis** — `flex: 120px` significa grow=1, shrink=1, basis=120px, porque o browser ativa grow e shrink automaticamente
4. **Dois valores: primeiro sempre e grow** — o segundo depende do tipo: numerico = shrink, com unidade = basis, porque a spec CSS usa o tipo do valor para desambiguar
5. **Tres valores: ordem fixa grow, shrink, basis** — sem ambiguidade, cada posicao tem seu papel
6. **Basis 0 vs auto muda tudo** — basis=0 ignora o tamanho do conteudo, basis=auto respeita, porque isso afeta como o espaco e distribuido

## How to write

### Keywords

```css
/* Nao cresce, encolhe, basis auto */
.item { flex: initial; }  /* equivale a flex: 0 1 auto */

/* Cresce, encolhe, basis auto */
.item { flex: auto; }     /* equivale a flex: 1 1 auto */

/* Nao cresce, nao encolhe, basis 0 */
.item { flex: none; }     /* equivale a flex: 0 0 0 */
```

### Um valor

```css
/* Numerico → grow (basis vira 0, shrink vira 1) */
.item { flex: 1; }        /* grow=1, shrink=1, basis=0 */
.item { flex: 2; }        /* grow=2, shrink=1, basis=0 */

/* Com unidade → basis (grow e shrink viram 1) */
.item { flex: 120px; }    /* grow=1, shrink=1, basis=120px */
.item { flex: 10%; }      /* grow=1, shrink=1, basis=10% */
```

### Dois valores

```css
/* Grow + Shrink (segundo e numerico → shrink, basis=0) */
.item { flex: 1 0; }      /* grow=1, shrink=0, basis=0 */

/* Grow + Basis (segundo tem unidade → basis, shrink=1) */
.item { flex: 1 200px; }  /* grow=1, shrink=1, basis=200px */
.item { flex: 0 10%; }    /* grow=0, shrink=1, basis=10% */
```

### Tres valores

```css
/* Ordem fixa: grow, shrink, basis */
.item { flex: 1 0 200px; }  /* cresce, nao encolhe, basis 200px */
.item { flex: 1 1 0; }      /* cresce, encolhe, basis 0 */
.item { flex: 0 0 auto; }   /* mesmo que flex: none */
```

## Example

**Before (verbose, 3 propriedades separadas):**
```css
.card {
  flex-grow: 1;
  flex-shrink: 0;
  flex-basis: 200px;
}
```

**After (shorthand correto):**
```css
.card {
  flex: 1 0 200px;
}
```

## Heuristics

| Situacao | Use |
|----------|-----|
| Item deve ocupar espaco igual aos outros | `flex: 1` |
| Item com tamanho fixo que nao muda | `flex: none` |
| Item com tamanho base que pode crescer | `flex: 1 200px` |
| Item que cresce mas nunca encolhe | `flex: 1 0 auto` |
| Reset para comportamento padrao | `flex: initial` |

## Anti-patterns

| Nunca escreva | Escreva |
|---------------|---------|
| `flex: 1` achando que basis e auto | `flex: 1` sabendo que basis e 0 |
| `flex-grow: 1; flex-shrink: 1; flex-basis: 0;` | `flex: 1` |
| `flex: 1 1 auto` quando quer distribuicao igual | `flex: 1` (basis=0 distribui igual) |
| `flex-basis: 200px` sem definir grow/shrink | `flex: 0 1 200px` ou `flex: 200px` |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Item nao cresce para preencher espaco | `flex: initial` (padrao) tem grow=0 | Use `flex: 1` para permitir crescimento |
| Itens com tamanhos desiguais apesar de `flex: 1` | Conteudo interno afeta tamanho quando basis=auto | Use `flex: 1` (basis=0) para distribuicao igual |
| Item nao respeita tamanho minimo | `flex-shrink` encolhe alem do desejado | Use `flex: 1 0 200px` para impedir encolhimento |
| Layout quebra em telas menores | Itens com basis fixa sem shrink | Permita shrink: `flex: 1 1 200px` ou use media queries |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre como o browser interpreta cada combinacao de valores
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-shorhand-flex/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-shorhand-flex/references/code-examples.md)
