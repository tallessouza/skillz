---
name: rs-full-stack-shorthand-grid-template
description: "Applies CSS grid-template shorthand syntax when writing grid layouts. Use when user asks to 'create a grid layout', 'define grid areas', 'set up grid rows and columns', or 'simplify grid CSS'. Combines grid-template-areas, grid-template-rows, and grid-template-columns into one declaration. Make sure to use this skill whenever consolidating grid properties into shorthand. Not for flexbox, grid-area placement on children, or grid-auto-flow."
---

# Shorthand grid-template

> Combine grid-template-areas, grid-template-rows e grid-template-columns numa unica propriedade `grid-template`.

## Rules

1. **Areas vem primeiro, rows ao lado** — cada string de area recebe seu row size ao lado, porque a leitura fica linha-a-linha
2. **Columns vem depois da barra** — apos todas as linhas, coloque `/` e defina as colunas, porque a barra separa visualmente o eixo
3. **Omita `-areas` ao usar shorthand** — `grid-template` ja interpreta strings como areas automaticamente, porque e redundante declarar separado
4. **Use shorthand apenas em grids simples** — para layouts complexos, propriedades separadas sao mais legiveis, porque ate instrutores experientes raramente usam o shorthand em producao

## How to write

### Sintaxe completa do shorthand

```css
.grid-container {
  display: grid;
  gap: 10px;
  grid-template:
    "header header header" 80px
    "sidebar content content" 40px
    "footer footer footer" 50px
    / 80px 1fr 2fr;
}
```

### Equivalente em propriedades separadas

```css
.grid-container {
  display: grid;
  gap: 10px;
  grid-template-areas:
    "header header header"
    "sidebar content content"
    "footer footer footer";
  grid-template-rows: 80px 40px 50px;
  grid-template-columns: 80px 1fr 2fr;
}
```

## Example

**Before (propriedades separadas):**
```css
.layout {
  display: grid;
  grid-template-areas:
    "nav nav"
    "side main"
    "foot foot";
  grid-template-rows: 60px 1fr 40px;
  grid-template-columns: 200px 1fr;
  gap: 8px;
}
```

**After (shorthand):**
```css
.layout {
  display: grid;
  grid-template:
    "nav nav" 60px
    "side main" 1fr
    "foot foot" 40px
    / 200px 1fr;
  gap: 8px;
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Grid com areas + rows + columns definidos | Candidato ao shorthand |
| Grid com apenas areas sem tamanhos explicitos | Use `grid-template` so com strings (omita `-areas`) |
| Grid complexo com repeat(), minmax(), auto-fill | Use propriedades separadas |
| Codigo que outros devs vao manter | Prefira propriedades separadas pela legibilidade |

## Anti-patterns

| Nunca escreva | Escreva |
|---------------|---------|
| `grid-template-areas` + `grid-template` juntos | Apenas `grid-template` (ja inclui areas) |
| Shorthand sem a barra quando precisa de columns | Adicione `/ columns` no final |
| Shorthand em grids com tracks dinamicos (auto-fill) | Propriedades separadas |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre quando usar shorthand vs separado, e como o browser interpreta cada parte
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-shorthand-grid-template/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-shorthand-grid-template/references/code-examples.md)
