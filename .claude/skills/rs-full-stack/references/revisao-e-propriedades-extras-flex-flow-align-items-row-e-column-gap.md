---
name: rs-full-stack-flexbox-review-extras
description: "Enforces correct Flexbox property usage when writing CSS layouts. Use when user asks to 'create a layout', 'align items', 'use flexbox', 'add gap between elements', or 'make responsive grid'. Applies rules: flex-flow shorthand over separate properties, row-gap/column-gap awareness, align-content requires flex-wrap, align-self for individual item alignment. Make sure to use this skill whenever generating CSS flex layouts. Not for CSS Grid, animations, or non-layout styling."
---

# Flexbox — Propriedades de Container e Filhos

> Dominar flexbox exige separar mentalmente propriedades de container e propriedades de filhos, e entender que tudo gira em torno do eixo principal e cruzado.

## Rules

1. **Use `flex-flow` como shorthand** — `flex-flow: column wrap` substitui `flex-direction` + `flex-wrap`, porque reduz duplicacao e deixa a intencao clara em uma linha
2. **Diferencie `row-gap` e `column-gap`** — `gap` e shorthand para ambos, mas quando precisa de espacamento diferente entre linhas e colunas, use as propriedades separadas
3. **`align-content` so funciona com `flex-wrap` ativado** — sem wrap nao ha multiplas linhas para alinhar, entao a propriedade e ignorada silenciosamente
4. **`align-self` e do filho, nao do container** — quando um unico item precisa de alinhamento diferente, aplique `align-self` nele, nao mude o container
5. **Remova `flex-grow` se nao quer esticamento** — elementos esticam porque receberam ordem para crescer; se o layout quebrou, verifique se `flex-grow` esta ativo sem intencao
6. **Separe mentalmente container vs filhos** — container: `display`, `flex-flow`, `gap`, `justify-content`, `align-items`, `align-content`. Filhos: `flex`, `flex-grow`, `flex-shrink`, `flex-basis`, `align-self`, `order`

## How to write

### Container com flex-flow

```css
.container {
  display: flex;
  flex-flow: row wrap; /* direction + wrap em uma linha */
  gap: 1rem;
  justify-content: space-between;
  align-items: center;
}
```

### Gap separado por eixo

```css
.container {
  display: flex;
  flex-wrap: wrap;
  row-gap: 2rem;    /* espaco entre linhas */
  column-gap: 1rem; /* espaco entre colunas */
}
```

### align-self no filho

```css
.item-destaque {
  align-self: flex-end; /* so este item vai para o final do eixo cruzado */
}
```

## Example

**Before (propriedades separadas e redundantes):**
```css
.container {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 2rem;
  align-content: center; /* funciona porque tem wrap */
}
.item { }
```

**After (com shorthand e intencao clara):**
```css
.container {
  display: flex;
  flex-flow: column wrap;
  row-gap: 2rem;
  column-gap: 1rem;
  align-content: center;
}
.item-2 {
  align-self: flex-start; /* apenas este item desalinhado */
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Direction e wrap juntos | Use `flex-flow` shorthand |
| Espacamento uniforme | Use `gap` |
| Espacamento diferente por eixo | Use `row-gap` + `column-gap` |
| Um item com alinhamento diferente | `align-self` no filho |
| Itens esticando sem querer | Verifique `flex-grow` — remova se nao intencional |
| `align-content` sem efeito | Verifique se `flex-wrap` esta ativado |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `flex-direction: row; flex-wrap: wrap;` separados | `flex-flow: row wrap;` |
| `align-content` sem `flex-wrap` | Adicione `flex-wrap: wrap` ou use `align-items` |
| `align-items` no filho individual | `align-self` no filho especifico |
| `gap` quando precisa de valores diferentes por eixo | `row-gap` + `column-gap` separados |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre eixos, shorthands e comportamento de esticamento
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-revisao-e-propriedades-extras-flex-flow-align-items-row-e-column-gap/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-revisao-e-propriedades-extras-flex-flow-align-items-row-e-column-gap/references/code-examples.md)
