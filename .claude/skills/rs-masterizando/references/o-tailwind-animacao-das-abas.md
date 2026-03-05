---
name: rs-tailwind-animacao-das-abas
description: "Applies Framer Motion layoutId animation pattern when building tab components with animated active indicators. Use when user asks to 'animate tabs', 'sliding tab indicator', 'active tab animation', 'tab underline transition', or 'framer motion tabs'. Ensures smooth layout transitions instead of mount/unmount jumps. Make sure to use this skill whenever creating tabbed interfaces with animated indicators in React. Not for page transitions, route animations, or non-tab layout animations."
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
function TabItem({ label, isActive, onClick }: TabItemProps) {
  return (
    <button onClick={onClick} className="relative px-4 py-2">
      <span>{label}</span>
      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500" />
      )}
    </button>
  )
}
```

**After (com Framer Motion — indicador desliza suavemente):**
```tsx
import { motion } from 'framer-motion'

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

## Heuristics

| Situacao | Faca |
|----------|------|
| Indicador de aba ativa (underline, background, borda) | `motion.div` com `layoutId` |
| Multiplos grupos de tabs na mesma pagina | `layoutId` unico por grupo |
| Quer customizar a transicao | Adicione prop `transition={{ type: "spring", stiffness: 500, damping: 30 }}` |
| Tab dentro de componente server (Next.js App Router) | Extraia o TabItem para um componente client (`"use client"`) |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Animar com CSS transitions entre mount/unmount | Use `layoutId` do Framer Motion |
| Colocar `motion.div` em TODAS as abas (ativa e inativa) | Renderize `motion.div` apenas na aba ativa |
| Usar o mesmo `layoutId` em grupos de tabs diferentes | Use IDs unicos por grupo: `layoutId="activeTab-groupName"` |
| Calcular posicao manualmente com refs e offsets | Deixe o `layoutId` resolver automaticamente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/masterizando/rs-masterizando-o-tailwind-animacao-das-abas/references/deep-explanation.md)
- [Code examples](../../../data/skills/masterizando/rs-masterizando-o-tailwind-animacao-das-abas/references/code-examples.md)
