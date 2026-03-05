---
name: rs-full-stack-ajustando-conteudo-card
description: "Enforces semantic HTML card structure using figure/figcaption and CSS techniques for card content layout. Use when user asks to 'create a card', 'build a news card', 'style card content', 'add caption to image', or 'use figure tag'. Applies rules: figure over div for media+caption, inline-block for tags, box-shadow for depth, position absolute for overlay captions. Make sure to use this skill whenever building card components with images and text overlays. Not for general layout, grid systems, or non-card components."
---

# Ajustando o Conteúdo do Card

> Estruture cards com `<figure>` e `<figcaption>` ao invés de divs genéricas, porque a semântica comunica a relação entre mídia e legenda.

## Rules

1. **Use `<figure>` ao invés de `<div>` para cards com mídia** — porque figure comunica semanticamente que o conteúdo (imagem, vídeo, áudio) tem uma descrição associada via figcaption
2. **Use `<figcaption>` para o texto sobreposto** — posicione com `position: absolute` e `bottom: 0` para ancorar o texto na base do card
3. **Use `display: inline-block` para tags/badges** — porque inline mantém o tamanho do texto e block permite padding vertical correto, inline-block dá os dois comportamentos
4. **Crie utility classes para tamanhos de fonte** — `text-2xl`, `text-lg`, `text-sm` usando CSS variables, porque facilita consistência e reutilização
5. **Use `box-shadow` para profundidade** — entenda os 4 valores: offset-x, offset-y, blur-radius e cor (RGBA para transparência)
6. **Gerencie overflow com cuidado** — `overflow: hidden` esconde conteúdo que transborda; posicione elementos internos com absolute para que apareçam dentro da área visível

## How to write

### Estrutura HTML do card

```html
<figure class="card">
  <img src="image.jpg" alt="Descrição" />
  <figcaption>
    <span class="content-tag">ROBÓTICA</span>
    <h2 class="text-2xl">Título do card aqui</h2>
  </figcaption>
</figure>
```

### Figcaption posicionado na base

```css
.card {
  position: relative;
  overflow: hidden;
}

.card figcaption {
  position: absolute;
  bottom: 0;
  padding: 24px;
}

.card figcaption h2 {
  margin-top: 8px;
}
```

### Content tag com inline-block

```css
.content-tag {
  display: inline-block;
  background-color: var(--brand-color-dark);
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 10px;
  line-height: 1.2;
  font-family: var(--font-family);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text-color-primary);
}
```

### Box-shadow para profundidade

```css
.content-tag {
  /* offset-x | offset-y | blur-radius | color */
  box-shadow: 0px 4px 16px rgba(17, 18, 19, 0.4);
}
```

## Example

**Before (divs genéricas, sem semântica):**
```html
<div class="card">
  <img src="robots.jpg" />
  <div class="card-text">
    <div class="tag">robótica</div>
    <div class="title">Os robôs já chegaram</div>
  </div>
</div>
```

**After (semântico com figure):**
```html
<figure class="card">
  <img src="robots.jpg" alt="Robôs modernos" />
  <figcaption>
    <span class="content-tag">ROBÓTICA</span>
    <h2 class="text-2xl">Os robôs já chegaram</h2>
  </figcaption>
</figure>
```

## Heuristics

| Situação | Faça |
|----------|------|
| Card com imagem + texto descritivo | Use `<figure>` + `<figcaption>` |
| Tag/badge que precisa de padding | Use `display: inline-block` |
| Texto não aparece no card | Verifique `overflow: hidden` no pai e posicionamento do figcaption |
| Precisa de profundidade visual | Use `box-shadow` com RGBA para transparência |
| Utility de fonte reutilizável | Crie classes como `text-2xl`, `text-lg`, `text-sm` com CSS variables |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| `<div>` para card com mídia+legenda | `<figure>` com `<figcaption>` |
| `display: inline` com padding vertical | `display: inline-block` |
| `display: block` em tags/badges | `display: inline-block` para manter tamanho do texto |
| Cores de sombra sem transparência `#000` | RGBA com alpha: `rgba(17,18,19,0.4)` |
| Font-size hardcoded em cada elemento | Utility classes: `.text-2xl`, `.text-lg` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre figure vs div, inline-block behavior e box-shadow
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-ajustando-o-conteudo-do-card/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-ajustando-o-conteudo-do-card/references/code-examples.md)
