---
name: rs-full-stack-alinhamentos-content
description: "Applies CSS Grid content alignment properties (align-content, justify-content, place-content) when building grid layouts. Use when user asks to 'center a grid', 'align grid items', 'distribute space in grid', 'create a grid layout', or 'use place-content'. Make sure to use this skill whenever generating CSS Grid code that needs content distribution or alignment. Not for flexbox alignment, individual item alignment (align-self/justify-self), or grid-template definitions."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [css, grid, align-content, justify-content, layout]
---

# Alinhamentos de Content no CSS Grid

> Usar align-content, justify-content e place-content para distribuir o conteudo do grid dentro do container.

## Rules

1. **align-content controla o eixo Y (vertical)** — distribui as rows dentro do container, porque o grid pode ter espaco vertical sobrando
2. **justify-content controla o eixo X (horizontal)** — distribui as columns dentro do container, porque o grid pode ter espaco horizontal sobrando
3. **place-content e o shorthand dos dois** — `place-content: center` aplica center para align E justify ao mesmo tempo, porque evita duplicacao
4. **Content so tem efeito quando sobra espaco** — se o grid preenche todo o container (fr units), content alignment nao faz nada, porque nao ha espaco livre para distribuir
5. **start e o padrao** — nao precisa declarar start explicitamente, porque ja e o comportamento default

## How to write

### Centralizar grid no container

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 100px);
  grid-template-rows: repeat(3, 100px);
  height: 100vh;
  /* Centraliza nos dois eixos */
  place-content: center;
}
```

### Distribuir espaco entre elementos

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 200px);
  gap: 8px;
  height: 100vh;
  align-content: space-between;    /* Vertical: sem espaco nas pontas */
  justify-content: space-evenly;   /* Horizontal: espaco igual em tudo */
}
```

## Example

**Before (grid grudado no canto):**

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 100px);
  grid-template-rows: repeat(3, 100px);
  height: 100vh;
  width: 100vw;
  background: black;
  gap: 8px;
}
```

**After (grid centralizado):**

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 100px);
  grid-template-rows: repeat(3, 100px);
  height: 100vh;
  width: 100vw;
  background: black;
  gap: 8px;
  place-content: center;
}
```

## Heuristics

| Situacao | Usar |
|----------|------|
| Centralizar tudo no container | `place-content: center` |
| Empurrar conteudo pro final | `place-content: end` |
| Espaco igual entre items, sem nas bordas | `space-between` |
| Espaco ao redor de cada item | `space-around` |
| Espaco perfeitamente igual em tudo | `space-evenly` |
| Alinhar so vertical | `align-content` |
| Alinhar so horizontal | `justify-content` |
| Alinhar ambos com mesmo valor | `place-content` |

## Anti-patterns

| Nunca escreva | Escreva instead |
|---------------|-----------------|
| `align-content: center; justify-content: center;` | `place-content: center;` |
| `place-content` com grid usando `1fr` columns/rows | Use tamanhos fixos ou `auto` para que sobre espaco |
| `align-content: start` explicitamente | Omita — ja e o padrao |

## Valores disponiveis

| Valor | Comportamento |
|-------|--------------|
| `start` | Inicio (padrao) |
| `center` | Centro do eixo |
| `end` | Final do eixo |
| `space-between` | Espaco entre, sem nas pontas |
| `space-around` | Espaco ao redor de cada grupo |
| `space-evenly` | Espaco perfeitamente uniforme |

## Troubleshooting

| Problema | Causa provável | Solução |
|----------|---------------|---------|
| `place-content: center` não faz nada | Grid usa `1fr` que preenche todo o espaço | Troque para tamanhos fixos ou `auto` para criar espaço sobrando |
| Itens não se distribuem com `space-between` | Grid sem altura/largura definida no container | Adicione `height: 100vh` ou dimensão explícita no container |
| Só um eixo centraliza | Usou `align-content` ou `justify-content` isolado | Use `place-content: center` para centralizar ambos os eixos |
| Grid centralizado mas itens desalinhados internamente | Confusão entre content e items | Use `place-items` para alinhar itens dentro das células |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre eixos, quando content alignment tem efeito, e analogias visuais
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes