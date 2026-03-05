---
name: rs-full-stack-alinhamentos-items
description: "Enforces correct usage of CSS Grid item alignment properties when writing grid layouts. Use when user asks to 'align grid items', 'center items in grid', 'create a grid layout', 'place items', or any CSS Grid task. Applies align-items (Y axis), justify-items (X axis), and place-items shorthand. Make sure to use this skill whenever generating CSS Grid code that needs item positioning within their cells. Not for Flexbox alignment, grid-template definitions, or align-content/justify-content (container-level)."
---

# Alinhamento de Items no CSS Grid

> Align-items controla o eixo Y, justify-items controla o eixo X, place-items combina ambos — sempre referente ao posicionamento do item DENTRO da sua celula grid.

## Rules

1. **align-items = eixo Y (vertical)** — memorize: align sempre vertical, porque confusao entre eixos e a causa #1 de bugs de layout em grid
2. **justify-items = eixo X (horizontal)** — memorize: justify sempre horizontal
3. **place-items e o shorthand** — `place-items: <align> <justify>`, usa quando quer controlar ambos os eixos de uma vez
4. **Valor padrao e stretch** — sem declaracao explicita, items esticam para preencher toda a celula (largura E altura automaticas definidas pelo grid)
5. **Valores uteis no dia a dia: start, center, end** — baseline existe mas raramente e necessario, space-between/around nao existem aqui porque ha apenas um elemento por celula
6. **Diferencie items de content** — align/justify-items posiciona o item DENTRO da celula; align/justify-content posiciona as tracks dentro do container

## How to write

### Centralizar items nas celulas

```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  /* Centraliza todos os items no meio de suas celulas */
  place-items: center;
}
```

### Posicionar items no canto inferior direito

```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 200px);
  grid-template-rows: repeat(3, 200px);
  align-items: end;    /* fim do eixo Y */
  justify-items: end;  /* fim do eixo X */
}
```

### Shorthand com valores diferentes por eixo

```css
.grid-container {
  /* align-items: center, justify-items: start */
  place-items: center start;
}
```

## Example

**Before (confusao entre content e items):**
```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  /* ERRADO: justify-content nao centraliza items dentro das celulas */
  justify-content: center;
  align-content: center;
}
```

**After (com esta skill aplicada):**
```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  /* CORRETO: place-items centraliza cada item dentro da sua celula */
  place-items: center;
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Quer centralizar item na celula | `place-items: center` |
| Quer item no topo da celula | `align-items: start` (Y) |
| Quer item na esquerda da celula | `justify-items: start` (X) |
| Quer item preenchendo toda a celula | `place-items: stretch` (ou remova a declaracao) |
| Grid flexivel com 1fr | Geralmente stretch e suficiente, use items alignment quando celulas sao maiores que o conteudo |
| Grid com colunas/rows de tamanho fixo | Items alignment faz mais sentido visual porque ha espaco sobrando na celula |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `justify-content: center` para centralizar items | `justify-items: center` ou `place-items: center` |
| `align-items: space-between` | Nao existe — use `align-content: space-between` para tracks |
| `place-items: center; align-items: center; justify-items: center;` | Apenas `place-items: center` (shorthand ja faz tudo) |
| Confundir eixos: `align-items` para horizontal | `align-items` e SEMPRE vertical (Y), use `justify-items` para horizontal (X) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre stretch vs auto, diferencas entre content e items, e quando cada propriedade faz sentido
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes de layout

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-alinhamentos-items/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-alinhamentos-items/references/code-examples.md)
