---
name: rs-tailwind-animacao-das-abas
description: "Applies Framer Motion layoutId animation pattern when building tab components with animated active indicators. Use when user asks to 'animate tabs', 'sliding tab indicator', 'active tab animation', 'tab underline transition', or 'framer motion tabs'. Ensures smooth layout transitions instead of mount/unmount jumps. Make sure to use this skill whenever creating tabbed interfaces with animated indicators in React. Not for page transitions, route animations, or non-tab layout animations (use Framer Motion docs directly for those)."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: masterizando-o-tailwind
  module: animacoes
  tags: [tailwind, framer-motion, tabs, animation, layoutId, react]
---

# Animacao de Abas com Framer Motion layoutId

> Use `layoutId` do Framer Motion para transicionar elementos entre componentes em vez de recria-los do zero.

## Rules

1. **Use `motion.div` com `layoutId` para indicadores de aba ativa** — porque o Framer Motion interpola automaticamente a posicao entre instancias que compartilham o mesmo `layoutId`, criando a ilusao de deslizamento
2. **Cada `layoutId` deve ser unico por grupo de abas** — se dois grupos de tabs existirem na mesma pagina, use IDs distintos (`"activeTab-settings"`, `"activeTab-profile"`), porque IDs duplicados causam conflitos de animacao
3. **Renderize o `motion.div` condicionalmente apenas na aba ativa** — porque o Framer Motion precisa que apenas UMA instancia do `layoutId` exista por vez para calcular a transicao
4. **Instale framer-motion como dependencia** — `npm i framer-motion`, porque e uma dependencia de runtime, nao dev

## How to write

### Tab Item com indicador animado

```tsx
import { motion } from 'framer-motion'

interface TabItemProps {
  label: string
  isActive: boolean
  onClick: () => void
}

function TabItem({ label, isActive, onClick }: TabItemProps) {
  return (
    <button onClick={onClick} className="relative px-4 py-2">
      <span>{label}</span>
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500"
        />
      )}
    </button>
  )
}
```

## Example

**Before (sem animacao — indicador aparece/desaparece abruptamente):**
```tsx
{isActive && (
  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500" />
)}
```

**After (com Framer Motion — indicador desliza suavemente):**
```tsx
{isActive && (
  <motion.div
    layoutId="activeTab"
    className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500"
  />
)}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Indicador de aba ativa (underline, background, borda) | `motion.div` com `layoutId` |
| Multiplos grupos de tabs na mesma pagina | `layoutId` unico por grupo |
| Customizar a transicao | `transition={{ type: "spring", stiffness: 500, damping: 30 }}` |
| Tab em Server Component (Next.js App Router) | Extraia para componente client (`"use client"`) |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| CSS transitions entre mount/unmount | `layoutId` do Framer Motion |
| `motion.div` em TODAS as abas | Renderize apenas na aba ativa |
| Mesmo `layoutId` em grupos diferentes | IDs unicos por grupo |
| Calcular posicao com refs e offsets | Deixe `layoutId` resolver |

## Troubleshooting

### Indicador pula em vez de deslizar
**Symptom:** O underline aparece instantaneamente na nova aba sem animacao.
**Cause:** O `motion.div` esta em mais de uma aba ao mesmo tempo, ou o `layoutId` difere entre instancias.
**Fix:** Garanta que apenas a aba ativa renderiza o `motion.div` e que o `layoutId` e identico em todos os TabItems do grupo.

### Animacao conflita entre dois grupos de tabs
**Symptom:** O indicador "pula" entre grupos de tabs diferentes.
**Cause:** Dois grupos compartilham o mesmo `layoutId`.
**Fix:** Use IDs unicos por grupo: `layoutId="activeTab-settings"` e `layoutId="activeTab-profile"`.

## Deep reference library

- [deep-explanation.md](../../../data/skills/masterizando-o-tailwind/rs-masterizando-o-tailwind-animacao-das-abas/references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](../../../data/skills/masterizando-o-tailwind/rs-masterizando-o-tailwind-animacao-das-abas/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
