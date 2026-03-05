---
name: rs-full-stack-combinators
description: "Applies CSS combinator selectors correctly when writing stylesheets. Use when user asks to 'style nested elements', 'select child elements', 'write CSS selectors', 'target siblings in CSS', or any CSS selector task. Covers descendant (space), list (comma), next-sibling (+), and child (>) combinators with correct syntax and specificity. Make sure to use this skill whenever generating CSS that targets elements by relationship. Not for CSS properties, layout systems like flexbox/grid, or JavaScript DOM selection."
---

# CSS Combinators

> Ao escrever seletores CSS, use combinators para selecionar elementos pela relacao hierarquica com outros elementos, nao por classes ou IDs desnecessarios.

## Rules

1. **Descendant combinator usa espaco** — `article p` seleciona TODO `p` dentro de `article`, em qualquer nivel de profundidade, porque sem espaco (`articlep`) nao existe como seletor
2. **List combinator usa virgula** — `span, mark` aplica o mesmo estilo a ambos, porque evita duplicacao de regras
3. **Next-sibling combinator usa `+`** — `h2 + p` seleciona apenas o `p` que e irmao imediatamente seguinte ao `h2`, porque a leitura e "esse P tem um H2 imediatamente antes?"
4. **Child combinator usa `>`** — `aside > ul` seleciona apenas `ul` filhos diretos de `aside`, nao os aninhados, porque o descendant pegaria todos os niveis
5. **Propriedades herdaveis ignoram child combinator** — `color` aplicada no pai propaga para todos os filhos independentemente do seletor, porque heranca CSS prevalece; use `>` apenas para propriedades nao-herdaveis como `margin`, `padding`, `border`

## How to write

### Descendant (espaco)

```css
/* Seleciona TODOS os p dentro de article, qualquer profundidade */
article p {
  color: red;
}
```

### List (virgula)

```css
/* Aplica o mesmo estilo a multiplos seletores */
span, mark {
  color: red;
}
```

### Next-sibling (+)

```css
/* Seleciona apenas o p imediatamente apos um h2 */
h2 + p {
  color: red;
}

/* Seleciona p que tem outro p imediatamente antes */
p + p {
  color: red;
}
```

### Child (>)

```css
/* Seleciona apenas ul filhos diretos de aside */
aside > ul {
  margin-top: 50px;
}
```

## Example

**Before (seletor generico demais):**

```css
/* Aplica margin-top a TODAS as ul dentro de aside, incluindo aninhadas */
aside ul {
  margin-top: 50px;
}
```

**After (com child combinator):**

```css
/* Aplica margin-top apenas as ul de primeiro nivel */
aside > ul {
  margin-top: 50px;
}
```

## Heuristics

| Situacao | Combinator |
|----------|-----------|
| Estilizar todos os elementos de um tipo dentro de um container | Descendant (espaco) |
| Aplicar mesmo estilo a seletores diferentes | List (virgula) |
| Estilizar apenas o primeiro elemento apos outro especifico | Next-sibling (+) |
| Estilizar apenas filhos diretos, sem afetar aninhados | Child (>) |
| Propriedade herdavel como `color` | Descendant basta — child nao muda o comportamento |
| Propriedade nao-herdavel como `margin` | Child (>) para precisao |

## Anti-patterns

| Nunca escreva | Escreva |
|---------------|---------|
| `articlep { }` (sem espaco) | `article p { }` |
| `aside ul { margin-top: 50px }` quando quer so primeiro nivel | `aside > ul { margin-top: 50px }` |
| `aside > ul { color: red }` esperando limitar heranca de cor | `aside ul { color: red }` (cor herda de qualquer forma) |
| Repetir bloco CSS identico para span e mark separados | `span, mark { color: red }` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases de cada combinator
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes