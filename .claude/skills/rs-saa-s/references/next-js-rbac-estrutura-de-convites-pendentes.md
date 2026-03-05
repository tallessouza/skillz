---
name: rs-saas-nextjs-estrutura-convites-pendentes
description: "Generates pending invites UI structure using shadcn/ui Popover in Next.js projects. Use when user asks to 'create invites list', 'build pending notifications popover', 'add invite accept/reject UI', or 'create popover with action buttons'. Applies pattern: Popover trigger with icon button, content with counter, invite details with accept/revoke actions. Make sure to use this skill whenever building notification-style popovers with action items in Next.js with shadcn/ui. Not for API logic, backend invite handling, or email notification systems."
---

# Estrutura de Convites Pendentes

> Construir uma UI de convites pendentes usando Popover do shadcn/ui com botao trigger, contador, detalhes do convite e botoes de acao.

## Prerequisites

- shadcn/ui instalado no projeto Next.js
- Componente Popover instalado: `npx shadcn-ui@latest add popover`
- Biblioteca `dayjs` com plugin `relativeTime` configurado
- Icones do `lucide-react`: `UserPlus2`, `Check`, `X`

## Steps

### Step 1: Instalar o componente Popover

```bash
npx shadcn-ui@latest add popover
```

### Step 2: Criar o componente PendingInvites

Criar pasta `components/pending-invites/` com `index.tsx`.

```tsx
import { useState } from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Check, UserPlus2, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

dayjs.extend(relativeTime)

export function PendingInvites() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="icon" variant="ghost">
          <UserPlus2 className="size-4" />
          <span className="sr-only">Pending invites</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80">
        <span className="block text-sm font-medium">
          Pending invites (2)
        </span>

        <div className="space-y-2">
          <p className="text-sm leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">John Doe</span>{' '}
            invited you to join{' '}
            <span className="font-medium text-foreground">Acme Inc</span>{' '}
            {dayjs('2024-01-15').fromNow()}
          </p>

          <div className="flex gap-1">
            <Button size="xs" variant="outline">
              <Check className="mr-1.5 size-3" />
              Accept
            </Button>
            <Button
              size="xs"
              variant="ghost"
              className="text-muted-foreground"
            >
              <X className="mr-1.5 size-3" />
              Revoke
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
```

### Step 3: Adicionar ao Header

Inserir `<PendingInvites />` no header, antes do `<ThemeSwitcher />`.

```tsx
import { PendingInvites } from './pending-invites'

// Dentro do header:
<PendingInvites />
<ThemeSwitcher />
```

## Output format

Componente renderiza:
1. Botao com icone `UserPlus2` (ghost, icon-only com sr-only label)
2. Popover com largura `w-80` (320px) contendo:
   - Titulo "Pending invites (N)" em `text-sm font-medium`
   - Lista de convites com nome do autor, organizacao e tempo relativo
   - Par de botoes Accept (outline) e Revoke (ghost) por convite

## Heuristics

| Situacao | Faca |
|----------|------|
| Botao trigger sem texto visivel | Use `sr-only` span para acessibilidade |
| Popover com muito texto | Reduza largura (w-80 em vez de w-96) para melhor legibilidade |
| Acoes por item da lista | Agrupe em div com `gap-1`, use `size="xs"` nos botoes |
| Datas de convite | Use `dayjs` com `relativeTime` plugin para exibir tempo relativo |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Popover sem `asChild` no trigger | Use `asChild` para compor com Button |
| Icone sem label de acessibilidade | Adicione `<span className="sr-only">` |
| Largura fixa em pixels no PopoverContent | Use classes Tailwind (`w-80`) |
| Botoes de acao sem diferenciacao visual | Accept = `outline`, Revoke = `ghost` com `text-muted-foreground` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/saa-s/rs-saa-s-next-js-rbac-estrutura-de-convites-pendentes/references/deep-explanation.md)
- [Code examples](../../../data/skills/saa-s/rs-saa-s-next-js-rbac-estrutura-de-convites-pendentes/references/code-examples.md)
