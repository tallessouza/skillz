# Code Examples: Estrutura de Convites Pendentes

## Estrutura completa do componente

```tsx
// components/pending-invites/index.tsx
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

## Integracao no Header

```tsx
// components/header.tsx
import { PendingInvites } from './pending-invites'
import { ThemeSwitcher } from './theme-switcher'

export function Header() {
  return (
    <header className="...">
      {/* outros elementos do header */}
      <div className="flex items-center gap-2">
        <PendingInvites />
        <ThemeSwitcher />
      </div>
    </header>
  )
}
```

## Variacao: com dados dinamicos (proximo passo)

```tsx
// Versao preparada para receber dados reais
interface Invite {
  id: string
  author: { name: string }
  organization: { name: string }
  createdAt: string
}

export function PendingInvites() {
  const invites: Invite[] = [] // sera carregado via API

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
          Pending invites ({invites.length})
        </span>

        <div className="space-y-2">
          {invites.map((invite) => (
            <div key={invite.id} className="space-y-2">
              <p className="text-sm leading-relaxed text-muted-foreground">
                <span className="font-medium text-foreground">
                  {invite.author.name}
                </span>{' '}
                invited you to join{' '}
                <span className="font-medium text-foreground">
                  {invite.organization.name}
                </span>{' '}
                {dayjs(invite.createdAt).fromNow()}
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
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
```

## Instalacao do Popover

```bash
npx shadcn-ui@latest add popover
```

## Configuracao do dayjs

```tsx
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

// Uso:
dayjs('2024-01-15').fromNow() // "2 months ago"
```