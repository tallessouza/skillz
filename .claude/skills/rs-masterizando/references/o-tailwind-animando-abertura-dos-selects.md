---
name: rs-tailwind-animando-selects
description: "Applies custom Tailwind CSS animation and keyframe configuration when building dropdown menus, selects, or any open/close UI components. Use when user asks to 'animate a dropdown', 'add open/close animation', 'configure tailwind keyframes', 'animate a select', or 'create slide animations'. Covers extending tailwind.config with custom keyframes, animation properties, cubic-bezier easing, and translateY transforms. Make sure to use this skill whenever adding animations to Radix UI selects or similar headless UI components. Not for CSS-in-JS animations, Framer Motion, React Spring, or general CSS transitions."
---

# Animacoes Customizadas no Tailwind para Selects/Dropdowns

> Estenda o tailwind.config com keyframes e animations customizados para controlar abertura e fechamento de menus.

## Rules

1. **Crie keyframes E animation juntos** — keyframes definem QUAIS propriedades mudam, animation define duracao e easing, porque um sem o outro nao funciona
2. **Use o mesmo nome em keyframes e animation** — `slideDownAndFade` nos dois lugares, porque facilita localizar e manter
3. **Combine opacidade com translateY** — opacidade sozinha e plana; o translate de -2px cria um movimento sutil de "descendo", porque micro-movimentos dao percepcao de fluidez
4. **Use cubic-bezier em vez de linear** — `cubic-bezier(0.16, 1, 0.3, 1)` produz uma desaceleracao natural, porque linear parece mecanico
5. **Duracoes entre 300-400ms para menus** — 1s e lento demais para UI, 100ms e imperceptivel, porque 400ms e o sweet spot para aberturas
6. **Elementos removidos da DOM nao animam no fechamento** — Radix Select remove o conteudo ao fechar; sem `forceMount` (indisponivel no Select), a animacao de saida nao funciona, porque nao ha elemento para animar

## How to write

### tailwind.config — keyframes + animation

```typescript
// tailwind.config.ts → theme.extend
export default {
  theme: {
    extend: {
      keyframes: {
        slideDownAndFade: {
          from: { opacity: '0', transform: 'translateY(-2px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        // slideUpAndFade: so usar se o componente suportar forceMount
        // slideUpAndFade: {
        //   from: { opacity: '1', transform: 'translateY(0)' },
        //   to: { opacity: '0', transform: 'translateY(-2px)' },
        // },
      },
      animation: {
        slideDownAndFade:
          'slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        // slideUpAndFade:
        //   'slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
}
```

### Aplicar no componente

```tsx
// No Select.Content do Radix (ou equivalente)
<SelectPrimitive.Content className="animate-slideDownAndFade ...">
  {children}
</SelectPrimitive.Content>
```

## Example

**Before (abertura seca, sem animacao):**
```tsx
<SelectPrimitive.Content className="rounded-lg border bg-white shadow-sm">
  {children}
</SelectPrimitive.Content>
```

**After (com animacao de slide + fade):**
```tsx
<SelectPrimitive.Content className="animate-slideDownAndFade rounded-lg border bg-white shadow-sm">
  {children}
</SelectPrimitive.Content>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Componente remove elemento da DOM ao fechar | Anime apenas a abertura, ou use Framer Motion/React Spring para interceptar a remocao |
| Radix com `forceMount` disponivel | Pode criar animacao de entrada E saida |
| Menu/dropdown/tooltip/popover | slideDown + fade e o padrao mais natural |
| Duracao parece lenta | Reduza para 300ms, nunca abaixo de 200ms |
| Precisa testar a animacao | Coloque 1s temporariamente para ver em camera lenta |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `animation: linear` para menus | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Duracao de 1s em producao | `400ms` ou `0.4s` |
| Apenas opacity sem transform | `opacity` + `translateY(-2px)` |
| Nome diferente no keyframe vs animation | Mesmo nome nos dois |
| Animacao de saida sem forceMount | Apenas animacao de entrada, ou usar lib JS |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/masterizando/rs-masterizando-o-tailwind-animando-abertura-dos-selects/references/deep-explanation.md)
- [Code examples](../../../data/skills/masterizando/rs-masterizando-o-tailwind-animando-abertura-dos-selects/references/code-examples.md)
