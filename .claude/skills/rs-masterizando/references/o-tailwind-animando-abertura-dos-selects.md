---
name: rs-tailwind-animando-selects
description: "Applies custom Tailwind CSS animation and keyframe configuration when building dropdown menus, selects, or any open/close UI components. Use when user asks to 'animate a dropdown', 'add open/close animation', 'configure tailwind keyframes', 'animate a select', or 'create slide animations'. Covers extending tailwind.config with custom keyframes, animation properties, cubic-bezier easing, and translateY transforms. Make sure to use this skill whenever adding animations to Radix UI selects or similar headless UI components. Not for CSS-in-JS animations, Framer Motion, or React Spring (use rs-tailwind-animacao-das-abas for Framer Motion)."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: masterizando-o-tailwind
  module: animacoes
  tags: [tailwind, animation, keyframes, dropdown, select, radix, css]
---

# Animacoes Customizadas no Tailwind para Selects/Dropdowns

> Estenda o tailwind.config com keyframes e animations customizados para controlar abertura e fechamento de menus.

## Rules

1. **Crie keyframes E animation juntos** — keyframes definem QUAIS propriedades mudam, animation define duracao e easing, porque um sem o outro nao funciona
2. **Use o mesmo nome em keyframes e animation** — `slideDownAndFade` nos dois, porque facilita localizar e manter
3. **Combine opacidade com translateY** — opacidade sozinha e plana; o translate de -2px cria movimento sutil, porque micro-movimentos dao percepcao de fluidez
4. **Use cubic-bezier em vez de linear** — `cubic-bezier(0.16, 1, 0.3, 1)` produz desaceleracao natural, porque linear parece mecanico
5. **Duracoes entre 300-400ms para menus** — 1s e lento, 100ms e imperceptivel, porque 400ms e o sweet spot
6. **Elementos removidos da DOM nao animam no fechamento** — Radix Select remove conteudo ao fechar; sem `forceMount`, animacao de saida nao funciona

## How to write

### tailwind.config — keyframes + animation

```typescript
export default {
  theme: {
    extend: {
      keyframes: {
        slideDownAndFade: {
          from: { opacity: '0', transform: 'translateY(-2px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        slideDownAndFade: 'slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
}
```

### Aplicar no componente

```tsx
<SelectPrimitive.Content className="animate-slideDownAndFade rounded-lg border bg-white shadow-sm">
  {children}
</SelectPrimitive.Content>
```

## Example

**Before (abertura seca):**
```tsx
<SelectPrimitive.Content className="rounded-lg border bg-white shadow-sm">
```

**After (com slide + fade):**
```tsx
<SelectPrimitive.Content className="animate-slideDownAndFade rounded-lg border bg-white shadow-sm">
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Componente remove da DOM ao fechar | Anime apenas a abertura |
| Radix com `forceMount` disponivel | Crie entrada E saida |
| Menu/dropdown/tooltip/popover | slideDown + fade e o padrao natural |
| Duracao parece lenta | Reduza para 300ms |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `animation: linear` para menus | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Duracao de 1s em producao | `400ms` |
| Apenas opacity sem transform | `opacity` + `translateY(-2px)` |
| Nome diferente no keyframe vs animation | Mesmo nome nos dois |

## Troubleshooting

### Animacao nao aparece no Select
**Symptom:** Classe `animate-slideDownAndFade` no componente mas sem animacao.
**Cause:** Keyframes e/ou animation nao foram adicionados ao `tailwind.config.ts`.
**Fix:** Verifique que ambos `keyframes.slideDownAndFade` e `animation.slideDownAndFade` estao em `theme.extend`.

### Animacao de fechamento nao funciona
**Symptom:** Dropdown abre com animacao mas fecha instantaneamente.
**Cause:** Radix Select remove conteudo da DOM ao fechar.
**Fix:** Use `forceMount` se disponivel. Caso contrario, aceite que apenas animacao de entrada e possivel com CSS puro.

## Deep reference library

- [deep-explanation.md](../../../data/skills/masterizando-o-tailwind/rs-masterizando-o-tailwind-animando-abertura-dos-selects/references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](../../../data/skills/masterizando-o-tailwind/rs-masterizando-o-tailwind-animando-abertura-dos-selects/references/code-examples.md) — Todos os exemplos de codigo expandidos
