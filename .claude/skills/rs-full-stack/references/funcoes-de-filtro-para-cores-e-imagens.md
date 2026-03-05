---
name: rs-full-stack-css-filter-functions
description: "Applies CSS filter functions (blur, brightness, contrast, drop-shadow, opacity, invert, hue-rotate, saturate, sepia) when styling elements or images. Use when user asks to 'add blur', 'adjust brightness', 'apply filter', 'create hover effect', 'style an image', or 'add shadow with filter'. Combines multiple filters for dynamic visual effects. Make sure to use this skill whenever generating CSS that involves visual transformations on images or elements. Not for CSS layout, positioning, or box-shadow (use box-shadow property instead of filter: drop-shadow when appropriate)."
---

# Funções de Filtro CSS

> Aplique filtros visuais com a propriedade `filter`, combinando múltiplas funções para criar efeitos dinâmicos em elementos e imagens.

## Rules

1. **Use `filter` como propriedade principal** — todas as funções de filtro são valores de `filter`, porque é a API unificada do CSS para transformações visuais
2. **Combine filtros na mesma declaração** — `filter: opacity(0.5) blur(2px)` e não duas propriedades `filter` separadas, porque a segunda sobrescreve a primeira
3. **Use `unset` no hover para revelar** — `filter: unset` remove todos os filtros aplicados, criando efeitos de revelação interativos
4. **Brightness default é 1** — valores > 1 aumentam brilho, < 1 escurecem até preto em 0, porque 1 é o estado natural do elemento
5. **Hue-rotate trabalha em graus (deg)** — gira as cores na roda HSL de 0deg a 360deg, porque segue o modelo de cores circular
6. **Prefira `drop-shadow` no filter para formas irregulares** — `filter: drop-shadow()` respeita transparência, `box-shadow` não

## How to write

### Filtros individuais

```css
/* Blur — embaça o elemento (px ou rem) */
.blurred { filter: blur(10px); }

/* Brightness — brilho (1 = normal, 2 = dobro, 0 = preto) */
.bright { filter: brightness(2); }

/* Contrast — contraste (1 = normal, <1 = pastel, >1 = intenso) */
.contrasted { filter: contrast(1.5); }

/* Opacity — transparência (1 = visível, 0 = invisível) */
.faded { filter: opacity(0.3); }

/* Invert — inverte cores (preto↔branco, azul↔vermelho) */
.inverted { filter: invert(1); }

/* Hue-rotate — gira cores na roda HSL */
.rotated { filter: hue-rotate(200deg); }

/* Saturate — saturação (0 = preto e branco, >1 = vívido) */
.desaturated { filter: saturate(0); }

/* Sepia — efeito sépia vintage */
.vintage { filter: sepia(1); }
```

### Drop-shadow no filter

```css
.shadow {
  /* drop-shadow(offsetX offsetY blur cor) */
  filter: drop-shadow(5px 5px 1rem grey);
}
```

### Combo de filtros + hover reveal

```css
.card {
  filter: opacity(0.1) blur(2px);
  transition: filter 0.3s ease;
}

.card:hover {
  filter: unset;
}
```

## Example

**Before (efeito estático sem interação):**
```css
.image-card {
  box-shadow: 2px 2px 5px grey;
}
```

**After (filtros combinados com hover reveal):**
```css
.image-card {
  filter: opacity(0.5) blur(2px) drop-shadow(5px 5px 1rem grey);
  transition: filter 0.3s ease;
}

.image-card:hover {
  filter: unset;
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Imagem precisa ficar embaçada no fundo | `filter: blur(10px)` |
| Elemento some e aparece no hover | `filter: opacity(0.1)` + `:hover { filter: unset }` |
| Precisa de sombra em PNG com transparência | `filter: drop-shadow()` em vez de `box-shadow` |
| Quer mudar cor sem alterar o CSS original | `filter: hue-rotate(Xdeg)` |
| Imagem precisa ficar preto e branco | `filter: saturate(0)` ou `filter: grayscale(1)` |
| Efeito vintage/retrô | `filter: sepia(1)` |
| Combinar múltiplos efeitos | Todos na mesma propriedade `filter` separados por espaço |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| Duas declarações `filter` separadas | Uma declaração com múltiplos valores |
| `filter: none` para reset no hover | `filter: unset` |
| `box-shadow` em imagens PNG transparentes | `filter: drop-shadow()` |
| `brightness(0)` achando que remove filtro | `brightness(1)` é o padrão neutro |
| `hue-rotate(200)` sem unidade | `hue-rotate(200deg)` sempre com deg |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre cada filtro, a roda HSL, e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-funcoes-de-filtro-para-cores-e-imagens/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-funcoes-de-filtro-para-cores-e-imagens/references/code-examples.md)
