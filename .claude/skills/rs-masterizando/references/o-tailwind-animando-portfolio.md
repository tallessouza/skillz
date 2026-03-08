---
name: rs-tailwind-animando-portfolio
description: "Applies AutoAnimate library for automatic list/grid animations in React components. Use when user asks to 'animate a list', 'add animations to items', 'animate portfolio', 'smooth add/remove transitions', or 'auto animate elements'. Configures useAutoAnimate hook with parent ref pattern for enter/exit animations. Make sure to use this skill whenever adding appear/disappear animations to dynamic lists or grids in React. Not for complex gesture animations, scroll animations, or CSS keyframe animations — use Framer Motion or CSS for those."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: masterizando-o-tailwind
  module: animacoes
  tags: [tailwind, react, animation, css-grid, flexbox]
---

# AutoAnimate em Listas e Grids React

> Para animacoes de aparecer/sumir em listas dinamicas, use AutoAnimate — uma unica ref no elemento pai e tudo anima automaticamente.

## Rules

1. **Use AutoAnimate para animacoes de entrada/saida** — listas, grids, acordeoes, porque ele resolve o caso mais comum (add/remove) com zero configuracao
2. **Aplique a ref no elemento PAI** — o div/ul que envolve os itens dinamicos recebe `ref={parent}`, porque AutoAnimate observa filhos diretos do elemento referenciado
3. **Respeite prefers-reduced-motion** — nunca use `disrespectUserMotionPreference: true`, porque usuarios configuram isso por necessidade de acessibilidade
4. **Use Framer Motion para animacoes complexas** — gestos, drag, layout animations, porque AutoAnimate so cobre aparecer/sumir
5. **Use CSS puro primeiro** — transicoes simples de cor, tamanho, opacidade nao precisam de biblioteca, porque CSS ja resolve sem bundle extra

## How to write

### Setup basico

```typescript
import { useAutoAnimate } from '@formkit/auto-animate/react'

export function FileList() {
  const [parent] = useAutoAnimate()

  return (
    <div ref={parent}>
      {items.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  )
}
```

### Com configuracao de easing e duracao

```typescript
const [parent] = useAutoAnimate({
  duration: 300,
  easing: 'ease-in-out',
})
```

## Example

**Before (sem animacao — itens aparecem/somem "secos"):**
```typescript
export function FileList({ files, onRemove }) {
  return (
    <div className="flex flex-col gap-2">
      {files.map(file => (
        <FileItem key={file.name} file={file} onRemove={onRemove} />
      ))}
    </div>
  )
}
```

**After (com AutoAnimate):**
```typescript
import { useAutoAnimate } from '@formkit/auto-animate/react'

export function FileList({ files, onRemove }) {
  const [parent] = useAutoAnimate()

  return (
    <div ref={parent} className="flex flex-col gap-2">
      {files.map(file => (
        <FileItem key={file.name} file={file} onRemove={onRemove} />
      ))}
    </div>
  )
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Lista com add/remove dinamico | AutoAnimate no pai |
| Grid com reordenacao | AutoAnimate no pai |
| Acordeao expand/collapse | AutoAnimate no pai |
| Animacao de drag/gesture | Framer Motion |
| Hover/focus transitions | CSS puro com Tailwind |
| Animacao de layout compartilhado | Framer Motion layoutId |

## Anti-patterns

| Nunca faca | Faca instead |
|------------|--------------|
| `disrespectUserMotionPreference: true` | Deixe o padrao (respeita acessibilidade) |
| Ref no item filho individual | Ref no elemento PAI que envolve os itens |
| AutoAnimate para slide/drag | Framer Motion para gestos complexos |
| Instalar Framer Motion so para add/remove em lista | AutoAnimate — muito mais leve |
## Troubleshooting

### Layout quebrando no mobile
**Symptom:** Elementos ficam fora da tela ou empilhados de forma inesperada no mobile.
**Cause:** Grid com colunas fixas nao se adapta a telas pequenas sem breakpoints.
**Fix:** Use `flex flex-col` como base mobile e `lg:grid lg:grid-cols-*` apenas no desktop.

### Espacamento inconsistente entre secoes
**Symptom:** Alguns elementos tem mais espaco que outros apesar de usar o mesmo gap.
**Cause:** Mistura de `space-y` e `gap` no mesmo container, ou margins conflitando.
**Fix:** Escolha `gap` (com flex/grid) ou `space-y` (com flow layout), nunca ambos no mesmo container.

## Deep reference library

- [deep-explanation.md](../../../data/skills/masterizando-o-tailwind/rs-masterizando-o-tailwind-animando-portfolio/references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](../../../data/skills/masterizando-o-tailwind/rs-masterizando-o-tailwind-animando-portfolio/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
