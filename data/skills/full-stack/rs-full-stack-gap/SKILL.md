---
name: rs-full-stack-gap
description: "Applies CSS gap, row-gap, and column-gap properties when building grid or flexbox layouts. Use when user asks to 'add spacing between elements', 'create a grid layout', 'space grid items', or 'add gap between columns/rows'. Ensures correct use of gap shorthand vs individual row-gap/column-gap. Make sure to use this skill whenever generating CSS grid or flexbox layouts that need spacing between items. Not for margin, padding, or spacing outside of grid/flex containers."
---

# CSS Gap — Espaçamento entre Elementos do Grid/Flex

> Usar `gap` no container para espaçar elementos internos, nunca margin entre filhos.

## Rules

1. **Use `gap` como padrão** — `gap: 20px` aplica espaçamento uniforme em linhas e colunas, porque cobre 90% dos casos de layout
2. **Use `row-gap` ou `column-gap` apenas quando o espaçamento difere** — porque o shorthand `gap` já resolve ambos quando iguais
3. **`gap` só funciona no container** — aplique em `display: grid` ou `display: flex`, nunca nos filhos
4. **`gap` não afeta elementos que ocupam área completa** — se um item ocupa toda a largura/altura via grid-area, o gap não aparece nesse eixo, porque não há vizinho para separar
5. **Combine `gap` com `padding` para respiro uniforme** — `gap` separa filhos entre si, `padding` separa filhos das bordas do container
6. **Use `box-sizing: border-box` ao adicionar padding** — porque evita que o padding aumente o tamanho total do container

## How to write

### Gap uniforme (caso mais comum)

```css
.container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 20px; /* aplica 20px entre linhas E colunas */
}
```

### Gap diferenciado por eixo

```css
.container {
  display: grid;
  gap: 30px 10px; /* row-gap: 30px, column-gap: 10px */
}
```

### Gap com padding para layout "even"

```css
.container {
  display: grid;
  gap: 30px;
  padding: 30px;
  box-sizing: border-box; /* padding não estoura o tamanho */
}
```

## Example

**Before (margin nos filhos — errado):**

```css
.container {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
.container > * {
  margin: 10px; /* cria espaço nas bordas externas também */
}
```

**After (gap no container — correto):**

```css
.container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px; /* espaço apenas ENTRE os elementos */
  padding: 20px; /* respiro nas bordas, se necessário */
  box-sizing: border-box;
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Espaçamento igual em linhas e colunas | `gap: Xpx` |
| Espaçamento diferente por eixo | `gap: row col` ou `row-gap` + `column-gap` separados |
| Espaço entre filhos E bordas do container | `gap` + `padding` + `box-sizing: border-box` |
| Elemento ocupa grid-area inteira | Não espere gap nesse eixo — é comportamento correto |
| Flexbox com wrap | `gap` funciona igual ao grid |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `margin` entre filhos de grid/flex para espaçamento | `gap` no container |
| `gap` nos filhos | `gap` no container (pai) |
| `row-gap` e `column-gap` com mesmo valor | `gap: Xpx` (shorthand) |
| `padding` sem `box-sizing: border-box` | Sempre combine os dois |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre quando gap aplica ou não, analogias visuais
- [code-examples.md](references/code-examples.md) — Todos os exemplos de layout com gap expandidos