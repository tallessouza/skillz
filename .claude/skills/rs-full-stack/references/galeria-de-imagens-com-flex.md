---
name: rs-full-stack-galeria-imagens-flex
description: "Applies flexbox image gallery patterns when building photo grids or image galleries with CSS. Use when user asks to 'create a gallery', 'display images in a grid', 'layout photos', 'image gallery with flex', or 'photo grid layout'. Enforces flex-wrap, object-fit cover, consistent sizing, and proper gap/padding. Make sure to use this skill whenever creating any image gallery or photo grid component. Not for CSS Grid layouts, carousels, sliders, or single image display."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: css-flexbox
  tags: [css, flexbox, gallery, images, flex-wrap, object-fit]
---

# Galeria de Imagens com Flexbox

> Ao criar galerias de imagens, use flexbox com wrap para que as imagens se reorganizem automaticamente conforme o espaco disponivel.

## Rules

1. **Use flex-wrap: wrap** — sem wrap, flex coloca tudo numa unica linha e extrapola o container, porque o comportamento padrao do flex e nao quebrar linha
2. **Defina tamanho fixo nas imagens** — largura e altura explicitas (ex: 286x286px), porque sem dimensoes definidas as imagens ficam com tamanhos inconsistentes
3. **Sempre use object-fit: cover** — quando imagens nao sao quadradas perfeitas, cover garante que preencham o espaco sem distorcao, porque preserva o aspect ratio cortando o excesso
4. **Use gap para espacamento entre imagens** — gap e mais limpo que margin em contextos flex, porque aplica espacamento uniforme sem precisar resetar margens nas bordas
5. **Use padding-block para espacamento vertical do container** — separa o conteudo das bordas superior e inferior do container, porque padding-block respeita writing modes

## How to write

### Container da galeria

```css
main {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  padding-block: 24px;
}
```

### Imagens dentro da galeria

```css
main img {
  width: 286px;
  height: 286px;
  object-fit: cover;
}
```

### HTML estrutural

```html
<main class="container">
  <img src="./assets/images/foto-1.png" alt="Descricao da foto 1" />
  <img src="./assets/images/foto-2.png" alt="Descricao da foto 2" />
  <img src="./assets/images/foto-3.png" alt="Descricao da foto 3" />
  <!-- mais imagens -->
</main>
```

## Example

**Before (sem flex-wrap, sem dimensoes):**

```css
main {
  display: flex;
}

main img {
  /* sem dimensoes definidas — imagens extrapolam o container */
}
```

**After (com esta skill aplicada):**

```css
main {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  padding-block: 24px;
}

main img {
  width: 286px;
  height: 286px;
  object-fit: cover;
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Imagens de tamanhos variados | object-fit: cover com dimensoes fixas |
| Galeria precisa ser responsiva | flex-wrap: wrap — imagens reorganizam automaticamente |
| Espacamento entre imagens | gap no container flex, nunca margin nas imagens |
| Espacamento vertical do bloco | padding-block no container |
| Muitas imagens repetitivas | Estilize via seletor `main img`, nao classes individuais |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `display: flex` sem `flex-wrap: wrap` em galerias | `display: flex; flex-wrap: wrap` |
| `margin` em cada imagem para espacamento | `gap: 24px` no container |
| Imagens sem dimensoes fixas em grid | `width: 286px; height: 286px` |
| Imagens sem `object-fit` quando nao sao quadradas | `object-fit: cover` |
| `padding: 24px` quando so precisa vertical | `padding-block: 24px` |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Imagens extrapolam o container | Falta `flex-wrap: wrap` | Adicione `flex-wrap: wrap` no container flex |
| Imagens distorcidas | Falta `object-fit: cover` | Adicione `object-fit: cover` nas imagens com dimensoes fixas |
| Espacamento irregular entre imagens | Usando `margin` em vez de `gap` | Use `gap` no container flex em vez de margin nas imagens |
| Imagens com tamanhos inconsistentes | Sem dimensoes fixas definidas | Defina `width` e `height` explicitos nas imagens |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre flex-wrap, object-fit e organizacao de galerias
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes