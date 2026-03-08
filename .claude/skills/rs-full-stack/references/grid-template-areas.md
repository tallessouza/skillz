---
name: rs-full-stack-grid-template-areas
description: "Applies CSS Grid Template Areas layout patterns when writing HTML/CSS code. Use when user asks to 'create a layout', 'build a page structure', 'use css grid', 'position elements with grid', or 'make a header/sidebar/footer layout'. Enforces grid-template-areas on the container and grid-area on children for semantic, visual layout definition. Make sure to use this skill whenever generating page layouts with named regions. Not for flexbox layouts, grid-template-columns/rows only approaches, or JavaScript positioning."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: css-grid
  tags: [css, grid, grid-template-areas, grid-area, layout, semantic]
---

# Grid Template Areas

> Defina layouts usando grid-template-areas no container e grid-area nos filhos — o CSS vira um mapa visual do layout.

## Rules

1. **Use grid-template-areas para layouts semânticos** — cada string representa uma linha do grid, cada nome uma célula, porque o código se torna um mapa visual legível do layout
2. **Nomeie áreas pelo significado, não por letras** — `header`, `main`, `aside`, `footer` em vez de `A`, `B`, `C`, `D`, porque nomes semânticos são autodocumentados
3. **Repita o nome da área para expandir** — `"header header header"` faz o header ocupar 3 colunas, porque a repetição define o span visualmente
4. **grid-area no filho não precisa de aspas** — `grid-area: header` e não `grid-area: "header"`, porque é um identificador CSS, não uma string
5. **Não precisa definir grid-template-columns/rows explicitamente** — o grid infere frações iguais a partir do template areas, porque as áreas já definem a estrutura
6. **Cada filho recebe apenas grid-area** — sem grid-column/grid-row, porque o posicionamento já está no container via areas

## How to write

### Layout clássico (header, main, aside, footer)

```css
.container {
  display: grid;
  grid-template-areas:
    "header header header"
    "main   main   aside"
    "footer footer footer";
}

.header { grid-area: header; }
.main   { grid-area: main; }
.aside  { grid-area: aside; }
.footer { grid-area: footer; }
```

### Layout simples com letras (prototipagem rápida)

```css
.container {
  display: grid;
  grid-template-areas:
    "A B B"
    "A C D";
}

.item-a { grid-area: A; }
.item-b { grid-area: B; }
.item-c { grid-area: C; }
.item-d { grid-area: D; }
```

## Example

**Before (posicionamento por linhas):**
```css
.container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto 1fr auto;
}
.header { grid-column: 1 / 4; grid-row: 1; }
.main   { grid-column: 1 / 3; grid-row: 2; }
.aside  { grid-column: 3;     grid-row: 2; }
.footer { grid-column: 1 / 4; grid-row: 3; }
```

**After (com grid-template-areas):**
```css
.container {
  display: grid;
  grid-template-areas:
    "header header header"
    "main   main   aside"
    "footer footer footer";
}
.header { grid-area: header; }
.main   { grid-area: main; }
.aside  { grid-area: aside; }
.footer { grid-area: footer; }
```

## Heuristics

| Situação | Faça |
|----------|------|
| Layout com regiões nomeadas (header, sidebar, content) | Use grid-template-areas |
| Grid numérico/repetitivo (galeria de cards) | Use grid-template-columns com repeat() |
| Precisa visualizar o layout no código | grid-template-areas — o CSS é o mapa |
| Layout flexível com frações iguais | Omita columns/rows, deixe o areas inferir |
| Prototipagem rápida | Use letras (A, B, C), depois renomeie |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `grid-area: "header"` (com aspas no filho) | `grid-area: header` |
| `grid-column: 1/4` junto com grid-template-areas | `grid-area: header` (areas já posiciona) |
| Nomes genéricos: `area1`, `area2`, `area3` | Nomes semânticos: `header`, `main`, `footer` |
| Areas retangulares não-contíguas (L-shape) | Apenas retângulos contíguos por área |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| `grid-area` nao funciona | Aspas no valor do filho: `grid-area: "header"` | Remova aspas: `grid-area: header` (e identificador CSS, nao string) |
| Area nao expande como esperado | Nome nao repetido no template | Repita o nome: `"header header header"` para ocupar 3 colunas |
| Erro de layout com forma L | Areas nao-retangulares nao sao permitidas | Use apenas retangulos contiguos por area nomeada |
| `grid-column` conflita com areas | Misturando posicionamento por linhas e por areas | Use apenas `grid-area` quando `grid-template-areas` esta definido |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações