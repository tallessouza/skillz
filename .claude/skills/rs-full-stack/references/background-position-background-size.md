---
name: rs-full-stack-bg-position-size
description: "Applies CSS background-position and background-size patterns when styling elements with background images. Use when user asks to 'add a background image', 'style a hero section', 'center a background', 'cover background', or any CSS background task. Enforces correct axis order (X then Y), proper use of contain vs cover, and shorthand syntax. Make sure to use this skill whenever working with CSS background images. Not for CSS colors, gradients without images, or JavaScript image manipulation."
---

# Background-Position e Background-Size

> Ao trabalhar com imagens de fundo em CSS, use background-position para posicionar nos eixos X/Y e background-size para controlar dimensionamento — priorizando contain e cover sobre valores fixos.

## Rules

1. **Use o shorthand background-position** — `background-position: right bottom` em vez de declarar position-x e position-y separadamente, porque reduz linhas e é o padrão da indústria
2. **Ordem do shorthand: X primeiro, Y segundo** — `background-position: center top` (X=center, Y=top), porque CSS interpreta nessa ordem e trocar pode causar confusão mesmo que o browser tente corrigir
3. **Prefira cover para hero sections e banners** — `background-size: cover` garante cobertura total do container sem espaços vazios, porque a imagem escala e recorta conforme necessário
4. **Use contain quando a imagem inteira deve ser visível** — `background-size: contain` adapta a imagem ao espaço disponível sem cortar, porque preserva a imagem completa
5. **Desative repeat ao posicionar** — `background-repeat: no-repeat` antes de usar position, porque repetição mascara o efeito do posicionamento
6. **Evite tamanhos fixos em pixels para backgrounds responsivos** — use `cover`, `contain` ou porcentagens em vez de `200px`, porque valores fixos quebram em telas diferentes

## How to write

### Hero section com cover

```css
.hero {
  background-image: url('/images/hero.jpg');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
}
```

### Imagem posicionada com contain

```css
.card-bg {
  background-image: url('/images/pattern.png');
  background-repeat: no-repeat;
  background-position: right top;
  background-size: contain;
}
```

## Example

**Before (problemas comuns):**

```css
.banner {
  background-image: url('/bg.jpg');
  background-position-x: center;
  background-position-y: top;
  background-size: 500px;
}
```

**After (com esta skill aplicada):**

```css
.banner {
  background-image: url('/bg.jpg');
  background-repeat: no-repeat;
  background-position: center top;
  background-size: cover;
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Imagem deve cobrir todo o container | `background-size: cover` |
| Imagem deve aparecer inteira sem cortes | `background-size: contain` |
| Centralizar imagem de fundo | `background-position: center center` ou apenas `center` |
| Posicionar no canto inferior direito | `background-position: right bottom` |
| Layout responsivo | Nunca use valores fixos em px para size |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `background-position-x: right; background-position-y: bottom;` | `background-position: right bottom;` |
| `background-size: 1920px;` (para banners) | `background-size: cover;` |
| `background-position: bottom center;` (Y antes de X) | `background-position: center bottom;` |
| Usar position sem `no-repeat` | Sempre declarar `background-repeat: no-repeat` antes |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre eixos X/Y, inteligência do browser, e diferenças contain vs cover
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações responsivas

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-background-position-background-size/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-background-position-background-size/references/code-examples.md)
